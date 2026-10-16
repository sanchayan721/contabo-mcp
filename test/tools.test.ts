import { describe, it, expect, vi } from "vitest";
import { ListToolsResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { buildDomainTools, type McpTool } from "../src/tools.js";
import { ContaboApiError, type ContaboClient } from "../src/client.js";

function stubClient() {
  return { request: vi.fn(async () => ({ data: [{ id: 1 }] })) } as unknown as ContaboClient & {
    request: ReturnType<typeof vi.fn>;
  };
}

const find = (name: string): McpTool =>
  buildDomainTools(stubClient(), { writesEnabled: false }).find((t) => t.name === name)!;

describe("buildDomainTools", () => {
  it("builds one tool per domain plus reference = 15", () => {
    const tools = buildDomainTools(stubClient(), { writesEnabled: false });
    expect(tools.map((t) => t.name)).toEqual([
      "contabo_instances", "contabo_snapshots", "contabo_images", "contabo_objectStorage",
      "contabo_privateNetworks", "contabo_firewalls", "contabo_dns", "contabo_domains",
      "contabo_vips", "contabo_secrets", "contabo_tags", "contabo_users", "contabo_audits",
      "contabo_troubleshooting", "contabo_reference",
    ]);
  });

  // NOTE: zod 4.6.7 converts a discriminatedUnion to JSON Schema with a top-level
  // `oneOf` (plus `$schema`), not `anyOf` — asserted here against the real shape.
  it("exposes a JSON-schema inputSchema per tool with oneOf branches", () => {
    const tool = find("contabo_instances");
    const schema = tool.inputSchema as { oneOf?: Array<{ properties?: { operation?: { const?: string } } }> };
    expect(Array.isArray(schema.oneOf)).toBe(true);
    expect(schema.oneOf).toHaveLength(16);
    const operations = schema.oneOf!.map((branch) => branch.properties?.operation?.const);
    expect(new Set(operations).size).toBe(16);
    expect(operations).toContain("list");
    expect(operations).toContain("start");
  });

  it("gives every tool an inputSchema with type object at the root", () => {
    // The MCP SDK's ToolSchema requires inputSchema.type === "object"; a bare
    // discriminated-union draft-7 schema ({ $schema, oneOf }) would fail tools/list.
    for (const tool of buildDomainTools(stubClient(), { writesEnabled: false })) {
      expect(tool.inputSchema.type, tool.name).toBe("object");
    }
  });

  it("inputSchemas pass the real SDK ListToolsResultSchema round-trip", () => {
    const tools = buildDomainTools(stubClient(), { writesEnabled: false }).map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
      annotations: t.annotations,
    }));
    const parsed = ListToolsResultSchema.parse({ tools });
    expect(parsed.tools).toHaveLength(15);
  });

  it("marks write tools in annotations", () => {
    expect(find("contabo_snapshots").annotations).toMatchObject({ readOnlyHint: false, destructiveHint: true });
    expect(find("contabo_secrets").annotations).toMatchObject({ readOnlyHint: false });
  });

  it("describes the write gate when writes are disabled", () => {
    expect(find("contabo_instances").description).toContain("CONTABO_ENABLE_WRITES");
  });

  it("dispatches reads to the right method/path with query params", async () => {
    const client = stubClient();
    const tool = buildDomainTools(client, { writesEnabled: false }).find((t) => t.name === "contabo_instances")!;
    const res = await tool.call({ operation: "list", page: 1, size: 10, status: "running" });
    expect(res.isError).toBeUndefined();
    expect(client.request).toHaveBeenCalledWith("GET", "/v1/compute/instances", {
      query: { page: ["1"], size: ["10"], status: ["running"] },
      body: undefined,
    });
  });

  it("substitutes path params and percent-encodes them", async () => {
    const client = stubClient();
    const tool = buildDomainTools(client, { writesEnabled: false }).find((t) => t.name === "contabo_dns")!;
    // Space forces real encoding; "example.com" would pass through unchanged.
    await tool.call({ operation: "getZone", zoneName: "test zone.com" });
    expect(client.request).toHaveBeenCalledWith("GET", "/v1/dns/zones/test%20zone.com", { query: {}, body: undefined });
  });

  it("blocks writes before any HTTP call when disabled", async () => {
    const client = stubClient();
    const tool = buildDomainTools(client, { writesEnabled: false }).find((t) => t.name === "contabo_instances")!;
    const res = await tool.call({ operation: "start", instanceId: 100 });
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toContain("CONTABO_ENABLE_WRITES");
    expect(client.request).not.toHaveBeenCalled();
  });

  it("allows writes and sends a body when enabled", async () => {
    const client = stubClient();
    const tool = buildDomainTools(client, { writesEnabled: true }).find((t) => t.name === "contabo_objectStorage")!;
    // Registry (objectStorage_create) body params: region (required, default "EU"),
    // totalPurchasedSpaceTB (required, default 0.25), autoScaling, displayName (optional).
    const res = await tool.call({ operation: "create", region: "EU", totalPurchasedSpaceTB: 0.25 });
    expect(res.isError).toBeUndefined();
    expect(client.request).toHaveBeenCalledWith("POST", "/v1/object-storages", {
      query: {},
      body: expect.objectContaining({ region: "EU", totalPurchasedSpaceTB: 0.25 }),
    });
  });

  it("sends an empty JSON object for write ops without body params", async () => {
    const client = stubClient();
    const tool = buildDomainTools(client, { writesEnabled: true }).find((t) => t.name === "contabo_instances")!;
    await tool.call({ operation: "start", instanceId: 100 });
    expect(client.request).toHaveBeenCalledWith("POST", "/v1/compute/instances/100/actions/start", {
      query: {}, body: {},
    });
  });

  it("returns validation errors listing the issues", async () => {
    const tool = find("contabo_instances");
    const res = await tool.call({ operation: "get" }); // missing instanceId
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toContain("instanceId");
  });

  it("surfaces ContaboApiError messages as isError results", async () => {
    const client = {
      request: vi.fn(async () => {
        // Real error class so the `instanceof ContaboApiError` branch is exercised.
        throw new ContaboApiError(409, "Conflict", "abc", "name in use");
      }),
    } as unknown as ContaboClient;
    const tool = buildDomainTools(client, { writesEnabled: true }).find((t) => t.name === "contabo_tags")!;
    // Registry (tags_create) body params: name (required), color (default "#0A78C3"), description (optional).
    const res = await tool.call({ operation: "create", name: "conflicting-tag", color: "#FF0000" });
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toContain("409");
    expect(res.content[0].text).toContain("abc");
  });

  it("pins DELETE dispatch with no body params (uniform non-GET body policy)", async () => {
    const client = stubClient();
    const tool = buildDomainTools(client, { writesEnabled: true }).find((t) => t.name === "contabo_dns")!;
    await tool.call({ operation: "deleteZone", zoneName: "example.com" });
    expect(client.request).toHaveBeenCalledWith("DELETE", "/v1/dns/zones/example.com", { query: {}, body: {} });
  });
});
