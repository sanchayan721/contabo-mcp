## What & why

<!-- One or two sentences. Reference the issue if there is one. -->

## Test plan

- [ ] `npm test` passes (chains codegen → typecheck → build → tests)
- [ ] If `spec/contabo-openapi.json` changed: `npm run generate` ran and `src/generated/registry.ts` is committed
- [ ] No credentials, tokens, or request-ids from real accounts in tests or fixtures
