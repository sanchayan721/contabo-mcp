import { LoggerImpl, type Logger } from "./Logger";
import type { LoggerConfig } from "./LogEntry";
import { LogLevel } from "./LogLevel";

declare global {
  var __contaboLogger: Logger | undefined;
}

function createFallbackLogger(): Logger {
  return {
    debug: () => {},
    info: (message, attributes) => console.error("[contabo-mcp]", message, attributes ?? ""),
    warn: (message, attributes) => console.warn("[contabo-mcp]", message, attributes ?? ""),
    error: (message, attributes, error) =>
      console.error("[contabo-mcp]", message, attributes ?? "", error?.stack ?? ""),
    fatal: (message, attributes, error) =>
      console.error("[contabo-mcp]", message, attributes ?? "", error?.stack ?? ""),
    log: (...parts) => console.error("[contabo-mcp]", ...parts),
  };
}

export function initializeLogger(config: LoggerConfig): void {
  if (globalThis.__contaboLogger) {
    return;
  }

  globalThis.__contaboLogger = new LoggerImpl({
    serviceName: config.serviceName,
    serviceVersion: config.serviceVersion ?? "0.1.0",
    minLevel: config.minLevel ?? LogLevel.INFO,
    exportToConsole: config.exportToConsole,
  });
}

export function getLogger(): Logger {
  return globalThis.__contaboLogger ?? createFallbackLogger();
}
