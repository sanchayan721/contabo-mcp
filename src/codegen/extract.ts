/**
 * Extracts flat operation descriptors from the Contabo OpenAPI spec.
 * Header parameters (x-request-id, x-trace-id) are dropped — the MCP client
 * layer injects them itself.
 */

export type JsonSchema = Record<string, unknown>;

export interface Param {
  name: string;
  required: boolean;
  description: string;
  schema: JsonSchema;
  deprecated: boolean;
}

export interface RawOperation {
  operationId: string;
  tags: string[];
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  summary: string;
  description: string;
  deprecated: boolean;
  pathParams: Param[];
  queryParams: Param[];
  /** undefined when the operation has no request body */
  body?: { properties: Record<string, JsonSchema>; required: string[]; description: string };
  bodyRequired: boolean;
}

const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete"]);

/** Headers the MCP layer drops; everything else must not be silently ignored. */
const ALLOWED_HEADERS = new Set(["x-request-id", "x-trace-id"]);

/** Resolve a $ref pointer like "#/components/schemas/Foo" inside the spec document. */
export function deref(node: unknown, root: JsonSchema, stack: string[] = []): unknown {
  if (typeof node !== "object" || node === null) return node;
  const ref = (node as Record<string, unknown>)["$ref"];
  if (typeof ref !== "string") return node;
  if (!ref.startsWith("#/")) throw new Error(`Only local $refs supported: ${ref}`);
  if (stack.includes(ref)) return { type: "object" }; // cycle guard
  let current: unknown = root;
  for (const part of ref.slice(2).split("/")) {
    const key = part.replace(/~1/g, "/").replace(/~0/g, "~");
    if (typeof current !== "object" || current === null || !(key in current)) {
      throw new Error(`Unresolvable $ref: ${ref}`);
    }
    current = (current as Record<string, unknown>)[key];
  }
  return deref(current, root, [...stack, ref]);
}

function toParam(p: unknown, root: JsonSchema): Param & { in: string } {
  const param = deref(p, root) as Record<string, unknown>;
  return {
    name: String(param.name),
    in: String(param.in),
    required: Boolean(param.required),
    description: typeof param.description === "string" ? param.description : "",
    schema: (param.schema ?? {}) as JsonSchema,
    deprecated: Boolean(param.deprecated),
  };
}

function toBody(requestBody: unknown, root: JsonSchema): { properties: Record<string, JsonSchema>; required: string[]; description: string } {
  const rb = deref(requestBody, root) as Record<string, unknown>;
  const content = rb.content as Record<string, Record<string, unknown>> | undefined;
  const json = content?.["application/json"];
  if (!json) throw new Error("Request body without application/json content");
  const schema = deref(json.schema, root) as Record<string, unknown>;
  if (schema.type !== "object" && !schema.properties) {
    throw new Error(`Unsupported request body schema type: ${String(schema.type)}`);
  }
  const properties = Object.fromEntries(
    Object.entries((schema.properties ?? {}) as Record<string, JsonSchema>).map(([k, v]) => [k, deref(v, root) as JsonSchema]),
  );
  return {
    properties,
    required: (schema.required as string[] | undefined) ?? [],
    description: typeof schema.description === "string" ? schema.description : "",
  };
}

export function extractOperations(spec: JsonSchema): RawOperation[] {
  const paths = spec.paths as Record<string, Record<string, unknown>>;
  const ops: RawOperation[] = [];
  for (const [path, pathItem] of Object.entries(paths)) {
    for (const [method, operationUnknown] of Object.entries(pathItem)) {
      if (!HTTP_METHODS.has(method)) continue;
      const operation = operationUnknown as Record<string, unknown>;
      const rawParams = [...((pathItem.parameters as unknown[]) ?? []), ...((operation.parameters as unknown[]) ?? [])];
      const params = rawParams.map((p) => toParam(p, spec));
      for (const param of params) {
        if (param.in === "header") {
          if (!ALLOWED_HEADERS.has(param.name)) {
            throw new Error(`Parameter "${param.name}" in "${param.in}" on ${method.toUpperCase()} ${path} is not supported — the MCP layer injects auth headers itself; extend ALLOWED_HEADERS in src/codegen/extract.ts if this header must reach the API`);
          }
        } else if (param.in !== "path" && param.in !== "query") {
          throw new Error(`Unsupported parameter location "${param.in}" for "${param.name}" on ${method.toUpperCase()} ${path}`);
        }
      }
      if (typeof operation.operationId !== "string" || !operation.operationId) {
        throw new Error(`Operation ${method.toUpperCase()} ${path} is missing operationId — cannot map it to a tool operation`);
      }
      const hasBody = operation.requestBody !== undefined;
      ops.push({
        operationId: operation.operationId,
        tags: (operation.tags as string[] | undefined) ?? [],
        method: method.toUpperCase() as RawOperation["method"],
        path,
        summary: String(operation.summary ?? ""),
        description: String(operation.description ?? ""),
        deprecated: Boolean(operation.deprecated),
        pathParams: params.filter((p) => p.in === "path").map(({ in: _in, ...rest }) => rest),
        queryParams: params.filter((p) => p.in === "query").map(({ in: _in, ...rest }) => rest),
        body: hasBody ? toBody(operation.requestBody, spec) : undefined,
        bodyRequired: hasBody ? Boolean((deref(operation.requestBody, spec) as Record<string, unknown>).required) : false,
      });
    }
  }
  return ops;
}
