/**
 * HTTP request builder for Contabo API.
 * @module client/request-builder
 */

/**
 * Builds a URL with query parameters.
 * @param baseUrl - Base URL
 * @param path - API endpoint path
 * @param query - Query parameters (key -> array of values)
 * @returns Constructed URL
 */
export function buildUrl(baseUrl: string, path: string, query?: Record<string, string[]>): URL {
  const url = new URL(path, `${baseUrl}/`);
  for (const [key, values] of Object.entries(query ?? {})) {
    for (const value of values) {
      url.searchParams.append(key, value);
    }
  }
  return url;
}

/**
 * Builds request headers.
 * @param token - Bearer token
 * @param body - Request body (undefined for GET)
 * @param requestId - Unique request ID
 * @returns Headers object
 */
export function buildHeaders(
  token: string,
  body: unknown,
  requestId: string,
): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "x-request-id": requestId,
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}
