import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types";
import { DomainToolsBuilder } from "../../tools";
import type { ContaboClient } from "../../client";
import type { Config } from "../config/index";

export class McpServerFactory {
  public create(config: Config, client: ContaboClient): McpServer {
    const tools = new DomainToolsBuilder(client, {
      writesEnabled: config.writesEnabled,
    }).build();

    const server = new McpServer(
      { name: "contabo-mcp", version: "0.1.0" },
      { capabilities: { tools: {} } },
    );

    server.server.setRequestHandler(ListToolsRequestSchema, async function () {
      const result = tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        annotations: tool.annotations,
      }));
      return { tools: result };
    });

    server.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const tool = tools.find((t) => t.name === request.params.name);
      if (!tool) {
        return {
          content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }],
          isError: true,
        };
      }

      try {
        return await tool.call(request.params.arguments);
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : String(cause);
        console.error("[contabo-mcp] tool call crashed:", message);
        return { content: [{ type: "text", text: message }], isError: true };
      }
    });

    return server;
  }
}

export function createMcpServer(config: Config, client: ContaboClient): McpServer {
  return new McpServerFactory().create(config, client);
}
