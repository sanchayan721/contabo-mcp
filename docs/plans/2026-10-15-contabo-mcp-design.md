# Contabo MCP Server — Design

Date: 2026-10-15
Status: Approved

## Purpose

Build an MCP (Model Context Protocol) server that exposes the **entire Contabo API**
(OpenAPI 3.0.3 spec, 102 paths, 157 operations, 353 schemas) so OpenAI-compliant
agents (OpenAI Agents SDK, Codex, Claude Desktop, Cursor, etc.) can manage Contabo
resources — compute instances, snapshots, images, object storage, private networks,
firewalls, DNS, domains/handles, VIPs, secrets, tags, users/roles, audits, and
troubleshooting — as tools.

## Decisions (user-approved)

| Decision | Choice |
| --- | --- |
| Tool granularity | Grouped by domain (~15 tools), each with an `operation` discriminator |
| Language/runtime | TypeScript on Node ≥ 20, official `@modelcontextprotocol/sdk`, zod v4 |
| Transport | stdio only |
| Write safety | Read-only by default; `CONTABO_ENABLE_WRITES=1` enables POST/PATCH/PUT/DELETE |
| Implementation | Approach A: build-time spec codegen + hand-written thin client/tool layer |

## Architecture

```
openapi.json ──npm run generate──▶ src/generated/registry.ts
                                        │
src/client.ts (ContaboClient)           ▼
  · OAuth2 password-grant token    src/tools.ts (15 domain tools)
    fetch + cache + refresh             · zod discriminated unions
  · x-request-id UUID per request       · read-only gating
  · envelope + error handling           │
                                        ▼
                                   src/index.ts (stdio MCP server)
```

Four layers:

1. **`src/generated/registry.ts`** — generated from the spec: every operation as
   `{ id, domain, name, method, path, summary, zodSchema, deprecated, write, destructive }`.
   Never hand-edited.
2. **`src/client.ts`** — `ContaboClient`: bearer-token fetch via OAuth2 password
   grant, cache until ~60s before expiry, single forced refresh + retry on 401;
   injects `Authorization` and `x-request-id` (UUIDv4) on every request; passes
   Contabo's `{ data, _pagination, _links }` envelope through; maps HTTP errors to
   readable MCP tool errors; single retry on 429 honoring `Retry-After`.
3. **`src/tools.ts`** — 15 domain tools. Each tool's input is a zod discriminated
   union on `operation`; handler validates, resolves the registry entry, enforces
   the write gate, calls the client.
4. **`src/index.ts`** — env parsing, server assembly, stdio run.

The user's downloaded spec is committed as `spec/contabo-openapi.json` — the
reproducible source of truth for codegen.

## Tool surface (15 tools)

| Tool | Ops | Coverage |
| --- | ---: | --- |
| `contabo_instances` | 16 | list/create/get/update/reinstall/cancel/upgrade, start/stop/restart/shutdown/rescue/reset-password, region change + move check, available products |
| `contabo_users` | 24 | users CRUD, password reset/email verification/SSO token/client secret, account switching, roles CRUD + API permissions, S3 object-storage credentials |
| `contabo_domains` | 18 | availability check/suggest, register & transfer, cancel/revoke, auth-code, transfer-out confirm/revoke, pending actions, handles CRUD + default handle |
| `contabo_dns` | 14 | PTR records, DNS zones CRUD, zone records CRUD, bulk delete |
| `contabo_audits` | 17 | all audit endpoints behind a `resource` enum |
| `contabo_troubleshooting` | 14 | checks, check collections + templates, remedies |
| `contabo_firewalls` | 9 | firewall CRUD, rules, instance attach/detach, preset rules |
| `contabo_tags` | 9 | tags CRUD + tag assignments for any resource type |
| `contabo_object_storage` | 8 | storages CRUD, upgrade/autoscaling, usage stats, cancellation, data-center list |
| `contabo_private_networks` | 7 | networks CRUD, instance attach/detach |
| `contabo_images` | 6 | standard/custom images, custom image metadata, stats |
| `contabo_snapshots` | 6 | snapshot CRUD + rollback |
| `contabo_secrets` | 5 | secrets CRUD |
| `contabo_vips` | 4 | VIP list/get-by-ip/assign/unassign |
| `contabo_reference` | — | full per-operation docs from the spec (params, required fields, examples, deprecations) |

Total: 157/157 API operations covered.

**Input shape.** Flat per-operation params behind one discriminator:

```json
{ "operation": "start", "instanceId": 100 }
```

Each operation is one branch of the tool's zod discriminated union, so validation
is exact per operation and parameter names never collide across operations.
Operation names are generated from spec `operationId`s (normalized camelCase) with
a hand-mapped alias table for awkward cases.

**Descriptions.** One compact line per operation in each tool description,
destructive ops marked ⚠️; full parameter docs behind `contabo_reference`.

## Auth & HTTP behavior

Credentials (env):

