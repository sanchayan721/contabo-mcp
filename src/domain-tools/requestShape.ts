import type { RegistryOp } from "../generated/registry";

export class RequestShapeBuilder {
  public pickDefined(args: Record<string, unknown>, keys: string[]): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const key of keys) {
      if (args[key] !== undefined) {
        out[key] = args[key];
      }
    }
    return out;
  }

  public buildPath(pathTemplate: string, args: Record<string, unknown>): string {
    return pathTemplate.replace(/\{(\w+)\}/g, (_, key: string) =>
      encodeURIComponent(String(args[key])),
    );
  }

  public buildQuery(
    queryParams: RegistryOp["queryParams"],
    args: Record<string, unknown>,
  ): Record<string, string[]> {
    const query: Record<string, string[]> = {};
    for (const key of queryParams) {
      const value = args[key];
      if (value === undefined) {
        continue;
      }
      query[key] = Array.isArray(value) ? value.map(String) : [String(value)];
    }
    return query;
  }
}
