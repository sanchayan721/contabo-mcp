# Contabo MCP Server Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an MCP stdio server exposing all 157 operations of the Contabo API (committed OpenAPI 3.0.3 spec) as 14 domain tools + 1 reference tool, generated from the spec at build time.

**Architecture:** Build-time codegen turns `spec/contabo-openapi.json` into `src/generated/registry.ts` (every operation: method, path, zod input schema, param metadata, read/write/destructive flags). A thin hand-written layer provides the OAuth2 password-grant client (token caching, `x-request-id` injection, error mapping) and the domain tools (zod discriminated unions on `operation`, read-only gating). Served over stdio via the MCP SDK low-level `Server` API (needed because tool input schemas are per-operation unions).

**Tech Stack:** Node ≥ 20, TypeScript 5 (ESM, NodeNext), `@modelcontextprotocol/sdk` ^1.12 (low-level `Server`), zod ^4, vitest, tsx (codegen runner).

**Required architecture skills:** None (non-Brahmcast project).

**Conventions used throughout:**
- Tests run with `npx vitest run <file>`. Each test file starts with `import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";`
- Relative imports in `src/` use `.js` extensions (NodeNext).
- Domain slugs are camelCase: `instances, snapshots, images, objectStorage, privateNetworks, firewalls, dns, domains, vips, secrets, tags, users, audits, troubleshooting` → tool names `contabo_instances` … `contabo_troubleshooting` plus `contabo_reference` (15 total).
- Op ids are `<domain>_<name>`, e.g. `objectStorage_create`, `audits_instances`.
- All Contabo HTTP errors become readable MCP `isError` results; nothing ever writes to stdout except the MCP protocol (logging goes to stderr).

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `.gitignore`

**Step 1: Create package.json**

```json
{
  "name": "contabo-mcp",
  "version": "0.1.0",
  "description": "MCP server exposing the full Contabo API to OpenAI-compatible agents",
  "type": "module",
  "license": "MIT",
  "bin": { "contabo-mcp": "dist/index.js" },
  "files": ["dist", "README.md"],
  "engines": { "node": ">=20" },
  "scripts": {
    "generate": "tsx src/codegen/generate.ts spec/contabo-openapi.json",
    "prebuild": "npm run generate",
    "build": "tsc -p tsconfig.json",
    "test": "vitest run",
    "test:watch": "vitest",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.12.0",
    "zod": "^4.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "tsx": "^4.19.0",
    "typescript": "^5.6.0",
    "vitest": "^3.0.0"
  }
}
```

**Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

**Step 3: Create vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "node" },
});
```

**Step 4: Create .gitignore**

```
node_modules/
dist/
```

**Step 5: Install dependencies**

Run: `npm install`
Expected: installs without errors; `node_modules/` and `package-lock.json` created.

**Step 6: Commit**

```bash
git add package.json package-lock.json tsconfig.json vitest.config.ts .gitignore
git commit -m "chore: scaffold contabo-mcp project"
```

---

### Task 2: Config loader

**Files:**
- Create: `src/config.ts`
- Test: `test/config.test.ts`

**Step 1: Write the failing test**

`test/config.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { loadConfig } from "../src/config.js";

