# Open-Source Setup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make contabo-mcp a properly set up open-source project: MIT LICENSE, npm publication with CI + tag-triggered release, community health files, and GitHub repo polish.

**Architecture:** One feature branch (`feature/open-source-setup`) carrying files + metadata changes, merged via PR. Repo settings (topics, discussions, protection) applied via `gh` after merge. Publishing is tag-driven: `vX.Y.Z` tag → GitHub Actions tests → npm publish with provenance.

**Tech Stack:** GitHub Actions, npm, gh CLI.

**Required architecture skills:** None (non-Brahmcast project).

---

### Task 1: LICENSE + package.json metadata

**Files:**
- Create: `LICENSE`
- Modify: `package.json`

**Step 1: Create LICENSE** — standard MIT text, copyright line exactly:

```
Copyright (c) 2026 Sanchayan (github.com/sanchayan721)
```

(Use the canonical MIT wording: "Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction…" — full text.)

**Step 2: Update package.json** — add after `"license": "MIT"`:

```json
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sanchayan721/contabo-mcp.git"
  },
  "homepage": "https://github.com/sanchayan721/contabo-mcp#readme",
  "bugs": {
    "url": "https://github.com/sanchayan721/contabo-mcp/issues"
  },
  "keywords": ["mcp", "contabo", "model-context-protocol", "openai", "agents", "vps", "typescript"],
```

and change `files` to `["dist", "README.md", "LICENSE"]`.

**Step 3: Verify** — `npm pack --dry-run 2>&1 | tail -8` → tarball contains dist/, README.md, LICENSE, package.json; `npm publish --dry-run` succeeds (it will fail auth check? no — dry-run needs no auth).

**Step 4: Commit**

```bash
git checkout -b feature/open-source-setup
git add LICENSE package.json
git commit -m "chore: MIT license and npm package metadata"
```

### Task 2: CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

**Step 1: Create ci.yml**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        node-version: [20, 22, 24]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
      - run: npm ci
      - run: npm test
```

**Step 2: Verify** — actionlint if available, else YAML parse check (`node -e "require('js-yaml')"` not installed → just eyeball + let CI verify). Commit.

**Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: test matrix on push and PRs (Node 20/22/24)"
```

### Task 3: Release workflow

**Files:**
- Create: `.github/workflows/release.yml`

**Step 1: Create release.yml**

```yaml
name: Release

on:
  push:
    tags: ['v*']

permissions:
  contents: read
  id-token: write

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: 'https://registry.npmjs.org/'
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm publish --provenance
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Step 2: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "ci: tag-triggered npm release with provenance"
```

### Task 4: Community health files

**Files:**
- Create: `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `CHANGELOG.md`
- Create: `.github/ISSUE_TEMPLATE/bug_report.yml`, `.github/ISSUE_TEMPLATE/feature_request.yml`, `.github/ISSUE_TEMPLATE/config.yml`, `.github/PULL_REQUEST_TEMPLATE.md`

**Content guidance (complete, concise):**
- CONTRIBUTING.md: dev setup (`npm install`, `npm test`, `npm run generate`), the codegen fail-loud contract (never hand-edit `src/generated/registry.ts`; spec updates = replace `spec/contabo-openapi.json` + `npm run generate`), TDD expectation, commit style (conventional), PR checklist, release process (bump version + CHANGELOG → tag `vX.Y.Z` → CI publishes).
- SECURITY.md: report via GitHub private vulnerability reporting (Security Advisories), do NOT open public issues for credentials-related vulnerabilities; supported version = latest main.
- CODE_OF_CONDUCT.md: paste the official Contributor Covenant v2.1 text (https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md) with contact method: `bhunia.sanchayan@gmail.com`.
- CHANGELOG.md: Keep-a-Changelog format; `[0.1.0] - 2026-10-16` entry: initial open-source release — 15 MCP tools covering all 157 Contabo API operations, OAuth2 handled internally, read-only default with `CONTABO_ENABLE_WRITES=1`.
- Issue templates as GitHub issue forms (bug: description, reproduction, env (OS/Node/agent client), expected vs actual, sensitivity acknowledgment "never paste Contabo credentials or tokens"; feature: problem + proposed behavior).
- config.yml: blank_issues_enabled: false, contact link to Discussions.
- PR template: what/why, test plan checklist (`npm test`, codegen untouched or regenerated).

**Step: Commit**

```bash
git add CONTRIBUTING.md SECURITY.md CODE_OF_CONDUCT.md CHANGELOG.md .github
git commit -m "docs: community health files and templates"
```

### Task 5: README badges

**Files:**
- Modify: `README.md` (top of file, above the title line)

```markdown
[![CI](https://github.com/sanchayan721/contabo-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/sanchayan721/contabo-mcp/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/contabo-mcp)](https://www.npmjs.com/package/contabo-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
```

**Step: Verify** `npm test` green, then commit:

```bash
git add README.md
git commit -m "docs: README badges"
```

### Task 6: Push, PR, merge, repo settings, release

**Steps:**
1. `git push -u Github feature/open-source-setup`; `gh pr create --base main --head feature/open-source-setup --title "Open-source setup: license, CI, npm release, community files" --body <summary+test plan>`; verify CI green on the PR (`gh pr checks --watch` or poll); merge with `gh pr merge --merge --delete-branch`; checkout main, pull.
2. Repo settings:
   ```bash
   gh repo edit sanchayan721/contabo-mcp --add-topic mcp --add-topic contabo --add-topic model-context-protocol --add-topic typescript --add-topic openai --add-topic agents --add-topic vps
   gh repo edit sanchayan721/contabo-mcp --enable-discussions --homepage "https://github.com/sanchayan721/contabo-mcp#readme"
   gh api -X PUT repos/sanchayan721/contabo-mcp/branches/main/protection -f 'required_status_checks[strict]=true' -f 'required_status_checks[context][]=test (20)' -f 'required_status_checks[context][]=test (22)' -f 'required_status_checks[context][]=test (24)' -F 'enforce_admins=false' -F 'required_pull_request_reviews=null' -F 'restrictions=null' -F 'allow_force_pushes=false' -F 'allow_deletions=false'
   ```
3. **User action (walk through):** create npm granular token (npmjs.com → Access Tokens → Generate → type Granular, packages: All packages, permissions: Read and write) → `gh secret set NPM_TOKEN --repo sanchayan721/contabo-mcp` (paste token).
4. First release: `npm version 0.1.0` already set → `git tag v0.1.0 && git push Github v0.1.0` → Release workflow runs → verify package at https://www.npmjs.com/package/contabo-mcp and `npm view contabo-mcp version` → 0.1.0.
5. Final verification: `npm pack --dry-run` clean; Discussions + topics visible on repo page; protection active.

## Verification checklist

- [ ] LICENSE visible on GitHub repo page
- [ ] CI green on the setup PR and on main after merge
- [ ] `npm view contabo-mcp` returns 0.1.0 after the v0.1.0 tag
- [ ] Topics/badges/protection visible
- [ ] CHANGELOG + templates render correctly