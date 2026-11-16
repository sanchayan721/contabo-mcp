import "reflect-metadata";
import { describe, it, expect, mock } from "bun:test";
import { buildDomainTools, type McpTool } from "../src/tools";
import { ContaboApiError, type ContaboClient } from "../src/client";

function stubClient() {
  return { request: mock(async () => ({ data: [{ id: 1 }] })) } as unknown as ContaboClient & {
    request: ReturnType<typeof mock>;
  };
}

const find = (name: string, client: ContaboClient = stubClient(), writesEnabled = false): McpTool =>
  buildDomainTools(client, { writesEnabled }).find((t) => t.name === name)!;

describe("buildDomainTools", () => {
  it("builds one tool per domain plus reference = 15", () => {
    const tools = buildDomainTools(stubClient(), { writesEnabled: false });
    expect(tools.map((t) => t.name)).toEqual([
      "contabo_instances",
      "contabo_snapshots",
      "contabo_images",
      "contabo_objectStorage",
      "contabo_privateNetworks",
      "contabo_firewalls",
      "contabo_dns",
      "contabo_domains",
      "contabo_vips",
      "contabo_secrets",
      "contabo_tags",
      "contabo_users",
      "contabo_audits",
      "contabo_troubleshooting",
      "contabo_reference",
    ]);
  });

  it("exposes a JSON-schema inputSchema per tool with oneOf branches", () => {
    const tool = find("contabo_instances");
    const schema = tool.inputSchema as { oneOf?: unknown[] };
    expect(Array.isArray(schema.oneOf)).toBe(true);
    expect(schema.oneOf).toHaveLength(16);
  });

  it("marks write tools in annotations", () => {
    expect(find("contabo_snapshots").annotations).toMatchObject({
      readOnlyHint: false,
      destructiveHint: true,
    });
    expect(find("contabo_secrets").annotations).toMatchObject({ readOnlyHint: false });
  });

  it("describes the write gate when writes are disabled", () => {
    expect(find("contabo_instances").description).toContain("CONTABO_ENABLE_WRITES");
  });

  it("dispatches reads to the right method/path with query params", async () => {
    const client = stubClient();
    const tool = find("contabo_instances", client);
    const res = await tool.call({ operation: "list", page: 1, size: 10, status: "running" });
    expect(res.isError).toBeUndefined();
    expect(client.request).toHaveBeenCalledWith("GET", "/v1/compute/instances", {
      query: { page: ["1"], size: ["10"], status: ["running"] },
      body: undefined,
    });
  });

  it("substitutes path params and percent-encodes them", async () => {
    const client = stubClient();
    const tool = buildDomainTools(client, { writesEnabled: false }).find(
      (t) => t.name === "contabo_dns",
    )!;
    await tool.call({ operation: "getZone", zoneName: "test zone.com" });
    expect(client.request).toHaveBeenCalledWith("GET", "/v1/dns/zones/test%20zone.com", {
      query: {},
      body: undefined,
    });
  });

  it("blocks writes before any HTTP call when disabled", async () => {
    const client = stubClient();
    const tool = buildDomainTools(client, { writesEnabled: false }).find(
      (t) => t.name === "contabo_instances",
    )!;
    const res = await tool.call({ operation: "start", instanceId: 100 });
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toContain("CONTABO_ENABLE_WRITES");
    expect(client.request).not.toHaveBeenCalled();
  });

  it("allows writes and sends a body when enabled", async () => {
    const client = stubClient();
    const tool = buildDomainTools(client, { writesEnabled: true }).find(
      (t) => t.name === "contabo_objectStorage",
    )!;
    const res = await tool.call({ operation: "create", region: "EU", totalPurchasedSpaceTB: 0.25 });
    expect(res.isError).toBeUndefined();
    expect(client.request).toHaveBeenCalledWith("POST", "/v1/object-storages", {
      query: {},
      body: expect.objectContaining({ region: "EU", totalPurchasedSpaceTB: 0.25 }),
    });
  });

  it("sends an empty JSON object for write ops without body params", async () => {
    const client = stubClient();
    const tool = buildDomainTools(client, { writesEnabled: true }).find(
      (t) => t.name === "contabo_instances",
    )!;
    await tool.call({ operation: "start", instanceId: 100 });
    expect(client.request).toHaveBeenCalledWith("POST", "/v1/compute/instances/100/actions/start", {
      query: {},
      body: {},
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
      request: mock(async () => {
        throw new ContaboApiError(409, "Conflict", "abc", "name in use");
      }),
    } as unknown as ContaboClient;
    const tool = find("contabo_tags", client, true);
    const res = await tool.call({ operation: "create", name: "conflicting-tag", color: "#FF0000" });
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toContain("409");
  });
});
