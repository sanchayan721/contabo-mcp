/**
 * Builds the operation registry from the Contabo OpenAPI spec and emits
 * src/generated/registry.ts. Run: npm run generate [-- path/to/openapi.json]
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { z } from "zod";
import { extractOperations, type JsonSchema, type Param, type RawOperation } from "./extract.js";
import { emitZodExpression, declaresDefault, coerceDefaultValue, type EmitContext } from "./emit.js";
import { domainForTag, nameForOperationId, isDestructive, NAME_OVERRIDES } from "./overrides.js";

export interface ParamMeta {
  name: string;
  location: "path" | "query" | "body";
  required: boolean;
  description: string;
  type: string;
  deprecated: boolean;
  enumValues?: string[];
  defaultValue?: unknown;
}

export interface BuiltOp {
  id: string;
  domain: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  summary: string;
  description: string;
  deprecated: boolean;
  write: boolean;
  destructive: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any; // z.ZodObject with an `operation` literal — typed loosely, generated code
  pathParams: string[];
  queryParams: string[];
  bodyParams: string[];
  paramMeta: ParamMeta[];
}

export const DOMAINS = [
  "instances", "snapshots", "images", "objectStorage", "privateNetworks",
  "firewalls", "dns", "domains", "vips", "secrets", "tags", "users",
  "audits", "troubleshooting",
] as const;

function typeLabel(schema: Record<string, unknown>): string {
  const t = schema.type;
  if (t === "array") return `${typeLabel((schema.items ?? {}) as Record<string, unknown>)}[]`;
  // The enum label wins over the primitive labels — the allowed value set
  // describes what an agent may pass more precisely than the bare type.
  if (Array.isArray(schema.enum)) return `enum(${(schema.enum as unknown[]).map(String).join("|")})`;
  if (t === "integer") return "integer";
  if (t === "number") return "number";
  if (t === "boolean") return "boolean";
  if (t === "object") return "object";
  if (typeof t === "string") return String(t);
  // allOf wrappers (`{ allOf: [{ $ref }] }`) declare no type of their own —
  // derive the label from the first member that carries a type or enum.
  if (Array.isArray(schema.allOf)) {
    for (const member of schema.allOf as unknown[]) {
      if (member && typeof member === "object") {
        const m = member as Record<string, unknown>;
        if (typeof m.type === "string" || Array.isArray(m.enum)) return typeLabel(m);
      }
    }
    // AllOf members merge into an object in the emitter — "object" is the
    // honest fallback when no member carries a usable type.
    return "object";
  }
  return "unknown";
}

function metaFromParam(p: Param, location: "path" | "query"): ParamMeta {
  const schema = p.schema as Record<string, unknown>;
  return {
    name: p.name,
    location,
    required: p.required,
    description: p.description,
    type: typeLabel(schema),
    deprecated: p.deprecated,
    enumValues: Array.isArray(schema.enum) ? (schema.enum as string[]) : undefined,
    defaultValue: coerceDefaultValue(schema),
  };
}

// Description policy: path/query descriptions come from the OpenAPI parameter
// object (the fallback text exists because there is no other source), while
// body-prop descriptions come from the schema itself and are intentionally
// left empty when absent — no fabricated docs.
function metaFromBody(name: string, schema: JsonSchema, required: string[]): ParamMeta {
  const s = schema as Record<string, unknown>;
  return {
    name,
    location: "body",
    required: required.includes(name),
    description: typeof s.description === "string" ? s.description : "",
    type: typeLabel(s),
    deprecated: s.deprecated === true,
    enumValues: Array.isArray(s.enum) ? (s.enum as string[]) : undefined,
    defaultValue: coerceDefaultValue(s),
  };
}

function buildOp(raw: RawOperation, spec: JsonSchema): BuiltOp & { schemaSrc: string } {
  const domain = domainForTag((raw.tags ?? [])[0] ?? "");
  const name = nameForOperationId(raw.operationId);
  const id = `${domain}_${name}`;
  const emitCtx: EmitContext = { root: spec };

  const pathParams = raw.pathParams.map((p) => p.name);
  const queryParams = raw.queryParams.map((p) => p.name);
  const bodyParams = raw.body ? Object.keys(raw.body.properties) : [];

  // Intra-op collision check: a key in two locations would silently break dispatch.
  const seen = new Map<string, string>();
  for (const [loc, names] of [["path", pathParams], ["query", queryParams], ["body", bodyParams]] as const) {
    for (const n of names) {
      // The schema carries an `operation` literal — a param of that name would shadow it.
      if (n === "operation") throw new Error(`Parameter "operation" on ${raw.operationId} collides with the operation discriminator — rename it in overrides.ts`);
      const prior = seen.get(n);
      if (prior) throw new Error(`Parameter "${n}" declared in both ${prior} and ${loc} for ${raw.operationId} — add a rename to overrides.ts`);
      seen.set(n, loc);
    }
  }

  const fields: string[] = [`operation: z.literal(${JSON.stringify(name)})`];
  const paramMeta: ParamMeta[] = [];

  // Parameter descriptions live on the OpenAPI parameter object, but a param
  // schema may also carry its own top-level description — emitting both would
  // double-.describe(). Emit from a shallow copy without it, then describe
  // explicitly from the parameter object (fallback keeps a non-empty label).
  for (const p of raw.pathParams) {
    const { description: _own, ...schemaNoDesc } = p.schema as Record<string, unknown>;
    const description = p.description || `Path parameter ${p.name}`;
    const expr = `${emitZodExpression(schemaNoDesc as JsonSchema, emitCtx)}.describe(${JSON.stringify(description)})`;
    fields.push(`${JSON.stringify(p.name)}: ${expr}`);
    paramMeta.push(metaFromParam(p, "path"));
  }
  for (const p of raw.queryParams) {
    const { description: _own, ...schemaNoDesc } = p.schema as Record<string, unknown>;
    const description = p.description || `Query parameter ${p.name}`;
    let expr = emitZodExpression(schemaNoDesc as JsonSchema, emitCtx);
    if (!p.required && !declaresDefault(p.schema, emitCtx)) expr += ".optional()";
    expr += `.describe(${JSON.stringify(description)})`;
    fields.push(`${JSON.stringify(p.name)}: ${expr}`);
    paramMeta.push(metaFromParam(p, "query"));
  }
  if (raw.body) {
    for (const [prop, propSchema] of Object.entries(raw.body.properties)) {
      // Body properties keep the emitter's own .describe (their descriptions
      // live on the schema itself) — do NOT append another one.
      let expr = emitZodExpression(propSchema, emitCtx);
      if (!raw.body.required.includes(prop) && !declaresDefault(propSchema, emitCtx)) expr += ".optional()";
      fields.push(`${JSON.stringify(prop)}: ${expr}`);
      paramMeta.push(metaFromBody(prop, propSchema, raw.body.required));
    }
  }

  const write = raw.method !== "GET";
  return {
    id,
    domain,
    name,
    method: raw.method,
    path: raw.path,
    summary: raw.summary,
    description: raw.description,
    deprecated: raw.deprecated,
    write,
    destructive: isDestructive(raw.method, name),
    schema: null, // materialized from schemaSrc by buildRegistry
    pathParams,
    queryParams,
    bodyParams,
    paramMeta,
    schemaSrc: `z.strictObject({ ${fields.join(", ")} })`,
  };
}

/** Evaluates emitted zod source with the same harness as the emit tests (zod 4.6.7). */
// eslint-disable-next-line no-new-func
const evalSchema = (src: string): BuiltOp["schema"] => new Function("z", `"use strict"; return (${src});`)(z);

