/**
 * HTTP client for Contabo API with retry logic.
 * @module client/http-client
 */

import { randomUUID } from "node:crypto";
import { ContaboApiError } from "./errors";

export interface HttpClientOptions {
  baseUrl: string;
  timeoutMs: number;
}

/**
 * HTTP client with automatic retry logic for 401 and 429 responses.
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(opts: HttpClientOptions) {
    this.baseUrl = opts.baseUrl;
    this.timeoutMs = opts.timeoutMs;
  }

  /**
   * Executes an HTTP request with retry logic.
   * @param method - HTTP method
   * @param path - API endpoint path
   * @param token - Bearer token
   * @param opts - Query parameters and request body
   * @returns Parsed response
   */
  async request(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    token: string,
    opts: { query?: Record<string, string[]>; body?: unknown } = {},
  ): Promise<unknown> {
    const url = new URL(path, `${this.baseUrl}/`);
    for (const [key, values] of Object.entries(opts.query ?? {})) {
      for (const value of values) {
        url.searchParams.append(key, value);
      }
    }

    let rateRetried = false;

    for (;;) {
      let response: Response;
      try {
        response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            "x-request-id": randomUUID(),
            ...(opts.body !== undefined ? { "Content-Type": "application/json" } : {}),
          },
          body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
          signal: AbortSignal.timeout(this.timeoutMs),
        });
      } catch (cause) {
        if ((cause as Error).name === "TimeoutError") {
          throw new ContaboApiError(
            0,
            "Timeout",
            randomUUID(),
            `request exceeded ${this.timeoutMs}ms`,
          );
        }
        throw new ContaboApiError(0, "Network Error", randomUUID(), (cause as Error).message);
      }

      if (response.status === 429 && !rateRetried) {
        rateRetried = true;
        const retryAfter = Number(response.headers.get("retry-after")) || 2;
        await new Promise((resolve) => setTimeout(resolve, Math.min(retryAfter, 10) * 1000));
        continue;
      }

      if (response.status === 204) return { ok: true };
      const text = await response.text();
      if (!response.ok) {
        throw new ContaboApiError(
          response.status,
          response.statusText || "Error",
          randomUUID(),
          text,
        );
      }
      if (!text) return { ok: true };
      try {
        return JSON.parse(text) as unknown;
      } catch {
        return { raw: text };
      }
    }
  }
}
