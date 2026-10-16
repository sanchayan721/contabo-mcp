import { z } from "zod";
import { DOMAINS, OPERATIONS, type RegistryOp } from "./generated/registry.js";
import { buildReferenceTool } from "./reference.js";
import type { McpTool } from "./tool-types.js";
import { ContaboApiError, type ContaboClient } from "./client.js";

export type { McpTool };

export interface ToolCallResult {
  content: { type: "text"; text: string }[];
  isError?: boolean;
}

const DOMAIN_LABELS: Record<string, string> = {
  instances: "Contabo compute instances (VPS/VDS)",
  snapshots: "Contabo instance snapshots",
  images: "Contabo standard and custom images",
  objectStorage: "Contabo S3-compatible object storages and data centers",
  privateNetworks: "Contabo private networks (VPC)",
  firewalls: "Contabo firewalls and their rules",
  dns: "Contabo DNS zones, records and PTR records",
  domains: "Contabo domains and contact handles",
  vips: "Contabo virtual IPs (VIP)",
  secrets: "Contabo secrets (SSH keys, passwords)",
  tags: "Contabo tags and tag assignments",
  users: "Contabo users, roles, accounts and object-storage credentials",
  audits: "Contabo audit logs for every resource type",
  troubleshooting: "Contabo troubleshooting checks, check collections and remedies",
};

function ok(result: unknown): ToolCallResult {
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
}

function err(message: string): ToolCallResult {
  return { content: [{ type: "text", text: message }], isError: true };
}

function formatIssues(error: z.ZodError): string {
  const lines = error.issues.map((issue) => {
    const path = issue.path.length ? issue.path.join(".") : "(root)";
    return `- ${path}: ${issue.message}`;
  });
  return `Invalid arguments:\n${lines.join("\n")}`;
}

function describeDomain(domain: string, ops: RegistryOp[], writesEnabled: boolean): string {
  const lines = ops.map(
    (op) =>
      `- ${op.name}: ${op.summary}${op.deprecated ? " (DEPRECATED)" : ""}${op.destructive ? " [DESTRUCTIVE]" : ""}`,
  );
  const gate = writesEnabled
    ? "This server allows write operations."
    : "This server runs READ-ONLY: write operations are rejected until it is started with CONTABO_ENABLE_WRITES=1.";
  return [
    `${DOMAIN_LABELS[domain] ?? domain}. Choose exactly one 'operation'; every operation has its own parameter set (validated per operation).`,
    gate,
    `Operations:\n${lines.join("\n")}`,
    "Use the contabo_reference tool for full parameter documentation of any operation.",
  ].join("\n\n");
}

function pickDefined(args: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    if (args[key] !== undefined) out[key] = args[key];
  }
  return out;
}

function buildDomainTool(
  domain: string,
  client: Pick<ContaboClient, "request">,
  writesEnabled: boolean,
): McpTool {
  const ops = OPERATIONS.filter((op) => op.domain === domain);
  const byName = new Map(ops.map((op) => [op.name, op]));
  // RegistryOp.schema is declared `any`; the codegen guarantees every schema is a
  // strictObject whose FIRST key is the `operation` literal, so the cast below is
  // the intended discriminated-union option tuple.
  type DiscriminatedOps = [z.core.$ZodTypeDiscriminable, ...z.core.$ZodTypeDiscriminable[]];
  const union = z.discriminatedUnion(
    "operation",
    ops.map((op) => op.schema) as unknown as DiscriminatedOps,
  );
  const hasWrites = ops.some((op) => op.write);
  const hasDestructive = ops.some((op) => op.destructive);

  return {
    name: `contabo_${domain}`,
    description: describeDomain(domain, ops, writesEnabled),
    // MCP SDK's ToolSchema requires inputSchema.type === "object" at the root;
    // the discriminated-union draft-7 schema alone ({ $schema, oneOf }) gets
    // rejected on tools/list. A root type alongside oneOf is valid JSON Schema.
    inputSchema: {
      type: "object",
      ...z.toJSONSchema(union, { target: "draft-7", io: "input" }),
    } as Record<string, unknown>,
    annotations: {
      ...(hasWrites ? { readOnlyHint: false } : { readOnlyHint: true }),
      ...(hasDestructive ? { destructiveHint: true } : {}),
    },
    async call(rawArgs: unknown): Promise<ToolCallResult> {
      const parsed = union.safeParse(rawArgs ?? {});
      if (!parsed.success) return err(formatIssues(parsed.error));
      const args = parsed.data as Record<string, unknown>;
      const op = byName.get(String(args.operation))!;

      if (op.write && !writesEnabled) {
        return err(
          `Operation '${op.id}' is a write operation (${op.method} ${op.path}) but this server is running ` +
            "read-only. Restart the server with CONTABO_ENABLE_WRITES=1 to allow write operations.",
        );
      }

      const path = op.path.replace(/\{(\w+)\}/g, (_, key: string) => encodeURIComponent(String(args[key])));
      const query: Record<string, string[]> = {};
      for (const key of op.queryParams) {
        const value = args[key];
        if (value === undefined) continue;
        query[key] = Array.isArray(value) ? value.map(String) : [String(value)];
      }
      const body = op.method === "GET" ? undefined : pickDefined(args, op.bodyParams);

      try {
        return ok(await client.request(op.method, path, { query, body }));
      } catch (cause) {
        if (cause instanceof ContaboApiError) return err(cause.message);
        return err(cause instanceof Error ? cause.message : String(cause));
      }
    },
  };
}

export function buildDomainTools(
  client: Pick<ContaboClient, "request">,
  opts: { writesEnabled: boolean },
): McpTool[] {
  const domainTools = DOMAINS.map((domain) => buildDomainTool(domain, client, opts.writesEnabled));
  return [...domainTools, buildReferenceTool()];
}
