import { DOMAINS, OPERATIONS } from "./generated/registry";
import { buildReferenceTool } from "./reference";
import type { McpTool } from "./tool-types";
import type { ContaboClient } from "./client";
import { DomainToolFactory } from "./domain-tools/buildDomainTool";
import type { ToolCallResult } from "./domain-tools/result";

export type { McpTool };
export type { ToolCallResult };

export interface DomainToolsBuilderOptions {
  writesEnabled: boolean;
}

export class DomainToolsBuilder {
  private readonly domainToolFactory: DomainToolFactory;

  public constructor(
    private readonly client: Pick<ContaboClient, "request">,
    private readonly options: DomainToolsBuilderOptions,
    domainToolFactory?: DomainToolFactory,
  ) {
    this.domainToolFactory = domainToolFactory ?? new DomainToolFactory();
  }

  public build(): McpTool[] {
    const domainTools = DOMAINS.map((domain) =>
      this.domainToolFactory.create(
        domain,
        OPERATIONS.filter((op) => op.domain === domain),
        this.client,
        this.options.writesEnabled,
      ),
    );
    return [...domainTools, buildReferenceTool()];
  }
}

/**
 * Builds all domain tools plus the reference tool.
 * Creates one MCP tool per domain plus the reference/documentation tool.
 *
 * @param client - Contabo client with request method
 * @param opts - Options object with writesEnabled flag
 * @returns Array of MCP tool definitions (14 domain tools + 1 reference tool = 15 total)
 * @public
 */
export function buildDomainTools(
  client: Pick<ContaboClient, "request">,
  opts: { writesEnabled: boolean },
): McpTool[] {
  return new DomainToolsBuilder(client, opts).build();
}
