import type { Logger } from "./Logger";

/**
 * Type guard to check if an object is a Logger.
 */
export function isLogger(obj: unknown): obj is Logger {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as Logger).debug === "function" &&
    typeof (obj as Logger).info === "function" &&
    typeof (obj as Logger).warn === "function" &&
    typeof (obj as Logger).error === "function" &&
    typeof (obj as Logger).fatal === "function" &&
    typeof (obj as Logger).log === "function"
  );
}