describe("loadConfig", () => {
  it("reads the four Contabo credentials", () => {
    const cfg = loadConfig({
      CONTABO_CLIENT_ID: "cid",
      CONTABO_CLIENT_SECRET: "csec",
      CONTABO_API_USER: "u@example.com",
      CONTABO_API_PASSWORD: "pw",
    });
    expect(cfg.clientId).toBe("cid");
    expect(cfg.clientSecret).toBe("csec");
    expect(cfg.apiUser).toBe("u@example.com");
    expect(cfg.apiPassword).toBe("pw");
  });

  it("disables writes by default and enables with CONTABO_ENABLE_WRITES=1", () => {
    expect(loadConfig({}).writesEnabled).toBe(false);
    expect(loadConfig({ CONTABO_ENABLE_WRITES: "1" }).writesEnabled).toBe(true);
    expect(loadConfig({ CONTABO_ENABLE_WRITES: "true" }).writesEnabled).toBe(false);
  });

  it("supports base/auth URL and timeout overrides", () => {
    const cfg = loadConfig({
      CONTABO_API_BASE_URL: "http://127.0.0.1:9999",
      CONTABO_AUTH_URL: "http://127.0.0.1:9999/token",
      CONTABO_TIMEOUT_MS: "5000",
    });
    expect(cfg.baseUrl).toBe("http://127.0.0.1:9999");
    expect(cfg.authUrl).toBe("http://127.0.0.1:9999/token");
    expect(cfg.timeoutMs).toBe(5000);
  });

  it("defaults timeoutMs to undefined", () => {
    expect(loadConfig({}).timeoutMs).toBeUndefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run test/config.test.ts`
Expected: FAIL — cannot find module `../src/config.js`.

**Step 3: Write minimal implementation**

`src/config.ts`:

```ts
export interface Config {
  clientId: string;
  clientSecret: string;
  apiUser: string;
  apiPassword: string;
  writesEnabled: boolean;
  baseUrl?: string;
  authUrl?: string;
  timeoutMs?: number;
}

export function loadConfig(env: Record<string, string | undefined> = process.env): Config {
  const get = (key: string): string | undefined => env[key]?.trim() || undefined;
  const timeoutRaw = get("CONTABO_TIMEOUT_MS");
  return {
    clientId: get("CONTABO_CLIENT_ID") ?? "",
    clientSecret: get("CONTABO_CLIENT_SECRET") ?? "",
    apiUser: get("CONTABO_API_USER") ?? "",
    apiPassword: get("CONTABO_API_PASSWORD") ?? "",
    writesEnabled: get("CONTABO_ENABLE_WRITES") === "1",
    baseUrl: get("CONTABO_API_BASE_URL"),
    authUrl: get("CONTABO_AUTH_URL"),
    timeoutMs: timeoutRaw ? Number(timeoutRaw) || undefined : undefined,
  };
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run test/config.test.ts`
Expected: PASS (4 tests).

**Step 5: Commit**

```bash
git add src/config.ts test/config.test.ts
git commit -m "feat: config loader for Contabo credentials and write gate"
```

---

### Task 3: Codegen — overrides tables and spec extraction

The overrides table maps every `operationId` whose default lower-camel form is not the desired tool operation name. (IDs absent from the table pass through lower-camel-cased: `start`, `restart`, `stop`, `shutdown`, `rescue`, `requestRegionChange`, `updatePtrRecord`, `deletePtrRecord`, `createPtrRecord`, `listHandles`, `createHandle`, `updateHandle`, `setDefaultHandle`, `resetPassword`, `resendEmailVerification`, `generateSsoToken`, `generateClientSecret`, `requestEmailChange`, `switchAccount`, `createRole`, `updateRole`, `deleteRole`, `createAssignment`, `deleteAssignment`, `listPendingActions`, `getAuthCode`, `listObjectStorageCredentials`, `getObjectStorageCredentials`, `regenerateObjectStorageCredentials`.)

**Files:**
- Create: `src/codegen/overrides.ts`
- Create: `src/codegen/extract.ts`
- Test: `test/codegen-extract.test.ts`

**Step 1: Write the failing test**

`test/codegen-extract.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { extractOperations, type RawOperation } from "../src/codegen/extract.js";
import { domainForTag, nameForOperationId } from "../src/codegen/overrides.js";

const spec = JSON.parse(readFileSync(new URL("../spec/contabo-openapi.json", import.meta.url), "utf8"));

describe("domainForTag", () => {
  it("maps data tags", () => {
    expect(domainForTag("Instances")).toBe("instances");
    expect(domainForTag("Instance Actions")).toBe("instances");
    expect(domainForTag("Instances Products")).toBe("instances");
    expect(domainForTag("Object Storages")).toBe("objectStorage");
    expect(domainForTag("Private Networks")).toBe("privateNetworks");
    expect(domainForTag("Users Object Storage Credentials")).toBe("users");
    expect(domainForTag("User Accounts")).toBe("users");
    expect(domainForTag("Roles")).toBe("users");
    expect(domainForTag("Handles")).toBe("domains");
    expect(domainForTag("Check Collection Templates")).toBe("troubleshooting");
  });

  it("maps every audit tag to the audits domain", () => {
    for (const tag of ["Instances Audits", "Vip Audits", "Tag Assignments Audits", "Roles Audits", "DNS Audits"]) {
      expect(domainForTag(tag)).toBe("audits");
    }
  });

  it("fails loudly on an unknown tag", () => {
    expect(() => domainForTag("Nonexistent")).toThrow(/Unknown tag/);
  });
});

describe("nameForOperationId", () => {
  it("returns overrides", () => {
    expect(nameForOperationId("retrieveInstancesList")).toBe("list");
    expect(nameForOperationId("CancelObjectStorage")).toBe("cancel");
    expect(nameForOperationId("putFirewall")).toBe("updateRules");
    expect(nameForOperationId("retrieveTagAuditsList")).toBe("tags");
  });

  it("passes clean ids through lower-camel", () => {
    expect(nameForOperationId("start")).toBe("start");
    expect(nameForOperationId("updatePtrRecord")).toBe("updatePtrRecord");
  });
});

describe("extractOperations", () => {
  const ops: RawOperation[] = extractOperations(spec);

  it("extracts exactly 157 operations", () => {
    expect(ops).toHaveLength(157);
  });

  it("excludes header parameters from tool-facing params", () => {
    for (const op of ops) {
      const names = [...op.pathParams, ...op.queryParams].map((p) => p.name);
      expect(names).not.toContain("x-request-id");
      expect(names).not.toContain("x-trace-id");
    }
  });

  it("captures body schemas for POST/PUT/PATCH/DELETE ops with bodies", () => {
    const create = ops.find((o) => o.operationId === "createInstance")!;
    expect(create.method).toBe("POST");
    expect(create.body).toBeDefined();
    expect(Object.keys(create.body!.properties!)).toContain("productId");

    const start = ops.find((o) => o.operationId === "start")!;
    expect(start.body).toBeUndefined();

    const del = ops.find((o) => o.operationId === "deleteSnapshot")!;
    expect(del.method).toBe("DELETE");
    expect(del.body).toBeUndefined();
  });

  it("marks requestBodies required where the spec says so", () => {
    const create = ops.find((o) => o.operationId === "createInstance")!;
    expect(create.bodyRequired).toBe(true);
    const start = ops.find((o) => o.operationId === "start")!;
    expect(start.bodyRequired).toBe(false);
  });

  it("assigns domains matching the design grouping", () => {
    const count = (domain: string) => ops.filter((o) => domainForTag((o.tags ?? [])[0]) === domain).length;
    expect(count("instances")).toBe(16);
    expect(count("snapshots")).toBe(6);
    expect(count("images")).toBe(6);
    expect(count("objectStorage")).toBe(8);
    expect(count("privateNetworks")).toBe(7);
    expect(count("firewalls")).toBe(9);
    expect(count("dns")).toBe(14);
    expect(count("domains")).toBe(18);
    expect(count("vips")).toBe(4);
    expect(count("secrets")).toBe(5);
    expect(count("tags")).toBe(9);
    expect(count("users")).toBe(24);
    expect(count("audits")).toBe(17);
    expect(count("troubleshooting")).toBe(14);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run test/codegen-extract.test.ts`
Expected: FAIL — module not found.

**Step 3: Write overrides.ts**

`src/codegen/overrides.ts`:

```ts
/**
 * Hand-maintained mapping tables for codegen. These survive spec updates.
 */

const TAG_TO_DOMAIN: Record<string, string> = {
  // Compute
  Instances: "instances",
  "Instance Actions": "instances",
  "Instances Products": "instances",
  Snapshots: "snapshots",
  Images: "images",
  "Object Storages": "objectStorage",
  "Private Networks": "privateNetworks",
  Firewalls: "firewalls",
  DNS: "dns",
  VIP: "vips",
  Secrets: "secrets",
  Tags: "tags",
  "Tag Assignments": "tags",
  Users: "users",
  "User Accounts": "users",
  Roles: "users",
  "Users Object Storage Credentials": "users",
  Handles: "domains",
  Domains: "domains",
  Checks: "troubleshooting",
  "Check Collections": "troubleshooting",
  "Check Collection Templates": "troubleshooting",
  Remedies: "troubleshooting",
  // Audits (all audit tags collapse into one domain tool)
  "Instances Audits": "audits",
  "Instance Actions Audits": "audits",
  "Snapshots Audits": "audits",
  "Images Audits": "audits",
  "Object Storages Audits": "audits",
  "Private Networks Audits": "audits",
  "Firewalls Audits": "audits",
  "Tags Audits": "audits",
  "Tag Assignments Audits": "audits",
  "Users Audits": "audits",
  "Roles Audits": "audits",
  "Secrets Audits": "audits",
  "DNS Audits": "audits",
  "Domains Audits": "audits",
  "Handles Audits": "audits",
  "Vip Audits": "audits",
};

export function domainForTag(tag: string): string {
  const domain = TAG_TO_DOMAIN[tag];
  if (!domain) throw new Error(`Unknown tag in spec: "${tag}" — add it to TAG_TO_DOMAIN in src/codegen/overrides.ts`);
  return domain;
}

/** operationId → tool operation name (only entries where the lower-camel default is not what we want). */
export const NAME_OVERRIDES: Record<string, string> = {
  // instances
  retrieveInstancesList: "list",
  createInstance: "create",
  retrieveInstance: "get",
  patchInstance: "update",
  reinstallInstance: "reinstall",
  cancelInstance: "cancel",
  upgradeInstance: "upgrade",
  checkSetNewHost: "checkRegionChange",
  retrieveAvailableInstanceProducts: "listProducts",
  resetPasswordAction: "resetPassword",
  // snapshots
  retrieveSnapshotList: "list",
  createSnapshot: "create",
  retrieveSnapshot: "get",
  updateSnapshot: "update",
  deleteSnapshot: "delete",
  rollbackSnapshot: "rollback",
  // images
  retrieveImageList: "list",
  createCustomImage: "create",
  retrieveImage: "get",
  updateImage: "update",
  deleteImage: "delete",
  retrieveCustomImagesStats: "stats",
  // objectStorage
  retrieveObjectStorageList: "list",
  createObjectStorage: "create",
  retrieveObjectStorage: "get",
  updateObjectStorage: "update",
  upgradeObjectStorage: "upgrade",
  retrieveObjectStoragesStats: "stats",
  CancelObjectStorage: "cancel",
  retrieveDataCenterList: "listDataCenters",
  // privateNetworks
  retrievePrivateNetworkList: "list",
  createPrivateNetwork: "create",
  retrievePrivateNetwork: "get",
  patchPrivateNetwork: "update",
  deletePrivateNetwork: "delete",
  assignInstancePrivateNetwork: "assignInstance",
  unassignInstancePrivateNetwork: "unassignInstance",
  // firewalls
  createFirewall: "create",
  retrieveFirewallList: "list",
  deleteFirewall: "delete",
  retrieveFirewall: "get",
  patchFirewall: "update",
  putFirewall: "updateRules",
  assignInstanceFirewall: "assignInstance",
  unassignInstanceFirewall: "unassignInstance",
  retrievePresetRules: "listPresetRules",
  // dns
  retrievePtrRecord: "getPtrRecord",
  retrievePtrRecordsList: "listPtrRecords",
  retrieveDnsZonesList: "listZones",
  createDnsZone: "createZone",
  retrieveDnsZone: "getZone",
  deleteDnsZone: "deleteZone",
  retrieveDnsZoneRecordsList: "listZoneRecords",
  createDnsZoneRecord: "createZoneRecord",
  updateDnsZoneRecord: "updateZoneRecord",
  deleteDnsZoneRecord: "deleteZoneRecord",
  bulkDeleteDnsZoneRecords: "bulkDeleteZoneRecords",
  // domains
  validateDomainAvailability: "checkAvailability",
  listDomains: "list",
  orderDomain: "order",
  suggestDomains: "suggest",
  retrieveDomain: "get",
  updateDomain: "update",
  cancelDomain: "cancel",
  revokeCancelDomain: "revokeCancel",
  confirmDomainTransferOut: "confirmTransferOut",
  revokeDomainTransferOut: "revokeTransferOut",
  retrieveHandle: "getHandle",
  removeHandle: "deleteHandle",
  // vips
  retrieveVipList: "list",
  retrieveVip: "get",
  assignIp: "assign",
  unassignIp: "unassign",
  // secrets
  retrieveSecretList: "list",
  createSecret: "create",
  retrieveSecret: "get",
  updateSecret: "update",
  deleteSecret: "delete",
  // tags
  retrieveTagList: "list",
  createTag: "create",
  retrieveTag: "get",
  updateTag: "update",
  deleteTag: "delete",
  retrieveAssignmentList: "listAssignments",
  retrieveAssignment: "getAssignment",
  // users
  retrieveUserList: "list",
  createUser: "create",
  retrieveUser: "get",
  updateUser: "update",
  deleteUser: "delete",
  retrieveUserClient: "getClient",
  retrieveUserIsPasswordSet: "isPasswordSet",
  makeDefaultAccount: "makeDefault",
  listUserAccounts: "listAccounts",
  retrieveRoleList: "listRoles",
  retrieveRole: "getRole",
  retrieveApiPermissionsList: "listApiPermissions",
  // audits (one entry per audit endpoint; name = resource area)
  retrieveTagAuditsList: "tags",
  retrieveAssignmentsAuditsList: "tagAssignments",
  retrieveDnsAuditsList: "dnsZones",
  retrieveRecordAuditsList: "dnsRecords",
  retrieveVipAuditsList: "vips",
  retrieveSecretAuditsList: "secrets",
  retrievePrivateNetworkAuditsList: "privateNetworks",
  retrieveUserAuditsList: "users",
  retrieveRoleAuditsList: "roles",
  retrieveFirewallAuditsList: "firewalls",
  retrieveInstancesAuditsList: "instances",
  retrieveInstancesActionsAuditsList: "instanceActions",
  retrieveImageAuditsList: "images",
  retrieveSnapshotsAuditsList: "snapshots",
  retrieveHandlesAuditsList: "handles",
  retrieveDomainsAuditsList: "domains",
  retrieveObjectStorageAuditsList: "objectStorages",
  // troubleshooting
  listExtChecks: "listChecks",
  startExtCheck: "startCheck",
  getExtCheck: "getCheck",
  cancelExtCheck: "cancelCheck",
  listExtCheckCollections: "listCheckCollections",
  startExtCheckCollection: "startCheckCollection",
  getExtCheckCollection: "getCheckCollection",
  cancelExtCheckCollection: "cancelCheckCollection",
  listExtCheckCollectionTemplates: "listCheckCollectionTemplates",
  getExtCheckCollectionTemplate: "getCheckCollectionTemplate",
  listExtRemedies: "listRemedies",
  startExtRemedy: "startRemedy",
  getExtRemedy: "getRemedy",
  cancelExtRemedy: "cancelRemedy",
};

export function nameForOperationId(operationId: string): string {
  const override = NAME_OVERRIDES[operationId];
  if (override) return override;
  return operationId.charAt(0).toLowerCase() + operationId.slice(1);
}

/** Destructive ops are advisory flags surfaced in descriptions and the reference tool. */
export function isDestructive(method: string, name: string): boolean {
  if (method === "DELETE") return true;
  return /^(cancel|revoke|resetPassword|shutdown|rollback|bulkDelete|regenerate|generateClientSecret)/.test(name);
}
```

**Step 4: Write extract.ts**

`src/codegen/extract.ts`:

```ts
/**
 * Extracts flat operation descriptors from the Contabo OpenAPI spec.
 * Header parameters (x-request-id, x-trace-id) are dropped — the MCP client
 * layer injects them itself.
 */

export type JsonSchema = Record<string, unknown>;

export interface Param {
  name: string;
  required: boolean;
  description: string;
  schema: JsonSchema;
  deprecated: boolean;
}

export interface RawOperation {
  operationId: string;
  tags: string[];
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  summary: string;
  description: string;
  deprecated: boolean;
  pathParams: Param[];
  queryParams: Param[];
  /** undefined when the operation has no request body */
  body?: { properties: Record<string, JsonSchema>; required: string[]; description: string };
  bodyRequired: boolean;
}

const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete"]);

/** Resolve a $ref pointer like "#/components/schemas/Foo" inside the spec document. */
export function deref(node: unknown, root: JsonSchema, stack: string[] = []): unknown {
  if (typeof node !== "object" || node === null) return node;
  const ref = (node as Record<string, unknown>)["$ref"];
  if (typeof ref !== "string") return node;
  if (!ref.startsWith("#/")) throw new Error(`Only local $refs supported: ${ref}`);
  if (stack.includes(ref)) return { type: "object" }; // cycle guard
  let current: unknown = root;
  for (const part of ref.slice(2).split("/")) {
    const key = part.replace(/~1/g, "/").replace(/~0/g, "~");
    if (typeof current !== "object" || current === null || !(key in current)) {
      throw new Error(`Unresolvable $ref: ${ref}`);
    }
    current = (current as Record<string, unknown>)[key];
  }
  return deref(current, root, [...stack, ref]);
}

function toParam(p: unknown, root: JsonSchema): Param & { in: string } {
  const param = deref(p, root) as Record<string, unknown>;
  return {
    name: String(param.name),
    in: String(param.in),
    required: Boolean(param.required),
    description: typeof param.description === "string" ? param.description : "",
    schema: (param.schema ?? {}) as JsonSchema,
    deprecated: Boolean(param.deprecated),
  };
}

function toBody(requestBody: unknown, root: JsonSchema): { properties: Record<string, JsonSchema>; required: string[]; description: string } {
  const rb = deref(requestBody, root) as Record<string, unknown>;
  const content = rb.content as Record<string, Record<string, unknown>> | undefined;
  const json = content?.["application/json"];
  if (!json) throw new Error("Request body without application/json content");
  const schema = deref(json.schema, root) as Record<string, unknown>;
  if (schema.type !== "object" && !schema.properties) {
    throw new Error(`Unsupported request body schema type: ${String(schema.type)}`);
  }
  const properties = (schema.properties ?? {}) as Record<string, JsonSchema>;
  for (const [k, v] of Object.entries(properties)) properties[k] = deref(v, root) as JsonSchema;
  return {
    properties,
    required: (schema.required as string[] | undefined) ?? [],
    description: typeof schema.description === "string" ? schema.description : "",
  };
}

export function extractOperations(spec: JsonSchema): RawOperation[] {
  const paths = spec.paths as Record<string, Record<string, unknown>>;
  const ops: RawOperation[] = [];
  for (const [path, pathItem] of Object.entries(paths)) {
    for (const [method, operationUnknown] of Object.entries(pathItem)) {
      if (!HTTP_METHODS.has(method)) continue;
      const operation = operationUnknown as Record<string, unknown>;
      const rawParams = [...((pathItem.parameters as unknown[]) ?? []), ...((operation.parameters as unknown[]) ?? [])];
      const params = rawParams.map((p) => toParam(p, spec));
      const hasBody = operation.requestBody !== undefined;
      ops.push({
        operationId: String(operation.operationId),
        tags: (operation.tags as string[] | undefined) ?? [],
        method: method.toUpperCase() as RawOperation["method"],
        path,
        summary: String(operation.summary ?? ""),
        description: String(operation.description ?? ""),
        deprecated: Boolean(operation.deprecated),
        pathParams: params.filter((p) => p.in === "path").map(({ in: _in, ...rest }) => rest),
        queryParams: params.filter((p) => p.in === "query").map(({ in: _in, ...rest }) => rest),
        body: hasBody ? toBody(operation.requestBody, spec) : undefined,
        bodyRequired: hasBody ? Boolean(deref(operation.requestBody, spec) && (deref(operation.requestBody, spec) as Record<string, unknown>).required) : false,
      });
    }
  }
  return ops;
}
```

**Step 5: Run test to verify it passes**

Run: `npx vitest run test/codegen-extract.test.ts`
Expected: PASS (10 tests across 3 describes). If `bodyRequired` assertions fail, inspect the spec's `requestBody.required` flag and adjust.

**Step 6: Commit**

```bash
git add src/codegen/overrides.ts src/codegen/extract.ts test/codegen-extract.test.ts
git commit -m "feat: codegen overrides tables and OpenAPI operation extraction"
```

---

### Task 4: Codegen — JSON schema → zod source emitter

**Files:**
- Create: `src/codegen/emit.ts`
- Test: `test/codegen-emit.test.ts`

**Step 1: Write the failing test**

`test/codegen-emit.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { z } from "zod";
import { emitZodExpression } from "../src/codegen/emit.js";

const evalExpr = (src: string): z.ZodType => {
  // Emitted source is a zod expression using the local `z` binding.
  // eslint-disable-next-line no-new-func
  return new Function("z", `"use strict"; return (${src});`)(z) as z.ZodType;
};

describe("emitZodExpression", () => {
  it("emits string with description", () => {
    const src = emitZodExpression({ type: "string", description: "The name" });
    const s = evalExpr(src) as z.ZodString;
    expect(s.parse("abc")).toBe("abc");
    expect(src).toContain('.describe("The name")');
  });

  it("emits string enum", () => {
    const s = evalExpr(emitZodExpression({ type: "string", enum: ["EU", "US-east"] })) as z.ZodEnum;
    expect(s.parse("EU")).toBe("EU");
    expect(() => s.parse("MARS")).toThrow();
  });

  it("emits int64 integer with bounds", () => {
    const s = evalExpr(emitZodExpression({ type: "integer", format: "int64", minimum: 1 })) as z.ZodNumber;
    expect(s.parse(10)).toBe(10);
    expect(() => s.parse(1.5)).toThrow();
    expect(() => s.parse(0)).toThrow();
  });

  it("emits boolean", () => {
    const s = evalExpr(emitZodExpression({ type: "boolean" }));
    expect(s.parse(true)).toBe(true);
  });

  it("emits arrays with item schemas", () => {
    const s = evalExpr(emitZodExpression({ type: "array", items: { type: "string" }, minItems: 1 }));
    expect(s.parse(["a"])).toEqual(["a"]);
    expect(() => s.parse([])).toThrow();
  });

  it("emits objects with required and optional fields, nested refs inlined", () => {
    const schema = {
      type: "object",
      properties: {
        displayName: { type: "string", maxLength: 255 },
        addOns: {
          type: "object",
          properties: { attributes: { type: "array", items: { type: "object", properties: { id: { type: "integer" }, quantity: { type: "integer" } }, required: ["id"] } } },
        },
      },
      required: ["displayName"],
    };
    const src = emitZodExpression(schema);
    const parsed = (evalExpr(src) as z.ZodObject).parse({ displayName: "x", addOns: { attributes: [{ id: 1 }] } });
    expect(parsed).toEqual({ displayName: "x", addOns: { attributes: [{ id: 1 }] } });
    expect(() => (evalExpr(src) as z.ZodObject).parse({})).toThrow(); // required missing
  });

  it("emits pattern strings", () => {
    const s = evalExpr(emitZodExpression({ type: "string", pattern: "^[a-z]{3}$" }));
    expect(s.parse("abc")).toBe("abc");
    expect(() => s.parse("AB1")).toThrow();
  });

  it("emits defaults", () => {
    const s = evalExpr(emitZodExpression({ type: "string", default: "V153" })) as z.ZodDefault;
    expect(s.parse(undefined)).toBe("V153");
  });

  it("falls back to z.unknown() for unrecognized shapes", () => {
    const s = evalExpr(emitZodExpression({ type: "mystery" }));
    expect(s.safeParse(12345).success).toBe(true);
  });

  it("guards against $ref cycles by inlining a stop", () => {
    const schema = {
      type: "object",
      properties: { next: { $ref: "#/components/schemas/Self" } },
    };
    const src = emitZodExpression(schema, { root: { components: { schemas: { Self: schema } } } });
    expect(src).toBeTruthy();
    expect((evalExpr(src) as z.ZodObject).parse({ next: {} })).toBeTruthy();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run test/codegen-emit.test.ts`
Expected: FAIL — module not found.

**Step 3: Write emit.ts**

`src/codegen/emit.ts`:

```ts
/**
 * Emits zod v4 expression source code from an OpenAPI JSON schema.
 * The generated source is written into src/generated/registry.ts, which is
 * type-checked at build time — a broken emitter therefore breaks the build,
 * never runtime behavior.
 */

import type { JsonSchema } from "./extract.js";

export interface EmitContext {
  /** Full spec document, needed to resolve $refs. */
  root?: JsonSchema;
  /** Internal: $refs currently being expanded (cycle guard). */
  stack?: string[];
}

function lit(value: unknown): string {
  return JSON.stringify(value) ?? "undefined";
}

function stringChecks(schema: Record<string, unknown>): string {
  let out = "";
  if (typeof schema.minLength === "number") out += `.min(${schema.minLength})`;
  if (typeof schema.maxLength === "number") out += `.max(${schema.maxLength})`;
  if (typeof schema.pattern === "string") out += `.regex(new RegExp(${JSON.stringify(schema.pattern)}))`;
  return out;
}

function description(schema: Record<string, unknown>): string {
  return typeof schema.description === "string" && schema.description ? `.describe(${lit(schema.description)})` : "";
}

function defaultValue(schema: Record<string, unknown>): string {
  return "default" in schema && schema.default !== null && schema.default !== undefined ? `.default(${lit(schema.default)})` : "";
}

function deprecation(schema: Record<string, unknown>): string {
  return schema.deprecated === true ? `.meta({ deprecated: true })` : "";
}

export function emitZodExpression(input: JsonSchema, ctx: EmitContext = {}): string {
  const schema = input as Record<string, unknown>;
  const stack = ctx.stack ?? [];

  // $ref: resolve inline with a cycle guard.
  if (typeof schema["$ref"] === "string") {
    const ref = schema["$ref"] as string;
    if (stack.includes(ref)) return `z.unknown() /* cycle: ${ref} */`;
    if (!ctx.root) throw new Error(`Cannot resolve $ref ${ref} without the spec root`);
    let current: unknown = ctx.root;
    for (const part of ref.replace(/^#\//, "").split("/")) {
      const key = part.replace(/~1/g, "/").replace(/~0/g, "~");
      current = (current as Record<string, unknown>)[key];
      if (current === undefined) throw new Error(`Unresolvable $ref: ${ref}`);
    }
    return emitZodExpression(current as JsonSchema, { ...ctx, stack: [...stack, ref] });
  }

  if (Array.isArray(schema.anyOf)) {
    const branches = (schema.anyOf as JsonSchema[]).map((s) => emitZodExpression(s, ctx));
    return `z.union([${branches.join(", ")}])${description(schema)}`;
  }

  if (Array.isArray(schema.allOf)) {
    // Merge object members (Contabo uses allOf rarely, for composed bodies).
    const merged: Record<string, unknown> = { type: "object", properties: {}, required: [] as string[] };
    for (const part of schema.allOf as JsonSchema[]) {
      const p = part as Record<string, unknown>;
      Object.assign(merged.properties as object, p.properties ?? {});
      merged.required = [...(merged.required as string[]), ...((p.required as string[]) ?? [])];
    }
    Object.assign(merged.properties as object, schema.properties ?? {});
    merged.required = [...new Set([...(merged.required as string[]), ...((schema.required as string[]) ?? [])])];
    return emitZodExpression(merged, ctx);
  }

  const type = schema.type as string | undefined;
  const enumValues = schema.enum as unknown[] | undefined;

  if (type === "string" && Array.isArray(enumValues) && enumValues.every((v) => typeof v === "string")) {
    return `z.enum([${enumValues.map(lit).join(", ")}])${stringChecks(schema)}${defaultValue(schema)}${deprecation(schema)}${description(schema)}`;
  }
  if (type === "string") {
    return `z.string()${stringChecks(schema)}${defaultValue(schema)}${deprecation(schema)}${description(schema)}`;
  }
  if (type === "integer" || type === "number") {
    let out = type === "integer" ? "z.number().int()" : "z.number()";
    if (typeof schema.minimum === "number") out += `.min(${schema.minimum})`;
    if (typeof schema.maximum === "number") out += `.max(${schema.maximum})`;
    return `${out}${defaultValue(schema)}${deprecation(schema)}${description(schema)}`;
  }
  if (type === "boolean") {
    return `z.boolean()${defaultValue(schema)}${deprecation(schema)}${description(schema)}`;
  }
  if (type === "array") {
    const items = emitZodExpression((schema.items ?? {}) as JsonSchema, ctx);
    let out = `z.array(${items})`;
    if (typeof schema.minItems === "number") out += `.min(${schema.minItems})`;
    if (typeof schema.maxItems === "number") out += `.max(${schema.maxItems})`;
    return `${out}${defaultValue(schema)}${deprecation(schema)}${description(schema)}`;
  }
  if (type === "object" || schema.properties) {
    const properties = (schema.properties ?? {}) as Record<string, JsonSchema>;
    const required = new Set((schema.required as string[] | undefined) ?? []);
    const hasProperties = Object.keys(properties).length > 0;
    const body = Object.entries(properties)
      .map(([name, propSchema]) => {
        let expr = emitZodExpression(propSchema, ctx);
        if (!required.has(name) && !expr.includes(".default(")) expr += ".optional()";
        return `${JSON.stringify(name)}: ${expr}`;
      })
      .join(", ");
    // Nested objects stay non-strict so agents are not punished for unspecified-but-valid fields.
    const ctor = hasProperties ? "z.object" : "z.looseObject";
    return `${ctor}({ ${body} })${defaultValue(schema)}${description(schema)}`;
  }

  return `z.unknown()${description(schema)}`;
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run test/codegen-emit.test.ts`
Expected: PASS (10 tests).

**Step 5: Commit**

```bash
git add src/codegen/emit.ts test/codegen-emit.test.ts
git commit -m "feat: OpenAPI JSON schema to zod source emitter"
```

---

### Task 5: Codegen — registry builder and generator CLI

**Files:**
- Create: `src/codegen/generate.ts`
- Test: `test/codegen-generate.test.ts`
- Create (generated): `src/generated/registry.ts`

**Step 1: Write the failing test**

`test/codegen-generate.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { buildRegistry, type BuiltOp } from "../src/codegen/generate.js";

const spec = JSON.parse(readFileSync(new URL("../spec/contabo-openapi.json", import.meta.url), "utf8"));
const { ops, domains }: { ops: BuiltOp[]; domains: string[] } = buildRegistry(spec);

describe("buildRegistry", () => {
  it("covers all 157 operations", () => {
    expect(ops).toHaveLength(157);
  });

  it("produces exactly the 14 domains", () => {
    expect(domains).toEqual([
      "instances", "snapshots", "images", "objectStorage", "privateNetworks",
      "firewalls", "dns", "domains", "vips", "secrets", "tags", "users", "audits", "troubleshooting",
    ]);
    expect(new Set(ops.map((o) => o.domain))).toEqual(new Set(domains));
  });

  it("builds unique op ids <domain>_<name>", () => {
    const ids = ops.map((o) => o.id);
    expect(new Set(ids).size).toBe(157);
    expect(ids).toContain("instances_start");
    expect(ids).toContain("objectStorage_cancel");
    expect(ids).toContain("audits_instances");
  });

  it("classifies reads and writes", () => {
    expect(ops.find((o) => o.id === "instances_list")!.write).toBe(false);
    expect(ops.find((o) => o.id === "instances_start")!.write).toBe(true);
    expect(ops.find((o) => o.id === "snapshots_delete")!.destructive).toBe(true);
    expect(ops.find((o) => o.id === "objectStorage_cancel")!.destructive).toBe(true);
    expect(ops.find((o) => o.id === "instances_resetPassword")!.destructive).toBe(true);
    expect(ops.find((o) => o.id === "dns_listZones")!.destructive).toBe(false);
  });

  it("creates a zod schema per op with an operation literal", () => {
    const list = ops.find((o) => o.id === "instances_list")!;
    const parsed = list.schema.safeParse({ operation: "list", page: 2, status: "running" });
    expect(parsed.success).toBe(true);
    const bad = list.schema.safeParse({ operation: "nope" });
    expect(bad.success).toBe(false);
  });

  it("carries path/query/body param locations for dispatch", () => {
    const start = ops.find((o) => o.id === "instances_start")!;
    expect(start.pathParams).toEqual(["instanceId"]);
    expect(start.queryParams).toEqual([]);
    expect(start.bodyParams).toEqual([]);
    expect(start.path).toBe("/v1/compute/instances/{instanceId}/actions/start");
    expect(start.method).toBe("POST");

    const create = ops.find((o) => o.id === "instances_create")!;
    expect(create.bodyParams).toContain("productId");
    expect(create.bodyParams).toContain("period");
    expect(create.bodyParams).not.toContain("x-request-id");

    const dnsList = ops.find((o) => o.id === "dns_listZones")!;
    expect(dnsList.queryParams).toContain("page");
    expect(dnsList.queryParams).toContain("orderBy");
  });

  it("applies spec defaults into schemas (instance create)", () => {
    const create = ops.find((o) => o.id === "instances_create")!;
    const parsed = create.schema.parse({ operation: "create", period: 1 });
    expect(parsed.productId).toBe("V153"); // spec default
    expect(parsed.region).toBe("EU");
  });

  it("flags deprecated operations", () => {
    const deprecated = ops.filter((o) => o.deprecated).map((o) => o.id);
    // The spec marks at least the legacy instances list `instanceId` param — op-level
    // deprecation depends on the spec; this op must NOT be flagged.
    expect(deprecated).not.toContain("instances_list");
  });

  it("keeps param metadata for the reference tool", () => {
    const create = ops.find((o) => o.id === "instances_create")!;
    const period = create.paramMeta.find((p) => p.name === "period")!;
    expect(period.location).toBe("body");
    expect(period.required).toBe(true);
    expect(period.description).toContain("contract period");
  });

  it("every override key resolves to a real operationId", () => {
    const ids = new Set(ops.map((o) => o.id));
    // via re-extraction: all names unique per domain already asserted; here assert
    // no override produced a name colliding with a passthrough name in the same domain.
    const byDomain = new Map<string, Set<string>>();
    for (const op of ops) {
      const set = byDomain.get(op.domain) ?? new Set();
      expect(set.has(op.name)).toBe(false); // unique name within domain
      set.add(op.name);
      byDomain.set(op.domain, set);
      void ids;
    }
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run test/codegen-generate.test.ts`
Expected: FAIL — module not found.

**Step 3: Write generate.ts**

`src/codegen/generate.ts`:

```ts
/**
 * Builds the operation registry from the Contabo OpenAPI spec and emits
 * src/generated/registry.ts. Run: npm run generate [-- path/to/openapi.json]
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { extractOperations, deref, type JsonSchema, type Param, type RawOperation } from "./extract.js";
import { emitZodExpression } from "./emit.js";
import { domainForTag, nameForOperationId, isDestructive } from "./overrides.js";

export interface ParamMeta {
  name: string;
  location: "path" | "query" | "body";
  required: boolean;
  description: string;
  type: string;
  deprecated: boolean;
  enumValues?: string[];
  defaultValue?: unknown;
}

export interface BuiltOp {
  id: string;
  domain: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  summary: string;
  description: string;
  deprecated: boolean;
  write: boolean;
  destructive: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any; // z.ZodObject with an `operation` literal — typed loosely, generated code
  pathParams: string[];
  queryParams: string[];
  bodyParams: string[];
  paramMeta: ParamMeta[];
}

export const DOMAINS = [
  "instances", "snapshots", "images", "objectStorage", "privateNetworks",
  "firewalls", "dns", "domains", "vips", "secrets", "tags", "users",
  "audits", "troubleshooting",
] as const;

function typeLabel(schema: Record<string, unknown>): string {
  const t = schema.type;
  if (t === "array") return `${typeLabel((schema.items ?? {}) as Record<string, unknown>)}[]`;
  if (t === "integer") return "integer";
  if (t === "number") return "number";
  if (t === "boolean") return "boolean";
  if (t === "object") return "object";
  if (Array.isArray(schema.enum)) return `enum(${(schema.enum as unknown[]).map(String).join("|")})`;
  return typeof t === "string" ? String(t) : "unknown";
}

function metaFromParam(p: Param, location: "path" | "query"): ParamMeta {
  const schema = p.schema as Record<string, unknown>;
  return {
    name: p.name,
    location,
    required: p.required,
    description: p.description,
    type: typeLabel(schema),
    deprecated: p.deprecated,
    enumValues: Array.isArray(schema.enum) ? (schema.enum as string[]) : undefined,
    defaultValue: schema.default,
  };
}

function metaFromBody(name: string, schema: JsonSchema, required: string[]): ParamMeta {
  const s = schema as Record<string, unknown>;
  return {
    name,
    location: "body",
    required: required.includes(name),
    description: typeof s.description === "string" ? s.description : "",
    type: typeLabel(s),
    deprecated: s.deprecated === true,
    enumValues: Array.isArray(s.enum) ? (s.enum as string[]) : undefined,
    defaultValue: s.default,
  };
}

/** Build one op's flat zod object expression source + dispatch metadata. */
function buildOp(raw: RawOperation): BuiltOp {
  const domain = domainForTag((raw.tags ?? [])[0] ?? "");
  const name = nameForOperationId(raw.operationId);
  const id = `${domain}_${name}`;

  const pathParams = raw.pathParams.map((p) => p.name);
  const queryParams = raw.queryParams.map((p) => p.name);
  const bodyParams = raw.body ? Object.keys(raw.body.properties) : [];

  // Intra-op collision check: a path/query/body key appearing twice would silently break dispatch.
  const seen = new Map<string, string>();
  for (const [loc, names] of [["path", pathParams], ["query", queryParams], ["body", bodyParams]] as const) {
    for (const n of names) {
      const prior = seen.get(n);
      if (prior) throw new Error(`Parameter "${n}" declared in both ${prior} and ${loc} for ${raw.operationId} — add a rename to overrides.ts`);
      seen.set(n, loc);
    }
  }

  const fields: string[] = [`operation: z.literal(${JSON.stringify(name)})`];
  const paramMeta: ParamMeta[] = [];

  for (const p of raw.pathParams) {
    let expr = emitZodExpression(p.schema as JsonSchema);
    expr += ".describe(" + JSON.stringify(p.description || `Path parameter ${p.name}`) + ")";
    fields.push(`${JSON.stringify(p.name)}: ${expr}`);
    paramMeta.push(metaFromParam(p, "path"));
  }
  for (const p of raw.queryParams) {
    let expr = emitZodExpression(p.schema as JsonSchema);
    if (!p.required && !expr.includes(".default(")) expr += ".optional()";
    if (p.description) expr += ".describe(" + JSON.stringify(p.description) + ")";
    fields.push(`${JSON.stringify(p.name)}: ${expr}`);
    paramMeta.push(metaFromParam(p, "query"));
  }
  if (raw.body) {
    for (const [prop, propSchema] of Object.entries(raw.body.properties)) {
      let expr = emitZodExpression(propSchema as JsonSchema);
      if (!raw.body.required.includes(prop) && !expr.includes(".default(")) expr += ".optional()";
      fields.push(`${JSON.stringify(prop)}: ${expr}`);
      paramMeta.push(metaFromBody(prop, propSchema, raw.body.required));
    }
  }

  const write = raw.method !== "GET";
  const op: BuiltOp = {
    id,
    domain,
    name,
    method: raw.method,
    path: raw.path,
    summary: raw.summary,
    description: raw.description,
    deprecated: raw.deprecated,
    write,
    destructive: isDestructive(raw.method, name),
    schema: null as unknown as BuiltOp["schema"], // replaced below
    pathParams,
    queryParams,
    bodyParams,
    paramMeta,
  };
  (op as Record<string, unknown>).schemaSrc = `z.strictObject({ ${fields.join(", ")} })`;
  return op;
}

function registrySource(ops: BuiltOp[]): string {
  const entries = ops
    .map((op) => {
      const meta = {
        id: op.id, domain: op.domain, name: op.name, method: op.method, path: op.path,
        summary: op.summary, description: op.description, deprecated: op.deprecated,
        write: op.write, destructive: op.destructive,
        pathParams: op.pathParams, queryParams: op.queryParams, bodyParams: op.bodyParams,
        paramMeta: op.paramMeta,
      };
      return `  {\n    ...${JSON.stringify(meta, null, 2).replace(/\n/g, "\n    ")},\n    // eslint-disable-next-line @typescript-eslint/no-explicit-any\n    schema: ${(op as Record<string, unknown>).schemaSrc as string} as any,\n  },`;
    })
    .join("\n");

  return `// GENERATED FILE — do not edit. Regenerate with: npm run generate
import { z } from "zod";

export interface ParamMeta {
  name: string;
  location: "path" | "query" | "body";
  required: boolean;
  description: string;
  type: string;
  deprecated: boolean;
  enumValues?: string[];
  defaultValue?: unknown;
}

export interface RegistryOp {
  id: string;
  domain: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  summary: string;
  description: string;
  deprecated: boolean;
  write: boolean;
  destructive: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any;
  pathParams: string[];
  queryParams: string[];
  bodyParams: string[];
  paramMeta: ParamMeta[];
}

export const DOMAINS = ${JSON.stringify(DOMAINS)} as const;

export const OPERATIONS: RegistryOp[] = [
${entries}
];
`;
}

export function buildRegistry(spec: JsonSchema): { ops: BuiltOp[]; domains: string[]; source: string } {
  const raws = extractOperations(spec);
  const built = raws.map(buildOp);

  // Uniqueness guards — codegen must fail loudly rather than silently drop/rename ops.
  const ids = new Set<string>();
  const byDomainName = new Set<string>();
  for (const op of built) {
    if (ids.has(op.id)) throw new Error(`Duplicate op id: ${op.id}`);
    const dn = `${op.domain}/${op.name}`;
    if (byDomainName.has(dn)) throw new Error(`Duplicate operation name "${op.name}" in domain "${op.domain}" — fix NAME_OVERRIDES`);
    ids.add(op.id);
    byDomainName.add(dn);
  }
  // Override-table hygiene: every override key must exist in the spec.
  const rawIds = new Set(raws.map((r) => r.operationId));
  for (const key of Object.keys(require_overridesKeys())) {
    if (!rawIds.has(key)) throw new Error(`NAME_OVERRIDES key "${key}" does not exist in the spec — remove or fix it`);
  }

  const domains = [...DOMAINS];
  return { ops: built, domains, source: registrySource(built) };
}

// Avoid a runtime import cycle in the generated CLI: read override keys lazily.
function require_overridesKeys(): Record<string, string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return NAME_OVERRIDES;
}

export function main(argv: string[]): void {
  const specPath = argv[2] ?? "spec/contabo-openapi.json";
  const outPath = "src/generated/registry.ts";
  const spec = JSON.parse(readFileSync(specPath, "utf8")) as JsonSchema;
  const { ops, source } = buildRegistry(spec);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, source);
  const reads = ops.filter((o) => !o.write).length;
  console.error(`generated ${outPath}: ${ops.length} operations (${reads} read, ${ops.length - reads} write) across ${DOMAINS.length} domains`);
}

// Run as CLI only (tsx src/codegen/generate.ts <spec>).
if (process.argv[1] && process.argv[1].endsWith("generate.ts")) {
  main(process.argv);
}
```

Then add the import at the top (after other imports):

```ts
import { NAME_OVERRIDES } from "./overrides.js";
```

and replace the `require_overridesKeys()` helper body with `return NAME_OVERRIDES;` (delete the lazy-loader comment lines — keep the function but make it a plain return; simpler: use `NAME_OVERRIDES` directly in the hygiene loop).

**Step 4: Run test to verify it passes**

Run: `npx vitest run test/codegen-generate.test.ts`
Expected: PASS (10 tests). Note: the spec-defaults test (`productId` → "V153", `region` → "EU") verifies body `default` handling; if Contabo's spec uses `$ref`+`default` elsewhere adjust only if the test fails with a clear diff.

**Step 5: Generate the committed registry**

Run: `npm run generate`
Expected (stderr): `generated src/generated/registry.ts: 157 operations (72 read, 85 write) across 14 domains`
(72 GETs / 85 non-GETs per the spec method census.)

**Step 6: Type-check the generated registry**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors. (If zod typing complains about `as any` on schemas, that line already suppresses it.)

**Step 7: Commit**

```bash
git add src/codegen/generate.ts src/generated/registry.ts test/codegen-generate.test.ts
git commit -m "feat: registry codegen — 157 ops into 14 domain tools"
```

---

### Task 6: Client — token manager

**Files:**
- Create: `src/client.ts` (token part; `request` comes in Task 7)
- Test: `test/client-token.test.ts`

**Step 1: Write the failing test**

`test/client-token.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ContaboClient } from "../src/client.js";

const TOKEN_URL = "https://auth.contabo.com/auth/realms/contabo/protocol/openid-connect/token";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

const creds = { clientId: "cid", clientSecret: "csec", apiUser: "u@x.com", apiPassword: "pw" };

describe("ContaboClient token handling", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("posts a password grant and caches the token", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ access_token: "tok1", expires_in: 3600 }));
    const client = new ContaboClient({ ...creds });
    await expect(client.getToken()).resolves.toBe("tok1");
    await expect(client.getToken()).resolves.toBe("tok1"); // cached — no second call
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(TOKEN_URL);
    expect(init.method).toBe("POST");
    const body = init.body as URLSearchParams;
    expect(body.get("grant_type")).toBe("password");
    expect(body.get("client_id")).toBe("cid");
    expect(body.get("username")).toBe("u@x.com");
  });

  it("refreshes proactively shortly before expiry", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ access_token: "tok2", expires_in: 90 }));
    const client = new ContaboClient({ ...creds });
    await client.getToken();
    // expires_in 90s → cache holds for 30s (90 - 60 safety margin); fake time past that:
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 31_000);
    await expect(client.getToken()).resolves.toBe("tok2"); // second fetch
    expect(fetchMock).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it("forces a refresh when requested", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ access_token: "tokA", expires_in: 3600 }));
    const client = new ContaboClient({ ...creds });
    await client.getToken();
    fetchMock.mockResolvedValueOnce(jsonResponse({ access_token: "tokB", expires_in: 3600 }));
    await expect(client.getToken(true)).resolves.toBe("tokB");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("coalesces concurrent token requests", async () => {
    let resolveFirst!: (r: Response) => void;
    fetchMock.mockImplementationOnce(() => new Promise<Response>((res) => { resolveFirst = res; }));
    const client = new ContaboClient({ ...creds });
    const [a, b] = await Promise.all([client.getToken(), client.getToken()]);
    expect(a).toBe("tok1");
    expect(b).toBe("tok1");
    resolveFirst(jsonResponse({ access_token: "tok1", expires_in: 3600 }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("surfaces a credential-oriented error on auth failure", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: "invalid_grant", error_description: "bad password" }, 401));
    const client = new ContaboClient({ ...creds });
    await expect(client.getToken()).rejects.toThrow(/CONTABO_CLIENT_ID.*bad password/s);
  });

  it("honors a custom auth URL", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ access_token: "t", expires_in: 10 }));
    const client = new ContaboClient({ ...creds, authUrl: "http://127.0.0.1:1/token" });
    await client.getToken();
    expect(fetchMock.mock.calls[0][0]).toBe("http://127.0.0.1:1/token");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run test/client-token.test.ts`
Expected: FAIL — module not found.

**Step 3: Write the token part of client.ts**

`src/client.ts`:

```ts
import { randomUUID } from "node:crypto";

export const DEFAULT_BASE_URL = "https://api.contabo.com";
export const DEFAULT_AUTH_URL = "https://auth.contabo.com/auth/realms/contabo/protocol/openid-connect/token";

export interface ContaboClientOptions {
  clientId: string;
  clientSecret: string;
  apiUser: string;
  apiPassword: string;
  baseUrl?: string;
  authUrl?: string;
  timeoutMs?: number;
}

export class ContaboAuthError extends Error {}

export class ContaboApiError extends Error {
  constructor(
    readonly status: number,
    readonly statusText: string,
    readonly requestId: string,
    readonly bodyText: string,
  ) {
    super(`Contabo API ${status} ${statusText}${bodyText ? `: ${bodyText}` : ""} (request-id ${requestId})`);
  }
}

function truncate(text: string, max = 300): string {
  return text.length <= max ? text : `${text.slice(0, max)}…`;
}

function extractMessage(text: string): string {
  try {
    const json = JSON.parse(text) as Record<string, unknown>;
    const msg = json.message ?? json.error_description ?? json.error ?? json.detail;
    return typeof msg === "string" ? msg : truncate(text);
  } catch {
    return truncate(text);
  }
}

export class ContaboClient {
  private token?: { value: string; expiresAt: number };
  private tokenPromise?: Promise<string>;

  constructor(private readonly opts: ContaboClientOptions) {}

  /** Bearer token with proactive refresh 60s before expiry. */
  async getToken(force = false): Promise<string> {
    if (!force && this.token && Date.now() < this.token.expiresAt) return this.token.value;
    if (!force && this.tokenPromise) return this.tokenPromise;
    const request = (async (): Promise<string> => {
      const body = new URLSearchParams({
        grant_type: "password",
        client_id: this.opts.clientId,
        client_secret: this.opts.clientSecret,
        username: this.opts.apiUser,
        password: this.opts.apiPassword,
      });
      let res: Response;
      try {
        res = await fetch(this.opts.authUrl ?? DEFAULT_AUTH_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
          signal: AbortSignal.timeout(this.opts.timeoutMs ?? 30_000),
        });
      } catch (cause) {
        throw new ContaboAuthError(`Could not reach the Contabo auth endpoint: ${(cause as Error).message}`);
      }
      const text = await res.text();
      if (!res.ok) {
        throw new ContaboAuthError(
          `Contabo authentication failed (${res.status}): ${extractMessage(text)}. ` +
            "Check CONTABO_CLIENT_ID, CONTABO_CLIENT_SECRET, CONTABO_API_USER and CONTABO_API_PASSWORD " +
            "(get them at https://my.contabo.com/api/details).",
        );
      }
      const json = JSON.parse(text) as { access_token?: string; expires_in?: number };
      if (!json.access_token) throw new ContaboAuthError("Contabo auth response contained no access_token.");
      const ttlMs = Math.max(0, ((json.expires_in ?? 3600) - 60)) * 1000;
      this.token = { value: json.access_token, expiresAt: Date.now() + ttlMs };
      return json.access_token;
    })();
    this.tokenPromise = request.finally(() => {
      this.tokenPromise = undefined;
    });
    return request;
  }
}
```

Note: the `randomUUID` import is unused until Task 7 — add it in Task 7's edit, or keep it now (remove it now to avoid lint noise; add in Task 7). **Do not import `randomUUID` yet** — Task 7 adds it.

**Step 4: Run test to verify it passes**

Run: `npx vitest run test/client-token.test.ts`
Expected: PASS (6 tests).

**Step 5: Commit**

```bash
git add src/client.ts test/client-token.test.ts
git commit -m "feat: Contabo OAuth2 token manager with caching and refresh"
```

---

### Task 7: Client — request method, headers, envelope, errors, retries

**Files:**
- Modify: `src/client.ts`
- Test: `test/client-request.test.ts`

**Step 1: Write the failing test**

`test/client-request.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ContaboClient, ContaboApiError } from "../src/client.js";

const creds = { clientId: "cid", clientSecret: "csec", apiUser: "u@x.com", apiPassword: "pw" };
const BASE = "https://api.contabo.com";

function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });
}

describe("ContaboClient.request", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let client: ContaboClient;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValueOnce(jsonResponse({ access_token: "tok", expires_in: 3600 })); // token
    client = new ContaboClient({ ...creds });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("sends bearer token, x-request-id UUID and JSON body; unwraps nothing", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: [{ instanceId: 100 }], _pagination: { page: 1 } }));
    const result = (await client.request("GET", "/v1/compute/instances", {
      query: { page: ["2"], orderBy: ["name:asc"] },
    })) as { data: unknown[] };
    expect(result.data).toHaveLength(1);
    const [url, init] = fetchMock.mock.calls[1];
    expect(String(url)).toBe(`${BASE}/v1/compute/instances?page=2&orderBy=name%3Aasc`);
    expect(init.headers.Authorization).toBe("Bearer tok");
    expect(init.headers["x-request-id"]).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(init.body).toBeUndefined();
  });

  it("sends a JSON body with Content-Type for writes", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: [{}] }, 201));
    await client.request("POST", "/v1/object-storages", { body: { displayName: "x" } });
    const [, init] = fetchMock.mock.calls[1];
    expect(init.body).toBe(JSON.stringify({ displayName: "x" }));
    expect(init.headers["Content-Type"]).toBe("application/json");
  });

  it("maps HTTP errors into ContaboApiError with request-id", async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ message: "name in use" }), { status: 409 }));
    const err = await client.request("POST", "/v1/tags", { body: {} }).catch((e) => e);
    expect(err).toBeInstanceOf(ContaboApiError);
    expect(err.status).toBe(409);
    expect(err.message).toContain("Contabo API 409 Conflict");
    expect(err.message).toContain("name in use");
    expect(err.requestId).toMatch(/^[0-9a-f-]{36}$/i);
  });

  it("retries once on 401 with a forced token refresh", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ access_token: "stale", expires_in: 3600 })); // re-token (forced)
    // order: token(tok) already fetched in beforeEach; request #1 gets 401, then token refresh, then retry
    fetchMock.mockReset();
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ access_token: "tok", expires_in: 3600 })) // initial token
      .mockResolvedValueOnce(new Response("", { status: 401 }))
      .mockResolvedValueOnce(jsonResponse({ access_token: "fresh", expires_in: 3600 })) // forced refresh
      .mockResolvedValueOnce(jsonResponse({ data: ["ok"] }));
    client = new ContaboClient({ ...creds });
    const result = (await client.request("GET", "/v1/secrets")) as { data: string[] };
    expect(result.data).toEqual(["ok"]);
    const retryInit = fetchMock.mock.calls[3][1];
    expect(retryInit.headers.Authorization).toBe("Bearer fresh");
  });

  it("retries once on 429 honoring Retry-After", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response("", { status: 429, headers: { "Retry-After": "0" } }))
      .mockResolvedValueOnce(jsonResponse({ data: ["fine"] }));
    const result = (await client.request("GET", "/v1/secrets")) as { data: string[] };
    expect(result.data).toEqual(["fine"]);
    expect(fetchMock).toHaveBeenCalledTimes(3); // token + 2 requests
  });

  it("returns {ok:true} for 204", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 204 }));
    await expect(client.request("DELETE", "/v1/tags/1")).resolves.toEqual({ ok: true });
  });

  it("surfaces non-JSON error bodies truncated", async () => {
    fetchMock.mockResolvedValueOnce(new Response("<html>boom</html>", { status: 500 }));
    const err = await client.request("GET", "/x").catch((e) => e);
    expect(err.message).toContain("500 Internal Server Error");
    expect(err.message).toContain("boom");
  });

  it("uses a custom base URL", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: [] }));
    const custom = new ContaboClient({ ...creds, baseUrl: "http://127.0.0.1:9999" });
    await custom.request("GET", "/v1/me/accounts");
    expect(String(fetchMock.mock.calls[1][0])).toBe("http://127.0.0.1:9999/v1/me/accounts");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run test/client-request.test.ts`
Expected: FAIL — `client.request is not a function`.

**Step 3: Implement request()**

Append to the `ContaboClient` class in `src/client.ts` (and add `import { randomUUID } from "node:crypto";` at the top, replacing the existing unused import if added earlier):

```ts
  /**
   * Executes one Contabo API call. Retries once on 401 (forced token refresh)
   * and once on 429 (honoring Retry-After). Returns the parsed JSON envelope
   * as-is, or `{ ok: true }` for 204 responses.
   */
  async request(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    opts: { query?: Record<string, string[]>; body?: unknown } = {},
  ): Promise<unknown> {
    const base = this.opts.baseUrl ?? DEFAULT_BASE_URL;
    const url = new URL(path, `${base}/`);
    for (const [key, values] of Object.entries(opts.query ?? {})) {
      for (const value of values) url.searchParams.append(key, value);
    }
    const timeoutMs = this.opts.timeoutMs ?? 30_000;

    let forceRefresh = false;
    let authRetried = false;
    let rateRetried = false;

    for (;;) {
      const token = await this.getToken(forceRefresh);
      forceRefresh = false;
      const requestId = randomUUID();
      let res: Response;
      try {
        res = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            "x-request-id": requestId,
            ...(opts.body !== undefined ? { "Content-Type": "application/json" } : {}),
          },
          body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
          signal: AbortSignal.timeout(timeoutMs),
        });
      } catch (cause) {
        if ((cause as Error).name === "TimeoutError") {
          throw new ContaboApiError(0, "Timeout", requestId, `request exceeded ${timeoutMs}ms`);
        }
        throw new ContaboApiError(0, "Network Error", requestId, (cause as Error).message);
      }

      if (res.status === 401 && !authRetried) {
        authRetried = true;
        forceRefresh = true;
        continue;
      }
      if (res.status === 429 && !rateRetried) {
        rateRetried = true;
        const retryAfter = Number(res.headers.get("retry-after")) || 2;
        await new Promise((resolve) => setTimeout(resolve, Math.min(retryAfter, 10) * 1000));
        continue;
      }

      if (res.status === 204) return { ok: true };
      const text = await res.text();
      if (!res.ok) {
        const reason = res.statusText || "Error";
        throw new ContaboApiError(res.status, reason, requestId, extractMessage(text));
      }
      if (!text) return { ok: true };
      try {
        return JSON.parse(text) as unknown;
      } catch {
        return { raw: text };
      }
    }
  }
