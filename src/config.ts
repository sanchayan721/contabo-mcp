export interface Config {
  clientId: string;
  clientSecret: string;
  apiUser: string;
  apiPassword: string;
  writesEnabled: boolean;
  baseUrl?: string;
  authUrl?: string;
  timeoutMs?: number;
}

export function loadConfig(env: Record<string, string | undefined> = process.env): Config {
  const get = (key: string): string | undefined => env[key]?.trim() || undefined;
  const timeoutRaw = get("CONTABO_TIMEOUT_MS");
  // "0" maps to undefined on purpose: a 0 ms timeout is meaningless.
  let timeoutMs: number | undefined;
  if (timeoutRaw !== undefined) {
    const parsed = Number(timeoutRaw);
    if (!Number.isFinite(parsed) || parsed < 0) {
      throw new Error(`Invalid CONTABO_TIMEOUT_MS: "${timeoutRaw}" — must be a non-negative number of milliseconds.`);
    }
    timeoutMs = parsed === 0 ? undefined : parsed;
  }
  return {
    clientId: get("CONTABO_CLIENT_ID") ?? "",
    clientSecret: get("CONTABO_CLIENT_SECRET") ?? "",
    apiUser: get("CONTABO_API_USER") ?? "",
    apiPassword: get("CONTABO_API_PASSWORD") ?? "",
    writesEnabled: get("CONTABO_ENABLE_WRITES") === "1",
    baseUrl: get("CONTABO_API_BASE_URL"),
    authUrl: get("CONTABO_AUTH_URL"),
    timeoutMs,
  };
}
