import { describe, it, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { extractOperations, type RawOperation } from "../src/codegen/extract";
import { domainForTag, nameForOperationId } from "../src/codegen/overrides";

const spec = JSON.parse(
  readFileSync(new URL("../spec/contabo-openapi.json", import.meta.url), "utf8"),
);

describe("domainForTag", () => {
  it("maps data tags", () => {
    expect(domainForTag("Instances")).toBe("instances");
    expect(domainForTag("Instance Actions")).toBe("instances");
    expect(domainForTag("Instances Products")).toBe("instances");
    expect(domainForTag("Object Storages")).toBe("objectStorage");
    expect(domainForTag("Private Networks")).toBe("privateNetworks");
    expect(domainForTag("Users Object Storage Credentials")).toBe("users");
    expect(domainForTag("User Accounts")).toBe("users");
    expect(domainForTag("Roles")).toBe("users");
    expect(domainForTag("Handles")).toBe("domains");
    expect(domainForTag("Check Collection Templates")).toBe("troubleshooting");
  });

  it("maps every audit tag to the audits domain", () => {
    for (const tag of [
      "Instances Audits",
      "Vip Audits",
      "Tag Assignments Audits",
      "Roles Audits",
      "DNS Audits",
    ]) {
      expect(domainForTag(tag)).toBe("audits");
    }
  });

  it("fails loudly on an unknown tag", () => {
    expect(() => domainForTag("Nonexistent")).toThrow(/Unknown tag/);
  });
});

describe("nameForOperationId", () => {
  it("returns overrides", () => {
    expect(nameForOperationId("retrieveInstancesList")).toBe("list");
    expect(nameForOperationId("CancelObjectStorage")).toBe("cancel");
    expect(nameForOperationId("putFirewall")).toBe("updateRules");
    expect(nameForOperationId("retrieveTagAuditsList")).toBe("tags");
  });

  it("passes clean ids through lower-camel", () => {
    expect(nameForOperationId("start")).toBe("start");
    expect(nameForOperationId("updatePtrRecord")).toBe("updatePtrRecord");
  });
});

describe("extractOperations", () => {
  const ops: RawOperation[] = extractOperations(spec);

  it("extracts exactly 157 operations", () => {
    expect(ops).toHaveLength(157);
  });

  it("excludes header parameters from tool-facing params", () => {
    for (const op of ops) {
      const names = [...op.pathParams, ...op.queryParams].map((p) => p.name);
      expect(names).not.toContain("x-request-id");
      expect(names).not.toContain("x-trace-id");
    }
  });

  it("captures body schemas for POST/PUT/PATCH/DELETE ops with bodies", () => {
    const create = ops.find((o) => o.operationId === "createInstance")!;
    expect(create.method).toBe("POST");
    expect(create.body).toBeDefined();
    expect(Object.keys(create.body!.properties!)).toContain("productId");

    const start = ops.find((o) => o.operationId === "start")!;
    expect(start.body).toBeUndefined();

    const del = ops.find((o) => o.operationId === "deleteSnapshot")!;
    expect(del.method).toBe("DELETE");
    expect(del.body).toBeUndefined();
  });

  it("marks requestBodies required where the spec says so", () => {
    const create = ops.find((o) => o.operationId === "createInstance")!;
    expect(create.bodyRequired).toBe(true);
    const start = ops.find((o) => o.operationId === "start")!;
    expect(start.bodyRequired).toBe(false);
  });

  it("assigns domains matching the design grouping", () => {
    const count = (domain: string) =>
      ops.filter((o) => (o.tags ?? [])[0] && domainForTag((o.tags ?? [])[0]!) === domain).length;
    expect(count("instances")).toBe(16);
    expect(count("snapshots")).toBe(6);
    expect(count("images")).toBe(6);
    expect(count("objectStorage")).toBe(8);
    expect(count("privateNetworks")).toBe(7);
    expect(count("firewalls")).toBe(9);
    expect(count("dns")).toBe(14);
    expect(count("domains")).toBe(18);
    expect(count("vips")).toBe(4);
    expect(count("secrets")).toBe(5);
    expect(count("tags")).toBe(9);
    expect(count("users")).toBe(24);
    expect(count("audits")).toBe(17);
    expect(count("troubleshooting")).toBe(14);
  });
});
