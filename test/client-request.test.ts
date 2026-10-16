import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ContaboClient, ContaboApiError } from "../src/client.js";

const creds = { clientId: "cid", clientSecret: "csec", apiUser: "u@x.com", apiPassword: "pw" };
const BASE = "https://api.contabo.com";

function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });
}

describe("ContaboClient.request", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let client: ContaboClient;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValueOnce(jsonResponse({ access_token: "tok", expires_in: 3600 })); // token
    client = new ContaboClient({ ...creds });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("sends bearer token, x-request-id UUID and JSON body; unwraps nothing", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: [{ instanceId: 100 }], _pagination: { page: 1 } }));
    const result = (await client.request("GET", "/v1/compute/instances", {
      query: { page: ["2"], orderBy: ["name:asc"] },
    })) as { data: unknown[] };
    expect(result.data).toHaveLength(1);
    const [url, init] = fetchMock.mock.calls[1];
    expect(String(url)).toBe(`${BASE}/v1/compute/instances?page=2&orderBy=name%3Aasc`);
    expect(init.headers.Authorization).toBe("Bearer tok");
    expect(init.headers["x-request-id"]).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(init.body).toBeUndefined();
  });

  it("sends a JSON body with Content-Type for writes", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: [{}] }, 201));
    await client.request("POST", "/v1/object-storages", { body: { displayName: "x" } });
    const [, init] = fetchMock.mock.calls[1];
    expect(init.body).toBe(JSON.stringify({ displayName: "x" }));
    expect(init.headers["Content-Type"]).toBe("application/json");
  });

  it("maps HTTP errors into ContaboApiError with request-id", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "name in use" }), { status: 409, statusText: "Conflict" }),
    );
    const err = await client.request("POST", "/v1/tags", { body: {} }).catch((e) => e);
    expect(err).toBeInstanceOf(ContaboApiError);
    expect(err.status).toBe(409);
    expect(err.message).toContain("Contabo API 409 Conflict");
    expect(err.message).toContain("name in use");
    expect(err.requestId).toMatch(/^[0-9a-f-]{36}$/i);
  });

  it("retries once on 401 with a forced token refresh", async () => {
    fetchMock.mockReset();
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ access_token: "tok", expires_in: 3600 })) // initial token
      .mockResolvedValueOnce(new Response("", { status: 401 }))
      .mockResolvedValueOnce(jsonResponse({ access_token: "fresh", expires_in: 3600 })) // forced refresh
      .mockResolvedValueOnce(jsonResponse({ data: ["ok"] }));
    client = new ContaboClient({ ...creds });
    const result = (await client.request("GET", "/v1/secrets")) as { data: string[] };
    expect(result.data).toEqual(["ok"]);
    const retryInit = fetchMock.mock.calls[3][1];
    expect(retryInit.headers.Authorization).toBe("Bearer fresh");
  });

  it("retries once on 429 honoring Retry-After (header 0 → immediate retry)", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response("", { status: 429, headers: { "Retry-After": "0" } }))
      .mockResolvedValueOnce(jsonResponse({ data: ["fine"] }));
    const result = (await client.request("GET", "/v1/secrets")) as { data: string[] };
    expect(result.data).toEqual(["fine"]);
    expect(fetchMock).toHaveBeenCalledTimes(3); // token + 2 requests
  });

  it("returns {ok:true} for 204", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
    await expect(client.request("DELETE", "/v1/tags/1")).resolves.toEqual({ ok: true });
  });

  it("surfaces non-JSON error bodies truncated", async () => {
    fetchMock.mockResolvedValueOnce(new Response("<html>boom</html>", { status: 500, statusText: "Internal Server Error" }));
    const err = await client.request("GET", "/x").catch((e) => e);
    expect(err.message).toContain("500 Internal Server Error");
    expect(err.message).toContain("boom");
  });

  it("uses a custom base URL", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: [] }));
    const custom = new ContaboClient({ ...creds, baseUrl: "http://127.0.0.1:9999" });
    await custom.request("GET", "/v1/me/accounts");
    expect(String(fetchMock.mock.calls[1][0])).toBe("http://127.0.0.1:9999/v1/me/accounts");
  });
});
