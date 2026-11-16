import { LogLevel } from "./LogLevel";
import type { LoggerConfig } from "./LogEntry";

/**
 * Logger contract.
 */
export interface Logger {
  debug(message: string, attributes?: Record<string, unknown>): void;
  info(message: string, attributes?: Record<string, unknown>): void;
  warn(message: string, attributes?: Record<string, unknown>): void;
  error(message: string, attributes?: Record<string, unknown>, error?: Error): void;
  fatal(message: string, attributes?: Record<string, unknown>, error?: Error): void;
  log(...parts: unknown[]): void;
}

/**
 * Logger implementation with structured stderr output.
 */
export class LoggerImpl implements Logger {
  private readonly minLevel: LogLevel;
  private readonly serviceName: string;
  private readonly serviceVersion: string;

  constructor(config: LoggerConfig) {
    this.minLevel = config.minLevel ?? LogLevel.INFO;
    this.serviceName = config.serviceName;
    this.serviceVersion = config.serviceVersion ?? "0.1.0";
  }

  debug(message: string, attributes?: Record<string, unknown>): void {
    this.write(LogLevel.DEBUG, message, attributes);
  }

  info(message: string, attributes?: Record<string, unknown>): void {
    this.write(LogLevel.INFO, message, attributes);
  }

  warn(message: string, attributes?: Record<string, unknown>): void {
    this.write(LogLevel.WARN, message, attributes);
  }

  error(message: string, attributes?: Record<string, unknown>, error?: Error): void {
    this.write(LogLevel.ERROR, message, attributes, error);
  }

  fatal(message: string, attributes?: Record<string, unknown>, error?: Error): void {
    this.write(LogLevel.FATAL, message, attributes, error);
  }

  log(...parts: unknown[]): void {
    console.error(`[${this.serviceName}]`, ...parts);
  }

  private write(
    level: LogLevel,
    message: string,
    attributes?: Record<string, unknown>,
    error?: Error,
  ): void {
    if (level < this.minLevel) {
      return;
    }

    const payload: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      level: LogLevel[level],
      service: this.serviceName,
      version: this.serviceVersion,
      message,
    };

    if (attributes && Object.keys(attributes).length > 0) {
      payload.attributes = attributes;
    }

    if (error) {
      payload.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    console.error(JSON.stringify(payload));
  }
}
