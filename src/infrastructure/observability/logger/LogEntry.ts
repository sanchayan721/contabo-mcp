/**
 * Log entry structure for structured logging.
 * @module infrastructure/observability/logger
 */

import { LogLevel } from "./LogLevel";

export interface LogEntry {
  level: LogLevel;
  message: string;
  attributes?: Record<string, unknown>;
  error?: Error;
  traceId?: string;
  spanId?: string;
}

export interface LoggerConfig {
  serviceName: string;
  serviceVersion?: string;
  minLevel?: LogLevel;
  exportToConsole?: boolean;
}
