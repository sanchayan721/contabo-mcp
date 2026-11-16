/**
 * Application configuration loaded from environment variables.
 * All properties are read-only to ensure configuration immutability.
 * @interface Config
 */
export interface Config {
  /** OAuth2 client ID from Contabo Control Panel */
  readonly clientId: string;
  /** OAuth2 client secret from Contabo Control Panel */
  readonly clientSecret: string;
  /** API user email (used as username for password grant) */
  readonly apiUser: string;
  /** API password for password grant */
  readonly apiPassword: string;
  /** Whether write operations are enabled (CONTABO_ENABLE_WRITES=1) */
  readonly writesEnabled: boolean;
  /** Base URL for Contabo API (optional, defaults to DEFAULT_BASE_URL) */
  readonly baseUrl: string | undefined;
  /** OAuth2 token endpoint URL (optional, defaults to DEFAULT_AUTH_URL) */
  readonly authUrl: string | undefined;
  /** Request timeout in milliseconds (minimum 1ms) */
  readonly timeoutMs: number | undefined;
}

/**
 * Interface for loading configuration from environment variables.
 * Allows for testability and different configuration sources.
 * @interface ConfigLoader
 */
export interface ConfigLoader {
  /**
   * Loads configuration from environment variables.
   * @param env - Environment variables object (defaults to process.env)
   * @returns Resolved configuration object
   */
  load(env?: Record<string, string | undefined>): Config;
}

/**
 * Default implementation of ConfigLoader that reads from process.env.
 * Implements validation and parsing of environment variables.
 *
 * @example
 * ```typescript
 * const loader = new ConfigLoaderImpl();
 * const config = loader.load();
 * // or with custom env:
 * const config = loader.load({ CONTABO_CLIENT_ID: "test" });
 * ```
 */
export class ConfigLoaderImpl implements ConfigLoader {
  /**
   * Loads configuration from environment variables.
   * @param env - Environment variables (defaults to process.env)
   * @returns Resolved configuration object
   * @throws {Error} If CONTABO_TIMEOUT_MS is invalid
   */
  load(env: Record<string, string | undefined> = process.env): Config {
    const get = (key: string): string | undefined => env[key]?.trim() || undefined;
    const timeoutRaw = get("CONTABO_TIMEOUT_MS");

    let timeoutMs: number | undefined;
    if (timeoutRaw !== undefined) {
      const parsed = Number(timeoutRaw);
      if (!Number.isFinite(parsed) || parsed < 0) {
        throw new Error(
          `Invalid CONTABO_TIMEOUT_MS: "${timeoutRaw}" — must be a non-negative number of milliseconds.`,
        );
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
}
