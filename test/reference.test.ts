import "reflect-metadata";
import { describe, it, expect } from "bun:test";
import { buildReferenceTool } from "../src/reference";

const tool = buildReferenceTool();

describe("contabo_reference", () => {
  it("lists operations of a domain", async () => {
    const res = await tool.call({ domain: "snapshots" });
    expect(res.isError).toBeUndefined();
    const text = res.content[0].text;
    expect(text).toContain("list");
    expect(text).toContain("create");
    expect(text).toContain("rollback");
  });

  it("documents one operation in full", async () => {
    const res = await tool.call({ domain: "instances", operation: "create" });
    const text = res.content[0].text;
    expect(text).toContain("POST /v1/compute/instances");
    expect(text).toContain("period");
    expect(text).toContain("required");
    expect(text).toContain("inputSchema");
  });

  it("rejects unknown operations with the available list", async () => {
    const res = await tool.call({ domain: "instances", operation: "explode" });
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toContain("Unknown operation 'explode'");
    expect(res.content[0].text).toContain("start");
  });

  it("rejects unknown domains", async () => {
    const res = await tool.call({ domain: "nonsense" as never });
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toContain("Invalid arguments");
  });

  it("documents full param details (location, enums, defaults)", async () => {
    const res = await tool.call({ domain: "instances", operation: "create" });
    const text = res.content[0].text;
    expect(text).toContain("(body, required");
    expect(text).toContain("default:");
    expect(text).toContain("EU"); // region enum values or default
  });
});
