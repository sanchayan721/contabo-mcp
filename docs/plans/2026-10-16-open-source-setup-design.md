# contabo-mcp Open-Source Setup — Design

Date: 2026-10-16
Status: Approved

## Purpose

Turn the merged `contabo-mcp` repository (MCP server exposing the full Contabo API)
into a properly set up open-source project on GitHub: license, npm publication,
CI + release automation, community health files, and repo metadata.

## Decisions (user-approved)

| Decision | Choice |
| --- | --- |
| License | MIT (`LICENSE` file added; package.json/README already declare MIT) |
| Copyright line | `Copyright (c) 2026 Sanchayan (github.com/sanchayan721)` |
| npm | Publish as `contabo-mcp` (name verified available); README's `npx -y contabo-mcp` becomes real |
| CI + release | GitHub Actions: test matrix on push/PR; tag-triggered npm publish with provenance |
| Community files | CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, issue templates, PR template, CHANGELOG |
| Repo metadata | Topics, Discussions on, homepage, README badges, branch protection on `main` (CI required, admin bypass) |
| Rejected alternatives | semantic-release bot (too much automation for solo project); license-only minimal kit |

## Components

1. **LICENSE** — MIT text with the approved copyright line.
2. **package.json metadata** — `repository`, `homepage`, `bugs`, `keywords`, `LICENSE` in `files`.
3. **`.github/workflows/ci.yml`** — push/PR: Node 20/22/24 matrix, `npm ci && npm test`.
4. **`.github/workflows/release.yml`** — tag `v*`: `npm ci && npm test && npm publish --provenance`
   with `NPM_TOKEN` secret; `id-token: write` permission for provenance.
5. **Community files** — CONTRIBUTING.md (dev setup, codegen fail-loud rules, PR checklist,
   release process), SECURITY.md (GitHub Security Advisories reporting), CODE_OF_CONDUCT.md
   (Contributor Covenant v2.1), `.github/ISSUE_TEMPLATE/` (bug + feature), PR template,
   CHANGELOG.md (Keep-a-Changelog, 0.1.0 entry).
6. **README updates** — badges (CI, npm, license), nothing else.
7. **Repo settings via `gh`** — topics (`mcp`, `contabo`, `model-context-protocol`,
   `typescript`, `openai`, `agents`, `vps`), Discussions enabled, homepage, branch
   protection on `main` (require CI check, admin bypass).

## Release flow (documented in CONTRIBUTING)

Bump version in package.json + CHANGELOG → commit → tag `vX.Y.Z` → push tag →
CI tests run → npm publishes. First publish requires `NPM_TOKEN` secret
(granular npm token, read+write) — user creates it at npmjs.com and sets it
via `gh secret set NPM_TOKEN`.

## Verification

- CI green on the setup PR itself.
- `npm pack --dry-run` shows correct file set (dist, README, LICENSE).
- `npm publish --dry-run` succeeds locally.
- After first tag: package visible at npmjs.com/package/contabo-mcp.
- Branch protection active; topics/badges visible.