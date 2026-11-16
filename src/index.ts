#!/usr/bin/env node
/**
 * Contabo MCP Server - Entry Point
 *
 * This is the main entry point for the Contabo MCP (Model Context Protocol) server.
 * It initializes the dependency injection container, resolves the MCP server and
 * configuration, connects to stdio transport, and starts listening for requests.
 *
 * The server exposes 15 tools:
 * - 14 domain tools (instances, snapshots, images, objectStorage, privateNetworks,
 *   firewalls, dns, domains, vips, secrets, tags, users, audits, troubleshooting)
 * - 1 reference tool (contabo_reference) for browsing API documentation
 *
 * Authentication:
 * - Uses OAuth2 password grant flow with Contabo credentials
 * - Credentials loaded from environment variables
 * - Tokens cached with 60s pre-expiry refresh
 *
 * Transport:
 * - stdio transport for MCP protocol communication
 * - All logging goes to stderr (stdout reserved for MCP protocol)
 *
 * @module contabo-mcp
 */

import "reflect-metadata";
import { container } from "./infrastructure/di/container";
import { initializeLogger, LogLevel } from "./infrastructure/observability/index";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import type { Config } from "./infrastructure/config/index";
import { DI_TOKENS } from "./infrastructure/di/tokens";

/** Server version */

/**
 * Main entry point.
 * Initializes the DI container, resolves the MCP server and configuration,
 * connects the stdio transport, and starts the server.
 */
async function main(): Promise<void> {
  // Initialize logger first
  initializeLogger({
    serviceName: "contabo-mcp",
    serviceVersion: "0.1.0",
    minLevel: LogLevel.INFO,
    exportToConsole: true,
  });

  const log = (message: string, ...args: unknown[]) =>
    console.error("[contabo-mcp]", message, ...args);

  // Resolve all dependencies from the container
  const server = container.resolve<McpServer>(DI_TOKENS.McpServer);
  const config = container.resolve<Config>(DI_TOKENS.Config);

  // The server is already configured with request handlers in the container
  await server.connect(new StdioServerTransport());
  log(
    `ready: 15 tools, writes ${config.writesEnabled ? "ENABLED" : "disabled (set CONTABO_ENABLE_WRITES=1)"}`,
  );
}

process.on("uncaughtException", (error: Error) => {
  console.error("[contabo-mcp] fatal:", error.stack ?? error.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  console.error(
    "[contabo-mcp] fatal:",
    reason instanceof Error ? (reason.stack ?? reason.message) : String(reason),
  );
  process.exit(1);
});

main().catch((error: unknown) => {
  console.error(
    "[contabo-mcp] fatal:",
    error instanceof Error ? (error.stack ?? error.message) : String(error),
  );
  process.exit(1);
});
