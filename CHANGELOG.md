# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-10-16

### Added

- MCP stdio server exposing the complete Contabo API (157 operations) as 14 domain tools
  plus a `contabo_reference` documentation tool
- Contabo OAuth2 handled internally (password grant, token caching, 401/429 retries,
  `x-request-id` per request) — agents never deal with tokens
- Read-only by default; `CONTABO_ENABLE_WRITES=1` enables writes; destructive operations flagged
- `contabo_reference` tool with full per-operation parameter docs
- Spec-driven codegen: replace `spec/contabo-openapi.json` and rerun `npm run generate`

[0.1.0]: https://github.com/sanchayan721/contabo-mcp/releases/tag/v0.1.0