```

Also confirm the statusText wording test: for 409 the Response's statusText is "Conflict" (Node sets standard reasons). If `statusText` comes back empty in some environments, the test's "409 Conflict" assertion would fail — in that case map common codes via a small record. (Node's undici sets standard statusText values, so it should pass as written.)

**Step 4: Run tests to verify they pass**

Run: `npx vitest run test/client-token.test.ts test/client-request.test.ts`
Expected: PASS (14 tests total).

**Step 5: Commit**

```bash
git add src/client.ts test/client-request.test.ts
git commit -m "feat: ContaboClient.request with auth retry, 429 backoff, envelope and error mapping"
```

---

### Task 8: Domain tools — discriminated unions, write gate, dispatch

**Files:**
- Create: `src/tools.ts`
- Test: `test/tools.test.ts`

**Step 1: Write the failing test**

`test/tools.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";
import { buildDomainTools, type McpTool } from "../src/tools.js";
import { OPERATIONS } from "../src/generated/registry.js";
import type { ContaboClient } from "../src/client.js";

function stubClient() {
  return { request: vi.fn(async () => ({ data: [{ id: 1 }] })) } as unknown as ContaboClient & { request: ReturnType<typeof vi.fn> };
}

const find = (name: string): McpTool => buildDomainTools(stubClient(), { writesEnabled: false }).find((t) => t.name === name)!;

