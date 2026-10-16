import { describe, it, expect } from "vitest";
import { z } from "zod";
import { emitZodExpression } from "../src/codegen/emit.js";

const evalExpr = (src: string): z.ZodType => {
  // Emitted source is a zod expression using the local `z` binding.
  // eslint-disable-next-line no-new-func
  return new Function("z", `"use strict"; return (${src});`)(z) as z.ZodType;
};

describe("emitZodExpression", () => {
  it("emits string with description", () => {
    const src = emitZodExpression({ type: "string", description: "The name" });
    const s = evalExpr(src) as z.ZodString;
    expect(s.parse("abc")).toBe("abc");
    expect(src).toContain('.describe("The name")');
  });

  it("emits string enum", () => {
    const s = evalExpr(emitZodExpression({ type: "string", enum: ["EU", "US-east"] })) as z.ZodEnum;
    expect(s.parse("EU")).toBe("EU");
    expect(() => s.parse("MARS")).toThrow();
  });

  it("emits int64 integer with bounds", () => {
    const s = evalExpr(emitZodExpression({ type: "integer", format: "int64", minimum: 1 })) as z.ZodNumber;
    expect(s.parse(10)).toBe(10);
    expect(() => s.parse(1.5)).toThrow();
    expect(() => s.parse(0)).toThrow();
  });

  it("emits boolean", () => {
    const s = evalExpr(emitZodExpression({ type: "boolean" }));
    expect(s.parse(true)).toBe(true);
  });

  it("emits arrays with item schemas", () => {
    const s = evalExpr(emitZodExpression({ type: "array", items: { type: "string" }, minItems: 1 }));
    expect(s.parse(["a"])).toEqual(["a"]);
    expect(() => s.parse([])).toThrow();
  });

  it("emits objects with required and optional fields, nested refs inlined", () => {
    const schema = {
      type: "object",
      properties: {
        displayName: { type: "string", maxLength: 255 },
        addOns: {
          type: "object",
          properties: { attributes: { type: "array", items: { type: "object", properties: { id: { type: "integer" }, quantity: { type: "integer" } }, required: ["id"] } } },
        },
      },
      required: ["displayName"],
    };
    const src = emitZodExpression(schema);
    const parsed = (evalExpr(src) as z.ZodObject).parse({ displayName: "x", addOns: { attributes: [{ id: 1 }] } });
    expect(parsed).toEqual({ displayName: "x", addOns: { attributes: [{ id: 1 }] } });
    expect(() => (evalExpr(src) as z.ZodObject).parse({})).toThrow(); // required missing
  });

  it("emits pattern strings", () => {
    const s = evalExpr(emitZodExpression({ type: "string", pattern: "^[a-z]{3}$" }));
    expect(s.parse("abc")).toBe("abc");
    expect(() => s.parse("AB1")).toThrow();
  });

  it("emits defaults", () => {
    const s = evalExpr(emitZodExpression({ type: "string", default: "V153" })) as z.ZodDefault;
    expect(s.parse(undefined)).toBe("V153");
  });

  it("coerces numeric-string defaults on numeric schemas (spec quirk)", () => {
    // totalPurchasedSpaceTB: type number, default "0.25" — the declared type
    // wins; a string default would break the generated file's type-check and
    // leak a string through zod (v4 does not validate defaults).
    const src = emitZodExpression({ type: "number", default: "0.25" });
    expect(src).toContain(".default(0.25)");
    expect((evalExpr(src) as z.ZodNumber).parse(undefined)).toBe(0.25);
  });

  it("fails loud on non-numeric defaults for numeric schemas", () => {
    expect(() => emitZodExpression({ type: "number", default: "abc" })).toThrow(/non-numeric default/);
  });

  it("throws on empty-string numeric default", () => {
    expect(() => emitZodExpression({ type: "number", default: "" })).toThrow(/empty-string default/);
  });

  it("throws on non-finite numeric default", () => {
    expect(() => emitZodExpression({ type: "number", default: "Infinity" })).toThrow(/non-numeric default/);
  });

  it("accepts trimmed and exponential numeric defaults", () => {
    expect((evalExpr(emitZodExpression({ type: "number", default: " 0.25 " })) as z.ZodDefault).parse(undefined)).toBe(0.25);
    expect((evalExpr(emitZodExpression({ type: "number", default: "1e3" })) as z.ZodDefault).parse(undefined)).toBe(1000);
  });

  it("falls back to z.unknown() for unrecognized shapes", () => {
    const s = evalExpr(emitZodExpression({ type: "mystery" }));
    expect(s.safeParse(12345).success).toBe(true);
  });

  it("carries the allOf wrapper description onto the merged object", () => {
    const schema = {
      description: "Address details for handle",
      allOf: [{ $ref: "#/components/schemas/Addr" }],
    };
    const src = emitZodExpression(schema as never, {
      root: { components: { schemas: { Addr: { type: "object", properties: { street: { type: "string" } } } } } },
    });
    expect(src).toContain('.describe("Address details for handle")');
    expect((evalExpr(src) as z.ZodObject).parse({ street: "x" })).toBeTruthy();
  });

  it("guards against $ref cycles by inlining a stop", () => {
    const schema = {
      type: "object",
      properties: { next: { $ref: "#/components/schemas/Self" } },
    };
    const src = emitZodExpression(schema, { root: { components: { schemas: { Self: schema } } } });
    expect(src).toBeTruthy();
    expect((evalExpr(src) as z.ZodObject).parse({ next: {} })).toBeTruthy();
  });

  it("inlines $ref members inside allOf", () => {
    const schema = { allOf: [{ $ref: "#/components/schemas/Shared" }] };
    const ctx = { root: { components: { schemas: { Shared: { type: "object", properties: { region: { type: "string" } }, required: ["region"] } } } } };
    const src = emitZodExpression(schema as never, ctx);
    const s = evalExpr(src) as z.ZodObject;
    expect(() => s.parse({})).toThrow(); // region required via the $ref member
    expect(s.parse({ region: "EU" })).toEqual({ region: "EU" });
  });

  it("throws loudly on unsupported allOf members", () => {
    const schema = { allOf: [{ type: "string" }] };
    expect(() => emitZodExpression(schema as never)).toThrow(/Unsupported allOf member/);
  });

  it("guards allOf members that ref an ancestor", () => {
    const schema = { type: "object", properties: { nested: { allOf: [{ $ref: "#/components/schemas/Self2" }] } } };
    const src = emitZodExpression(schema as never, { root: { components: { schemas: { Self2: schema } } } });
    expect(src).toBeTruthy(); // no infinite recursion
    expect(src).toContain("z.unknown()"); // the recursion bottoms out in the cycle stop
    // The emitted source stays valid: nested is the self-similar object whose
    // innermost occurrence collapses into z.unknown().
    expect((evalExpr(src) as z.ZodObject).parse({ nested: {} })).toEqual({ nested: {} });
  });

  it("merges direct properties over allOf $ref members and unions required", () => {
    const schema = {
      allOf: [{ $ref: "#/components/schemas/Base" }],
      properties: { region: { type: "string", maxLength: 2 } },
      required: ["name"],
    };
    const ctx = { root: { components: { schemas: { Base: { type: "object", properties: { name: { type: "string" }, region: { type: "string" } }, required: ["region"] } } } } };
    const src = emitZodExpression(schema as never, ctx);
    const s = evalExpr(src) as z.ZodObject;
    expect(() => s.parse({ name: "x" })).toThrow(); // region required via the $ref member
    expect(() => s.parse({ region: "EU" })).toThrow(); // name required via the direct schema
    expect(s.parse({ name: "x", region: "EU" })).toEqual({ name: "x", region: "EU" });
    expect(src).toContain("z.string().max(2)"); // direct properties override member properties
  });

  it("does not chain string checks onto enums", () => {
    const src = emitZodExpression({ type: "string", enum: ["EU", "US-east"], minLength: 1, maxLength: 8 });
    expect(src).not.toContain(".min(");
    expect(src).not.toContain(".max(");
    expect((evalExpr(src) as z.ZodEnum).parse("EU")).toBe("EU");
  });

  it("throws loudly on enum with pattern", () => {
    expect(() => emitZodExpression({ type: "string", enum: ["A"], pattern: "^A$" })).toThrow(/Unsupported pattern on enum/);
  });

  it("keeps non-required defaulted properties optional (no double .optional())", () => {
    const src = emitZodExpression({ type: "object", properties: { region: { type: "string", enum: ["EU"], default: "EU" } }, required: [] });
    const s = evalExpr(src) as z.ZodObject;
    expect(s.parse({})).toEqual({ region: "EU" }); // default fills in
  });

  it("keeps optional wrappers optional even when nested items have defaults", () => {
    const src = emitZodExpression({ type: "object", properties: { attrs: { type: "array", items: { type: "object", properties: { q: { type: "string", default: "d" } } } } }, required: [] });
    const s = evalExpr(src) as z.ZodObject;
    expect(s.parse({})).toEqual({}); // attrs itself is optional; nested default must not make it required
  });

  it("does not treat '.default(' inside a description as a default", () => {
    const src = emitZodExpression({ type: "object", properties: { note: { type: "string", description: "use .default( here" } }, required: [] });
    const s = evalExpr(src) as z.ZodObject;
    expect(s.parse({})).toEqual({}); // optional despite the text
  });

  it("throws on allOf member with nested allOf", () => {
    const schema = { allOf: [{ type: "object", properties: { a: { type: "string" } }, allOf: [{ type: "object", properties: { b: { type: "string" } } }] }] };
    expect(() => emitZodExpression(schema as never)).toThrow(/Unsupported allOf member/);
  });

  it("emits compact empty objects", () => {
    expect(emitZodExpression({ type: "object", properties: {} })).toBe("z.looseObject({})");
  });

  it("emits unions for anyOf", () => {
    const src = emitZodExpression({ anyOf: [{ type: "string" }, { type: "integer" }] });
    const s = evalExpr(src);
    expect(s.parse("x")).toBe("x");
    expect(s.parse(3)).toBe(3);
  });

  it("marks deprecated schemas via .meta", () => {
    const src = emitZodExpression({ type: "string", deprecated: true });
    expect(src).toContain(".meta({ deprecated: true })");
  });
});
