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