describe("buildDomainTools", () => {
  it("builds one tool per domain plus reference = 15", () => {
    const tools = buildDomainTools(stubClient(), { writesEnabled: false });
    expect(tools.map((t) => t.name)).toEqual([
      "contabo_instances", "contabo_snapshots", "contabo_images", "contabo_objectStorage",
      "contabo_privateNetworks", "contabo_firewalls", "contabo_dns", "contabo_domains",
      "contabo_vips", "contabo_secrets", "contabo_tags", "contabo_users", "contabo_audits",
      "contabo_troubleshooting", "contabo_reference",
    ]);
  });

  it("exposes a JSON-schema inputSchema per tool with anyOf branches", () => {
    const tool = find("contabo_instances");
    const schema = tool.inputSchema as { anyOf?: unknown[] };
    expect(Array.isArray(schema.anyOf)).toBe(true);
    expect(schema.anyOf).toHaveLength(16);
  });

  it("marks read-only tools in annotations", () => {
    expect(find("contabo_snapshots").annotations).toMatchObject({ readOnlyHint: false, destructiveHint: true });
    expect(find("contabo_secrets").annotations).toMatchObject({ readOnlyHint: false });
  });

  it("describes the write gate when writes are disabled", () => {
    expect(find("contabo_instances").description).toContain("CONTABO_ENABLE_WRITES");
  });

  it("dispatches reads to the right method/path with query params", async () => {
    const client = stubClient();
    const tool = buildDomainTools(client, { writesEnabled: false }).find((t) => t.name === "contabo_instances")!;
    const res = await tool.call({ operation: "list", page: 1, size: 10, status: "running" });
    expect(res.isError).toBeUndefined();
    expect(client.request).toHaveBeenCalledWith("GET", "/v1/compute/instances", {
      query: { page: ["1"], size: ["10"], status: ["running"] },
      body: undefined,
    });
  });

  it("substitutes path params and percent-encodes them", async () => {
    const client = stubClient();
    const tool = buildDomainTools(client, { writesEnabled: false }).find((t) => t.name === "contabo_dns")!;
    await tool.call({ operation: "getZone", zoneName: "example.com" });
    expect(client.request).toHaveBeenCalledWith("GET", "/v1/dns/zones/example.com", { query: {}, body: undefined });
  });

  it("blocks writes before any HTTP call when disabled", async () => {
    const client = stubClient();
    const tool = buildDomainTools(client, { writesEnabled: false }).find((t) => t.name === "contabo_instances")!;
    const res = await tool.call({ operation: "start", instanceId: 100 });
    expect(res.isError).toBe(true);
    expect(JSON.parse(res.content[0].text)).toContain("CONTABO_ENABLE_WRITES");
    expect(client.request).not.toHaveBeenCalled();
  });

  it("allows writes and sends a body when enabled", async () => {
    const client = stubClient();
    const tool = buildDomainTools(client, { writesEnabled: true }).find((t) => t.name === "contabo_objectStorage")!;
    const res = await tool.call({ operation: "create", displayName: "s1", disk: 100, region: "EU" });
    expect(res.isError).toBeUndefined();
    expect(client.request).toHaveBeenCalledWith("POST", "/v1/object-storages", {
      query: {},
      body: expect.objectContaining({ displayName: "s1" }),
    });
  });

  it("sends an empty JSON object for write ops without body params", async () => {
    const client = stubClient();
    const tool = buildDomainTools(client, { writesEnabled: true }).find((t) => t.name === "contabo_instances")!;
    await tool.call({ operation: "start", instanceId: 100 });
    expect(client.request).toHaveBeenCalledWith("POST", "/v1/compute/instances/100/actions/start", {
      query: {}, body: {},
    });
  });

  it("returns validation errors listing the issues", async () => {
    const tool = find("contabo_instances");
    const res = await tool.call({ operation: "get" }); // missing instanceId
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toContain("instanceId");
  });

  it("surfaces ContaboApiError messages as isError results", async () => {
    const client = {
      request: vi.fn(async () => {
        const e = new Error("Contabo API 409 Conflict: name in use (request-id abc)");
        Object.assign(e, { status: 409 });
        throw e;
      }),
    } as unknown as ContaboClient;
    const tool = buildDomainTools(client, { writesEnabled: true }).find((t) => t.name === "contabo_tags")!;
    const res = await tool.call({ operation: "create", name: "x" });
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toContain("409");
  });
});
```

Note: the `create` object-storage body fields (`displayName`, `disk`, `region`) must match the real spec's `createObjectStorage` body — before finalizing this test, check `OPERATIONS` (or the spec) for actual property names and adjust the arguments. The intent is: a valid `create` call passes validation.

**Step 2: Run test to verify it fails**

Run: `npx vitest run test/tools.test.ts`
Expected: FAIL — module not found.

**Step 3: Implement tools.ts**

`src/tools.ts`:

```ts
import { z } from "zod";
import { DOMAINS, OPERATIONS, type RegistryOp } from "./generated/registry.js";
import { buildReferenceTool, type McpTool } from "./reference.js";
import { ContaboApiError } from "./client.js";

