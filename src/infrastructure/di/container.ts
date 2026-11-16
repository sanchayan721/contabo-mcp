import "reflect-metadata";
import { container } from "tsyringe";
import { ContaboClient } from "../../client";
import { Config, ConfigLoaderImpl } from "../config/index";
import { ContaboAuthError, ContaboApiError } from "../../client/errors";
import { createMcpServer } from "./createMcpServer";
import { DI_TOKENS } from "./tokens";

/**
 * Creates and configures the dependency injection container.
 * This module initializes the tsyringe container with all application services.
 *
 * Registration strategy:
 * - Config: Registered as a singleton value (loaded once at startup)
 * - ContaboClient: Factory-scoped, created per resolution with config injection
 * - Logger: Not registered (uses global logger)
 * - McpServer: Factory-scoped, creates a new server with all handlers on each resolution
 *
 * @module infrastructure/di/container
 */

/**
 * Creates a config loader instance for dependency registration.
 * Using a single instance ensures consistent configuration across the application.
 */
const configLoader = new ConfigLoaderImpl();

/**
 * Registers the application configuration as a singleton value.
 * Configuration is loaded once at startup from environment variables.
 */
container.registerInstance(DI_TOKENS.Config, configLoader.load());

/**
 * Registers the Contabo API client as a factory.
 * A new client instance is created per resolution with the current configuration.
 * Uses factory function to properly inject configuration values.
 */
container.register(DI_TOKENS.ContaboClient, {
  useFactory: (c: typeof container) => {
    const config = c.resolve<Config>(DI_TOKENS.Config);
    return new ContaboClient({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      apiUser: config.apiUser,
      apiPassword: config.apiPassword,
      baseUrl: config.baseUrl,
      authUrl: config.authUrl,
      timeoutMs: config.timeoutMs,
    });
  },
});

/**
 * Registers the MCP server as a factory.
 * Creates a new server instance with all request handlers on each resolution.
 * This ensures fresh tool registrations and handler bindings.
 */
container.register(DI_TOKENS.McpServer, {
  useFactory: (c: typeof container) => {
    const config = c.resolve<Config>(DI_TOKENS.Config);
    const client = c.resolve<ContaboClient>(DI_TOKENS.ContaboClient);
    return createMcpServer(config, client);
  },
});

// Export the container for use in the application
export { container };

// Export error types for external use
export { ContaboAuthError, ContaboApiError };
export type { Config } from "../config/index";
export type { McpTool } from "../../tool-types";
