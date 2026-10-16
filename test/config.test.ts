import { describe, it, expect } from "vitest";
import { loadConfig } from "../src/config.js";

describe("loadConfig", () => {
  it("reads the four Contabo credentials", () => {
    const cfg = loadConfig({
      CONTABO_CLIENT_ID: "cid",
      CONTABO_CLIENT_SECRET: "csec",
      CONTABO_API_USER: "u@example.com",
      CONTABO_API_PASSWORD: "pw",
    });
    expect(cfg.clientId).toBe("cid");
    expect(cfg.clientSecret).toBe("csec");
    expect(cfg.apiUser).toBe("u@example.com");
    expect(cfg.apiPassword).toBe("pw");
  });

  it("disables writes by default and enables with CONTABO_ENABLE_WRITES=1", () => {
    expect(loadConfig({}).writesEnabled).toBe(false);
    expect(loadConfig({ CONTABO_ENABLE_WRITES: "1" }).writesEnabled).toBe(true);
    expect(loadConfig({ CONTABO_ENABLE_WRITES: "true" }).writesEnabled).toBe(false);
  });

  it("supports base/auth URL and timeout overrides", () => {
    const cfg = loadConfig({
      CONTABO_API_BASE_URL: "http://127.0.0.1:9999",
      CONTABO_AUTH_URL: "http://127.0.0.1:9999/token",
      CONTABO_TIMEOUT_MS: "5000",
    });
    expect(cfg.baseUrl).toBe("http://127.0.0.1:9999");
    expect(cfg.authUrl).toBe("http://127.0.0.1:9999/token");
    expect(cfg.timeoutMs).toBe(5000);
  });

  it("defaults timeoutMs to undefined", () => {
    expect(loadConfig({}).timeoutMs).toBeUndefined();
  });

  it("trims CONTABO_TIMEOUT_MS before parsing", () => {
    expect(loadConfig({ CONTABO_TIMEOUT_MS: " 5000 " }).timeoutMs).toBe(5000);
  });

  it("rejects a non-numeric CONTABO_TIMEOUT_MS", () => {
    expect(() => loadConfig({ CONTABO_TIMEOUT_MS: "abc" })).toThrow(/Invalid CONTABO_TIMEOUT_MS/);
  });

  it("rejects a negative CONTABO_TIMEOUT_MS", () => {
    expect(() => loadConfig({ CONTABO_TIMEOUT_MS: "-5" })).toThrow(/Invalid CONTABO_TIMEOUT_MS/);
  });

  it("rejects a non-finite CONTABO_TIMEOUT_MS", () => {
    expect(() => loadConfig({ CONTABO_TIMEOUT_MS: "Infinity" })).toThrow(/Invalid CONTABO_TIMEOUT_MS/);
  });

  it("maps CONTABO_TIMEOUT_MS=0 to undefined", () => {
    expect(loadConfig({ CONTABO_TIMEOUT_MS: "0" }).timeoutMs).toBeUndefined();
  });

  it("treats a whitespace-only CONTABO_API_BASE_URL as unset", () => {
    expect(loadConfig({ CONTABO_API_BASE_URL: "   " }).baseUrl).toBeUndefined();
  });
});
