[![CI](https://github.com/sanchayan721/contabo-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/sanchayan721/contabo-mcp/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

# contabo-mcp

An MCP (Model Context Protocol) server that exposes the **entire Contabo API** —
all 157 operations, generated from the official OpenAPI spec — to OpenAI-compatible
agents (OpenAI Agents SDK, Codex CLI, Claude Desktop, Cursor, …).

- 14 domain tools (instances, snapshots, images, objectStorage, privateNetworks,
  firewalls, dns, domains, vips, secrets, tags, users, audits, troubleshooting)
- 1 documentation tool (`contabo_reference`) with full parameter docs per operation
- Handles Contabo OAuth2 (password grant), token caching, and the required
  `x-request-id` header — the agent never deals with tokens
- **Read-only by default.** Start with `CONTABO_ENABLE_WRITES=1` to allow
  POST/PATCH/PUT/DELETE operations.

## Getting credentials

Create the four credentials in the [Contabo Customer Control Panel](https://my.contabo.com/api/details):
`ClientId`, `ClientSecret`, `API User` (email), `API Password`.

## Configuration

| Env var | Required | Meaning |
| --- | --- | --- |
| `CONTABO_CLIENT_ID` | yes | OAuth2 client id |
| `CONTABO_CLIENT_SECRET` | yes | OAuth2 client secret |
| `CONTABO_API_USER` | yes | API user email |
| `CONTABO_API_PASSWORD` | yes | API password |
| `CONTABO_ENABLE_WRITES` | no | `1` enables non-GET operations (default read-only) |
| `CONTABO_API_BASE_URL` | no | default `https://api.contabo.com` |
| `CONTABO_AUTH_URL` | no | default Contabo token endpoint |
| `CONTABO_TIMEOUT_MS` | no | per-request timeout (default 30000) |

## Usage

The server runs straight from this repository — `npx` fetches it, builds it, and starts it:

```sh
npx -y github:sanchayan721/contabo-mcp
```

Prefer running from a clone? `git clone` + `npm install && npm run build`, then point
your client at `node dist/index.js` instead.

### OpenAI Agents SDK (Python)

```python
from agents import Agent, MCPServerStdio

mcp = MCPServerStdio(
    command="npx",
    args=["-y", "github:sanchayan721/contabo-mcp"],
    env={
        "CONTABO_CLIENT_ID": "...",
        "CONTABO_CLIENT_SECRET": "...",
        "CONTABO_API_USER": "...",
        "CONTABO_API_PASSWORD": "...",
        # "CONTABO_ENABLE_WRITES": "1",  # uncomment to allow writes
    },
)
agent = Agent(name="infra", mcp_servers=[mcp])
```

### Claude Desktop / Codex CLI / Cursor (stdio config)

```json
{
  "mcpServers": {
    "contabo": {
      "command": "npx",
      "args": ["-y", "github:sanchayan721/contabo-mcp"],
      "env": {
        "CONTABO_CLIENT_ID": "...",
        "CONTABO_CLIENT_SECRET": "...",
        "CONTABO_API_USER": "...",
        "CONTABO_API_PASSWORD": "..."
      }
    }
  }
}
```

## Development

Requires Node.js >= 24. Nub users get a faster local loop (`nub run test`,
`nub src/codegen/generate.ts`) — see [CONTRIBUTING.md](CONTRIBUTING.md).

```sh
npm install
npm run generate   # spec/contabo-openapi.json → src/generated/registry.ts (157 ops)
npm test           # vitest suite incl. golden codegen + stdio E2E tests
npm run build      # tsc → dist/ (regenerates the registry first)
```

The API spec is committed at `spec/contabo-openapi.json`. When Contabo updates
their API, replace that file and rerun `npm run generate` — the registry and all
tool schemas stay in sync (codegen fails loudly if anything is dropped, renamed
or collides).

## Safety

- Read-only by default: write operations are rejected **before any HTTP call**
  with a message naming `CONTABO_ENABLE_WRITES`.
- Destructive operations (cancel/delete/revoke/reset/shutdown/rollback) are
  flagged `[DESTRUCTIVE]` in tool descriptions and the reference tool.
- Tokens are never logged; all logging goes to stderr.
