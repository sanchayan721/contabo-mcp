import { z } from "zod";
import { DOMAINS, OPERATIONS, type RegistryOp } from "./generated/registry.js";
import type { McpTool } from "./tool-types.js";

type ParamLocation = RegistryOp["paramMeta"][number]["location"];
const LOCATION_ORDER: Record<ParamLocation, number> = { path: 0, query: 1, body: 2 };

function flagsOf(op: RegistryOp): string {
  return [
    op.write ? "write" : "read",
    op.destructive ? "DESTRUCTIVE" : "",
    op.deprecated ? "deprecated" : "",
  ]
    .filter(Boolean)
    .join(", ");
}

function formatOperation(op: RegistryOp): string {
  const head = [
    `### ${op.id} (${flagsOf(op)})`,
    `${op.method} ${op.path}`,
    op.summary,
    op.deprecated ? "**DEPRECATED** — avoid using this operation." : "",
    op.destructive
      ? "**DESTRUCTIVE** — this operation cancels, deletes, revokes or resets something."
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const params = [...op.paramMeta].sort(
    (a, b) =>
      LOCATION_ORDER[a.location] - LOCATION_ORDER[b.location] || a.name.localeCompare(b.name),
  );
  const paramLines = params.map((p) => {
    const clauses = [
      `${p.location}${p.required ? ", required" : ""}`,
      p.type,
      // An enum(...) type label already lists the values; only add "one of:"
      // for the defensive case where enumValues exist without an enum type label.
      !p.type.startsWith("enum(") && p.enumValues ? `one of: ${p.enumValues.join(" | ")}` : "",
      p.defaultValue !== undefined ? `default: ${JSON.stringify(p.defaultValue)}` : "",
    ].filter(Boolean);
    return `- \`${p.name}\` (${clauses.join(", ")})${p.description ? ` — ${p.description}` : ""}`;
  });

  return [
    head,
    paramLines.length ? `Parameters:\n${paramLines.join("\n")}` : "Parameters: none",
    `inputSchema:\n\`\`\`json\n${JSON.stringify(
      z.toJSONSchema(op.schema, { target: "draft-7", io: "input" }),
      null,
      2,
    )}\n\`\`\``,
  ].join("\n\n");
}

export function buildReferenceTool(): McpTool {
  const domainEnum = z.enum(DOMAINS);
  const schema = z.strictObject({
    domain: domainEnum.describe("Contabo domain to document"),
    operation: z
      .string()
      .optional()
      .describe(
        "Specific operation within the domain. Omit to list all operations of the domain.",
      ),
  });

  return {
    name: "contabo_reference",
    description:
      "Documentation for every Contabo MCP operation. Pass a domain to list its operations; " +
      "pass domain + operation to get full parameter documentation (types, required fields, enums, defaults, " +
      "descriptions and the exact input JSON Schema).",
    // MCP SDK's ToolSchema requires inputSchema.type === "object" at the root;
    // same wrap pattern as the domain tools in tools.ts.
    inputSchema: {
      type: "object",
      ...z.toJSONSchema(schema, { target: "draft-7", io: "input" }),
    } as Record<string, unknown>,
    annotations: { readOnlyHint: true },
    async call(rawArgs: unknown) {
      const parsed = schema.safeParse(rawArgs ?? {});
      if (!parsed.success) {
        const lines = parsed.error.issues.map(
          (i) => `- ${i.path.join(".") || "(root)"}: ${i.message}`,
        );
        return {
          content: [{ type: "text", text: `Invalid arguments:\n${lines.join("\n")}` }],
          isError: true,
        };
      }
      const { domain, operation } = parsed.data;
      const ops = OPERATIONS.filter((op) => op.domain === domain);
      if (operation) {
        const op = ops.find((o) => o.name === operation);
        if (!op) {
          const available = ops.map((o) => o.name).join(", ");
          return {
            content: [
              {
                type: "text",
                text: `Unknown operation '${operation}' in domain '${domain}'. Available: ${available}`,
              },
            ],
            isError: true,
          };
        }
        return { content: [{ type: "text", text: formatOperation(op) }] };
      }
      const body = ops.map((op) => `- ${op.name} (${flagsOf(op)}): ${op.summary}`).join("\n");
      return {
        content: [
          {
            type: "text",
            text: `Contabo domain '${domain}' — ${ops.length} operations.\n\n${body}\n\nCall again with { domain, operation } for full parameter docs.`,
          },
        ],
      };
    },
  };
}
