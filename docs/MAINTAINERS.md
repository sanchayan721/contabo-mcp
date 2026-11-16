# Maintainer Guide

This document is the operational playbook for maintainers of `contabo-mcp`.

## Quality gates (required)

A change is merge-ready only when all gates pass:

1. `bun run lint`
2. `bun run test:ci`
   - Runs coverage and enforces line coverage >= 95%
3. Regenerated API artifacts are committed when the spec changes:
   - `bun run generate`
   - commit `src/generated/registry.ts`

## Documentation standards

- Keep public behavior changes reflected in [README.md](../README.md).
- Keep contributor workflow changes reflected in [CONTRIBUTING.md](../CONTRIBUTING.md).
- Keep release-facing history in [CHANGELOG.md](../CHANGELOG.md).
- New exported classes/functions should include TSDoc with at least:
  - purpose summary
  - `@param` for each parameter
  - `@returns` description
  - relevant behavior notes (`@remarks`, caveats, error paths)

## Testing standards

- Prefer test-first changes for behavior updates.
- Add unit tests for utility and parser logic.
- Keep E2E tests deterministic and isolated from real credentials.

## CI coverage outputs

CI publishes coverage in two places:

- Job summary markdown (`coverage:summary`)
- Uploaded artifact: `coverage/lcov.info`

If coverage drops below threshold, CI must fail.

## Release checklist

1. Update version in `package.json`.
2. Update `CHANGELOG.md`.
3. Ensure all quality gates pass.
4. Create and push tag.
5. Create GitHub release.

## Security hygiene

- Never commit credentials, tokens, or request IDs from real accounts.
- Keep auth and error paths covered by tests.
- Treat parser/generator failures as build-time blockers.