export type {
  McpTool,
};

export interface ToolCallResult {
  content: { type: "text"; text: string }[];
  isError?: boolean;
}

const DOMAIN_LABELS: Record<string, string> = {
  instances: "Contabo compute instances (VPS/VDS)",
  snapshots: "Contabo instance snapshots",
  images: "Contabo standard and custom images",
  objectStorage: "Contabo S3-compatible object storages and data centers",
  privateNetworks: "Contabo private networks (VPC)",
  firewalls: "Contabo firewalls and their rules",
  dns: "Contabo DNS zones, records and PTR records",
  domains: "Contabo domains and contact handles",
  vips: "Contabo virtual IPs (VIP)",
  secrets: "Contabo secrets (SSH keys, passwords)",
  tags: "Contabo tags and tag assignments",
  users: "Contabo users, roles, accounts and object-storage credentials",
  audits: "Contabo audit logs for every resource type",
  troubleshooting: "Contabo troubleshooting checks, check collections and remedies",
};

function ok(result: unknown): ToolCallResult {
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
}

function err(message: string): ToolCallResult {
  return { content: [{ type: "text", text: message }], isError: true };
}

function formatIssues(error: z.ZodError): string {
  const lines = error.issues.map((issue) => {
    const path = issue.path.length ? issue.path.join(".") : "(root)";
    return `- ${path}: ${issue.message}`;
  });
  return `Invalid arguments:\n${lines.join("\n")}`;
}

