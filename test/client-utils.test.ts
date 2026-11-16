import { describe, it, expect } from "bun:test";
import { buildUrl, buildHeaders } from "../src/client/request-builder";
import { extractMessage, truncate } from "../src/client/helpers";

describe("client request-builder", () => {
  it("buildUrl appends repeated query parameters", () => {
    const url = buildUrl("https://api.contabo.com", "/v1/compute/instances", {
      page: ["1"],
      orderBy: ["name:asc", "createdAt:desc"],
    });

    expect(String(url)).toBe(
      "https://api.contabo.com/v1/compute/instances?page=1&orderBy=name%3Aasc&orderBy=createdAt%3Adesc",
    );
  });

  it("buildUrl returns base path when query is omitted", () => {
    const url = buildUrl("https://api.contabo.com", "/v1/tags");
    expect(String(url)).toBe("https://api.contabo.com/v1/tags");
  });

  it("buildHeaders sets auth and request id and omits content-type for empty body", () => {
    const headers = buildHeaders("tok", undefined, "rid-1");
    expect(headers.Authorization).toBe("Bearer tok");
    expect(headers["x-request-id"]).toBe("rid-1");
    expect(headers["Content-Type"]).toBeUndefined();
  });

  it("buildHeaders adds JSON content-type when body exists", () => {
    const headers = buildHeaders("tok", { a: 1 }, "rid-2");
    expect(headers["Content-Type"]).toBe("application/json");
  });
});

describe("client helpers", () => {
  it("truncate returns original when within max and truncates when above max", () => {
    expect(truncate("abc", 5)).toBe("abc");
    expect(truncate("abcdef", 3)).toBe("abc…");
  });

  it("extractMessage prefers known JSON fields and falls back to truncated text", () => {
    expect(extractMessage('{"message":"m1"}')).toBe("m1");
    expect(extractMessage('{"error_description":"m2"}')).toBe("m2");
    expect(extractMessage('{"error":"m3"}')).toBe("m3");
    expect(extractMessage('{"detail":"m4"}')).toBe("m4");

    const long = "x".repeat(350);
    const fallback = extractMessage(`{"other":${JSON.stringify(long)}}`);
    expect(fallback.startsWith('{"other":"')).toBe(true);
    expect(fallback.endsWith("…")).toBe(true);
  });

  it("extractMessage handles invalid JSON by returning truncated raw text", () => {
    const raw = "not-json-" + "y".repeat(400);
    expect(extractMessage(raw)).toBe(`${"not-json-"}${"y".repeat(291)}…`);
  });
});
