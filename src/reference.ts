import { z } from "zod";
import { DOMAINS, OPERATIONS, type RegistryOp } from "./generated/registry";
import type { McpTool } from "./tool-types";

/**
 * Parameter location priority for sorting.
 * @internal
 */
type ParamLocation = RegistryOp["paramMeta"][number]["location"];
const LOCATION_ORDER: Record<ParamLocation, number> = {
  path: 0,
  query: 1,
  body: 2,
};

/**
 * Formats operation state flags for human-readable output.
 *
 * @internal
 */
class OperationFlagFormatter {
  /**
   * Renders operation flags (`read/write`, `DESTRUCTIVE`, `deprecated`).
   *
   * @param op - Operation descriptor from the generated registry.
   * @returns Comma-separated flag string.
   */
  format(op: RegistryOp): string {
    return [
      op.write ? "write" : "read",
      op.destructive ? "DESTRUCTIVE" : "",
      op.deprecated ? "deprecated" : "",
    ]
      .filter(Boolean)
      .join(", ");
  }
}

/**
 * Builds complete markdown documentation text for a single operation.
 *
 * @internal
 */
class OperationReferenceFormatter {
  /**
   * @param flagFormatter - Shared formatter for operation state flags.
   */
  constructor(private readonly flagFormatter: OperationFlagFormatter) {}

  /**
   * Formats a full operation reference including summary, parameter metadata,
   * and the exact input JSON Schema.
   *
   * @param op - Operation descriptor from the generated registry.
   * @returns Multi-section markdown string.
   */
  format(op: RegistryOp): string {
    const head = [
      `### ${op.id} (${this.flagFormatter.format(op)})`,
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
}

/**
 * Builds the `contabo_reference` MCP tool.
 *
 * @internal
 */
class ReferenceToolBuilder {
  private readonly domainEnum = z.enum(DOMAINS);
  private readonly schema = z.strictObject({
    domain: this.domainEnum.describe("Contabo domain to document"),
    operation: z
      .string()
      .optional()
      .describe("Specific operation within the domain. Omit to list all operations of the domain."),
  });

  constructor(
    private readonly operations: RegistryOp[],
    private readonly flagFormatter: OperationFlagFormatter,
    private readonly opFormatter: OperationReferenceFormatter,
  ) {}

  /**
   * Creates the reference tool definition.
   *
   * @returns MCP tool metadata and call implementation.
   */
  build(): McpTool {
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
        ...z.toJSONSchema(this.schema, { target: "draft-7", io: "input" }),
      } as Record<string, unknown>,
      annotations: { readOnlyHint: true },
      call: async (rawArgs: unknown) => this.call(rawArgs),
    };
  }

  /**
   * Executes a reference lookup request.
   *
   * @param rawArgs - Raw MCP tool arguments.
   * @returns Tool response text with either errors, domain list, or operation details.
   */
  private async call(rawArgs: unknown): Promise<{
    content: { type: "text"; text: string }[];
    isError?: boolean;
  }> {
    const parsed = this.schema.safeParse(rawArgs ?? {});
    if (!parsed.success) {
      const lines = parsed.error.issues.map(
        (i) => `- ${i.path.join(".") || "(root)"}: ${i.message}`,
      );
      return {
        content: [{ type: "text" as const, text: `Invalid arguments:\n${lines.join("\n")}` }],
        isError: true,
      };
    }

    const { domain, operation } = parsed.data;
    const ops = this.operations.filter((op) => op.domain === domain);

    if (operation) {
      const op = ops.find((o) => o.name === operation);
      if (!op) {
        const available = ops.map((o) => o.name).join(", ");
        return {
          content: [
            {
              type: "text" as const,
              text: `Unknown operation '${operation}' in domain '${domain}'. Available: ${available}`,
            },
          ],
          isError: true,
        };
      }

      return { content: [{ type: "text" as const, text: this.opFormatter.format(op) }] };
    }

    const body = ops
      .map((op) => `- ${op.name} (${this.flagFormatter.format(op)}): ${op.summary}`)
      .join("\n");

    return {
      content: [
        {
          type: "text" as const,
          text: `Contabo domain '${domain}' — ${ops.length} operations.\n\n${body}\n\nCall again with { domain, operation } for full parameter docs.`,
        },
      ],
    };
  }
}

/**
 * Creates the reference tool for browsing Contabo API documentation.
 * Provides two modes:
 * - Domain listing: Shows all operations in a domain with flags
 * - Operation details: Full parameter documentation with JSON schema
 *
 * @returns MCP tool definition for the reference tool
 * @public
 */
export function buildReferenceTool(): McpTool {
  const flagFormatter = new OperationFlagFormatter();
  const opFormatter = new OperationReferenceFormatter(flagFormatter);
  const builder = new ReferenceToolBuilder(OPERATIONS, flagFormatter, opFormatter);
  return builder.build();
}