function describeDomain(domain: string, ops: RegistryOp[], writesEnabled: boolean): string {
  const lines = ops.map(
    (op) =>
      `- ${op.name}: ${op.summary}${op.deprecated ? " (DEPRECATED)" : ""}${op.destructive ? " [DESTRUCTIVE]" : ""}`,
  );
  const gate = writesEnabled
    ? "This server allows write operations."
    : "This server runs READ-ONLY: write operations are rejected until it is started with CONTABO_ENABLE_WRITES=1.";
  return [
    `${DOMAIN_LABELS[domain] ?? domain}. Choose exactly one 'operation'; every operation has its own parameter set (validated per operation).`,
    gate,
    `Operations:\n${lines.join("\n")}`,
    "Use the contabo_reference tool for full parameter documentation of any operation.",
  ].join("\n\n");
}

function buildDomainTool(
  domain: string,
  client: Pick<ContaboClient, "request">,
  writesEnabled: boolean,
): McpTool {
  const ops = OPERATIONS.filter((op) => op.domain === domain);
  const byName = new Map(ops.map((op) => [op.name, op]));
  const union = z.discriminatedUnion(
    "operation",
    ops.map((op) => op.schema),
  );
  const hasWrites = ops.some((op) => op.write);
  const hasDestructive = ops.some((op) => op.destructive);

  return {
    name: `contabo_${domain}`,
    description: describeDomain(domain, ops, writesEnabled),
    inputSchema: z.toJSONSchema(union, { target: "draft-7", io: "input" }),
    annotations: {
      ...(hasWrites ? { readOnlyHint: false } : { readOnlyHint: true }),
      ...(hasDestructive ? { destructiveHint: true } : {}),
    },
    async call(rawArgs: unknown): Promise<ToolCallResult> {
      const parsed = union.safeParse(rawArgs ?? {});
      if (!parsed.success) return err(formatIssues(parsed.error));
      const args = parsed.data as Record<string, unknown>;
      const op = byName.get(String(args.operation))!;

      if (op.write && !writesEnabled) {
        return err(
          `Operation '${op.id}' is a write operation (${op.method} ${op.path}) but this server is running ` +
            "read-only. Restart the server with CONTABO_ENABLE_WRITES=1 to allow write operations.",
        );
      }

      const path = op.path.replace(/\{(\w+)\}/g, (_, key: string) => encodeURIComponent(String(args[key])));
      const query: Record<string, string[]> = {};
      for (const key of op.queryParams) {
        const value = args[key];
        if (value === undefined) continue;
        query[key] = Array.isArray(value) ? value.map(String) : [String(value)];
      }
      const body = op.method === "GET" ? undefined : pickDefined(args, op.bodyParams);

      try {
        return ok(await client.request(op.method, path, { query, body }));
      } catch (cause) {
        if (cause instanceof ContaboApiError) return err(cause.message);
        return err(cause instanceof Error ? cause.message : String(cause));
      }
    },
  };
}

