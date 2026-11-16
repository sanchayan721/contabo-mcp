/**
 * Contabo API error classes.
 * @module client/errors
 */

import { truncate } from "./helpers";

/**
 * Error thrown when Contabo authentication fails.
 * Extends Error with a specific name for type checking.
 */
export class ContaboAuthError extends Error {
  /**
   * Creates a new ContaboAuthError.
   * @param message - Human-readable error message
   */
  constructor(message: string) {
    super(message);
    this.name = "ContaboAuthError";
  }
}

/**
 * Error thrown when a Contabo API request fails.
 * Contains structured error information for programmatic handling.
 */
export class ContaboApiError extends Error {
  /** HTTP status code */
  public readonly status: number;
  /** HTTP status text */
  public readonly statusText: string;
  /** Unique request ID for debugging */
  public readonly requestId: string;
  /** Truncated response body text */
  public readonly bodyText: string;

  /**
   * Creates a new ContaboApiError.
   * @param status - HTTP status code
   * @param statusText - HTTP status text
   * @param requestId - Unique request identifier
   * @param bodyText - Raw response body text (will be truncated)
   */
  constructor(status: number, statusText: string, requestId: string, bodyText: string) {
    const truncated = truncate(bodyText);
    super(
      `Contabo API ${status} ${statusText}${truncated ? `: ${truncated}` : ""} (request-id ${requestId})`,
    );
    this.status = status;
    this.statusText = statusText;
    this.requestId = requestId;
    this.bodyText = truncated;
    this.name = "ContaboApiError";
  }
}
