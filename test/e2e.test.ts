import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createServer, type Server as HttpServer, type IncomingMessage, type ServerResponse } from "node:http";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

let httpServer: HttpServer;
let baseUrl = "";
// Records the request pathname (not the raw URL): list operations append query
// strings such as ?page=1, and the route table below matches on path only.
const seen: { auth?: string; requestId?: string; url?: string; method?: string }[] = [];

beforeAll(async () => {
  httpServer = createServer((req: IncomingMessage, res: ServerResponse) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const { pathname } = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
      seen.push({
        auth: req.headers.authorization,
        requestId: req.headers["x-request-id"] as string,
        url: pathname,
        method: req.method,
      });
      const send = (status: number, payload: unknown) => {
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(payload));
      };
      if (pathname === "/token") return send(200, { access_token: "e2e-token", expires_in: 3600 });
      if (pathname === "/v1/compute/instances") return send(200, { data: [{ instanceId: 100, status: "running" }], _pagination: { page: 1, totalPages: 1, totalElements: 1, size: 10 } });
      if (pathname === "/v1/object-storages" && req.method === "POST") return send(201, { data: [{ objectStorageId: 7 }] });
      return send(404, { message: `no route for ${req.method} ${req.url}` });
    });
  });
  await new Promise<void>((resolve) => httpServer.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${(httpServer.address() as { port: number }).port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => httpServer.close(() => resolve()));
});

async function connectClient(writes: string | undefined) {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ["dist/index.js"],
    env: {
      // Hermetic: never inherit CONTABO_* from the developer's shell — an
      // exported CONTABO_ENABLE_WRITES (or any CONTABO_* var) would otherwise
      // leak into the spawned server and flip test expectations.
      ...(Object.fromEntries(
        Object.entries(process.env).filter(([k, v]) => v !== undefined && !k.startsWith("CONTABO_")),
      ) as Record<string, string>),
      CONTABO_API_BASE_URL: baseUrl,
      CONTABO_AUTH_URL: `${baseUrl}/token`,
      // Dummy credentials: the missing-credentials preflight only needs them
      // non-empty, and the mock /token endpoint ignores their values. Placed
      // after the parent-env spread so a developer's real CONTABO_* vars are
      // still overridden (hermetic).
      CONTABO_CLIENT_ID: "e2e-client-id",
      CONTABO_CLIENT_SECRET: "e2e-client-secret",
      CONTABO_API_USER: "e2e@example.com",
      CONTABO_API_PASSWORD: "e2e-password",
      ...(writes ? { CONTABO_ENABLE_WRITES: writes } : {}),
    },
  });
  const client = new Client({ name: "e2e", version: "0.0.0" });
  await client.connect(transport);
  return client;
}

describe("contabo-mcp end-to-end (stdio + mock API)", () => {
  it("exposes 15 tools and reads instances through the mock API", async () => {
    const client = await connectClient(undefined);
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name)).toContain("contabo_instances");
    expect(tools).toHaveLength(15);

    const seenBefore = seen.length;
    const result = await client.callTool({ name: "contabo_instances", arguments: { operation: "list", page: 1 } });
    expect(result.isError).toBeUndefined();
    const payload = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(payload.data[0].instanceId).toBe(100);

    // Assert only on this test's own requests: `seen` is file-global, so
    // matching against the whole array would depend on test ordering.
    const instanceCall = seen.slice(seenBefore).find((s) => s.url === "/v1/compute/instances");
    expect(instanceCall?.auth).toBe("Bearer e2e-token");
    expect(instanceCall?.requestId).toMatch(/^[0-9a-f-]{36}$/i);
    await client.close();
  }, 30_000);

  it("blocks writes when CONTABO_ENABLE_WRITES is unset", async () => {
    const client = await connectClient(undefined);
    const seenBefore = seen.length;
    const result = await client.callTool({ name: "contabo_objectStorage", arguments: { operation: "create", region: "EU", totalPurchasedSpaceTB: 0.25 } });
    expect(result.isError).toBe(true);
    expect(((result.content as { text: string }[])[0].text)).toContain("CONTABO_ENABLE_WRITES");
    expect(seen.slice(seenBefore).some((s) => s.url === "/v1/object-storages" && s.method === "POST")).toBe(false);
    await client.close();
  }, 30_000);

  it("performs a write when CONTABO_ENABLE_WRITES=1", async () => {
    const client = await connectClient("1");
    const seenBefore = seen.length;
    const result = await client.callTool({
      name: "contabo_objectStorage",
      arguments: { operation: "create", region: "EU", totalPurchasedSpaceTB: 0.25 },
    });
    expect(result.isError).toBeUndefined();
    const payload = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(payload.data[0].objectStorageId).toBe(7);
    expect(seen.slice(seenBefore).some((s) => s.url === "/v1/object-storages" && s.method === "POST")).toBe(true);
    await client.close();
  }, 30_000);
});
