/**
 * Helper functions for the Contabo client.
 * @module client/helpers
 */

/**
 * Truncates a string to a maximum length, appending an ellipsis if truncated.
 * @param text - The string to truncate
 * @param max - Maximum length (default: 300)
 * @returns The truncated string
 * @internal
 */
export function truncate(text: string, max = 300): string {
  return text.length <= max ? text : `${text.slice(0, max)}…`;
}

/**
 * Extracts a human-readable error message from an API response body.
 * @param text - Raw response body text
 * @returns Extracted error message or truncated original text
 * @internal
 */
export function extractMessage(text: string): string {
  try {
    const json = JSON.parse(text) as Record<string, unknown>;
    const msg = json.message ?? json.error_description ?? json.error ?? json.detail;
    return typeof msg === "string" ? msg : truncate(text);
  } catch {
    return truncate(text);
  }
}
