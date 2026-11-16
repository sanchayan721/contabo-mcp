## What & why

<!-- One or two sentences. Reference the issue if there is one. -->

## Test plan

- [ ] `bun run lint` passes
- [ ] `bun run test:ci` passes (coverage gate included)
- [ ] If `spec/contabo-openapi.json` changed: `bun run generate` ran and `src/generated/registry.ts` is committed
- [ ] No credentials, tokens, or request-ids from real accounts in tests or fixtures
