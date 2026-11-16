import type { RegistryOp } from "../generated/registry";

export class DomainDescriptionBuilder {
  private static readonly DOMAIN_LABELS: Readonly<Record<string, string>> = {
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

  public build(domain: string, ops: RegistryOp[], writesEnabled: boolean): string {
    const lines = ops.map(
      (op) =>
        `- ${op.name}: ${op.summary}${op.deprecated ? " (DEPRECATED)" : ""}${op.destructive ? " [DESTRUCTIVE]" : ""}`,
    );

    const writeGateMessage = writesEnabled
      ? "This server allows write operations."
      : "This server runs READ-ONLY: write operations are rejected until it is started with CONTABO_ENABLE_WRITES=1.";

    return [
      `${DomainDescriptionBuilder.DOMAIN_LABELS[domain] ?? domain}. Choose exactly one 'operation'; every operation has its own parameter set (validated per operation).`,
      writeGateMessage,
      `Operations:\n${lines.join("\n")}`,
      "Use the contabo_reference tool for full parameter documentation of any operation.",
    ].join("\n\n");
  }
}
