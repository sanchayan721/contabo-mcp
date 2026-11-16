/**
 * Token manager for OAuth2 token caching and refresh.
 * @module client/token-manager
 */

import { ContaboAuthError } from "./errors";
import { DEFAULT_AUTH_URL } from "./constants";
import type { ContaboClientOptions } from "./constants";
import { extractMessage } from "./helpers";

export interface TokenData {
  value: string;
  expiresAt: number;
}

/**
 * Manages OAuth2 access tokens with caching and automatic refresh.
 */
export class TokenManager {
  private token?: { value: string; expiresAt: number };
  private tokenPromise?: Promise<string>;
  private readonly authUrl: string;
  private readonly timeoutMs: number;

  constructor(private readonly opts: ContaboClientOptions) {
    this.authUrl = opts.authUrl ?? DEFAULT_AUTH_URL;
    this.timeoutMs = Math.max(1, opts.timeoutMs ?? 30_000);
  }

  /**
   * Checks if all credentials are missing.
   */
  private hasNoCredentials(): boolean {
    return (
      !this.opts.clientId.trim() &&
      !this.opts.clientSecret.trim() &&
      !this.opts.apiUser.trim() &&
      !this.opts.apiPassword.trim()
    );
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
    // Check if all credentials are missing
    if (this.hasNoCredentials()) {
      throw new ContaboAuthError(
        "Contabo credentials are not configured. Set CONTABO_CLIENT_ID, CONTABO_CLIENT_SECRET, " +
          "CONTABO_API_USER and CONTABO_API_PASSWORD (get them at https://my.contabo.com/api/details).",
      );
    }

    // Return cached token if still valid and not forcing refresh
    if (!force && this.token && Date.now() < this.token.expiresAt) {
      return this.token.value;
    }

    // Return existing in-flight request to avoid duplicate requests
    if (!force && this.tokenPromise) {
      return this.tokenPromise;
    }

    // Initiate new token request
    const request = (async (): Promise<string> => {
      const body = new URLSearchParams({
        grant_type: "password",
        client_id: this.opts.clientId,
        client_secret: this.opts.clientSecret,
        username: this.opts.apiUser,
        password: this.opts.apiPassword,
      });

      let res: Response;
      try {
        res = await fetch(this.authUrl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
          signal: AbortSignal.timeout(this.timeoutMs),
        });
      } catch (cause) {
        throw new ContaboAuthError(
          `Could not reach the Contabo auth endpoint: ${(cause as Error).message}`,
        );
      }
      const text = await res.text();
      if (!res.ok) {
        throw new ContaboAuthError(
          `Contabo authentication failed (${res.status}). ` +
            "Check CONTABO_CLIENT_ID, CONTABO_CLIENT_SECRET, CONTABO_API_USER and CONTABO_API_PASSWORD " +
            `(get them at https://my.contabo.com/api/details). Server said: ${extractMessage(text)}`,
        );
      }
      const json = JSON.parse(text) as { access_token?: string; expires_in?: number };
      if (!json.access_token) {
        throw new ContaboAuthError("Contabo auth response contained no access_token.");
      }
      const ttlMs = Math.max(0, (json.expires_in ?? 3600) - 60) * 1000;
      this.token = { value: json.access_token, expiresAt: Date.now() + ttlMs };
      return json.access_token;
    })();
    this.tokenPromise = request;
    void request
      .catch(() => undefined)
      .finally(() => {
        if (this.tokenPromise === request) {
          this.tokenPromise = undefined;
        }
      });
    return request;
  }
}
