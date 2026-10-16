#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { ContaboClient } from "./client.js";
import { buildDomainTools } from "./tools.js";
import type { McpTool } from "./tool-types.js";

const VERSION = "0.1.0";

const log = (...parts: unknown[]): void => {
  console.error("[contabo-mcp]", ...parts);
};

async function main(): Promise<void> {
  const config = loadConfig();
  const client = new ContaboClient({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    apiUser: config.apiUser,
    apiPassword: config.apiPassword,
    baseUrl: config.baseUrl,
    authUrl: config.authUrl,
    timeoutMs: config.timeoutMs,
  });

  const tools: McpTool[] = buildDomainTools(client, { writesEnabled: config.writesEnabled });

  const server = new Server({ name: "contabo-mcp", version: VERSION }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
      annotations: tool.annotations,
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = tools.find((t) => t.name === request.params.name);
    if (!tool) {
      return { content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }], isError: true };
    }
    try {
      return await tool.call(request.params.arguments);
    } catch (cause) {
      // Tool call handlers normally return isError results themselves; this is a last resort.
      const message = cause instanceof Error ? cause.message : String(cause);
      log("tool call crashed:", message);
      return { content: [{ type: "text", text: message }], isError: true };
    }
  });

  await server.connect(new StdioServerTransport());
  log(`ready: ${tools.length} tools, writes ${config.writesEnabled ? "ENABLED" : "disabled (set CONTABO_ENABLE_WRITES=1)"}`);
}

main().catch((error: unknown) => {
  log("fatal:", error instanceof Error ? error.stack ?? error.message : String(error));
  process.exit(1);
});
