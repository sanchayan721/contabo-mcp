/**
 * Contabo API constants.
 * @module client/constants
 */

/**
 * Default base URL for the Contabo API.
 * @constant {string}
 */
export const DEFAULT_BASE_URL = "https://api.contabo.com";

/**
 * Default authentication URL for the Contabo OAuth2 token endpoint.
 * @constant {string}
 */
export const DEFAULT_AUTH_URL =
  "https://auth.contabo.com/auth/realms/contabo/protocol/openid-connect/token";

/**
 * Configuration options for the ContaboClient.
 * @interface ContaboClientOptions
 */
export interface ContaboClientOptions {
  /** OAuth2 client ID obtained from Contabo Control Panel */
  clientId: string;
  /** OAuth2 client secret obtained from Contabo Control Panel */
  clientSecret: string;
  /** API user email (used as username for password grant) */
  apiUser: string;
  /** API password (used for password grant) */
  apiPassword: string;
  /** Base URL for the Contabo API (defaults to DEFAULT_BASE_URL) */
  baseUrl?: string;
  /** OAuth2 token endpoint URL (defaults to DEFAULT_AUTH_URL) */
  authUrl?: string;
  /** Request timeout in milliseconds (minimum 1ms, default: 30000) */
  timeoutMs?: number;
}
