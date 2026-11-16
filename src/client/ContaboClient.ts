/**
 * Contabo API client - main entry point.
 * @module client/ContaboClient
 */

import { injectable } from "tsyringe";

import { DEFAULT_BASE_URL } from "./constants";
import type { ContaboClientOptions } from "./constants";
import { ContaboApiError } from "./errors";
import { TokenManager } from "./token-manager";
import { HttpClient } from "./http-client";

/**
 * ContaboClient provides a typed, authenticated HTTP client for the Contabo API.
 *
 * Features:
 * - OAuth2 password grant authentication with automatic token caching and refresh
 * - Automatic retry on 401 (with token refresh) and 429 (rate limiting)
 * - Request ID generation for tracing
 * - Configurable timeout and base URL
 * - Proper error types for authentication and API errors
 *
 * @example
 * ```typescript
 * const client = new ContaboClient({
 *   clientId: "your-client-id",
 *   clientSecret: "your-client-secret",
 *   apiUser: "user@example.com",
 *   apiPassword: "your-password"
 * });
 *
 * // List instances
 * const instances = await client.request("GET", "/v1/compute/instances");
 *
 * // Create a new instance
 * const instance = await client.request("POST", "/v1/compute/instances", {
 *   body: { productId: "V153", region: "EU", period: 1 }
 * });
 * ```
 *
 * @public
 */
@injectable()
export class ContaboClient {
  private readonly tokenManager: TokenManager;
  private readonly httpClient: HttpClient;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  /**
   * Creates a new ContaboClient instance.
   * @param opts - Client configuration options
   */
  constructor(opts: ContaboClientOptions) {
    this.baseUrl = opts.baseUrl ?? DEFAULT_BASE_URL;
    this.timeoutMs = Math.max(1, opts.timeoutMs ?? 30_000);

    this.tokenManager = new TokenManager({
      clientId: opts.clientId,
      clientSecret: opts.clientSecret,
      apiUser: opts.apiUser,
      apiPassword: opts.apiPassword,
      baseUrl: opts.baseUrl,
      authUrl: opts.authUrl,
      timeoutMs: this.timeoutMs,
    });

    this.httpClient = new HttpClient({
      baseUrl: this.baseUrl,
      timeoutMs: this.timeoutMs,
    });
  }

  /**
   * Obtains a valid OAuth2 bearer token, using cached token if still valid.
   * Tokens are cached and refreshed 60 seconds before expiry.
   *
   * @param force - Force token refresh even if cached token is still valid
   * @returns Promise resolving to the access token string
   * @throws {ContaboAuthError} If credentials are missing or authentication fails
   */
  async getToken(force = false): Promise<string> {
    return this.tokenManager.getToken(force);
  }

  /**
   * Executes a Contabo API request with automatic retries and error handling.
   *
   * Features:
   * - Automatic bearer token injection
   * - Unique request ID generation for tracing
   * - Automatic retry on 401 (with token refresh) and 429 (rate limiting)
   * - Request timeout enforcement
   * - Response envelope passthrough
   *
   * @param method - HTTP method
   * @param path - API endpoint path (e.g., "/v1/compute/instances")
   * @param opts - Optional query parameters and request body
   * @returns Parsed JSON response, or `{ ok: true }` for 204 responses
   * @throws {ContaboApiError} On API errors (non-2xx responses)
   * @throws {ContaboAuthError} If authentication fails
   */
  async request(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    opts: { query?: Record<string, string[]>; body?: unknown } = {},
  ): Promise<unknown> {
    let token = await this.tokenManager.getToken();
    try {
      return await this.httpClient.request(method, path, token, opts);
    } catch (error) {
      if (error instanceof ContaboApiError && error.status === 401) {
        token = await this.tokenManager.getToken(true);
        return this.httpClient.request(method, path, token, opts);
      }
      throw error;
    }
  }
}