function pickDefined(args: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    if (args[key] !== undefined) out[key] = args[key];
  }
  return out;
}

export function buildDomainTools(
  client: Pick<ContaboClient, "request">,
  opts: { writesEnabled: boolean },
): McpTool[] {
  const domainTools = DOMAINS.map((domain) => buildDomainTool(domain, client, opts.writesEnabled));
  return [...domainTools, buildReferenceTool()];
}
```

(`McpTool` interface comes from `reference.ts`, created next in Task 9 — to keep Task 8 self-contained, define the interface **in a new tiny module** `src/tool-types.ts` instead, and have both tools.ts and reference.ts import from it:

`src/tool-types.ts`:

```ts
export interface McpTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: Record<string, boolean>;
  call(args: unknown): Promise<{ content: { type: "text"; text: string }[]; isError?: boolean }>;
}
```

Adjust imports accordingly: tools.ts imports `type McpTool` from `./tool-types.js` and `buildReferenceTool` from `./reference.js` — so Task 8 must also create a **stub** reference.ts that Task 9 fills in:

`src/reference.ts` (stub for now):

```ts
import type { McpTool } from "./tool-types.js";

export function buildReferenceTool(): McpTool {
  return {
    name: "contabo_reference",
    description: "Placeholder — replaced in Task 9.",
    inputSchema: { type: "object" },
    annotations: { readOnlyHint: true },
    async call() {
      return { content: [{ type: "text", text: "not implemented" }], isError: true };
    },
  };
}
```

)

**Step 4: Run test to verify it passes**

Run: `npx vitest run test/tools.test.ts`
Expected: PASS (11 tests). If the `create` object-storage body-args assertion fails, fix the test's field names to match the real `createObjectStorage` body schema from `spec/contabo-openapi.json` (do not weaken the assertion — match reality).

**Step 5: Commit**

```bash
git add src/tool-types.ts src/reference.ts src/tools.ts test/tools.test.ts
git commit -m "feat: 14 domain tools with per-operation validation and write gate"
```

---

### Task 9: Reference tool

**Files:**
- Modify: `src/reference.ts` (replace stub)
- Test: `test/reference.test.ts`

**Step 1: Write the failing test**

`test/reference.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildReferenceTool } from "../src/reference.js";

const tool = buildReferenceTool();

