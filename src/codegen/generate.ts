/**
 * Builds the operation registry from the Contabo OpenAPI spec and emits
 * src/generated/registry.ts. Run: npm run generate [-- path/to/openapi.json]
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { z } from "zod";
import { extractOperations, type JsonSchema, type Param, type RawOperation } from "./extract";
import { emitZodExpression, declaresDefault, type EmitContext } from "./emit";
import { domainForTag, nameForOperationId, isDestructive, NAME_OVERRIDES } from "./overrides";

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

  schema: any; // z.ZodObject with an `operation` literal — typed loosely, generated code
  pathParams: string[];
  queryParams: string[];
  bodyParams: string[];
  paramMeta: ParamMeta[];
}

export const DOMAINS = [
  "instances",
  "snapshots",
  "images",
  "objectStorage",
  "privateNetworks",
  "firewalls",
  "dns",
  "domains",
  "vips",
  "secrets",
  "tags",
  "users",
  "audits",
  "troubleshooting",
] as const;

function typeLabel(schema: Record<string, unknown>): string {
  const t = schema.type;
  if (t === "array") return `${typeLabel((schema.items ?? {}) as Record<string, unknown>)}[]`;
  if (t === "integer") return "integer";
  if (t === "number") return "number";
  if (t === "boolean") return "boolean";
  if (t === "object") return "object";
  if (Array.isArray(schema.enum))
    return `enum(${(schema.enum as unknown[]).map(String).join("|")})`;
  if (t === "object") return "object";
  if (typeof t === "string") return String(t);
  return "unknown";
}

function metaFromParam(
  p: Param,
  location: "path" | "query",
): import("../../infrastructure/config/index").ParamMeta {
  const schema = p.schema as Record<string, unknown>;
  return {
    name: p.name,
    location,
    required: p.required,
    description: p.description,
    type: typeLabel(schema),
    deprecated: p.deprecated,
    enumValues: Array.isArray(schema.enum) ? (schema.enum as string[]) : undefined,
    defaultValue: schema.default,
  };
}

function metaFromBody(
  name: string,
  schema: JsonSchema,
  required: string[],
): import("../../infrastructure/config/index").ParamMeta {
  const s = schema as Record<string, unknown>;
  return {
    name,
    location: "body",
    required: required.includes(name),
    description: typeof s.description === "string" ? s.description : "",
    type: typeLabel(s),
    deprecated: s.deprecated === true,
    enumValues: Array.isArray(s.enum) ? (s.enum as string[]) : undefined,
    defaultValue: s.default,
  };
}

function buildOp(raw: RawOperation, spec: JsonSchema): BuiltOp {
  const domain = domainForTag((raw.tags ?? [])[0] ?? "");
  const name = nameForOperationId(raw.operationId);
  const id = `${domain}_${name}`;

  const pathParams = raw.pathParams.map((p) => p.name);
  const queryParams = raw.queryParams.map((p) => p.name);
  const bodyParams = raw.body ? Object.keys(raw.body.properties) : [];

  // Intra-op collision check: a path/query/body key appearing twice would silently break dispatch.
  const seen = new Map<string, string>();
  for (const [loc, names] of [
    ["path", pathParams],
    ["query", queryParams],
    ["body", bodyParams],
  ] as const) {
    for (const n of names) {
      const prior = seen.get(n);
      if (prior)
        throw new Error(
          `Parameter "${n}" declared in both ${prior} and ${loc} for ${raw.operationId} — add a rename to overrides.ts`,
        );
      seen.set(n, loc);
    }
  }

  const fields: string[] = [`operation: z.literal(${JSON.stringify(name)})`];
  const paramMeta: import("../config/index").ParamMeta[] = [];

  const emitCtx = { root: spec } as EmitContext;

  for (const p of raw.pathParams) {
    const { description: _own, ...schemaNoDesc } = p.schema as Record<string, unknown>;
    let expr = emitZodExpression(schemaNoDesc as JsonSchema, emitCtx);
    expr += `.describe(${JSON.stringify(p.description || `Path parameter ${p.name}`)})`;
    fields.push(`${JSON.stringify(p.name)}: ${expr}`);
    paramMeta.push(metaFromParam(p, "path"));
  }
  for (const p of raw.queryParams) {
    const { description: _own, ...schemaNoDesc } = p.schema as Record<string, unknown>;
    let expr = emitZodExpression(schemaNoDesc as JsonSchema, { root: spec });
    if (!p.required && !declaresDefault(p.schema as Record<string, unknown>, { root: spec }))
      expr += ".optional()";
    if (p.description) expr += `.describe(${JSON.stringify(p.description)})`;
    fields.push(`${JSON.stringify(p.name)}: ${expr}`);
    paramMeta.push(metaFromParam(p, "query"));
  }
  if (raw.body) {
    for (const [prop, propSchema] of Object.entries(raw.body.properties)) {
      let expr = emitZodExpression(propSchema as JsonSchema, { root: spec });
      if (
        !raw.body.required.includes(prop) &&
        !declaresDefault(propSchema as Record<string, unknown>, { root: spec })
      )
        expr += ".optional()";
      fields.push(`${JSON.stringify(prop)}: ${expr}`);
      paramMeta.push(metaFromBody(prop, propSchema, raw.body.required));
    }
  }

  const write = raw.method !== "GET";
  const schemaSrc = `z.strictObject({ ${fields.join(", ")} })`;
  const schema = new Function("z", `return ${schemaSrc};`)(z) as BuiltOp["schema"];

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
    schema,
    schemaSrc,
    pathParams,
    queryParams,
    bodyParams,
    paramMeta,
  } as BuiltOp & { schemaSrc: string };
}

function registrySource(ops: (BuiltOp & { schemaSrc: string })[]): string {
  const entries = ops.map((op) => {
    const meta = {
      id: op.id,
      domain: op.domain,
      name: op.name,
      method: op.method,
      path: op.path,
      summary: op.summary,
      description: op.description,
      deprecated: op.deprecated,
      write: op.write,
      destructive: op.destructive,
      pathParams: op.pathParams,
      queryParams: op.queryParams,
      bodyParams: op.bodyParams,
      paramMeta: op.paramMeta,
    };
    const metaStr = Object.entries(meta)
      .map(([k, v]) => `    ${k}: ${JSON.stringify(v)}`)
      .join(",\n");
    return `  {\n    ...{\n${metaStr}\n    },\n    // eslint-disable-next-line @typescript-eslint/no-explicit-any\n    schema: ${(op as Record<string, unknown>).schemaSrc as string} as any,\n  }`;
  });

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

export function buildRegistry(spec: JsonSchema): {
  ops: BuiltOp[];
  domains: string[];
  source: string;
} {
  const raws = extractOperations(spec);
  const built = raws.map((raw) => buildOp(raw, spec));

  // Uniqueness guards — codegen must fail loudly rather than silently drop/rename ops.
  const ids = new Set<string>();
  const byDomainName = new Set<string>();
  for (const op of built) {
    if (ids.has(op.id)) throw new Error(`Duplicate op id: ${op.id}`);
    const dn = `${op.domain}/${op.name}`;
    if (byDomainName.has(dn))
      throw new Error(
        `Duplicate operation name "${op.name}" in domain "${op.domain}" — fix NAME_OVERRIDES`,
      );
    ids.add(op.id);
    byDomainName.add(dn);
  }
  // Override-table hygiene: every override key must exist in the spec.
  const rawIds = new Set(raws.map((r) => r.operationId));
  for (const key of Object.keys(NAME_OVERRIDES)) {
    if (!rawIds.has(key))
      throw new Error(`NAME_OVERRIDES key "${key}" does not exist in the spec — remove or fix it`);
  }

  const domains = [...DOMAINS];
  return { ops: built, domains, source: registrySource(built) };
}

export function main(argv: string[]): void {
  const specPath = argv[2] ?? "spec/contabo-openapi.json";
  const outPath = "src/generated/registry.ts";
  const spec = JSON.parse(require("node:fs").readFileSync(specPath, "utf8"));
  const { ops, source } = buildRegistry(spec);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, source);
  const reads = ops.filter((o) => !o.write).length;
  console.error(
    `generated ${outPath}: ${ops.length} operations (${reads} read, ${ops.length - reads} write) across ${DOMAINS.length} domains`,
  );
}

// Run as CLI only (tsx src/codegen/generate.ts <spec>).
if (process.argv[1] && process.argv[1].endsWith("generate.ts")) {
  main(process.argv);
}
