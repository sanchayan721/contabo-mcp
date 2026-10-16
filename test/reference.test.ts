import { describe, it, expect } from "vitest";
import { buildReferenceTool } from "../src/reference.js";

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
    // the error must name a valid domain so the caller can self-correct
    expect(res.content[0].text).toContain("instances");
  });

  it("documents full param details (location, enums, defaults)", async () => {
    const res = await tool.call({ domain: "instances", operation: "create" });
    const text = res.content[0].text;
    expect(text).toContain("(body, required");
    expect(text).toContain("default:");
    expect(text).toContain("EU"); // region enum values or default
  });

  it("renders enum params once, with comma-separated clauses", async () => {
    const res = await tool.call({ domain: "instances", operation: "create" });
    const text = res.content[0].text;
    // enum(...) type label already lists the values; default follows after a comma
    expect(text).toContain(
      '`region` (body, enum(EU|US-central|US-east|US-west|SIN|UK|AUS|JPN|IND), default: "EU")',
    );
    // no doubled "one of:" listing next to an enum(...) type label
    expect(text).not.toContain("one of: EU");
    // license: enum type only — the registry carries no default for it
    expect(text).toContain("`license` (body, enum(cPanel5|");
    expect(text).toContain("PleskPro)) — Additional licence");
  });

  it("documents an operation with no parameters", async () => {
    const res = await tool.call({ domain: "users", operation: "getClient" });
    expect(res.isError).toBeUndefined();
    const text = res.content[0].text;
    expect(text).toContain("Parameters: none");
  });

  it("flags destructive write ops in the listing", async () => {
    const res = await tool.call({ domain: "users" });
    const text = res.content[0].text;
    expect(text).toContain("- delete (write, DESTRUCTIVE): Delete existing user by id");
  });

  it("rejects unknown keys in strict input", async () => {
    const res = await tool.call({ domain: "vips", bogus: 1 });
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toContain("(root): Unrecognized key");
  });
});
