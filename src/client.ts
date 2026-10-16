import { randomUUID } from "node:crypto";

export const DEFAULT_BASE_URL = "https://api.contabo.com";
export const DEFAULT_AUTH_URL = "https://auth.contabo.com/auth/realms/contabo/protocol/openid-connect/token";

export interface ContaboClientOptions {
  clientId: string;
  clientSecret: string;
  apiUser: string;
  apiPassword: string;
  baseUrl?: string;
  authUrl?: string;
  timeoutMs?: number;
}

function truncate(text: string, max = 300): string {
  return text.length <= max ? text : `${text.slice(0, max)}…`;
}

export class ContaboAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContaboAuthError";
  }
}

export class ContaboApiError extends Error {
  readonly bodyText: string;

  constructor(
    readonly status: number,
    readonly statusText: string,
    readonly requestId: string,
    bodyText: string,
  ) {
    const truncated = truncate(bodyText);
    super(`Contabo API ${status} ${statusText}${truncated ? `: ${truncated}` : ""} (request-id ${requestId})`);
    this.bodyText = truncated;
    this.name = "ContaboApiError";
  }
}

function extractMessage(text: string): string {
  try {
    const json = JSON.parse(text) as Record<string, unknown>;
    const msg = json.message ?? json.error_description ?? json.error ?? json.detail;
    return typeof msg === "string" ? msg : truncate(text);
  } catch {
    return truncate(text);
  }
}

export class ContaboClient {
  private token?: { value: string; expiresAt: number };
  private tokenPromise?: Promise<string>;
  private readonly timeoutMs: number;

  constructor(private readonly opts: ContaboClientOptions) {
    this.timeoutMs = Math.max(1, opts.timeoutMs ?? 30_000);
  }

  /** Bearer token with proactive refresh 60s before expiry. */
  async getToken(force = false): Promise<string> {
    if (
      !this.opts.clientId.trim() &&
      !this.opts.clientSecret.trim() &&
      !this.opts.apiUser.trim() &&
      !this.opts.apiPassword.trim()
    ) {
      throw new ContaboAuthError(
        "Contabo credentials are not configured. Set CONTABO_CLIENT_ID, CONTABO_CLIENT_SECRET, " +
          "CONTABO_API_USER and CONTABO_API_PASSWORD (get them at https://my.contabo.com/api/details).",
      );
    }
    if (!force && this.token && Date.now() < this.token.expiresAt) return this.token.value;
    if (!force && this.tokenPromise) return this.tokenPromise;
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
        res = await fetch(this.opts.authUrl ?? DEFAULT_AUTH_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
          signal: AbortSignal.timeout(this.timeoutMs),
        });
      } catch (cause) {
        throw new ContaboAuthError(`Could not reach the Contabo auth endpoint: ${(cause as Error).message}`);
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
      if (!json.access_token) throw new ContaboAuthError("Contabo auth response contained no access_token.");
      const ttlMs = Math.max(0, ((json.expires_in ?? 3600) - 60)) * 1000;
      this.token = { value: json.access_token, expiresAt: Date.now() + ttlMs };
      return json.access_token;
    })();
    const pending = request.finally(() => {
      if (this.tokenPromise === pending) this.tokenPromise = undefined;
    });
    this.tokenPromise = pending;
    // Return the stored promise (not `request`): every caller then handles the
    // same promise, so a rejection can never surface as an unhandled rejection.
    return pending;
  }

  /**
   * Executes one Contabo API call. Retries once on 401 (forced token refresh)
   * and once on 429 (honoring Retry-After). Returns the parsed JSON envelope
   * as-is, or `{ ok: true }` for 204 responses.
   */
  async request(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    opts: { query?: Record<string, string[]>; body?: unknown } = {},
  ): Promise<unknown> {
    const base = this.opts.baseUrl ?? DEFAULT_BASE_URL;
    const url = new URL(path, `${base}/`);
    for (const [key, values] of Object.entries(opts.query ?? {})) {
      for (const value of values) url.searchParams.append(key, value);
    }

    let forceRefresh = false;
    let authRetried = false;
    let rateRetried = false;

    for (;;) {
      const token = await this.getToken(forceRefresh);
      forceRefresh = false;
      const requestId = randomUUID();
      let res: Response;
      try {
        res = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            "x-request-id": requestId,
            ...(opts.body !== undefined ? { "Content-Type": "application/json" } : {}),
          },
          body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
          signal: AbortSignal.timeout(this.timeoutMs),
        });
      } catch (cause) {
        if ((cause as Error).name === "TimeoutError") {
          throw new ContaboApiError(0, "Timeout", requestId, `request exceeded ${this.timeoutMs}ms`);
        }
        throw new ContaboApiError(0, "Network Error", requestId, (cause as Error).message);
      }

      if (res.status === 401 && !authRetried) {
        authRetried = true;
        forceRefresh = true;
        continue;
      }
      if (res.status === 429 && !rateRetried) {
        rateRetried = true;
        // "0" legitimately means "retry immediately"; only missing/garbage headers fall back to 2s.
        const retryAfterHeader = Number(res.headers.get("retry-after"));
        const retryAfter = Number.isFinite(retryAfterHeader) && retryAfterHeader >= 0 ? retryAfterHeader : 2;
        await new Promise((resolve) => setTimeout(resolve, Math.min(retryAfter, 10) * 1000));
        continue;
      }

      if (res.status === 204) return { ok: true };
      const text = await res.text();
      if (!res.ok) {
        throw new ContaboApiError(res.status, res.statusText || "Error", requestId, extractMessage(text));
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
