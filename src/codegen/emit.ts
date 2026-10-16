/**
 * Emits zod v4 expression source code from an OpenAPI JSON schema.
 * The generated source is written into src/generated/registry.ts, which is
 * type-checked at build time — a broken emitter therefore breaks the build,
 * never runtime behavior.
 *
 * This is the input-side emitter only: `nullable` and `format` constraints
 * (date-time/uuid/email) are intentionally not enforced on tool inputs —
 * the API remains the validator.
 */

import type { JsonSchema } from "./extract.js";

export interface EmitContext {
  /** Full spec document, needed to resolve $refs. */
  root?: JsonSchema;
  /** Internal: $refs currently being expanded (cycle guard). */
  stack?: string[];
}

function lit(value: unknown): string {
  return JSON.stringify(value) ?? "undefined";
}

/** Walks a local pointer like "#/components/schemas/Foo" to its target inside the spec root. */
function resolveRefPointer(ref: string, root: JsonSchema): unknown {
  let current: unknown = root;
  for (const part of ref.replace(/^#\//, "").split("/")) {
    const key = part.replace(/~1/g, "/").replace(/~0/g, "~");
    current = (current as Record<string, unknown>)[key];
    if (current === undefined) throw new Error(`Unresolvable $ref: ${ref}`);
  }
  return current;
}

function stringChecks(schema: Record<string, unknown>): string {
  let out = "";
  if (typeof schema.minLength === "number") out += `.min(${schema.minLength})`;
  if (typeof schema.maxLength === "number") out += `.max(${schema.maxLength})`;
  if (typeof schema.pattern === "string") out += `.regex(new RegExp(${JSON.stringify(schema.pattern)}))`;
  return out;
}

function description(schema: Record<string, unknown>): string {
  return typeof schema.description === "string" && schema.description ? `.describe(${lit(schema.description)})` : "";
}

/**
 * Normalizes a schema default into the value the emitted zod source (and the
 * registry's paramMeta.defaultValue) will hold. Exported so the emitter and
 * the meta builders in generate.ts share one coercion — they can never diverge.
 * Throws on the fail-loud cases; meta generation inherits that posture.
 */
export function coerceDefaultValue(schema: Record<string, unknown>): unknown {
  if (!("default" in schema) || schema.default === null || schema.default === undefined) return undefined;
  let value = schema.default;
  if ((schema.type === "integer" || schema.type === "number") && typeof value === "string") {
    // Spec quirk (totalPurchasedSpaceTB): numeric fields whose default is a
    // numeric string. The declared type wins — emitting `.default("0.25")`
    // after z.number() breaks the generated file's type-check AND leaks a
    // string through zod (v4 does not validate defaults). Coerce, fail loud
    // when the string is not numeric.
    if (value.trim() === "") throw new Error(`Numeric schema with empty-string default: ${JSON.stringify(value)}`);
    // Trimmed/alternative numeric forms (" 0.25 ", "0x10", "1e3", "+0.25") parse via Number() and are accepted intentionally.
    const n = Number(value);
    if (!Number.isFinite(n)) throw new Error(`Numeric schema with non-numeric default: ${JSON.stringify(value)}`);
    if (schema.type === "integer" && !Number.isInteger(n)) throw new Error(`Integer schema with non-integer default: ${JSON.stringify(value)}`);
    value = n;
  }
  return value;
}

function defaultValue(schema: Record<string, unknown>): string {
  if (!("default" in schema) || schema.default === null || schema.default === undefined) return "";
  return `.default(${lit(coerceDefaultValue(schema))})`;
}

/**
 * Whether this schema (its own layer, its $ref target, or its allOf members) declares a default.
 * Deliberately does NOT recurse into nested object properties or array items:
 * a nested field's default must not make its parent property optional-skipping.
 *
 * Exported for the registry builder: a field carrying a default must not also
 * be wrapped in .optional() (ZodDefault already accepts undefined).
 */
export function declaresDefault(schema: Record<string, unknown>, ctx: EmitContext, seenRefs: Set<string> = new Set()): boolean {
  if ("default" in schema && schema.default !== null && schema.default !== undefined) return true;
  if (typeof schema["$ref"] === "string" && ctx.root) {
    const ref = schema["$ref"] as string;
    if (!seenRefs.has(ref)) {
      // seenRefs guards against mutually-recursive $ref chains (emit itself
      // already bottomed those out via its cycle guard — this must not loop).
      seenRefs.add(ref);
      const target = resolveRefPointer(ref, ctx.root) as Record<string, unknown> | undefined;
      if (target) return declaresDefault(target, ctx, seenRefs);
    }
  }
  if (Array.isArray(schema.allOf)) {
    for (const member of schema.allOf as JsonSchema[]) {
      if (declaresDefault(member as Record<string, unknown>, ctx, seenRefs)) return true;
    }
  }
  return false;
}

function deprecation(schema: Record<string, unknown>): string {
  return schema.deprecated === true ? `.meta({ deprecated: true })` : "";
}

/**
 * Resolves an allOf member's $ref to its target schema, following chained refs
 * with the same cycle guard as the $ref branch. Returns null when the ref is
 * already on the stack — the member then expands to nothing mergeable (the
 * allOf composite falls back to z.unknown() when no other member survives).
 */
function resolveAllOfMemberRef(ref: string, ctx: EmitContext, stack: string[]): Record<string, unknown> | null {
  if (stack.includes(ref)) return null;
  if (!ctx.root) throw new Error(`Cannot resolve $ref ${ref} without the spec root`);
  const target = resolveRefPointer(ref, ctx.root) as Record<string, unknown>;
  if (typeof target["$ref"] === "string") {
    return resolveAllOfMemberRef(target["$ref"] as string, ctx, [...stack, ref]);
  }
  return target;
}

export function emitZodExpression(input: JsonSchema, ctx: EmitContext = {}): string {
  const schema = input as Record<string, unknown>;
  const stack = ctx.stack ?? [];

  // $ref: resolve inline with a cycle guard.
  if (typeof schema["$ref"] === "string") {
    const ref = schema["$ref"] as string;
    if (stack.includes(ref)) return `z.unknown() /* cycle: ${ref.replace(/\*\//g, "*\\/")} */`;
    if (!ctx.root) throw new Error(`Cannot resolve $ref ${ref} without the spec root`);
    return emitZodExpression(resolveRefPointer(ref, ctx.root) as JsonSchema, { ...ctx, stack: [...stack, ref] });
  }

  if (Array.isArray(schema.anyOf)) {
    const branches = (schema.anyOf as JsonSchema[]).map((s) => emitZodExpression(s, ctx));
    return `z.union([${branches.join(", ")}])${description(schema)}`;
  }

  if (Array.isArray(schema.allOf)) {
    // Merge object members. Contabo composes request bodies as
    // `allOf: [{ $ref: Component }]`, so $ref members must be resolved inline —
    // merging only direct properties would silently drop all validation.
    const merged: Record<string, unknown> = { type: "object", properties: {}, required: [] as string[] };
    const memberRefs: string[] = []; // resolved refs: pushed onto the stack for the merged emit
    const cycleRefs: string[] = []; // members skipped because their ref is already on the stack
    for (const part of schema.allOf as JsonSchema[]) {
      const member = part as Record<string, unknown>;
      const ref = typeof member["$ref"] === "string" ? (member["$ref"] as string) : undefined;
      const target = ref === undefined ? member : resolveAllOfMemberRef(ref, ctx, stack);
      if (target === null) {
        // Cycle: this member cannot contribute properties (see resolveAllOfMemberRef).
        cycleRefs.push(ref as string);
        continue;
      }
      if (typeof target !== "object" || target === null || (target.properties === undefined && target.required === undefined)) {
        throw new Error(`Unsupported allOf member: ${JSON.stringify(part)}`);
      }
      if (Array.isArray(target.allOf)) {
        // A member carrying its own nested allOf would need recursive merging
        // the emitter does not implement — silently discarding it would drop
        // its constraints, so fail loud instead (0 occurrences in the real spec).
        throw new Error(`Unsupported allOf member: ${JSON.stringify(part)} carries a nested allOf`);
      }
      Object.assign(merged.properties as object, target.properties ?? {});
      merged.required = [...(merged.required as string[]), ...((target.required as string[]) ?? [])];
      if (ref !== undefined) memberRefs.push(ref);
    }
    Object.assign(merged.properties as object, schema.properties ?? {});
    merged.required = [...new Set([...(merged.required as string[]), ...((schema.required as string[]) ?? [])])];
    // The wrapper's own description is agent-facing documentation (e.g. "Address details for
    // handle") — carry it onto the merged object so .describe() is emitted for it.
    if (typeof schema.description === "string" && schema.description) merged.description = schema.description;
    const nothingMerged = Object.keys(merged.properties as object).length === 0 && (merged.required as string[]).length === 0;
    if (nothingMerged && cycleRefs.length > 0) {
      // Every member collapsed into a cycle stop — the composite is unknowable,
      // same fallback as a top-level cycle.
      return `z.unknown() /* cycle: ${cycleRefs.join(", ").replace(/\*\//g, "*\\/")} */`;
    }
    // Member refs are now inlined into the merged result: re-encountering them
    // inside it is a cycle, so they must be on the stack from here on.
    return emitZodExpression(merged as JsonSchema, { ...ctx, stack: [...stack, ...memberRefs] });
  }

  const type = schema.type as string | undefined;
  const enumValues = schema.enum as unknown[] | undefined;

  if (type === "string" && Array.isArray(enumValues) && enumValues.every((v) => typeof v === "string")) {
    // ZodEnum has no min/max/regex methods — chaining stringChecks here would
    // be a guaranteed runtime TypeError (and TS error) on every emission.
    // Membership subsumes minLength/maxLength; a pattern on an enum is
    // unsupported, so fail loud instead of emitting a broken expression.
    if (typeof schema.pattern === "string") {
      throw new Error(`Unsupported pattern on enum: ${JSON.stringify(schema.pattern)}`);
    }
    return `z.enum([${enumValues.map(lit).join(", ")}])${defaultValue(schema)}${deprecation(schema)}${description(schema)}`;
  }
  if (type === "string") {
    return `z.string()${stringChecks(schema)}${defaultValue(schema)}${deprecation(schema)}${description(schema)}`;
  }
  if (type === "integer" || type === "number") {
    let out = type === "integer" ? "z.number().int()" : "z.number()";
    if (typeof schema.minimum === "number") out += `.min(${schema.minimum})`;
    if (typeof schema.maximum === "number") out += `.max(${schema.maximum})`;
    return `${out}${defaultValue(schema)}${deprecation(schema)}${description(schema)}`;
  }
  if (type === "boolean") {
    return `z.boolean()${defaultValue(schema)}${deprecation(schema)}${description(schema)}`;
  }
  if (type === "array") {
    const items = emitZodExpression((schema.items ?? {}) as JsonSchema, ctx);
    let out = `z.array(${items})`;
    if (typeof schema.minItems === "number") out += `.min(${schema.minItems})`;
    if (typeof schema.maxItems === "number") out += `.max(${schema.maxItems})`;
    return `${out}${defaultValue(schema)}${deprecation(schema)}${description(schema)}`;
  }
  if (type === "object" || schema.properties) {
    const properties = (schema.properties ?? {}) as Record<string, JsonSchema>;
    const required = new Set((schema.required as string[] | undefined) ?? []);
    const hasProperties = Object.keys(properties).length > 0;
    const body = Object.entries(properties)
      .map(([name, propSchema]) => {
        let expr = emitZodExpression(propSchema, ctx);
        // Structural default detection: a substring check on the emitted source
        // would also fire on ".default(" appearing inside .describe() text or in
        // nested emissions. Nested defaults must not leak to the parent layer.
        if (!required.has(name) && !declaresDefault(propSchema as Record<string, unknown>, ctx)) expr += ".optional()";
        return `${JSON.stringify(name)}: ${expr}`;
      })
      .join(", ");
    // Nested objects stay non-strict so agents are not punished for unspecified-but-valid fields.
    const ctor = hasProperties ? "z.object" : "z.looseObject";
    return `${ctor}(${body ? `{ ${body} }` : "{}"})${defaultValue(schema)}${description(schema)}`;
  }

  return `z.unknown()${description(schema)}`;
}