```
CONTABO_CLIENT_ID, CONTABO_CLIENT_SECRET   # from my.contabo.com/api/details
CONTABO_API_USER, CONTABO_API_PASSWORD     # API user email + password
CONTABO_ENABLE_WRITES                      # "1" enables non-GET ops
CONTABO_API_BASE_URL                       # optional, default https://api.contabo.com
CONTABO_LOG_LEVEL                          # optional, default info
```

- Missing credentials: server starts; tool calls return a clear setup error
  pointing at `my.contabo.com/api/details` (tool list still visible to clients).
- Token: POST password grant to
  `https://auth.contabo.com/auth/realms/contabo/protocol/openid-connect/token`;
  cache with 60s pre-expiry refresh; on 401 force one refresh + single retry.
- Headers per request: `Authorization: Bearer …`, `x-request-id: <uuid4>`
  (Contabo-required; server-generated so agents never see it),
  `Content-Type: application/json`.
- Rate limit (429): one retry after short backoff honoring `Retry-After`, then a
  readable error. No aggressive retry loops.
- Responses: Contabo envelope `{ data, _pagination, _links }` passed through;
  `204` → `{ ok: true }`.
- Errors: status + `message`/`details` → MCP `isError` result, e.g.
  `Contabo API 409 Conflict: <message> (request-id <uuid>)`. request-id included
  for support quoting. Tokens never logged (logs go to stderr only).

## Safety gating

- GET operations: always allowed.
- POST/PATCH/PUT/DELETE: rejected at the tool layer *before any HTTP call* with a
  message naming the exact flag (`CONTABO_ENABLE_WRITES`), so an agent can tell
  the user precisely what to change.
- `destructive` classification (DELETE method or names matching
  cancel/revoke/reset-password/shutdown/bulk-delete): advisory — shown as ⚠️ in
  descriptions and surfaced by `contabo_reference`.

## Codegen pipeline

`npm run generate -- spec/contabo-openapi.json`:

- Parse spec, resolve `$ref`s; convert Contabo's simple schemas (objects, strings
  with enums, int64 numbers, arrays) to zod with `.describe()` from parameter
  descriptions.
- Per op derive: camelCase name (from `operationId` + alias table), domain
  (tag → tool table), path/query/body params, `deprecated`, read/write,
  destructive.
- Emits `src/generated/registry.ts` and per-tool compact description text.
- Hard failure if any operation is dropped (157 in → 157 out).
- Hand-maintained `src/codegen/overrides.ts` survives spec updates.

## Project layout

```
contabo-mcp/
├── spec/contabo-openapi.json      # committed source of truth
├── src/
│   ├── index.ts                   # entry: env, server, stdio
│   ├── client.ts                  # token cache, headers, envelope, errors
│   ├── tools.ts                   # 15 tools, write gate, dispatch
│   ├── reference.ts               # contabo_reference implementation
│   ├── codegen/
│   │   ├── generate.ts            # spec → registry.ts
│   │   └── overrides.ts           # name aliases, domain table, flags
│   └── generated/registry.ts      # OUTPUT — do not edit
├── test/                          # vitest
├── package.json                   # bin: contabo-mcp
├── tsconfig.json
└── README.md                      # setup + client config snippets
```

## Testing (vitest)

1. Codegen golden test — 157 in / 157 out, correct domain mapping, no drops.
2. Client unit tests — mocked fetch: token cache/refresh-on-401, `x-request-id`
   present, envelope passthrough, error mapping, 429 retry.
3. Tool-layer tests — write gate blocked/allowed, discriminated-union validation
   errors, correct dispatch.
4. E2E — spawn server over stdio with the MCP client SDK against a mocked API:
   `tools/list` shows 15 tools; `contabo_instances(operation="list")` returns the
   parsed envelope.

## Packaging & agent connection

`bin: { "contabo-mcp": "dist/index.js" }` for `npx contabo-mcp` distribution;
README includes Claude Desktop, Codex CLI, and OpenAI Agents SDK snippets, e.g.:

```python
from agents import Agent, MCPServerStdio
mcp = MCPServerStdio(command="npx", args=["-y", "contabo-mcp"], env={
    "CONTABO_CLIENT_ID": "...", "CONTABO_CLIENT_SECRET": "...",
    "CONTABO_API_USER": "...", "CONTABO_API_PASSWORD": "...",
})
agent = Agent(name="infra", mcp_servers=[mcp])
```

## As-built notes

Drift between this design and the shipped v0.1 implementation, recorded for
future readers; the sections above are left as approved:

- Tool slugs are camelCase, e.g. `contabo_objectStorage`, not
  `contabo_object_storage` as the table above shows — they reuse the same
  camelCase normalization the codegen applies to `operationId`s.
- Destructive operations are marked `[DESTRUCTIVE]` in tool descriptions and the
  reference tool (`**DESTRUCTIVE**` in per-operation reference docs), not ⚠️.
- `contabo_reference` surfaces, per operation: parameters with location, type,
  required, enum values, defaults and descriptions; deprecation and destructive
  flags; and the exact input JSON Schema (`z.toJSONSchema`, draft-7, input IO).
  Per-parameter `examples` from the spec are **not** surfaced — a deliberate
  omission at v0.1 (YAGNI; keeps reference output compact).
