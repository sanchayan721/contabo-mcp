# Contributing to contabo-mcp

Thanks for your interest in contributing! `contabo-mcp` is an open-source MCP server that
exposes the complete Contabo API (157 operations) as tools for OpenAI-compatible agents.

## Development setup

Prerequisite: **Bun** (see `package.json` engines).

```bash
bun install
bun test
```

For CI-equivalent validation (coverage gate included):

```bash
bun run lint
bun run test:ci
```

To regenerate the API registry from the Contabo OpenAPI spec:

```bash
bun run generate
```

## Optional: Nub

If you use [Nub](https://nubjs.com) (the Rust toolkit for Node), this repo works with it
out of the box and Nub runs the TypeScript codegen directly, no `tsx` needed:

```bash
nub install                                              # adopts the existing lockfile
nub src/codegen/generate.ts spec/contabo-openapi.json   # codegen without tsx
nub run test                                             # Bun test suite
```

Bun scripts and CI do not depend on Nub — it is purely a local speed-up.

## Code style & pre-commit checks

This repository enforces homogeneous code standards with ESLint + Prettier and a
Husky pre-commit hook.

- `bun run lint` checks lint rules (including unused imports/vars and declaration policy).
- `bun run format:check` verifies formatting.
- `.editorconfig` + `.prettierrc.json` define baseline formatting behavior.
- Pre-commit automatically runs `lint-staged` on changed files.
- Public APIs and non-trivial logic should include TSDoc (`@param`, `@returns`, and behavior notes).

If hooks are not installed locally yet, run:

```bash
bun run prepare
```

## Project layout

```text
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

`src/generated/registry.ts` is **generated**. The only way to update API surface is to
replace `spec/contabo-openapi.json` and rerun `bun run generate`.

The generator fails loudly on anything suspicious: unknown tags, renamed `operationId`s,
duplicate tool names, parameter collisions. If it fails, fix `src/codegen/overrides.ts`
— never hand-edit the generated file.

## Testing

- Tests are expected to be written test-first (TDD) when adding behavior.
- CI runs on Bun and enforces line coverage **>= 95%**.
- Use `bun run test:ci` locally before opening a PR (coverage + threshold check).
- `bun test` is useful for quick iteration; `bun run test:ci` is the release gate.

### Coverage outputs

- `bun run test:coverage` writes `coverage/lcov.info`.
- `bun run coverage:summary` emits markdown for GitHub job summaries.
- `bun run coverage:check` fails the build when line coverage drops below threshold.

## Commits & PRs

Use [Conventional Commits](https://www.conventionalcommits.org): `feat`, `fix`, `docs`,
`chore`, `ci`.

Before opening a PR:

- [ ] `bun run lint` passes
- [ ] `bun run test:ci` passes (coverage included)
- [ ] If `spec/contabo-openapi.json` changed: `bun run generate` ran and
      `src/generated/registry.ts` is committed
- [ ] No credentials, tokens, or request-ids from real accounts in tests or fixtures

## Reporting bugs

Open a [GitHub issue](https://github.com/sanchayan721/contabo-mcp/issues) using the bug
report template. For security-sensitive reports, see [SECURITY.md](SECURITY.md) — please do
not open public issues containing Contabo credentials, API tokens, or account-linked request-ids.

## Releases (maintainers)

Releases are GitHub Releases — the package is not published to npm; users run it
directly from this repository via `npx -y github:sanchayan721/contabo-mcp`.

1. Bump `version` in `package.json` and update `CHANGELOG.md`.
2. Commit the release changes.
3. Tag, push, and create the release:

```bash
git tag v0.1.0
git push origin v0.1.0
gh release create v0.1.0 --title "v0.1.0" --notes "See CHANGELOG.md"
```