function registrySource(ops: (BuiltOp & { schemaSrc: string })[]): string {
  const entries = ops
    .map((op) => {
      const meta = {
        id: op.id, domain: op.domain, name: op.name, method: op.method, path: op.path,
        summary: op.summary, description: op.description, deprecated: op.deprecated,
        write: op.write, destructive: op.destructive,
        pathParams: op.pathParams, queryParams: op.queryParams, bodyParams: op.bodyParams,
        paramMeta: op.paramMeta,
      };
      return `  {\n    ...${JSON.stringify(meta, null, 2).replace(/\n/g, "\n    ")},\n    // eslint-disable-next-line @typescript-eslint/no-explicit-any\n    schema: ${op.schemaSrc} as any,\n  },`;
    })
    .join("\n");

  return `// GENERATED FILE — do not edit. Regenerate with: npm run generate
import { z } from "zod";

export interface ParamMeta {
  name: string;
  location: "path" | "query" | "body";
  required: boolean;
  description: string;
  type: string;
  deprecated: boolean;
  enumValues?: string[];
  defaultValue?: unknown;
}

export interface RegistryOp {
  id: string;
  domain: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  summary: string;
  description: string;
  deprecated: boolean;
  write: boolean;
  destructive: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any;
  pathParams: string[];
  queryParams: string[];
  bodyParams: string[];
  paramMeta: ParamMeta[];
}

export const DOMAINS = ${JSON.stringify(DOMAINS)} as const;

export const OPERATIONS: RegistryOp[] = [
${entries}
];
`;
}

export function buildRegistry(spec: JsonSchema): { ops: BuiltOp[]; domains: string[]; source: string } {
  const raws = extractOperations(spec);

  // Emit each op's zod source, then materialize the schema from that very
  // source — this guarantees the emitted registry and the in-memory registry
  // stay identical (and that every emission is actually constructible).
  const built = raws.map((raw) => buildOp(raw, spec));

  // Uniqueness guards — codegen must fail loudly rather than silently drop/rename ops.
  const ids = new Set<string>();
  const byDomainName = new Set<string>();
  for (const op of built) {
    if (ids.has(op.id)) throw new Error(`Duplicate op id: ${op.id}`);
    const dn = `${op.domain}/${op.name}`;
    if (byDomainName.has(dn)) throw new Error(`Duplicate operation name "${op.name}" in domain "${op.domain}" — fix NAME_OVERRIDES`);
    ids.add(op.id);
    byDomainName.add(dn);
  }
  // Override-table hygiene: every override key must exist in the spec.
  const rawIds = new Set(raws.map((r) => r.operationId));
  for (const key of Object.keys(NAME_OVERRIDES)) {
    if (!rawIds.has(key)) throw new Error(`NAME_OVERRIDES key "${key}" does not exist in the spec — remove or fix it`);
  }

  const source = registrySource(built);

  const ops: BuiltOp[] = built.map(({ schemaSrc, ...op }) => ({ ...op, schema: evalSchema(schemaSrc) }));
  return { ops, domains: [...DOMAINS], source };
}

export function main(argv: string[]): void {
  const specPath = argv[2] ?? "spec/contabo-openapi.json";
  const outPath = "src/generated/registry.ts";
  const spec = JSON.parse(readFileSync(specPath, "utf8")) as JsonSchema;
  const { ops, source } = buildRegistry(spec);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, source);
  const reads = ops.filter((o) => !o.write).length;
  console.error(`generated ${outPath}: ${ops.length} operations (${reads} read, ${ops.length - reads} write) across ${DOMAINS.length} domains`);
}

// Run as CLI only (tsx src/codegen/generate.ts <spec>).
if (process.argv[1] && process.argv[1].endsWith("generate.ts")) {
  main(process.argv);
}
