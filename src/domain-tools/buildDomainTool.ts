import { z } from "zod";
import type { ContaboClient } from "../client";
import { ContaboApiError } from "../client";
import type { RegistryOp } from "../generated/registry";
import type { McpTool } from "../tool-types";
import { DomainDescriptionBuilder } from "./domainDescription";
import { RequestShapeBuilder } from "./requestShape";
import { ToolCallResultFactory, type ToolCallResult } from "./result";

/**
 * Zod discriminated-union tuple type requiring at least one operation schema.
 *
 * @internal
 */
type DiscriminatedOps = [z.core.$ZodTypeDiscriminable, ...z.core.$ZodTypeDiscriminable[]];

/**
 * Dependencies used by {@link DomainToolFactory}.
 *
 * @internal
 */
interface DomainToolFactoryDependencies {
  readonly descriptionBuilder: DomainDescriptionBuilder;
  readonly requestShapeBuilder: RequestShapeBuilder;
  readonly resultFactory: ToolCallResultFactory;
}

/**
 * Factory that builds one MCP domain tool for a given domain operation set.
 *
 * @public
 */
export class DomainToolFactory {
  private readonly descriptionBuilder: DomainDescriptionBuilder;
  private readonly requestShapeBuilder: RequestShapeBuilder;
  private readonly resultFactory: ToolCallResultFactory;

  /**
   * @param dependencies - Optional dependency overrides for testing/composition.
   */
  public constructor(dependencies?: Partial<DomainToolFactoryDependencies>) {
    this.descriptionBuilder = dependencies?.descriptionBuilder ?? new DomainDescriptionBuilder();
    this.requestShapeBuilder = dependencies?.requestShapeBuilder ?? new RequestShapeBuilder();
    this.resultFactory = dependencies?.resultFactory ?? new ToolCallResultFactory();
  }

  /**
   * Creates a domain MCP tool.
   *
   * @param domain - Domain identifier (for example `instances`, `dns`).
   * @param ops - Domain operations from the generated registry.
   * @param client - Contabo client request capability.
   * @param writesEnabled - Whether mutating operations are allowed.
   * @returns MCP tool implementation for the domain.
   */
  public create(
    domain: string,
    ops: RegistryOp[],
    client: Pick<ContaboClient, "request">,
    writesEnabled: boolean,
  ): McpTool {
    return new DomainTool(
      domain,
      ops,
      client,
      writesEnabled,
      this.descriptionBuilder,
      this.requestShapeBuilder,
      this.resultFactory,
    );
  }
}

class DomainTool implements McpTool {
  private readonly byName: ReadonlyMap<string, RegistryOp>;
  private readonly union: z.ZodType;

  public readonly name: string;
  public readonly description: string;
  public readonly inputSchema: Record<string, unknown>;
  public readonly annotations: Record<string, boolean>;

  /**
   * @param domain - Domain identifier.
   * @param ops - Operations belonging to the domain.
   * @param client - Request-capable client.
   * @param writesEnabled - Whether write operations are allowed.
   * @param descriptionBuilder - Domain description formatter.
   * @param requestShapeBuilder - Request path/query/body builder.
   * @param resultFactory - Tool result formatter.
   */
  public constructor(
    private readonly domain: string,
    private readonly ops: RegistryOp[],
    private readonly client: Pick<ContaboClient, "request">,
    private readonly writesEnabled: boolean,
    private readonly descriptionBuilder: DomainDescriptionBuilder,
    private readonly requestShapeBuilder: RequestShapeBuilder,
    private readonly resultFactory: ToolCallResultFactory,
  ) {
    this.byName = new Map(ops.map((op) => [op.name, op]));
    this.union = z.discriminatedUnion(
      "operation",
      ops.map((op) => op.schema) as unknown as DiscriminatedOps,
    );

    this.name = `contabo_${domain}`;
    this.description = descriptionBuilder.build(domain, ops, writesEnabled);
    this.inputSchema = this.buildInputSchema(this.union);
    this.annotations = this.buildAnnotations(ops);
  }

  /**
   * Executes a domain tool request.
   *
   * @param rawArgs - Raw MCP tool arguments.
   * @returns Success or error response in MCP tool-call format.
   */
  public async call(rawArgs: unknown): Promise<ToolCallResult> {
    const parsed = this.union.safeParse(rawArgs ?? {});
    if (!parsed.success) {
      return this.resultFactory.invalidArguments(parsed.error);
    }

    const args = parsed.data as Record<string, unknown>;
    const op = this.byName.get(String(args.operation));
    if (!op) {
      return this.resultFactory.failure(`Unknown operation: ${String(args.operation)}`);
    }

    if (op.write && !this.writesEnabled) {
      return this.resultFactory.failure(this.writeDisabledMessage(op));
    }

    const path = this.requestShapeBuilder.buildPath(op.path, args);
    const query = this.requestShapeBuilder.buildQuery(op.queryParams, args);
    const body = this.getBody(op, args);

    try {
      return this.resultFactory.success(
        await this.client.request(op.method, path, { query, body }),
      );
    } catch (cause) {
      if (cause instanceof ContaboApiError) {
        return this.resultFactory.failure(cause.message);
      }
      return this.resultFactory.failure(cause instanceof Error ? cause.message : String(cause));
    }
  }

  /**
   * Builds MCP-compatible input schema with an explicit object root.
   *
   * @param union - Discriminated operation schema.
   * @returns JSON Schema object for MCP tool metadata.
   */
  private buildInputSchema(union: z.ZodType): Record<string, unknown> {
    return {
      type: "object",
      ...z.toJSONSchema(union, { target: "draft-7", io: "input" }),
    } as Record<string, unknown>;
  }

  /**
   * Derives MCP tool annotations from operation properties.
   *
   * @param ops - Domain operations.
   * @returns Annotations map understood by MCP clients.
   */
  private buildAnnotations(ops: RegistryOp[]): Record<string, boolean> {
    const hasWrites = ops.some((op) => op.write);
    const hasDestructive = ops.some((op) => op.destructive);
    return {
      ...(hasWrites ? { readOnlyHint: false } : { readOnlyHint: true }),
      ...(hasDestructive ? { destructiveHint: true } : {}),
    };
  }

  /**
   * Extracts request body arguments for non-GET operations.
   *
   * @param op - Target operation.
   * @param args - Parsed request arguments.
   * @returns Request body object or `undefined` for GET requests.
   */
  private getBody(
    op: RegistryOp,
    args: Record<string, unknown>,
  ): Record<string, unknown> | undefined {
    if (op.method === "GET") {
      return undefined;
    }
    return this.requestShapeBuilder.pickDefined(args, op.bodyParams);
  }

  /**
   * Produces a standardized write-disabled error message.
   *
   * @param op - Operation that was blocked.
   * @returns User-facing guidance for enabling writes.
   */
  private writeDisabledMessage(op: RegistryOp): string {
    return (
      `Operation '${op.id}' is a write operation (${op.method} ${op.path}) but this server is running ` +
      "read-only. Restart the server with CONTABO_ENABLE_WRITES=1 to allow write operations."
    );
  }
}
