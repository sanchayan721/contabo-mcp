import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ContaboClient, ContaboAuthError } from "../src/client.js";

const TOKEN_URL = "https://auth.contabo.com/auth/realms/contabo/protocol/openid-connect/token";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

const creds = { clientId: "cid", clientSecret: "csec", apiUser: "u@x.com", apiPassword: "pw" };

describe("ContaboClient token handling", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("posts a password grant and caches the token", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ access_token: "tok1", expires_in: 3600 }));
    const client = new ContaboClient({ ...creds });
    await expect(client.getToken()).resolves.toBe("tok1");
    await expect(client.getToken()).resolves.toBe("tok1"); // cached — no second call
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(TOKEN_URL);
    expect(init.method).toBe("POST");
    const body = init.body as URLSearchParams;
    expect(body.get("grant_type")).toBe("password");
    expect(body.get("client_id")).toBe("cid");
    expect(body.get("username")).toBe("u@x.com");
  });

  it("refreshes proactively shortly before expiry", async () => {
    // Fresh Response per call — Response bodies are single-read, so reusing one
    // instance across two fetches would fail with "Body is unusable".
    fetchMock.mockImplementation(async () => jsonResponse({ access_token: "tok2", expires_in: 90 }));
    const client = new ContaboClient({ ...creds });
    await client.getToken();
    // expires_in 90s → cache holds for 30s (90 - 60 safety margin); fake time past that:
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 31_000);
    await expect(client.getToken()).resolves.toBe("tok2"); // second fetch
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("forces a refresh when requested", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ access_token: "tokA", expires_in: 3600 }));
    const client = new ContaboClient({ ...creds });
    await client.getToken();
    fetchMock.mockResolvedValueOnce(jsonResponse({ access_token: "tokB", expires_in: 3600 }));
    await expect(client.getToken(true)).resolves.toBe("tokB");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("coalesces concurrent token requests", async () => {
    let resolveFirst!: (r: Response) => void;
    fetchMock.mockImplementationOnce(() => new Promise<Response>((res) => { resolveFirst = res; }));
    const client = new ContaboClient({ ...creds });
    const pending = Promise.all([client.getToken(), client.getToken()]);
    resolveFirst(jsonResponse({ access_token: "tok1", expires_in: 3600 }));
    const [a, b] = await pending;
    expect(a).toBe("tok1");
    expect(b).toBe("tok1");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("surfaces a credential-oriented error on auth failure", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: "invalid_grant", error_description: "bad password" }, 401));
    const client = new ContaboClient({ ...creds });
    await expect(client.getToken()).rejects.toThrow(/CONTABO_CLIENT_ID.*bad password/s);
  });

  it("rejects before fetching when no credentials are configured", async () => {
    const client = new ContaboClient({ clientId: "", clientSecret: "", apiUser: "", apiPassword: "" });
    await expect(client.getToken()).rejects.toThrow(/CONTABO_CLIENT_ID.*my\.contabo\.com\/api\/details/s);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("attempts the fetch when only some credentials are set", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: "invalid_grant" }, 401));
    const client = new ContaboClient({ ...creds, clientSecret: "", apiUser: "", apiPassword: "" });
    await expect(client.getToken()).rejects.toThrow(/Contabo authentication failed/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("honors a custom auth URL", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ access_token: "t", expires_in: 10 }));
    const client = new ContaboClient({ ...creds, authUrl: "http://127.0.0.1:1/token" });
    await client.getToken();
    expect(fetchMock.mock.calls[0][0]).toBe("http://127.0.0.1:1/token");
  });

  it("maps a network failure to ContaboAuthError", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    const client = new ContaboClient({ ...creds });
    await expect(client.getToken()).rejects.toBeInstanceOf(ContaboAuthError);
    await expect(client.getToken()).rejects.toThrow(/Could not reach the Contabo auth endpoint/);
  });

  it("does not poison token state after a failed fetch", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));
    fetchMock.mockResolvedValueOnce(jsonResponse({ access_token: "tok3", expires_in: 3600 }));
    const client = new ContaboClient({ ...creds });
    await expect(client.getToken()).rejects.toThrow(/Could not reach the Contabo auth endpoint/);
    await expect(client.getToken()).resolves.toBe("tok3"); // fresh fetch, not the failed promise
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
