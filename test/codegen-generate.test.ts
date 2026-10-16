import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { buildRegistry, type BuiltOp } from "../src/codegen/generate.js";

const spec = JSON.parse(readFileSync(new URL("../spec/contabo-openapi.json", import.meta.url), "utf8"));
const { ops, domains }: { ops: BuiltOp[]; domains: string[] } = buildRegistry(spec);

describe("buildRegistry", () => {
  it("covers all 157 operations", () => {
    expect(ops).toHaveLength(157);
  });

  it("produces exactly the 14 domains", () => {
    expect(domains).toEqual([
      "instances", "snapshots", "images", "objectStorage", "privateNetworks",
      "firewalls", "dns", "domains", "vips", "secrets", "tags", "users", "audits", "troubleshooting",
    ]);
    expect(new Set(ops.map((o) => o.domain))).toEqual(new Set(domains));
  });

  it("builds unique op ids <domain>_<name>", () => {
    const ids = ops.map((o) => o.id);
    expect(new Set(ids).size).toBe(157);
    expect(ids).toContain("instances_start");
    expect(ids).toContain("objectStorage_cancel");
    expect(ids).toContain("audits_instances");
  });

  it("classifies reads and writes", () => {
    expect(ops.find((o) => o.id === "instances_list")!.write).toBe(false);
    expect(ops.find((o) => o.id === "instances_start")!.write).toBe(true);
    expect(ops.find((o) => o.id === "snapshots_delete")!.destructive).toBe(true);
    expect(ops.find((o) => o.id === "objectStorage_cancel")!.destructive).toBe(true);
    expect(ops.find((o) => o.id === "instances_resetPassword")!.destructive).toBe(true);
    expect(ops.find((o) => o.id === "dns_listZones")!.destructive).toBe(false);
  });

  it("creates a zod schema per op with an operation literal", () => {
    const list = ops.find((o) => o.id === "instances_list")!;
    const parsed = list.schema.safeParse({ operation: "list", page: 2, status: "running" });
    expect(parsed.success).toBe(true);
    const bad = list.schema.safeParse({ operation: "nope" });
    expect(bad.success).toBe(false);
  });

  it("carries path/query/body param locations for dispatch", () => {
    const start = ops.find((o) => o.id === "instances_start")!;
    expect(start.pathParams).toEqual(["instanceId"]);
    expect(start.queryParams).toEqual([]);
    expect(start.bodyParams).toEqual([]);
    expect(start.path).toBe("/v1/compute/instances/{instanceId}/actions/start");
    expect(start.method).toBe("POST");

    const create = ops.find((o) => o.id === "instances_create")!;
    expect(create.bodyParams).toContain("productId");
    expect(create.bodyParams).toContain("period");
    expect(create.bodyParams).not.toContain("x-request-id");

    const dnsList = ops.find((o) => o.id === "dns_listZones")!;
    expect(dnsList.queryParams).toContain("page");
    expect(dnsList.queryParams).toContain("orderBy");
  });

  it("applies spec defaults into schemas (instance create)", () => {
    const create = ops.find((o) => o.id === "instances_create")!;
    const parsed = create.schema.parse({ operation: "create", period: 1 });
    expect(parsed.productId).toBe("V153"); // spec default
    expect(parsed.region).toBe("EU");
  });

  it("does not flag instances_list as deprecated (only its instanceId param is)", () => {
    expect(ops.find((o) => o.id === "instances_list")!.deprecated).toBe(false);
  });

  it("keeps param metadata for the reference tool", () => {
    const create = ops.find((o) => o.id === "instances_create")!;
    const period = create.paramMeta.find((p) => p.name === "period")!;
    expect(period.location).toBe("body");
    expect(period.required).toBe(true);
    expect(period.description).toContain("contract period");
  });

  it("operation names are unique within each domain", () => {
    const byDomain = new Map<string, Set<string>>();
    for (const op of ops) {
      const set = byDomain.get(op.domain) ?? new Set();
      expect(set.has(op.name)).toBe(false);
      set.add(op.name);
      byDomain.set(op.domain, set);
    }
  });

  it("committed registry.ts is byte-identical to a fresh buildRegistry run", () => {
    const { source } = buildRegistry(spec);
    expect(source).toBe(readFileSync(new URL("../src/generated/registry.ts", import.meta.url), "utf8"));
  });
});
