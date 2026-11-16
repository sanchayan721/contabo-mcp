/**
 * Contabo API client - main entry point.
 * @module client
 */

export { DEFAULT_BASE_URL, DEFAULT_AUTH_URL } from "./client/constants";

export { ContaboAuthError, ContaboApiError } from "./client/errors";
export { truncate, extractMessage } from "./client/helpers";
export { TokenManager } from "./client/token-manager";
export { HttpClient } from "./client/http-client";
export { buildUrl, buildHeaders } from "./client/request-builder";

export { ContaboClient } from "./client/ContaboClient";
export type { ContaboClientOptions } from "./client/constants";
