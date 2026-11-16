/**
 * Logger barrel file - exports all logger-related functionality.
 * @module infrastructure/observability/logger
 */

export { LogLevel } from "./logger/LogLevel";
export { type Logger, LoggerImpl } from "./logger/Logger";
export { isLogger } from "./logger/guards";
export { initializeLogger, getLogger } from "./logger/globalLogger";
export type { LoggerConfig, LogEntry } from "./logger/LogEntry";
