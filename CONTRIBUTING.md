# Contributing to contabo-mcp

Thanks for your interest in contributing! contabo-mcp is an open-source MCP server that
exposes the complete Contabo API (157 operations) as tools for OpenAI-compatible agents.

## Development setup

Prerequisites: **Node.js >= 24** and **npm**.

```bash
npm install
npm test
```

`npm test` is the only command you need: it chains spec-driven codegen → TypeScript
compile → the full test suite (112 tests).

To regenerate the API registry from the Contabo OpenAPI spec:

```bash
npm run generate
```

### Optional: Nub

If you use [Nub](https://nubjs.com) (the Rust toolkit for Node), this repo works with it
out of the box — `.node-version` pins Node 24 and Nub runs the TypeScript codegen
directly, no `tsx` needed:

```bash
nub install                          # fast install, adopts the existing lockfile
nub src/codegen/generate.ts spec/contabo-openapi.json   # codegen without tsx
nub run test                         # full pretest → build → test chain
```

npm scripts and CI do not depend on Nub — it is purely a local speed-up.

## Project layout

```
spec/contabo-openapi.json   Contabo OpenAPI spec (source of truth for codegen)
src/codegen/                Spec → registry generator (extract, emit, overrides)
src/generated/registry.ts   GENERATED — do not edit
src/client.ts               OAuth2 + HTTP client (token caching, 401/429 retries)
src/tools.ts                The 14 domain tools + write-mode gating
src/reference.ts            contabo_reference documentation tool
src/index.ts                MCP stdio server entry point
test/                       Unit + E2E tests (E2E spawns dist/)
```

## The codegen contract

`src/generated/registry.ts` is **generated**. The only way to update API coverage is to
replace `spec/contabo-openapi.json` and rerun `npm run generate`.

The generator fails loudly on anything suspicious: unknown tags, renamed `operationId`s,
duplicate tool names, parameter collisions. If it fails, fix `src/codegen/overrides.ts`
— never hand-edit the generated file.

## Testing

- Tests are expected to be written test-first (TDD) when adding behavior.
- The suite must pass on **Node 20, 22, and 24** — CI runs that exact matrix.
- E2E tests spawn the built `dist/` server, so always use `npm test`, not a bare
  `npx vitest run` (which skips codegen and the build).

## Commits & PRs

Use [Conventional Commits](https://www.conventionalcommits.org): `feat`, `fix`, `docs`,
`chore`, `ci`.

Before opening a PR:

- [ ] `npm test` passes (chains codegen → typecheck → build → tests)
- [ ] If `spec/contabo-openapi.json` changed: `npm run generate` ran and
      `src/generated/registry.ts` is committed
- [ ] No credentials, tokens, or request-ids from real accounts in tests or fixtures

## Reporting bugs

Open a [GitHub issue](https://github.com/sanchayan721/contabo-mcp/issues) using the bug
report template. For security-sensitive reports, see
[SECURITY.md](SECURITY.md) — please do not open public issues containing Contabo
credentials, API tokens, or account-linked request-ids.

## Releases (maintainers)

Releases are GitHub Releases — the package is not published to npm; users run it
directly from this repository via `npx -y github:sanchayan721/contabo-mcp`.

1. Bump `version` in `package.json` and update `CHANGELOG.md`.
2. Commit the release changes.
3. Tag, push, and create the release:

   ```bash
   git tag v0.1.0
   git push Github v0.1.0
   gh release create v0.1.0 --title "v0.1.0" --notes "See CHANGELOG.md"
   ```