describe("contabo_reference", () => {
  it("lists operations of a domain", async () => {
    const res = await tool.call({ domain: "snapshots" });
    expect(res.isError).toBeUndefined();
    const text = res.content[0].text;
    expect(text).toContain("list");
    expect(text).toContain("createSnapshot");
    expect(text).toContain("POST");
  });

  it("documents one operation in full", async () => {
    const res = await tool.call({ domain: "instances", operation: "create" });
    const text = res.content[0].text;
    expect(text).toContain("POST /v1/compute/instances");
    expect(text).toContain("period");
    expect(text).toContain("required");
    expect(text).toContain("inputSchema");
  });

  it("rejects unknown operations with the available list", async () => {
    const res = await tool.call({ domain: "instances", operation: "explode" });
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toContain("Unknown operation 'explode'");
    expect(res.content[0].text).toContain("start");
  });

  it("rejects unknown domains", async () => {
    const res = await tool.call({ domain: "nonsense" as never });
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toContain("Invalid arguments");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run test/reference.test.ts`
Expected: FAIL — stub returns "not implemented".

**Step 3: Implement reference.ts (replace stub)**

`src/reference.ts`:

```ts
import { z } from "zod";
import { DOMAINS, OPERATIONS, type RegistryOp } from "./generated/registry.js";
import type { McpTool } from "./tool-types.js";

const LOCATION_ORDER = { path: 0, query: 1, body: 2 } as const;

function formatOp(op: RegistryOp, full: boolean): string {
  const head = [
    `### ${op.id}`,
    `${op.method} ${op.path}`,
    op.summary,
    op.deprecated ? "**DEPRECATED** — avoid using this operation." : "",
    op.destructive ? "**DESTRUCTIVE** — this operation cancels, deletes, revokes or resets something." : "",
  ]
    .filter(Boolean)
    .join("\n");

  if (!full) return head;

  const params = [...op.paramMeta].sort((a, b) => LOCATION_ORDER[a.location] - LOCATION_ORDER[b.location] || a.name.localeCompare(b.name));
  const paramLines = params.map(
    (p) =>
      `- \`${p.name}\` (${p.location}${p.required ? ", required" : ""}, ${p.type})` +
      (p.enumValues ? ` one of: ${p.enumValues.join(" | ")}` : "") +
      (p.defaultValue !== undefined ? ` default: ${JSON.stringify(p.defaultValue)}` : "") +
      (p.description ? ` — ${p.description}` : ""),
  );

  return [
    head,
    paramLines.length ? `Parameters:\n${paramLines.join("\n")}` : "Parameters: none",
    `inputSchema:\n\`\`\`json\n${JSON.stringify(z.toJSONSchema(op.schema, { target: "draft-7", io: "input" }), null, 2)}\n\`\`\
```
,
  ].join("\n\n");
}

export function buildReferenceTool(): McpTool {
  const domainEnum = z.enum(DOMAINS as unknown as [string, ...string[]]);
  const schema = z.strictObject({
    domain: domainEnum.describe("Contabo domain to document"),
    operation: z.string().optional().describe(
      "Specific operation within the domain. Omit to list all operations of the domain.",
    ),
  });

  return {
    name: "contabo_reference",
    description:
      "Documentation for every Contabo MCP operation. Pass a domain to list its operations; " +
      "pass domain + operation to get full parameter documentation (types, required fields, enums, defaults, " +
      "descriptions and the exact input JSON Schema).",
    inputSchema: z.toJSONSchema(schema, { target: "draft-7", io: "input" }),
    annotations: { readOnlyHint: true },
    async call(rawArgs: unknown) {
      const parsed = schema.safeParse(rawArgs ?? {});
      if (!parsed.success) {
        const lines = parsed.error.issues.map((i) =>
```
- ${i.path.join(".") || "(root)"}: ${i.message}`);
        return { content: [{ type: "text", text: `Invalid arguments:\n${lines.join("\n")}` }], isError: true };
      }
      const { domain, operation } = parsed.data;
      const ops = OPERATIONS.filter((op) => op.domain === domain);
      if (operation) {
        const op = ops.find((o) => o.name === operation);
        if (!op) {
          const available = ops.map((o) => o.name).join(", ");
          return {
            content: [{ type: "text", text: `Unknown operation '${operation}' in domain '${domain}'. Available: ${available}` }],
            isError: true,
          };
        }
        return { content: [{ type: "text", text: formatOp(op, true) }] };
      }
      const body = ops
        .map((op) => {
          const flags = [op.write ? "write" : "read", op.destructive ? "DESTRUCTIVE" : "", op.deprecated ? "deprecated" : ""]
            .filter(Boolean)
            .join(", ");
          return `- ${op.name} (${flags}): ${op.summary}`;
        })
        .join("\n");
      return {
        content: [{ type: "text", text: `Contabo domain '${domain}' — ${ops.length} operations.\n\n${body}\n\nCall again with { domain, operation } for full parameter docs.` }],
      };
    },
  };
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run test/reference.test.ts`
Expected: PASS (4 tests).

**Step 5: Commit**

```bash
git add src/reference.ts test/reference.test.ts
git commit -m "feat: contabo_reference tool exposing full per-operation docs"
```

---

### Task 10: Server entry point + E2E over stdio

**Files:**
- Create: `src/index.ts`
- Test: `test/e2e.test.ts`

**Step 1: Write the failing test**

`test/e2e.test.ts`:

```ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createServer, type Server as HttpServer, type IncomingMessage, type ServerResponse } from "node:http";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

let httpServer: HttpServer;
let baseUrl = "";
const seen: { auth?: string; requestId?: string; url?: string; method?: string }[] = [];

beforeAll(async () => {
  httpServer = createServer((req: IncomingMessage, res: ServerResponse) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      seen.push({
        auth: req.headers.authorization,
        requestId: req.headers["x-request-id"] as string,
        url: req.url,
        method: req.method,
      });
      const send = (status: number, payload: unknown) => {
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(payload));
      };
      if (req.url === "/token") return send(200, { access_token: "e2e-token", expires_in: 3600 });
      if (req.url === "/v1/compute/instances") return send(200, { data: [{ instanceId: 100, status: "running" }], _pagination: { page: 1, totalPages: 1, totalElements: 1, size: 10 } });
      if (req.url === "/v1/object-storages" && req.method === "POST") return send(201, { data: [{ objectStorageId: 7 }] });
      return send(404, { message: `no route for ${req.method} ${req.url}` });
    });
  });
  await new Promise<void>((resolve) => httpServer.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${(httpServer.address() as { port: number }).port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => httpServer.close(() => resolve()));
});

async function connectClient(writes: string | undefined) {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ["dist/index.js"],
    env: {
      ...(Object.fromEntries(Object.entries(process.env).filter(([, v]) => v !== undefined)) as Record<string, string>),
      CONTABO_API_BASE_URL: baseUrl,
      CONTABO_AUTH_URL: `${baseUrl}/token`,
      ...(writes ? { CONTABO_ENABLE_WRITES: writes } : {}),
    },
  });
  const client = new Client({ name: "e2e", version: "0.0.0" });
  await client.connect(transport);
  return client;
}

describe("contabo-mcp end-to-end (stdio + mock API)", () => {
  it("exposes 15 tools and reads instances through the mock API", async () => {
    const client = await connectClient(undefined);
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name)).toContain("contabo_instances");
    expect(tools).toHaveLength(15);

    const result = await client.callTool({ name: "contabo_instances", arguments: { operation: "list", page: 1 } });
    expect(result.isError).toBeUndefined();
    const payload = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(payload.data[0].instanceId).toBe(100);

    const instanceCall = seen.find((s) => s.url === "/v1/compute/instances");
    expect(instanceCall?.auth).toBe("Bearer e2e-token");
    expect(instanceCall?.requestId).toMatch(/^[0-9a-f-]{36}$/i);
    await client.close();
  }, 30_000);

  it("blocks writes when CONTABO_ENABLE_WRITES is unset", async () => {
    const client = await connectClient(undefined);
    const result = await client.callTool({ name: "contabo_objectStorage", arguments: { operation: "create", disk: 100 } });
    expect(result.isError).toBe(true);
    expect(((result.content as { text: string }[])[0].text)).toContain("CONTABO_ENABLE_WRITES");
    expect(seen.some((s) => s.url === "/v1/object-storages" && s.method === "POST")).toBe(false);
    await client.close();
  }, 30_000);

  it("performs a write when CONTABO_ENABLE_WRITES=1", async () => {
    const client = await connectClient("1");
    const result = await client.callTool({
      name: "contabo_objectStorage",
      arguments: { operation: "create", disk: 100, region: "EU" },
    });
    expect(result.isError).toBeUndefined();
    const payload = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(payload.data[0].objectStorageId).toBe(7);
    await client.close();
  }, 30_000);
});
```

(As in Task 8: before finalizing, check the real `createObjectStorage` body field names in the spec and adjust the arguments so the call validates.)

**Step 2: Run test to verify it fails**

Run: `npm run build && npx vitest run test/e2e.test.ts`
Expected: FAIL — `dist/index.js` does not exist (build fails on missing src/index.ts; if build succeeds because index.ts absent from include, vitest spawn fails with module-not-found).

**Step 3: Implement index.ts**

`src/index.ts`:

```ts
#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { ContaboClient } from "./client.js";
import { buildDomainTools } from "./tools.js";
import type { McpTool } from "./tool-types.js";

const VERSION = "0.1.0";

const log = (...parts: unknown[]): void => {
  console.error("[contabo-mcp]", ...parts);
};

async function main(): Promise<void> {
  const config = loadConfig();
  const client = new ContaboClient({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    apiUser: config.apiUser,
    apiPassword: config.apiPassword,
    baseUrl: config.baseUrl,
    authUrl: config.authUrl,
    timeoutMs: config.timeoutMs,
  });

  const tools: McpTool[] = buildDomainTools(client, { writesEnabled: config.writesEnabled });

  const server = new Server({ name: "contabo-mcp", version: VERSION }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
      annotations: tool.annotations,
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = tools.find((t) => t.name === request.params.name);
    if (!tool) {
      return { content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }], isError: true };
    }
    try {
      return await tool.call(request.params.arguments);
    } catch (cause) {
      // Tool call handlers normally return isError results themselves; this is a last resort.
      const message = cause instanceof Error ? cause.message : String(cause);
      log("tool call crashed:", message);
      return { content: [{ type: "text", text: message }], isError: true };
    }
  });

  await server.connect(new StdioServerTransport());
  log(`ready: ${tools.length} tools, writes ${config.writesEnabled ? "ENABLED" : "disabled (set CONTABO_ENABLE_WRITES=1)"}`);
}

main().catch((error: unknown) => {
  log("fatal:", error instanceof Error ? error.stack ?? error.message : String(error));
  process.exit(1);
});
```

**Step 4: Run E2E to verify it passes**

Run: `npm run build && npx vitest run test/e2e.test.ts`
Expected: PASS (3 tests). The MCP handshake over stdio exercises `initialize`, `tools/list`, `tools/call`.

**Step 5: Run the whole suite**

Run: `npm test`
Expected: all test files PASS.

**Step 6: Commit**

```bash
git add src/index.ts test/e2e.test.ts
git commit -m "feat: stdio MCP server entry point with end-to-end coverage"
```

---

### Task 11: README, final verification

**Files:**
- Create: `README.md`

**Step 1: Write README.md**

```markdown
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

### OpenAI Agents SDK (Python)

```python
from agents import Agent, MCPServerStdio

mcp = MCPServerStdio(
    command="npx",
    args=["-y", "contabo-mcp"],
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
      "args": ["-y", "contabo-mcp"],
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
```

**Step 2: Full verification**

Run: `npm test && npm run build`
Expected: all tests pass; build emits `dist/` with no type errors.

Run: `node dist/index.js --help` — not supported by design (no CLI flags); instead verify the server starts and waits on stdio:
Run: `echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"0"}}}' | timeout 5 node dist/index.js | head -c 200`
Expected: a JSON-RPC `initialize` response containing `"serverInfo"` with name `contabo-mcp` (then the process is killed by timeout — that's fine).

**Step 3: Commit**

```bash
git add README.md
git commit -m "docs: README with setup, agent config snippets and safety notes"
```

---

## Verification checklist (final)

- [ ] `npm test` green: config, codegen (extract/emit/generate), client token+request, tools, reference, E2E
- [ ] `src/generated/registry.ts` contains exactly 157 `id:` entries; `grep -c 'id: "' src/generated/registry.ts` → 157
- [ ] `tools/list` returns exactly 15 tools (verified in E2E)
- [ ] Write gate: write call without env flag returns isError naming `CONTABO_ENABLE_WRITES` (verified in E2E)
- [ ] `x-request-id` UUID4 present on every API request (verified in E2E + unit)
- [ ] `npm run build` clean; `bin: contabo-mcp` works via `node dist/index.js`
