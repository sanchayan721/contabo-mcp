// GENERATED FILE — do not edit. Regenerate with: npm run generate
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

export const DOMAINS = ["instances","snapshots","images","objectStorage","privateNetworks","firewalls","dns","domains","vips","secrets","tags","users","audits","troubleshooting"] as const;

export const OPERATIONS: RegistryOp[] = [
  {
    ...{
      "id": "tags_list",
      "domain": "tags",
      "name": "list",
      "method": "GET",
      "path": "/v1/tags",
      "summary": "List tags",
      "description": "List and filter all tags in your account",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "name"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "query",
          "required": false,
          "description": "Filter as substring match for tag names. Tags may contain letters, numbers, colons, dashes, and underscores. There is a limit of 255 characters per tag.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("list"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "name": z.string().optional().describe("Filter as substring match for tag names. Tags may contain letters, numbers, colons, dashes, and underscores. There is a limit of 255 characters per tag.") }) as any,
  },
  {
    ...{
      "id": "tags_create",
      "domain": "tags",
      "name": "create",
      "method": "POST",
      "path": "/v1/tags",
      "summary": "Create a new tag",
      "description": "Create a new tag in your account with attribute name and optional attribute color.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [
        "name",
        "color",
        "description"
      ],
      "paramMeta": [
        {
          "name": "name",
          "location": "body",
          "required": true,
          "description": "The name of the tag. Tags may contain letters, numbers, colons, dashes, and underscores. There is a limit of 255 characters per tag.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "color",
          "location": "body",
          "required": true,
          "description": "The color of the tag. Color can be specified using hexadecimal value. Default color is #0A78C3",
          "type": "string",
          "deprecated": false,
          "defaultValue": "#0A78C3"
        },
        {
          "name": "description",
          "location": "body",
          "required": false,
          "description": "The description of the Tag name. ",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("create"), "name": z.string().min(1).max(255).describe("The name of the tag. Tags may contain letters, numbers, colons, dashes, and underscores. There is a limit of 255 characters per tag."), "color": z.string().min(4).max(7).default("#0A78C3").describe("The color of the tag. Color can be specified using hexadecimal value. Default color is #0A78C3"), "description": z.string().describe("The description of the Tag name. ").optional() }) as any,
  },
  {
    ...{
      "id": "tags_get",
      "domain": "tags",
      "name": "get",
      "method": "GET",
      "path": "/v1/tags/{tagId}",
      "summary": "Get specific tag by id",
      "description": "Get attributes values to a specific tag on your account.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "tagId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "tagId",
          "location": "path",
          "required": true,
          "description": "The identifier of the tag",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("get"), "tagId": z.number().int().describe("The identifier of the tag") }) as any,
  },
  {
    ...{
      "id": "tags_update",
      "domain": "tags",
      "name": "update",
      "method": "PATCH",
      "path": "/v1/tags/{tagId}",
      "summary": "Update specific tag by id",
      "description": "Update attributes to your tag. Attributes are optional. If not set, the attributes will retain their original values.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "tagId"
      ],
      "queryParams": [],
      "bodyParams": [
        "name",
        "color",
        "description"
      ],
      "paramMeta": [
        {
          "name": "tagId",
          "location": "path",
          "required": true,
          "description": "The identifier of the tag",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "body",
          "required": false,
          "description": "The name of the tag. Tags may contain letters, numbers, colons, dashes, and underscores. There is a limit of 255 characters per tag.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "color",
          "location": "body",
          "required": false,
          "description": "The color of the tag. Color can be specified using hexadecimal value. Default color is #0A78C3",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "description",
          "location": "body",
          "required": false,
          "description": "The description of the Tag name. ",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("update"), "tagId": z.number().int().describe("The identifier of the tag"), "name": z.string().min(1).max(255).describe("The name of the tag. Tags may contain letters, numbers, colons, dashes, and underscores. There is a limit of 255 characters per tag.").optional(), "color": z.string().min(4).max(7).describe("The color of the tag. Color can be specified using hexadecimal value. Default color is #0A78C3").optional(), "description": z.string().describe("The description of the Tag name. ").optional() }) as any,
  },
  {
    ...{
      "id": "tags_delete",
      "domain": "tags",
      "name": "delete",
      "method": "DELETE",
      "path": "/v1/tags/{tagId}",
      "summary": "Delete existing tag by id",
      "description": "Your tag can be deleted if it is not assigned to any resource on your account. Check tag assigments before deleting tag.",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "tagId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "tagId",
          "location": "path",
          "required": true,
          "description": "The identifier of the tag",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("delete"), "tagId": z.number().int().describe("The identifier of the tag") }) as any,
  },
  {
    ...{
      "id": "tags_listAssignments",
      "domain": "tags",
      "name": "listAssignments",
      "method": "GET",
      "path": "/v1/tags/{tagId}/assignments",
      "summary": "List tag assignments",
      "description": "List and filter all existing assignments for a tag in your account",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "tagId"
      ],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "resourceType"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "tagId",
          "location": "path",
          "required": true,
          "description": "The identifier of the tag.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "resourceType",
          "location": "query",
          "required": false,
          "description": "Filter as substring match for assignment resource type. Resource type is one of `instance|image|object-storage`.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("listAssignments"), "tagId": z.number().int().describe("The identifier of the tag."), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "resourceType": z.string().optional().describe("Filter as substring match for assignment resource type. Resource type is one of `instance|image|object-storage`.") }) as any,
  },
  {
    ...{
      "id": "tags_getAssignment",
      "domain": "tags",
      "name": "getAssignment",
      "method": "GET",
      "path": "/v1/tags/{tagId}/assignments/{resourceType}/{resourceId}",
      "summary": "Get specific assignment for the tag",
      "description": "Get attributes for a specific tag assignment in your account. For this the resource type and resource id is required.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "tagId",
        "resourceType",
        "resourceId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "tagId",
          "location": "path",
          "required": true,
          "description": "The identifier of the tag.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "resourceType",
          "location": "path",
          "required": true,
          "description": "The identifier of the resource type. Resource type is one of `instance|image|object-storage`.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "resourceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the resource id",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("getAssignment"), "tagId": z.number().int().describe("The identifier of the tag."), "resourceType": z.string().describe("The identifier of the resource type. Resource type is one of `instance|image|object-storage`."), "resourceId": z.string().describe("The identifier of the resource id") }) as any,
  },
  {
    ...{
      "id": "tags_createAssignment",
      "domain": "tags",
      "name": "createAssignment",
      "method": "POST",
      "path": "/v1/tags/{tagId}/assignments/{resourceType}/{resourceId}",
      "summary": "Create a new assignment for the tag",
      "description": "Create a new tag assignment. This marks the specified resource with the specified tag for organizing purposes or to restrict access to that resource.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "tagId",
        "resourceType",
        "resourceId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "tagId",
          "location": "path",
          "required": true,
          "description": "The identifier of the tag.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "resourceType",
          "location": "path",
          "required": true,
          "description": "The identifier of the resource type. Resource type is one of `instance|image|object-storage`.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "resourceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the resource id",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("createAssignment"), "tagId": z.number().int().describe("The identifier of the tag."), "resourceType": z.string().describe("The identifier of the resource type. Resource type is one of `instance|image|object-storage`."), "resourceId": z.string().describe("The identifier of the resource id") }) as any,
  },
  {
    ...{
      "id": "tags_deleteAssignment",
      "domain": "tags",
      "name": "deleteAssignment",
      "method": "DELETE",
      "path": "/v1/tags/{tagId}/assignments/{resourceType}/{resourceId}",
      "summary": "Delete existing tag assignment",
      "description": "Tag assignment will be removed from the specified resource. If this tag is being used for access restrictions the affected users will no longer be able to access that resource.",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "tagId",
        "resourceType",
        "resourceId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "tagId",
          "location": "path",
          "required": true,
          "description": "The identifier of the tag.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "resourceType",
          "location": "path",
          "required": true,
          "description": "The identifier of the resource type. Resource type is one of `instance|image|object-storage`.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "resourceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the resource id",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("deleteAssignment"), "tagId": z.number().int().describe("The identifier of the tag."), "resourceType": z.string().describe("The identifier of the resource type. Resource type is one of `instance|image|object-storage`."), "resourceId": z.string().describe("The identifier of the resource id") }) as any,
  },
  {
    ...{
      "id": "audits_tags",
      "domain": "audits",
      "name": "tags",
      "method": "GET",
      "path": "/v1/tags/audits",
      "summary": "List history about your assignments (audit)",
      "description": "List and filters the history about your assignments.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "tagId",
        "requestId",
        "changedBy",
        "startDate",
        "endDate"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "tagId",
          "location": "query",
          "required": false,
          "description": "The identifier of the tag.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "requestId",
          "location": "query",
          "required": false,
          "description": "The requestId of the API call which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "changedBy",
          "location": "query",
          "required": false,
          "description": "UserId of the user which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "startDate",
          "location": "query",
          "required": false,
          "description": "Start of search time range.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "endDate",
          "location": "query",
          "required": false,
          "description": "End of search time range.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("tags"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "tagId": z.number().int().optional().describe("The identifier of the tag."), "requestId": z.string().optional().describe("The requestId of the API call which led to the change."), "changedBy": z.string().optional().describe("UserId of the user which led to the change."), "startDate": z.string().optional().describe("Start of search time range."), "endDate": z.string().optional().describe("End of search time range.") }) as any,
  },
  {
    ...{
      "id": "audits_tagAssignments",
      "domain": "audits",
      "name": "tagAssignments",
      "method": "GET",
      "path": "/v1/tags/assignments/audits",
      "summary": "List history about your assignments (audit)",
      "description": "List and filters the history about your assignments.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "tagId",
        "resourceId",
        "requestId",
        "changedBy",
        "startDate",
        "endDate"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "tagId",
          "location": "query",
          "required": false,
          "description": "The identifier of the tag.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "resourceId",
          "location": "query",
          "required": false,
          "description": "The identifier of the resource.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "requestId",
          "location": "query",
          "required": false,
          "description": "The requestId of the API call which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "changedBy",
          "location": "query",
          "required": false,
          "description": "UserId of the user which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "startDate",
          "location": "query",
          "required": false,
          "description": "Start of search time range.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "endDate",
          "location": "query",
          "required": false,
          "description": "End of search time range.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("tagAssignments"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "tagId": z.number().int().optional().describe("The identifier of the tag."), "resourceId": z.string().optional().describe("The identifier of the resource."), "requestId": z.string().optional().describe("The requestId of the API call which led to the change."), "changedBy": z.string().optional().describe("UserId of the user which led to the change."), "startDate": z.string().optional().describe("Start of search time range."), "endDate": z.string().optional().describe("End of search time range.") }) as any,
  },
  {
    ...{
      "id": "dns_getPtrRecord",
      "domain": "dns",
      "name": "getPtrRecord",
      "method": "GET",
      "path": "/v1/dns/ptrs/{ipAddress}",
      "summary": "Retrieve a PTR Record by ip address",
      "description": "Get all attributes for a specific PTR Record",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "ipAddress"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "ipAddress",
          "location": "path",
          "required": true,
          "description": "Ip Address",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("getPtrRecord"), "ipAddress": z.string().describe("Ip Address") }) as any,
  },
  {
    ...{
      "id": "dns_updatePtrRecord",
      "domain": "dns",
      "name": "updatePtrRecord",
      "method": "PUT",
      "path": "/v1/dns/ptrs/{ipAddress}",
      "summary": "Edit a PTR Record by ip address",
      "description": "Edit attributes for a specific PTR Record",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "ipAddress"
      ],
      "queryParams": [],
      "bodyParams": [
        "ptr"
      ],
      "paramMeta": [
        {
          "name": "ipAddress",
          "location": "path",
          "required": true,
          "description": "Ip Address",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "ptr",
          "location": "body",
          "required": true,
          "description": "PTR Record name",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("updatePtrRecord"), "ipAddress": z.string().describe("Ip Address"), "ptr": z.string().describe("PTR Record name") }) as any,
  },
  {
    ...{
      "id": "dns_deletePtrRecord",
      "domain": "dns",
      "name": "deletePtrRecord",
      "method": "DELETE",
      "path": "/v1/dns/ptrs/{ipAddress}",
      "summary": "Delete a PTR Record using ip address",
      "description": "Delete a PTR Record using ip address. Only IPv6 can be deleted",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "ipAddress"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "ipAddress",
          "location": "path",
          "required": true,
          "description": "Ip Address",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("deletePtrRecord"), "ipAddress": z.string().describe("Ip Address") }) as any,
  },
  {
    ...{
      "id": "dns_createPtrRecord",
      "domain": "dns",
      "name": "createPtrRecord",
      "method": "POST",
      "path": "/v1/dns/ptrs",
      "summary": "Create a new PTR Record using ip address",
      "description": "Create a new PTR Record using ip address. Only IPv6 can be created",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [
        "ptr",
        "ip",
        "ttl"
      ],
      "paramMeta": [
        {
          "name": "ptr",
          "location": "body",
          "required": true,
          "description": "PTR Record name",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "ip",
          "location": "body",
          "required": true,
          "description": "IP Address",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "ttl",
          "location": "body",
          "required": true,
          "description": "Time to live for the PTR record in seconds",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("createPtrRecord"), "ptr": z.string().describe("PTR Record name"), "ip": z.string().describe("IP Address"), "ttl": z.number().int().describe("Time to live for the PTR record in seconds") }) as any,
  },
  {
    ...{
      "id": "dns_listPtrRecords",
      "domain": "dns",
      "name": "listPtrRecords",
      "method": "GET",
      "path": "/v1/dns/ptrs",
      "summary": "List PTR records",
      "description": "Get a list of all PTR records, either customer or a list of IPs is required",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "customerId",
        "tenantId",
        "ips",
        "search"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "customerId",
          "location": "query",
          "required": false,
          "description": "Customer ID",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "tenantId",
          "location": "query",
          "required": false,
          "description": "Tenant ID",
          "type": "enum(DE|INT)",
          "deprecated": false,
          "enumValues": [
            "DE",
            "INT"
          ]
        },
        {
          "name": "ips",
          "location": "query",
          "required": false,
          "description": "List of IPs, separated by commas",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "search",
          "location": "query",
          "required": false,
          "description": "Search PTR records by ip or data",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("listPtrRecords"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "customerId": z.string().optional().describe("Customer ID"), "tenantId": z.enum(["DE", "INT"]).optional().describe("Tenant ID"), "ips": z.array(z.string()).optional().describe("List of IPs, separated by commas"), "search": z.string().optional().describe("Search PTR records by ip or data") }) as any,
  },
  {
    ...{
      "id": "dns_listZones",
      "domain": "dns",
      "name": "listZones",
      "method": "GET",
      "path": "/v1/dns/zones",
      "summary": "List DNS zones",
      "description": "Get a list of all zones",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "customerId",
        "tenantId",
        "zoneName"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "customerId",
          "location": "query",
          "required": false,
          "description": "Customer ID",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "tenantId",
          "location": "query",
          "required": false,
          "description": "Tenant ID",
          "type": "enum(DE|INT)",
          "deprecated": false,
          "enumValues": [
            "DE",
            "INT"
          ]
        },
        {
          "name": "zoneName",
          "location": "query",
          "required": false,
          "description": "Seach by zone name",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("listZones"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "customerId": z.string().optional().describe("Customer ID"), "tenantId": z.enum(["DE", "INT"]).optional().describe("Tenant ID"), "zoneName": z.string().optional().describe("Seach by zone name") }) as any,
  },
  {
    ...{
      "id": "dns_createZone",
      "domain": "dns",
      "name": "createZone",
      "method": "POST",
      "path": "/v1/dns/zones",
      "summary": "Create DNS zone",
      "description": "Creates a new DNS zone for a customer",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [
        "zoneName"
      ],
      "paramMeta": [
        {
          "name": "zoneName",
          "location": "body",
          "required": true,
          "description": "Zone name",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("createZone"), "zoneName": z.string().describe("Zone name") }) as any,
  },
  {
    ...{
      "id": "dns_getZone",
      "domain": "dns",
      "name": "getZone",
      "method": "GET",
      "path": "/v1/dns/zones/{zoneName}",
      "summary": "Retrieve a DNS Zone by zone name",
      "description": "Get all attributes for a specific DNS Zone",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "zoneName"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "zoneName",
          "location": "path",
          "required": true,
          "description": "Zone name",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("getZone"), "zoneName": z.string().describe("Zone name") }) as any,
  },
  {
    ...{
      "id": "dns_deleteZone",
      "domain": "dns",
      "name": "deleteZone",
      "method": "DELETE",
      "path": "/v1/dns/zones/{zoneName}",
      "summary": "Delete a DNS zone.",
      "description": "Delete a DNS Zone using zone name.",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "zoneName"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "zoneName",
          "location": "path",
          "required": true,
          "description": "Zone name",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("deleteZone"), "zoneName": z.string().describe("Zone name") }) as any,
  },
  {
    ...{
      "id": "dns_listZoneRecords",
      "domain": "dns",
      "name": "listZoneRecords",
      "method": "GET",
      "path": "/v1/dns/zones/{zoneName}/records",
      "summary": "List a DNS Zone's records",
      "description": "Get all the records of a DNS Zone",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "zoneName"
      ],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "search"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "zoneName",
          "location": "path",
          "required": true,
          "description": "Zone name",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "search",
          "location": "query",
          "required": false,
          "description": "Search DNS records by name, type or data",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("listZoneRecords"), "zoneName": z.string().describe("Zone name"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "search": z.string().optional().describe("Search DNS records by name, type or data") }) as any,
  },
  {
    ...{
      "id": "dns_createZoneRecord",
      "domain": "dns",
      "name": "createZoneRecord",
      "method": "POST",
      "path": "/v1/dns/zones/{zoneName}/records",
      "summary": "Create DNS zone record",
      "description": "Create resource record in a zone",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "zoneName"
      ],
      "queryParams": [],
      "bodyParams": [
        "name",
        "type",
        "ttl",
        "prio",
        "data",
        "port",
        "weight",
        "flag",
        "tag"
      ],
      "paramMeta": [
        {
          "name": "zoneName",
          "location": "path",
          "required": true,
          "description": "Zone name",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "body",
          "required": false,
          "description": "Name, if empty the zone name will be used",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "type",
          "location": "body",
          "required": true,
          "description": "DNS record type",
          "type": "enum(A|AAAA|CAA|CNAME|MX|SRV|TXT)",
          "deprecated": false,
          "enumValues": [
            "A",
            "AAAA",
            "CAA",
            "CNAME",
            "MX",
            "SRV",
            "TXT"
          ]
        },
        {
          "name": "ttl",
          "location": "body",
          "required": true,
          "description": "TTL",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "prio",
          "location": "body",
          "required": true,
          "description": "Prio",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "data",
          "location": "body",
          "required": true,
          "description": "Data",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "port",
          "location": "body",
          "required": false,
          "description": "Port",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "weight",
          "location": "body",
          "required": false,
          "description": "Weight",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "flag",
          "location": "body",
          "required": false,
          "description": "Flag",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "tag",
          "location": "body",
          "required": false,
          "description": "Tag",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("createZoneRecord"), "zoneName": z.string().describe("Zone name"), "name": z.string().min(1).describe("Name, if empty the zone name will be used").optional(), "type": z.enum(["A", "AAAA", "CAA", "CNAME", "MX", "SRV", "TXT"]).describe("DNS record type"), "ttl": z.number().describe("TTL"), "prio": z.number().describe("Prio"), "data": z.string().min(1).describe("Data"), "port": z.number().describe("Port").optional(), "weight": z.number().describe("Weight").optional(), "flag": z.number().describe("Flag").optional(), "tag": z.string().describe("Tag").optional() }) as any,
  },
  {
    ...{
      "id": "dns_updateZoneRecord",
      "domain": "dns",
      "name": "updateZoneRecord",
      "method": "PATCH",
      "path": "/v1/dns/zones/{zoneName}/records/{recordId}",
      "summary": "Update DNS zone record",
      "description": "Create resource record in a zone",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "recordId",
        "zoneName"
      ],
      "queryParams": [],
      "bodyParams": [
        "ttl",
        "prio",
        "type",
        "data",
        "port",
        "weight",
        "flag",
        "tag"
      ],
      "paramMeta": [
        {
          "name": "recordId",
          "location": "path",
          "required": true,
          "description": "The identifier of the DNS record",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "zoneName",
          "location": "path",
          "required": true,
          "description": "Zone name",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "ttl",
          "location": "body",
          "required": true,
          "description": "TTL",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "prio",
          "location": "body",
          "required": true,
          "description": "Prio",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "type",
          "location": "body",
          "required": true,
          "description": "DNS record type",
          "type": "enum(A|AAAA|CAA|CNAME|MX|SRV|TXT)",
          "deprecated": false,
          "enumValues": [
            "A",
            "AAAA",
            "CAA",
            "CNAME",
            "MX",
            "SRV",
            "TXT"
          ]
        },
        {
          "name": "data",
          "location": "body",
          "required": true,
          "description": "Data",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "port",
          "location": "body",
          "required": false,
          "description": "Port",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "weight",
          "location": "body",
          "required": false,
          "description": "Weight",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "flag",
          "location": "body",
          "required": false,
          "description": "Flag",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "tag",
          "location": "body",
          "required": false,
          "description": "Tag",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("updateZoneRecord"), "recordId": z.number().int().describe("The identifier of the DNS record"), "zoneName": z.string().describe("Zone name"), "ttl": z.number().describe("TTL"), "prio": z.number().describe("Prio"), "type": z.enum(["A", "AAAA", "CAA", "CNAME", "MX", "SRV", "TXT"]).describe("DNS record type"), "data": z.string().min(1).describe("Data"), "port": z.number().describe("Port").optional(), "weight": z.number().describe("Weight").optional(), "flag": z.number().describe("Flag").optional(), "tag": z.string().describe("Tag").optional() }) as any,
  },
  {
    ...{
      "id": "dns_deleteZoneRecord",
      "domain": "dns",
      "name": "deleteZoneRecord",
      "method": "DELETE",
      "path": "/v1/dns/zones/{zoneName}/records/{recordId}",
      "summary": "Delete a DNS zone record",
      "description": "Delete a DNZ Zone's record",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "recordId",
        "zoneName"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "recordId",
          "location": "path",
          "required": true,
          "description": "The identifier of the DNS record",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "zoneName",
          "location": "path",
          "required": true,
          "description": "Zone name",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("deleteZoneRecord"), "recordId": z.number().int().describe("The identifier of the DNS record"), "zoneName": z.string().describe("Zone name") }) as any,
  },
  {
    ...{
      "id": "dns_bulkDeleteZoneRecords",
      "domain": "dns",
      "name": "bulkDeleteZoneRecords",
      "method": "DELETE",
      "path": "/v1/dns/zones/{zoneName}/records/bulk",
      "summary": "Bulk delete DNS zone records",
      "description": "Delete multiple zone records from a DNS Zone",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "zoneName"
      ],
      "queryParams": [],
      "bodyParams": [
        "recordIds"
      ],
      "paramMeta": [
        {
          "name": "zoneName",
          "location": "path",
          "required": true,
          "description": "Zone name",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "recordIds",
          "location": "body",
          "required": true,
          "description": "List of zone record ids to delete",
          "type": "integer[]",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("bulkDeleteZoneRecords"), "zoneName": z.string().describe("Zone name"), "recordIds": z.array(z.number().int()).describe("List of zone record ids to delete") }) as any,
  },
  {
    ...{
      "id": "audits_dnsZones",
      "domain": "audits",
      "name": "dnsZones",
      "method": "GET",
      "path": "/v1/dns/zones/audits",
      "summary": "List history about your DNS Zones (audit)",
      "description": "List and filters the history about your DNS Zones .",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "name",
        "requestId",
        "changedBy",
        "startDate",
        "endDate"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "query",
          "required": false,
          "description": "Dns Zone name.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "requestId",
          "location": "query",
          "required": false,
          "description": "The requestId of the API call which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "changedBy",
          "location": "query",
          "required": false,
          "description": "UserId of the user which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "startDate",
          "location": "query",
          "required": false,
          "description": "Start of search time range.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "endDate",
          "location": "query",
          "required": false,
          "description": "End of search time range.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("dnsZones"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "name": z.string().optional().describe("Dns Zone name."), "requestId": z.string().optional().describe("The requestId of the API call which led to the change."), "changedBy": z.string().optional().describe("UserId of the user which led to the change."), "startDate": z.string().optional().describe("Start of search time range."), "endDate": z.string().optional().describe("End of search time range.") }) as any,
  },
  {
    ...{
      "id": "audits_dnsRecords",
      "domain": "audits",
      "name": "dnsRecords",
      "method": "GET",
      "path": "/v1/dns/records/audits",
      "summary": "List history about your DNS Records (audit)",
      "description": "List and filter the history of changes made to your DNS Records.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "recordId",
        "requestId",
        "changedBy",
        "startDate",
        "endDate"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "recordId",
          "location": "query",
          "required": false,
          "description": "The identifier of the Zone record",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "requestId",
          "location": "query",
          "required": false,
          "description": "The requestId of the API call which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "changedBy",
          "location": "query",
          "required": false,
          "description": "UserId of the user which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "startDate",
          "location": "query",
          "required": false,
          "description": "Start of search time range.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "endDate",
          "location": "query",
          "required": false,
          "description": "End of search time range.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("dnsRecords"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "recordId": z.number().int().optional().describe("The identifier of the Zone record"), "requestId": z.string().optional().describe("The requestId of the API call which led to the change."), "changedBy": z.string().optional().describe("UserId of the user which led to the change."), "startDate": z.string().optional().describe("Start of search time range."), "endDate": z.string().optional().describe("End of search time range.") }) as any,
  },
  {
    ...{
      "id": "vips_list",
      "domain": "vips",
      "name": "list",
      "method": "GET",
      "path": "/v1/vips",
      "summary": "List VIPs",
      "description": "List and filter all vips in your account",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "resourceId",
        "resourceType",
        "resourceName",
        "resourceDisplayName",
        "ipVersion",
        "ips",
        "ip",
        "type",
        "dataCenter",
        "region"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "resourceId",
          "location": "query",
          "required": false,
          "description": "The resourceId using the VIP.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "resourceType",
          "location": "query",
          "required": false,
          "description": "The resourceType using the VIP.",
          "type": "enum(instances|bare-metal|null)",
          "deprecated": false,
          "enumValues": [
            "instances",
            "bare-metal",
            "null"
          ]
        },
        {
          "name": "resourceName",
          "location": "query",
          "required": false,
          "description": "The name of the resource.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "resourceDisplayName",
          "location": "query",
          "required": false,
          "description": "The display name of the resource.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "ipVersion",
          "location": "query",
          "required": false,
          "description": "The VIP version.",
          "type": "enum(v4)",
          "deprecated": false,
          "enumValues": [
            "v4"
          ]
        },
        {
          "name": "ips",
          "location": "query",
          "required": false,
          "description": "Comma separated IPs",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "ip",
          "location": "query",
          "required": false,
          "description": "The ip of the VIP",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "type",
          "location": "query",
          "required": false,
          "description": "The VIP type.",
          "type": "enum(additional|floating)",
          "deprecated": false,
          "enumValues": [
            "additional",
            "floating"
          ]
        },
        {
          "name": "dataCenter",
          "location": "query",
          "required": false,
          "description": "The dataCenter of the VIP.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "region",
          "location": "query",
          "required": false,
          "description": "The region of the VIP.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("list"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "resourceId": z.string().optional().describe("The resourceId using the VIP."), "resourceType": z.enum(["instances", "bare-metal", "null"]).optional().describe("The resourceType using the VIP."), "resourceName": z.string().optional().describe("The name of the resource."), "resourceDisplayName": z.string().optional().describe("The display name of the resource."), "ipVersion": z.enum(["v4"]).optional().describe("The VIP version."), "ips": z.string().optional().describe("Comma separated IPs"), "ip": z.string().optional().describe("The ip of the VIP"), "type": z.enum(["additional", "floating"]).optional().describe("The VIP type."), "dataCenter": z.string().optional().describe("The dataCenter of the VIP."), "region": z.string().optional().describe("The region of the VIP.") }) as any,
  },
  {
    ...{
      "id": "vips_get",
      "domain": "vips",
      "name": "get",
      "method": "GET",
      "path": "/v1/vips/{ip}",
      "summary": "Get specific VIP by ip",
      "description": "Get attributes values to a specific VIP on your account.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "ip"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "ip",
          "location": "path",
          "required": true,
          "description": "The ip of the VIP",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("get"), "ip": z.string().describe("The ip of the VIP") }) as any,
  },
  {
    ...{
      "id": "vips_assign",
      "domain": "vips",
      "name": "assign",
      "method": "POST",
      "path": "/v1/vips/{ip}/{resourceType}/{resourceId}",
      "summary": "Assign a VIP to an VPS/VDS/Bare Metal",
      "description": "Assign a VIP to a VPS/VDS/Bare Metal using the machine id.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "resourceId",
        "ip",
        "resourceType"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "resourceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the resource",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "ip",
          "location": "path",
          "required": true,
          "description": "The ip you want to add the instance to",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "resourceType",
          "location": "path",
          "required": true,
          "description": "The resourceType using the VIP.",
          "type": "enum(instances|bare-metal)",
          "deprecated": false,
          "enumValues": [
            "instances",
            "bare-metal"
          ]
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("assign"), "resourceId": z.number().int().describe("The identifier of the resource"), "ip": z.string().describe("The ip you want to add the instance to"), "resourceType": z.enum(["instances", "bare-metal"]).describe("The resourceType using the VIP.") }) as any,
  },
  {
    ...{
      "id": "vips_unassign",
      "domain": "vips",
      "name": "unassign",
      "method": "DELETE",
      "path": "/v1/vips/{ip}/{resourceType}/{resourceId}",
      "summary": "Unassign a VIP to a VPS/VDS/Bare Metal",
      "description": "Unassign a VIP from an VPS/VDS/Bare Metal using the machine id.",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "resourceId",
        "ip",
        "resourceType"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "resourceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the resource",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "ip",
          "location": "path",
          "required": true,
          "description": "The ip you want to add the instance to",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "resourceType",
          "location": "path",
          "required": true,
          "description": "The resourceType using the VIP.",
          "type": "enum(instances|bare-metal)",
          "deprecated": false,
          "enumValues": [
            "instances",
            "bare-metal"
          ]
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("unassign"), "resourceId": z.number().int().describe("The identifier of the resource"), "ip": z.string().describe("The ip you want to add the instance to"), "resourceType": z.enum(["instances", "bare-metal"]).describe("The resourceType using the VIP.") }) as any,
  },
  {
    ...{
      "id": "audits_vips",
      "domain": "audits",
      "name": "vips",
      "method": "GET",
      "path": "/v1/vips/audits",
      "summary": "List history about your VIPs (audit)",
      "description": "List and filters the history about your VIPs.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "vipId",
        "requestId",
        "changedBy",
        "startDate",
        "endDate"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "vipId",
          "location": "query",
          "required": false,
          "description": "The identifier of the VIP.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "requestId",
          "location": "query",
          "required": false,
          "description": "The requestId of the API call which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "changedBy",
          "location": "query",
          "required": false,
          "description": "User name which did the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "startDate",
          "location": "query",
          "required": false,
          "description": "Start of search time range.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "endDate",
          "location": "query",
          "required": false,
          "description": "End of search time range.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("vips"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "vipId": z.string().optional().describe("The identifier of the VIP."), "requestId": z.string().optional().describe("The requestId of the API call which led to the change."), "changedBy": z.string().optional().describe("User name which did the change."), "startDate": z.string().optional().describe("Start of search time range."), "endDate": z.string().optional().describe("End of search time range.") }) as any,
  },
  {
    ...{
      "id": "secrets_list",
      "domain": "secrets",
      "name": "list",
      "method": "GET",
      "path": "/v1/secrets",
      "summary": "List secrets",
      "description": "List and filter all secrets in your account.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "name",
        "type"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "query",
          "required": false,
          "description": "Filter secrets by name",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "type",
          "location": "query",
          "required": false,
          "description": "Filter secrets by type",
          "type": "enum(password|ssh)",
          "deprecated": false,
          "enumValues": [
            "password",
            "ssh"
          ]
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("list"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "name": z.string().optional().describe("Filter secrets by name"), "type": z.enum(["password", "ssh"]).optional().describe("Filter secrets by type") }) as any,
  },
  {
    ...{
      "id": "secrets_create",
      "domain": "secrets",
      "name": "create",
      "method": "POST",
      "path": "/v1/secrets",
      "summary": "Create a new secret",
      "description": "Create a new secret in your account with attributes name, type and value. Attribute type can be password or ssh.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [
        "name",
        "value",
        "type"
      ],
      "paramMeta": [
        {
          "name": "name",
          "location": "body",
          "required": true,
          "description": "The name of the secret that will keep the password",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "value",
          "location": "body",
          "required": true,
          "description": "The secret value that needs to be saved. In case of a password it must match a pattern with at least one upper and lower case character and either one number with two special characters `!@#$^&*?_~` or at least three numbers with one special character `!@#$^&*?_~`. This is expressed in the following regular expression: `^((?=.*?[A-Z]{1,})(?=.*?[a-z]{1,}))(((?=(?:[^d]*d){1})(?=([^^&*?_~]*[!@#$^&*?_~]){2,}))|((?=(?:[^d]*d){3})(?=.*?[!@#$^&*?_~]+))).{8,}$`",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "type",
          "location": "body",
          "required": true,
          "description": "The type of the secret. Can be `password` or `ssh`",
          "type": "enum(password|ssh)",
          "deprecated": false,
          "enumValues": [
            "password",
            "ssh"
          ]
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("create"), "name": z.string().min(1).max(255).describe("The name of the secret that will keep the password"), "value": z.string().min(8).describe("The secret value that needs to be saved. In case of a password it must match a pattern with at least one upper and lower case character and either one number with two special characters `!@#$^&*?_~` or at least three numbers with one special character `!@#$^&*?_~`. This is expressed in the following regular expression: `^((?=.*?[A-Z]{1,})(?=.*?[a-z]{1,}))(((?=(?:[^d]*d){1})(?=([^^&*?_~]*[!@#$^&*?_~]){2,}))|((?=(?:[^d]*d){3})(?=.*?[!@#$^&*?_~]+))).{8,}$`"), "type": z.enum(["password", "ssh"]).describe("The type of the secret. Can be `password` or `ssh`") }) as any,
  },
  {
    ...{
      "id": "secrets_get",
      "domain": "secrets",
      "name": "get",
      "method": "GET",
      "path": "/v1/secrets/{secretId}",
      "summary": "Get specific secret by id",
      "description": "Get attributes values for a specific secret on your account.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "secretId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "secretId",
          "location": "path",
          "required": true,
          "description": "The id of the secret",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("get"), "secretId": z.number().int().describe("The id of the secret") }) as any,
  },
  {
    ...{
      "id": "secrets_update",
      "domain": "secrets",
      "name": "update",
      "method": "PATCH",
      "path": "/v1/secrets/{secretId}",
      "summary": "Update specific secret by id",
      "description": "Update attributes to your secret. Attributes are optional. If not set, the attributes will retain their original values. Only name and value can be updated.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "secretId"
      ],
      "queryParams": [],
      "bodyParams": [
        "name",
        "value"
      ],
      "paramMeta": [
        {
          "name": "secretId",
          "location": "path",
          "required": true,
          "description": "The id of the secret",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "body",
          "required": false,
          "description": "The name of the secret to be saved",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "value",
          "location": "body",
          "required": false,
          "description": "The value of the secret to be saved",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("update"), "secretId": z.number().int().describe("The id of the secret"), "name": z.string().describe("The name of the secret to be saved").optional(), "value": z.string().min(8).describe("The value of the secret to be saved").optional() }) as any,
  },
  {
    ...{
      "id": "secrets_delete",
      "domain": "secrets",
      "name": "delete",
      "method": "DELETE",
      "path": "/v1/secrets/{secretId}",
      "summary": "Delete existing secret by id",
      "description": "You can remove a specific secret from your account.",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "secretId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "secretId",
          "location": "path",
          "required": true,
          "description": "The id of the secret",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("delete"), "secretId": z.number().int().describe("The id of the secret") }) as any,
  },
  {
    ...{
      "id": "audits_secrets",
      "domain": "audits",
      "name": "secrets",
      "method": "GET",
      "path": "/v1/secrets/audits",
      "summary": "List history about your secrets (audit)",
      "description": "List and filters the history about your secrets.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "secretId",
        "requestId",
        "changedBy",
        "startDate",
        "endDate"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "secretId",
          "location": "query",
          "required": false,
          "description": "The id of the secret.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "requestId",
          "location": "query",
          "required": false,
          "description": "The requestId of the API call which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "changedBy",
          "location": "query",
          "required": false,
          "description": "changedBy of the user which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "startDate",
          "location": "query",
          "required": false,
          "description": "Start of search time range.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "endDate",
          "location": "query",
          "required": false,
          "description": "End of search time range.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("secrets"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "secretId": z.number().int().optional().describe("The id of the secret."), "requestId": z.string().optional().describe("The requestId of the API call which led to the change."), "changedBy": z.string().optional().describe("changedBy of the user which led to the change."), "startDate": z.string().optional().describe("Start of search time range."), "endDate": z.string().optional().describe("End of search time range.") }) as any,
  },
  {
    ...{
      "id": "privateNetworks_list",
      "domain": "privateNetworks",
      "name": "list",
      "method": "GET",
      "path": "/v1/private-networks",
      "summary": "List Private Networks",
      "description": "List and filter all Private Networks in your account",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "name",
        "instanceIds",
        "region",
        "dataCenter"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "query",
          "required": false,
          "description": "The name of the Private Network",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "instanceIds",
          "location": "query",
          "required": false,
          "description": "Comma separated instances identifiers",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "region",
          "location": "query",
          "required": false,
          "description": "The slug of the region where your Private Network is located",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "dataCenter",
          "location": "query",
          "required": false,
          "description": "The data center where your Private Network is located",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("list"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "name": z.string().optional().describe("The name of the Private Network"), "instanceIds": z.string().optional().describe("Comma separated instances identifiers"), "region": z.string().optional().describe("The slug of the region where your Private Network is located"), "dataCenter": z.string().optional().describe("The data center where your Private Network is located") }) as any,
  },
  {
    ...{
      "id": "privateNetworks_create",
      "domain": "privateNetworks",
      "name": "create",
      "method": "POST",
      "path": "/v1/private-networks",
      "summary": "Create a new Private Network",
      "description": "Create a new Private Network in your account.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [
        "region",
        "name",
        "description"
      ],
      "paramMeta": [
        {
          "name": "region",
          "location": "body",
          "required": false,
          "description": "Region where the Private Network should be located. Default is `EU`",
          "type": "string",
          "deprecated": false,
          "defaultValue": "EU"
        },
        {
          "name": "name",
          "location": "body",
          "required": true,
          "description": "The name of the Private Network. It may contain letters, numbers, colons, dashes, and underscores. There is a limit of 255 characters per Private Network name.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "description",
          "location": "body",
          "required": false,
          "description": "The description of the Private Network. There is a limit of 255 characters per Private Network description.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("create"), "region": z.string().min(1).default("EU").describe("Region where the Private Network should be located. Default is `EU`"), "name": z.string().min(1).max(255).describe("The name of the Private Network. It may contain letters, numbers, colons, dashes, and underscores. There is a limit of 255 characters per Private Network name."), "description": z.string().max(255).describe("The description of the Private Network. There is a limit of 255 characters per Private Network description.").optional() }) as any,
  },
  {
    ...{
      "id": "privateNetworks_update",
      "domain": "privateNetworks",
      "name": "update",
      "method": "PATCH",
      "path": "/v1/private-networks/{privateNetworkId}",
      "summary": "Update a Private Network by id",
      "description": "Update a Private Network by id in your account.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "privateNetworkId"
      ],
      "queryParams": [],
      "bodyParams": [
        "name",
        "description"
      ],
      "paramMeta": [
        {
          "name": "privateNetworkId",
          "location": "path",
          "required": true,
          "description": "The identifier of the Private Network",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "body",
          "required": false,
          "description": "The name of the Private Network. It may contain letters, numbers, colons, dashes, and underscores. There is a limit of 255 characters per Private Network.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "description",
          "location": "body",
          "required": false,
          "description": "The description of the Private Network. There is a limit of 255 characters per Private Network.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("update"), "privateNetworkId": z.number().int().describe("The identifier of the Private Network"), "name": z.string().min(1).max(255).describe("The name of the Private Network. It may contain letters, numbers, colons, dashes, and underscores. There is a limit of 255 characters per Private Network.").optional(), "description": z.string().max(255).describe("The description of the Private Network. There is a limit of 255 characters per Private Network.").optional() }) as any,
  },
  {
    ...{
      "id": "privateNetworks_get",
      "domain": "privateNetworks",
      "name": "get",
      "method": "GET",
      "path": "/v1/private-networks/{privateNetworkId}",
      "summary": "Get specific Private Network by id",
      "description": "Get attributes values to a specific Private Network on your account.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "privateNetworkId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "privateNetworkId",
          "location": "path",
          "required": true,
          "description": "The identifier of the Private Network",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("get"), "privateNetworkId": z.number().int().describe("The identifier of the Private Network") }) as any,
  },
  {
    ...{
      "id": "privateNetworks_delete",
      "domain": "privateNetworks",
      "name": "delete",
      "method": "DELETE",
      "path": "/v1/private-networks/{privateNetworkId}",
      "summary": "Delete existing Private Network by id",
      "description": "Delete existing Virtual Private Cloud by id and automatically unassign all instances from it",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "privateNetworkId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "privateNetworkId",
          "location": "path",
          "required": true,
          "description": "The identifier of the Private Network",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("delete"), "privateNetworkId": z.number().int().describe("The identifier of the Private Network") }) as any,
  },
  {
    ...{
      "id": "privateNetworks_assignInstance",
      "domain": "privateNetworks",
      "name": "assignInstance",
      "method": "POST",
      "path": "/v1/private-networks/{privateNetworkId}/instances/{instanceId}",
      "summary": "Add instance to a Private Network",
      "description": "Add a specific instance to a Private Network",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "privateNetworkId",
        "instanceId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "privateNetworkId",
          "location": "path",
          "required": true,
          "description": "The identifier of the Private Network",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the instance",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("assignInstance"), "privateNetworkId": z.number().int().describe("The identifier of the Private Network"), "instanceId": z.number().int().describe("The identifier of the instance") }) as any,
  },
  {
    ...{
      "id": "privateNetworks_unassignInstance",
      "domain": "privateNetworks",
      "name": "unassignInstance",
      "method": "DELETE",
      "path": "/v1/private-networks/{privateNetworkId}/instances/{instanceId}",
      "summary": "Remove instance from a Private Network",
      "description": "Remove a specific instance from a Private Network",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "privateNetworkId",
        "instanceId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "privateNetworkId",
          "location": "path",
          "required": true,
          "description": "The identifier of the Private Network",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the instance",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("unassignInstance"), "privateNetworkId": z.number().int().describe("The identifier of the Private Network"), "instanceId": z.number().int().describe("The identifier of the instance") }) as any,
  },
  {
    ...{
      "id": "audits_privateNetworks",
      "domain": "audits",
      "name": "privateNetworks",
      "method": "GET",
      "path": "/v1/private-networks/audits",
      "summary": "List history about your Private Networks (audit)",
      "description": "List and filters the history about your Private Networks.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "privateNetworkId",
        "requestId",
        "changedBy",
        "startDate",
        "endDate"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "privateNetworkId",
          "location": "query",
          "required": false,
          "description": "The identifier of the Private Network",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "requestId",
          "location": "query",
          "required": false,
          "description": "The requestId of the API call which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "changedBy",
          "location": "query",
          "required": false,
          "description": "User name which did the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "startDate",
          "location": "query",
          "required": false,
          "description": "Start of search time range.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "endDate",
          "location": "query",
          "required": false,
          "description": "End of search time range.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("privateNetworks"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "privateNetworkId": z.number().int().optional().describe("The identifier of the Private Network"), "requestId": z.string().optional().describe("The requestId of the API call which led to the change."), "changedBy": z.string().optional().describe("User name which did the change."), "startDate": z.string().optional().describe("Start of search time range."), "endDate": z.string().optional().describe("End of search time range.") }) as any,
  },
  {
    ...{
      "id": "users_list",
      "domain": "users",
      "name": "list",
      "method": "GET",
      "path": "/v1/users",
      "summary": "List users",
      "description": "List and filter all your users.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "email",
        "enabled",
        "default",
        "owner",
        "search"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "email",
          "location": "query",
          "required": false,
          "description": "Filter as substring match for user emails.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "enabled",
          "location": "query",
          "required": false,
          "description": "Filter if user is enabled or not.",
          "type": "boolean",
          "deprecated": false
        },
        {
          "name": "default",
          "location": "query",
          "required": false,
          "description": "Filter if user is default account or not.",
          "type": "boolean",
          "deprecated": false
        },
        {
          "name": "owner",
          "location": "query",
          "required": false,
          "description": "Filter if user is owner or not.",
          "type": "boolean",
          "deprecated": false
        },
        {
          "name": "search",
          "location": "query",
          "required": false,
          "description": "Full text search when listing the users. Can be searched by `first name`, `last name`, `email` or `first name` and `last name` combined",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("list"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "email": z.string().optional().describe("Filter as substring match for user emails."), "enabled": z.boolean().optional().describe("Filter if user is enabled or not."), "default": z.boolean().optional().describe("Filter if user is default account or not."), "owner": z.boolean().optional().describe("Filter if user is owner or not."), "search": z.string().optional().describe("Full text search when listing the users. Can be searched by `first name`, `last name`, `email` or `first name` and `last name` combined") }) as any,
  },
  {
    ...{
      "id": "users_create",
      "domain": "users",
      "name": "create",
      "method": "POST",
      "path": "/v1/users",
      "summary": "Create a new user",
      "description": "Create a new user with required attributes firstName, lastName, email, enabled, totp (=Two-factor authentication 2FA), admin (=access to all endpoints and resources), accessAllResources and roles. You can't specify any password / secrets for the user. For security reasons the user will have to specify secrets on his own.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [
        "firstName",
        "lastName",
        "email",
        "enabled",
        "totp",
        "locale",
        "roles",
        "sendInvoiceEmail"
      ],
      "paramMeta": [
        {
          "name": "firstName",
          "location": "body",
          "required": true,
          "description": "The name of the user. Names may contain letters, numbers, colons, dashes, and underscores. There is a limit of 255 characters per user.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "lastName",
          "location": "body",
          "required": true,
          "description": "The last name of the user. Users may contain letters, numbers, colons, dashes, and underscores. There is a limit of 255 characters per user.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "email",
          "location": "body",
          "required": true,
          "description": "The email of the user to which activation and forgot password links are being sent to. There is a limit of 255 characters per email.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "enabled",
          "location": "body",
          "required": true,
          "description": "If user is not enabled, he can't login and thus use services any longer.",
          "type": "boolean",
          "deprecated": false
        },
        {
          "name": "totp",
          "location": "body",
          "required": true,
          "description": "Enable or disable two-factor authentication (2FA) via time based OTP.",
          "type": "boolean",
          "deprecated": false
        },
        {
          "name": "locale",
          "location": "body",
          "required": true,
          "description": "The locale of the user. This can be `de-DE`, `de`, `en-US`, `en`, `es-ES`, `es`, `pt-BR`, `pt`.",
          "type": "enum(de-DE|de|en-US|en|es|es-ES|pt-BR|pt)",
          "deprecated": false,
          "enumValues": [
            "de-DE",
            "de",
            "en-US",
            "en",
            "es",
            "es-ES",
            "pt-BR",
            "pt"
          ]
        },
        {
          "name": "roles",
          "location": "body",
          "required": false,
          "description": "The roles as list of `roleId`s of the user.",
          "type": "integer[]",
          "deprecated": false
        },
        {
          "name": "sendInvoiceEmail",
          "location": "body",
          "required": false,
          "description": "If enabled, the user receives invoice emails and is registered as an invoice contact in CMS. Only available for users with the Full Access role.",
          "type": "boolean",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("create"), "firstName": z.string().min(1).max(255).describe("The name of the user. Names may contain letters, numbers, colons, dashes, and underscores. There is a limit of 255 characters per user."), "lastName": z.string().min(1).max(255).describe("The last name of the user. Users may contain letters, numbers, colons, dashes, and underscores. There is a limit of 255 characters per user."), "email": z.string().min(1).max(255).describe("The email of the user to which activation and forgot password links are being sent to. There is a limit of 255 characters per email."), "enabled": z.boolean().describe("If user is not enabled, he can't login and thus use services any longer."), "totp": z.boolean().describe("Enable or disable two-factor authentication (2FA) via time based OTP."), "locale": z.enum(["de-DE", "de", "en-US", "en", "es", "es-ES", "pt-BR", "pt"]).describe("The locale of the user. This can be `de-DE`, `de`, `en-US`, `en`, `es-ES`, `es`, `pt-BR`, `pt`."), "roles": z.array(z.number().int()).describe("The roles as list of `roleId`s of the user.").optional(), "sendInvoiceEmail": z.boolean().describe("If enabled, the user receives invoice emails and is registered as an invoice contact in CMS. Only available for users with the Full Access role.").optional() }) as any,
  },
  {
    ...{
      "id": "users_get",
      "domain": "users",
      "name": "get",
      "method": "GET",
      "path": "/v1/users/{userId}",
      "summary": "Get specific user by id",
      "description": "Get attributes for a specific user.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "userId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "userId",
          "location": "path",
          "required": true,
          "description": "The identifier of the user.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("get"), "userId": z.string().describe("The identifier of the user.") }) as any,
  },
  {
    ...{
      "id": "users_update",
      "domain": "users",
      "name": "update",
      "method": "PATCH",
      "path": "/v1/users/{userId}",
      "summary": "Update specific user by id",
      "description": "Update attributes of a user. You may only specify the attributes you want to change. If an attribute is not set, it will retain its original value.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "userId"
      ],
      "queryParams": [],
      "bodyParams": [
        "firstName",
        "lastName",
        "enabled",
        "totp",
        "locale",
        "roles",
        "sendInvoiceEmail"
      ],
      "paramMeta": [
        {
          "name": "userId",
          "location": "path",
          "required": true,
          "description": "The identifier of the user.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "firstName",
          "location": "body",
          "required": false,
          "description": "The name of the user. Names may contain letters, numbers, colons, dashes, and underscores. There is a limit of 255 characters per user.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "lastName",
          "location": "body",
          "required": false,
          "description": "The last name of the user. Users may contain letters, numbers, colons, dashes, and underscores. There is a limit of 255 characters per user.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "enabled",
          "location": "body",
          "required": false,
          "description": "If user is not enabled, he can't login and thus use services any longer.",
          "type": "boolean",
          "deprecated": false
        },
        {
          "name": "totp",
          "location": "body",
          "required": false,
          "description": "Enable or disable two-factor authentication (2FA) via time based OTP.",
          "type": "boolean",
          "deprecated": false
        },
        {
          "name": "locale",
          "location": "body",
          "required": false,
          "description": "The locale of the user. This can be `de-DE`, `de`, `en-US`, `en`, `es-ES`, `es`, `pt-BR`, `pt`.",
          "type": "enum(de-DE|de|en-US|en|es|es-ES|pt-BR|pt)",
          "deprecated": false,
          "enumValues": [
            "de-DE",
            "de",
            "en-US",
            "en",
            "es",
            "es-ES",
            "pt-BR",
            "pt"
          ]
        },
        {
          "name": "roles",
          "location": "body",
          "required": false,
          "description": "The roles as list of `roleId`s of the user.",
          "type": "integer[]",
          "deprecated": false
        },
        {
          "name": "sendInvoiceEmail",
          "location": "body",
          "required": false,
          "description": "If enabled, the user receives invoice emails and is registered as an invoice contact in CMS. Only available for users with the Full Access role.",
          "type": "boolean",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("update"), "userId": z.string().describe("The identifier of the user."), "firstName": z.string().min(1).max(255).describe("The name of the user. Names may contain letters, numbers, colons, dashes, and underscores. There is a limit of 255 characters per user.").optional(), "lastName": z.string().min(1).max(255).describe("The last name of the user. Users may contain letters, numbers, colons, dashes, and underscores. There is a limit of 255 characters per user.").optional(), "enabled": z.boolean().describe("If user is not enabled, he can't login and thus use services any longer.").optional(), "totp": z.boolean().describe("Enable or disable two-factor authentication (2FA) via time based OTP.").optional(), "locale": z.enum(["de-DE", "de", "en-US", "en", "es", "es-ES", "pt-BR", "pt"]).describe("The locale of the user. This can be `de-DE`, `de`, `en-US`, `en`, `es-ES`, `es`, `pt-BR`, `pt`.").optional(), "roles": z.array(z.number().int()).describe("The roles as list of `roleId`s of the user.").optional(), "sendInvoiceEmail": z.boolean().describe("If enabled, the user receives invoice emails and is registered as an invoice contact in CMS. Only available for users with the Full Access role.").optional() }) as any,
  },
  {
    ...{
      "id": "users_delete",
      "domain": "users",
      "name": "delete",
      "method": "DELETE",
      "path": "/v1/users/{userId}",
      "summary": "Delete existing user by id",
      "description": "By deleting a user he will not be able to access any endpoints or resources any longer. In order to temporarily disable a user please update its `enabled` attribute.",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "userId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "userId",
          "location": "path",
          "required": true,
          "description": "The identifier of the user.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("delete"), "userId": z.string().describe("The identifier of the user.") }) as any,
  },
  {
    ...{
      "id": "users_resetPassword",
      "domain": "users",
      "name": "resetPassword",
      "method": "POST",
      "path": "/v1/users/{userId}/reset-password",
      "summary": "Send reset password email",
      "description": "Send reset password email for a specific user",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "userId"
      ],
      "queryParams": [
        "redirectUrl"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "userId",
          "location": "path",
          "required": true,
          "description": "The identifier of the user.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "redirectUrl",
          "location": "query",
          "required": false,
          "description": "The redirect url used for resetting password",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("resetPassword"), "userId": z.string().describe("The identifier of the user."), "redirectUrl": z.string().optional().describe("The redirect url used for resetting password") }) as any,
  },
  {
    ...{
      "id": "users_resendEmailVerification",
      "domain": "users",
      "name": "resendEmailVerification",
      "method": "POST",
      "path": "/v1/users/{userId}/resend-email-verification",
      "summary": "Resend email verification",
      "description": "Resend email verification for a specific user",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "userId"
      ],
      "queryParams": [
        "redirectUrl"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "userId",
          "location": "path",
          "required": true,
          "description": "The identifier of the user.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "redirectUrl",
          "location": "query",
          "required": false,
          "description": "The redirect url used for email verification",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("resendEmailVerification"), "userId": z.string().describe("The identifier of the user."), "redirectUrl": z.string().optional().describe("The redirect url used for email verification") }) as any,
  },
  {
    ...{
      "id": "users_generateSsoToken",
      "domain": "users",
      "name": "generateSsoToken",
      "method": "POST",
      "path": "/v1/users/sso-token",
      "summary": "Generate one time SSO token",
      "description": "Generate an one time SSO token for the authenticated user account.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": []
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("generateSsoToken") }) as any,
  },
  {
    ...{
      "id": "users_getClient",
      "domain": "users",
      "name": "getClient",
      "method": "GET",
      "path": "/v1/users/client",
      "summary": "Get client",
      "description": "Get idm client.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": []
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("getClient") }) as any,
  },
  {
    ...{
      "id": "users_generateClientSecret",
      "domain": "users",
      "name": "generateClientSecret",
      "method": "PUT",
      "path": "/v1/users/client/secret",
      "summary": "Generate new client secret",
      "description": "Generate and get new client secret.",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": []
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("generateClientSecret") }) as any,
  },
  {
    ...{
      "id": "users_isPasswordSet",
      "domain": "users",
      "name": "isPasswordSet",
      "method": "GET",
      "path": "/v1/users/is-password-set",
      "summary": "Get user is password set status",
      "description": "Get info about idm user if the password is set.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "userId"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "userId",
          "location": "query",
          "required": false,
          "description": "The user ID for checking if password is set for him",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("isPasswordSet"), "userId": z.string().optional().describe("The user ID for checking if password is set for him") }) as any,
  },
  {
    ...{
      "id": "users_requestEmailChange",
      "domain": "users",
      "name": "requestEmailChange",
      "method": "POST",
      "path": "/v1/users/{userId}/mail-change-requests",
      "summary": "Request email change",
      "description": "Request an email change for the specified user. This operation is only available for owner accounts. If triggered by a subuser, the request will be rejected.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "userId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "userId",
          "location": "path",
          "required": true,
          "description": "The identifier of the user.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("requestEmailChange"), "userId": z.string().describe("The identifier of the user.") }) as any,
  },
  {
    ...{
      "id": "users_switchAccount",
      "domain": "users",
      "name": "switchAccount",
      "method": "POST",
      "path": "/v1/me/action/switchAccount",
      "summary": "Switch user account",
      "description": "Switch user account",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [
        "customerId",
        "tenantId",
        "email"
      ],
      "paramMeta": [
        {
          "name": "customerId",
          "location": "body",
          "required": true,
          "description": "Customer ID",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "tenantId",
          "location": "body",
          "required": true,
          "description": "Tenant ID",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "email",
          "location": "body",
          "required": true,
          "description": "Email of the user",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("switchAccount"), "customerId": z.string().min(1).max(255).describe("Customer ID"), "tenantId": z.string().min(1).max(255).describe("Tenant ID"), "email": z.string().min(1).max(255).describe("Email of the user") }) as any,
  },
  {
    ...{
      "id": "users_makeDefault",
      "domain": "users",
      "name": "makeDefault",
      "method": "PATCH",
      "path": "/v1/me/account/{tenantId}/{customerId}",
      "summary": "Make user account default",
      "description": "Make user account default",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "tenantId",
        "customerId"
      ],
      "queryParams": [],
      "bodyParams": [
        "default"
      ],
      "paramMeta": [
        {
          "name": "tenantId",
          "location": "path",
          "required": true,
          "description": "Tenant ID.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "customerId",
          "location": "path",
          "required": true,
          "description": "Customer ID.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "default",
          "location": "body",
          "required": true,
          "description": "Default flag for the selected account",
          "type": "boolean",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("makeDefault"), "tenantId": z.string().describe("Tenant ID."), "customerId": z.string().describe("Customer ID."), "default": z.boolean().describe("Default flag for the selected account") }) as any,
  },
  {
    ...{
      "id": "users_listAccounts",
      "domain": "users",
      "name": "listAccounts",
      "method": "GET",
      "path": "/v1/me/accounts",
      "summary": "List of your accounts",
      "description": "List of your accounts",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "email",
        "default"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "email",
          "location": "query",
          "required": false,
          "description": "Filter as substring match for user emails.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "default",
          "location": "query",
          "required": false,
          "description": "Filter if default account or not.",
          "type": "boolean",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("listAccounts"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "email": z.string().optional().describe("Filter as substring match for user emails."), "default": z.boolean().optional().describe("Filter if default account or not.") }) as any,
  },
  {
    ...{
      "id": "users_listRoles",
      "domain": "users",
      "name": "listRoles",
      "method": "GET",
      "path": "/v1/roles",
      "summary": "List roles",
      "description": "List and filter all your roles. A role allows you to specify permission to api endpoints and resources like compute.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "name",
        "apiName",
        "tagName",
        "type"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "query",
          "required": false,
          "description": "The name of the role",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "apiName",
          "location": "query",
          "required": false,
          "description": "The name of api",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "tagName",
          "location": "query",
          "required": false,
          "description": "The name of the tag",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "type",
          "location": "query",
          "required": false,
          "description": "The type of the tag. Can be either `default` or `custom`",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("listRoles"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "name": z.string().optional().describe("The name of the role"), "apiName": z.string().optional().describe("The name of api"), "tagName": z.string().optional().describe("The name of the tag"), "type": z.string().optional().describe("The type of the tag. Can be either `default` or `custom`") }) as any,
  },
  {
    ...{
      "id": "users_createRole",
      "domain": "users",
      "name": "createRole",
      "method": "POST",
      "path": "/v1/roles",
      "summary": "Create a new role",
      "description": "Create a new role. In order to get a list availbale api enpoints (apiName) and their actions please refer to the GET api-permissions endpoint. For specifying `resources` please enter tag ids. For those to take effect please assign them to a resource in the tag management api.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [
        "name",
        "admin",
        "accessAllResources",
        "permissions"
      ],
      "paramMeta": [
        {
          "name": "name",
          "location": "body",
          "required": true,
          "description": "The name of the role. There is a limit of 255 characters per role.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "admin",
          "location": "body",
          "required": true,
          "description": "If user is admin he will have permissions to all API endpoints and resources. Enabling this will superseed all role definitions and `accessAllResources`.",
          "type": "boolean",
          "deprecated": false
        },
        {
          "name": "accessAllResources",
          "location": "body",
          "required": true,
          "description": "Allow access to all resources. This will superseed all assigned resources in a role.",
          "type": "boolean",
          "deprecated": false
        },
        {
          "name": "permissions",
          "location": "body",
          "required": false,
          "description": "",
          "type": "unknown[]",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("createRole"), "name": z.string().min(1).max(255).describe("The name of the role. There is a limit of 255 characters per role."), "admin": z.boolean().describe("If user is admin he will have permissions to all API endpoints and resources. Enabling this will superseed all role definitions and `accessAllResources`."), "accessAllResources": z.boolean().describe("Allow access to all resources. This will superseed all assigned resources in a role."), "permissions": z.array(z.object({ "apiName": z.string().min(1).max(255).describe("The name of the role. There is a limit of 255 characters per role."), "actions": z.array(z.enum(["CREATE", "READ", "UPDATE", "DELETE"])).describe("Action allowed for the API endpoint. Basically `CREATE` corresponds to POST endpoints, `READ` to GET endpoints, `UPDATE` to PATCH / PUT endpoints and `DELETE` to DELETE endpoints."), "resources": z.array(z.number().int()).describe("The IDs of tags. Only if those tags are assgined to a resource the user with that role will be able to access the resource.").optional() })).optional() }) as any,
  },
  {
    ...{
      "id": "users_getRole",
      "domain": "users",
      "name": "getRole",
      "method": "GET",
      "path": "/v1/roles/{roleId}",
      "summary": "Get specific role by id",
      "description": "Get attributes of specific role.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "roleId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "roleId",
          "location": "path",
          "required": true,
          "description": "The identifier of the role",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("getRole"), "roleId": z.number().int().describe("The identifier of the role") }) as any,
  },
  {
    ...{
      "id": "users_updateRole",
      "domain": "users",
      "name": "updateRole",
      "method": "PUT",
      "path": "/v1/roles/{roleId}",
      "summary": "Update specific role by id",
      "description": "Update attributes to your role. Attributes are optional. If not set, the attributes will retain their original values.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "roleId"
      ],
      "queryParams": [],
      "bodyParams": [
        "name",
        "admin",
        "accessAllResources",
        "permissions"
      ],
      "paramMeta": [
        {
          "name": "roleId",
          "location": "path",
          "required": true,
          "description": "The identifier of the role",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "body",
          "required": true,
          "description": "The name of the role. There is a limit of 255 characters per role.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "admin",
          "location": "body",
          "required": true,
          "description": "If user is admin he will have permissions to all API endpoints and resources. Enabling this will superseed all role definitions and `accessAllResources`.",
          "type": "boolean",
          "deprecated": false
        },
        {
          "name": "accessAllResources",
          "location": "body",
          "required": true,
          "description": "Allow access to all resources. This will superseed all assigned resources in a role.",
          "type": "boolean",
          "deprecated": false
        },
        {
          "name": "permissions",
          "location": "body",
          "required": false,
          "description": "",
          "type": "unknown[]",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("updateRole"), "roleId": z.number().int().describe("The identifier of the role"), "name": z.string().min(1).max(255).describe("The name of the role. There is a limit of 255 characters per role."), "admin": z.boolean().describe("If user is admin he will have permissions to all API endpoints and resources. Enabling this will superseed all role definitions and `accessAllResources`."), "accessAllResources": z.boolean().describe("Allow access to all resources. This will superseed all assigned resources in a role."), "permissions": z.array(z.object({ "apiName": z.string().min(1).max(255).describe("The name of the role. There is a limit of 255 characters per role."), "actions": z.array(z.enum(["CREATE", "READ", "UPDATE", "DELETE"])).describe("Action allowed for the API endpoint. Basically `CREATE` corresponds to POST endpoints, `READ` to GET endpoints, `UPDATE` to PATCH / PUT endpoints and `DELETE` to DELETE endpoints."), "resources": z.array(z.number().int()).describe("The IDs of tags. Only if those tags are assgined to a resource the user with that role will be able to access the resource.").optional() })).optional() }) as any,
  },
  {
    ...{
      "id": "users_deleteRole",
      "domain": "users",
      "name": "deleteRole",
      "method": "DELETE",
      "path": "/v1/roles/{roleId}",
      "summary": "Delete existing role by id",
      "description": "You can't delete a role if it is still assigned to a user. In such cases please remove the role from the users.",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "roleId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "roleId",
          "location": "path",
          "required": true,
          "description": "The identifier of the role",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("deleteRole"), "roleId": z.number().int().describe("The identifier of the role") }) as any,
  },
  {
    ...{
      "id": "users_listApiPermissions",
      "domain": "users",
      "name": "listApiPermissions",
      "method": "GET",
      "path": "/v1/roles/api-permissions",
      "summary": "List of API permissions",
      "description": "List all available API permissions. This list serves as a reference for specifying roles. As endpoints differ in their possibilities not all actions are available for each endpoint.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "apiName"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "apiName",
          "location": "query",
          "required": false,
          "description": "The name of api",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("listApiPermissions"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "apiName": z.string().optional().describe("The name of api") }) as any,
  },
  {
    ...{
      "id": "users_listObjectStorageCredentials",
      "domain": "users",
      "name": "listObjectStorageCredentials",
      "method": "GET",
      "path": "/v1/users/{userId}/object-storages/credentials",
      "summary": "Get list of S3 compatible object storage credentials for user.",
      "description": "Get list of S3 compatible object storage credentials for accessing it via S3 compatible tools like `aws` cli.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "userId"
      ],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "objectStorageId",
        "regionName",
        "displayName"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "userId",
          "location": "path",
          "required": true,
          "description": "The identifier of the user.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "objectStorageId",
          "location": "query",
          "required": false,
          "description": "The identifier of the S3 object storage",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "regionName",
          "location": "query",
          "required": false,
          "description": "Filter for Object Storage by regions. Available regions: Asia (Singapore), European Union, United States (Central)",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "displayName",
          "location": "query",
          "required": false,
          "description": "Filter for Object Storage by his displayName.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("listObjectStorageCredentials"), "userId": z.string().describe("The identifier of the user."), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "objectStorageId": z.string().optional().describe("The identifier of the S3 object storage"), "regionName": z.string().optional().describe("Filter for Object Storage by regions. Available regions: Asia (Singapore), European Union, United States (Central)"), "displayName": z.string().optional().describe("Filter for Object Storage by his displayName.") }) as any,
  },
  {
    ...{
      "id": "users_getObjectStorageCredentials",
      "domain": "users",
      "name": "getObjectStorageCredentials",
      "method": "GET",
      "path": "/v1/users/{userId}/object-storages/{objectStorageId}/credentials/{credentialId}",
      "summary": "Get S3 compatible object storage credentials.",
      "description": "Get S3 compatible object storage credentials for accessing it via S3 compatible tools like `aws` cli.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "userId",
        "objectStorageId",
        "credentialId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "userId",
          "location": "path",
          "required": true,
          "description": "The identifier of the user.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "objectStorageId",
          "location": "path",
          "required": true,
          "description": "The identifier of the S3 object storage",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "credentialId",
          "location": "path",
          "required": true,
          "description": "The ID of the object storage credential",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("getObjectStorageCredentials"), "userId": z.string().describe("The identifier of the user."), "objectStorageId": z.string().describe("The identifier of the S3 object storage"), "credentialId": z.number().int().describe("The ID of the object storage credential") }) as any,
  },
  {
    ...{
      "id": "users_regenerateObjectStorageCredentials",
      "domain": "users",
      "name": "regenerateObjectStorageCredentials",
      "method": "PATCH",
      "path": "/v1/users/{userId}/object-storages/{objectStorageId}/credentials/{credentialId}",
      "summary": "Regenerates secret key of specified user for the S3 compatible object storages.",
      "description": "Regenerates secret key of specified user for the a specific S3 compatible object storages.",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "userId",
        "objectStorageId",
        "credentialId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "userId",
          "location": "path",
          "required": true,
          "description": "The identifier of the user.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "objectStorageId",
          "location": "path",
          "required": true,
          "description": "The identifier of the S3 object storage",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "credentialId",
          "location": "path",
          "required": true,
          "description": "The ID of the object storage credential",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("regenerateObjectStorageCredentials"), "userId": z.string().describe("The identifier of the user."), "objectStorageId": z.string().describe("The identifier of the S3 object storage"), "credentialId": z.number().int().describe("The ID of the object storage credential") }) as any,
  },
  {
    ...{
      "id": "audits_users",
      "domain": "audits",
      "name": "users",
      "method": "GET",
      "path": "/v1/users/audits",
      "summary": "List history about your users (audit)",
      "description": "List and filter the history about your users.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "userId",
        "requestId",
        "changedBy",
        "startDate",
        "endDate"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "userId",
          "location": "query",
          "required": false,
          "description": "The identifier of the user.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "requestId",
          "location": "query",
          "required": false,
          "description": "The requestId of the API call which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "changedBy",
          "location": "query",
          "required": false,
          "description": "changedBy of the user which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "startDate",
          "location": "query",
          "required": false,
          "description": "Start of search time range.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "endDate",
          "location": "query",
          "required": false,
          "description": "End of search time range.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("users"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "userId": z.string().optional().describe("The identifier of the user."), "requestId": z.string().optional().describe("The requestId of the API call which led to the change."), "changedBy": z.string().optional().describe("changedBy of the user which led to the change."), "startDate": z.string().optional().describe("Start of search time range."), "endDate": z.string().optional().describe("End of search time range.") }) as any,
  },
  {
    ...{
      "id": "audits_roles",
      "domain": "audits",
      "name": "roles",
      "method": "GET",
      "path": "/v1/roles/audits",
      "summary": "List history about your roles (audit)",
      "description": "List and filter the history about your roles.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "roleId",
        "requestId",
        "changedBy",
        "startDate",
        "endDate"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "roleId",
          "location": "query",
          "required": false,
          "description": "The identifier of the role.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "requestId",
          "location": "query",
          "required": false,
          "description": "The requestId of the API call which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "changedBy",
          "location": "query",
          "required": false,
          "description": "changedBy of the user which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "startDate",
          "location": "query",
          "required": false,
          "description": "Start of search time range.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "endDate",
          "location": "query",
          "required": false,
          "description": "End of search time range.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("roles"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "roleId": z.number().int().optional().describe("The identifier of the role."), "requestId": z.string().optional().describe("The requestId of the API call which led to the change."), "changedBy": z.string().optional().describe("changedBy of the user which led to the change."), "startDate": z.string().optional().describe("Start of search time range."), "endDate": z.string().optional().describe("End of search time range.") }) as any,
  },
  {
    ...{
      "id": "firewalls_create",
      "domain": "firewalls",
      "name": "create",
      "method": "POST",
      "path": "/v1/firewalls",
      "summary": "Create a new firewall definition",
      "description": "Create a new firewall definition by specifying its name and a set of rules. The status of the firewall determines whether the rules are active or not.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [
        "name",
        "description",
        "status",
        "rules"
      ],
      "paramMeta": [
        {
          "name": "name",
          "location": "body",
          "required": true,
          "description": "The name of the firewall.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "description",
          "location": "body",
          "required": false,
          "description": "The description of the firewall.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "status",
          "location": "body",
          "required": true,
          "description": "The status of the firewall determines whether the rules are active or not.",
          "type": "enum(active|inactive)",
          "deprecated": false,
          "enumValues": [
            "active",
            "inactive"
          ]
        },
        {
          "name": "rules",
          "location": "body",
          "required": false,
          "description": "",
          "type": "object",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("create"), "name": z.string().max(255).describe("The name of the firewall."), "description": z.string().max(255).describe("The description of the firewall.").optional(), "status": z.enum(["active", "inactive"]).describe("The status of the firewall determines whether the rules are active or not."), "rules": z.object({ "inbound": z.array(z.object({ "protocol": z.enum(["tcp", "udp", "icmp", ""]).describe("Protocol for incoming traffic to be allowed. ‘tcp‘, ´udp´, ´icmp´ or ´´ empty value are allowed. Empty means any traffic."), "destPorts": z.array(z.string()).describe("Ports to specify allowed traffic. Not available for protocol `ICMP`. Port ranges can specified like in example."), "srcCidr": z.object({ "ipv4": z.array(z.string()).describe("IPv4 addresses in CIDR notation or \"AnyIPv4\" to allow all IPv4 sources (translates to 0.0.0.0/0)").optional(), "ipv6": z.array(z.string()).describe("IPv6 addresses in CIDR notation or \"AnyIPv6\" to allow all IPv6 sources (translates to ::/0)").optional() }).describe("Source CIDR configuration. Use \"AnyIPv4\" to allow all IPv4 sources (0.0.0.0/0) or \"AnyIPv6\" to allow all IPv6 sources (::/0). Both can be combined to allow all IP sources. Regular CIDR notation is also supported."), "action": z.enum(["accept", "drop"]).describe("Currently only `accept` is supported."), "status": z.enum(["active", "inactive"]).describe("Status of the inbound rule. An inactive rule is removed from all assigned instances."), "displayName": z.string().describe("Display name for the firewall rule.").optional() })) }).optional() }) as any,
  },
  {
    ...{
      "id": "firewalls_list",
      "domain": "firewalls",
      "name": "list",
      "method": "GET",
      "path": "/v1/firewalls",
      "summary": "List all firewalls",
      "description": "List and filter all firewalls on your account",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "name",
        "instanceIds"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "query",
          "required": false,
          "description": "The name of the firewall",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "instanceIds",
          "location": "query",
          "required": false,
          "description": "Comma separated instance IDs.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("list"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "name": z.string().optional().describe("The name of the firewall"), "instanceIds": z.string().optional().describe("Comma separated instance IDs.") }) as any,
  },
  {
    ...{
      "id": "firewalls_delete",
      "domain": "firewalls",
      "name": "delete",
      "method": "DELETE",
      "path": "/v1/firewalls/{firewallId}",
      "summary": "Delete existing firewall by id",
      "description": "Delete existing firewall by id. A firewall cannot be deleted if there are instances attached to it.",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "firewallId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "firewallId",
          "location": "path",
          "required": true,
          "description": "The identifier of the firewall",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("delete"), "firewallId": z.string().describe("The identifier of the firewall") }) as any,
  },
  {
    ...{
      "id": "firewalls_get",
      "domain": "firewalls",
      "name": "get",
      "method": "GET",
      "path": "/v1/firewalls/{firewallId}",
      "summary": "Get specific firewall by its id",
      "description": "Get data for a specific firewall on your account.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "firewallId"
      ],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "name",
        "instanceIds"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "firewallId",
          "location": "path",
          "required": true,
          "description": "The identifier of the firewall",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "query",
          "required": false,
          "description": "The name of the firewall",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "instanceIds",
          "location": "query",
          "required": false,
          "description": "Comma separated instance IDs.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("get"), "firewallId": z.string().describe("The identifier of the firewall"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "name": z.string().optional().describe("The name of the firewall"), "instanceIds": z.string().optional().describe("Comma separated instance IDs.") }) as any,
  },
  {
    ...{
      "id": "firewalls_update",
      "domain": "firewalls",
      "name": "update",
      "method": "PATCH",
      "path": "/v1/firewalls/{firewallId}",
      "summary": "Update a firewall by id",
      "description": "Update a firewall by id in your account.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "firewallId"
      ],
      "queryParams": [],
      "bodyParams": [
        "name",
        "status",
        "description"
      ],
      "paramMeta": [
        {
          "name": "firewallId",
          "location": "path",
          "required": true,
          "description": "The identifier of the firewall",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "body",
          "required": false,
          "description": "The name of the firewall",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "status",
          "location": "body",
          "required": false,
          "description": "Active status of the firewall enables all rules, thus filtering traffic. Inactive status does not filter any traffic.",
          "type": "enum(active|inactive)",
          "deprecated": false,
          "enumValues": [
            "active",
            "inactive"
          ]
        },
        {
          "name": "description",
          "location": "body",
          "required": false,
          "description": "The description of the firewall.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("update"), "firewallId": z.string().describe("The identifier of the firewall"), "name": z.string().min(1).max(255).describe("The name of the firewall").optional(), "status": z.enum(["active", "inactive"]).describe("Active status of the firewall enables all rules, thus filtering traffic. Inactive status does not filter any traffic.").optional(), "description": z.string().describe("The description of the firewall.").optional() }) as any,
  },
  {
    ...{
      "id": "firewalls_updateRules",
      "domain": "firewalls",
      "name": "updateRules",
      "method": "PUT",
      "path": "/v1/firewalls/{firewallId}",
      "summary": "Update specific firewall rules",
      "description": "Set rules for a specific firewall. Currently only inbound rules are allowed to be configured.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "firewallId"
      ],
      "queryParams": [],
      "bodyParams": [
        "rules"
      ],
      "paramMeta": [
        {
          "name": "firewallId",
          "location": "path",
          "required": true,
          "description": "The identifier of the firewall",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "rules",
          "location": "body",
          "required": false,
          "description": "",
          "type": "object",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("updateRules"), "firewallId": z.string().describe("The identifier of the firewall"), "rules": z.object({ "inbound": z.array(z.object({ "protocol": z.enum(["tcp", "udp", "icmp", ""]).describe("Protocol for incoming traffic to be allowed. ‘tcp‘, ´udp´, ´icmp´ or ´´ empty value are allowed. Empty means any traffic."), "destPorts": z.array(z.string()).describe("Ports to specify allowed traffic. Not available for protocol `ICMP`. Port ranges can specified like in example."), "srcCidr": z.object({ "ipv4": z.array(z.string()).describe("IPv4 addresses in CIDR notation or \"AnyIPv4\" to allow all IPv4 sources (translates to 0.0.0.0/0)").optional(), "ipv6": z.array(z.string()).describe("IPv6 addresses in CIDR notation or \"AnyIPv6\" to allow all IPv6 sources (translates to ::/0)").optional() }).describe("Source CIDR configuration. Use \"AnyIPv4\" to allow all IPv4 sources (0.0.0.0/0) or \"AnyIPv6\" to allow all IPv6 sources (::/0). Both can be combined to allow all IP sources. Regular CIDR notation is also supported."), "action": z.enum(["accept", "drop"]).describe("Currently only `accept` is supported."), "status": z.enum(["active", "inactive"]).describe("Status of the inbound rule. An inactive rule is removed from all assigned instances."), "displayName": z.string().describe("Display name for the firewall rule.").optional() })) }).optional() }) as any,
  },
  {
    ...{
      "id": "firewalls_assignInstance",
      "domain": "firewalls",
      "name": "assignInstance",
      "method": "POST",
      "path": "/v1/firewalls/{firewallId}/instances/{instanceId}",
      "summary": "Add instance to a firewall",
      "description": "Add a specific instance to a firewall",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "firewallId",
        "instanceId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "firewallId",
          "location": "path",
          "required": true,
          "description": "The identifier of the firewall",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the instance",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("assignInstance"), "firewallId": z.string().describe("The identifier of the firewall"), "instanceId": z.number().int().describe("The identifier of the instance") }) as any,
  },
  {
    ...{
      "id": "firewalls_unassignInstance",
      "domain": "firewalls",
      "name": "unassignInstance",
      "method": "DELETE",
      "path": "/v1/firewalls/{firewallId}/instances/{instanceId}",
      "summary": "Remove instance from a firewall",
      "description": "Remove a specific instance from a firewall",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "firewallId",
        "instanceId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "firewallId",
          "location": "path",
          "required": true,
          "description": "The identifier of the firewall",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the instance",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("unassignInstance"), "firewallId": z.string().describe("The identifier of the firewall"), "instanceId": z.number().int().describe("The identifier of the instance") }) as any,
  },
  {
    ...{
      "id": "firewalls_listPresetRules",
      "domain": "firewalls",
      "name": "listPresetRules",
      "method": "GET",
      "path": "/v1/firewalls/preset-rules",
      "summary": "Get all preset rules",
      "description": "",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "name"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "query",
          "required": false,
          "description": "The name of preset rule",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("listPresetRules"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "name": z.string().optional().describe("The name of preset rule") }) as any,
  },
  {
    ...{
      "id": "audits_firewalls",
      "domain": "audits",
      "name": "firewalls",
      "method": "GET",
      "path": "/v1/firewalls/audits",
      "summary": "List history about your Firewalls (audit)",
      "description": "List and filters the history about your Firewalls.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "firewallId",
        "requestId",
        "changedBy",
        "startDate",
        "endDate"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "firewallId",
          "location": "query",
          "required": false,
          "description": "The identifier of the Firewall.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "requestId",
          "location": "query",
          "required": false,
          "description": "The requestId of the API call which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "changedBy",
          "location": "query",
          "required": false,
          "description": "User name which did the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "startDate",
          "location": "query",
          "required": false,
          "description": "Start of search time range.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "endDate",
          "location": "query",
          "required": false,
          "description": "End of search time range.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("firewalls"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "firewallId": z.string().optional().describe("The identifier of the Firewall."), "requestId": z.string().optional().describe("The requestId of the API call which led to the change."), "changedBy": z.string().optional().describe("User name which did the change."), "startDate": z.string().optional().describe("Start of search time range."), "endDate": z.string().optional().describe("End of search time range.") }) as any,
  },
  {
    ...{
      "id": "troubleshooting_listChecks",
      "domain": "troubleshooting",
      "name": "listChecks",
      "method": "GET",
      "path": "/v1/troubleshooting/checks",
      "summary": "List check",
      "description": "List and filter all check",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "objectType",
        "objectId",
        "status",
        "checkCollectionId",
        "checkTemplateId",
        "page",
        "size",
        "orderBy",
        "creationStartTime",
        "creationEndTime",
        "modificationStartTime",
        "modificationEndTime"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "objectType",
          "location": "query",
          "required": false,
          "description": "Object type to be handled",
          "type": "enum(vserver)",
          "deprecated": false,
          "enumValues": [
            "vserver"
          ]
        },
        {
          "name": "objectId",
          "location": "query",
          "required": false,
          "description": "ID of the object, to be handled",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "status",
          "location": "query",
          "required": false,
          "description": "Status of the handle",
          "type": "enum(queued|running|skipped|cancelled|failed|warn|successful)",
          "deprecated": false,
          "enumValues": [
            "queued",
            "running",
            "skipped",
            "cancelled",
            "failed",
            "warn",
            "successful"
          ]
        },
        {
          "name": "checkCollectionId",
          "location": "query",
          "required": false,
          "description": "ID of check collection if started in scope of a collection",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "checkTemplateId",
          "location": "query",
          "required": false,
          "description": "Check Template for this check",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "creationStartTime",
          "location": "query",
          "required": false,
          "description": "Start of search time range for created date",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "creationEndTime",
          "location": "query",
          "required": false,
          "description": "End of search time range for created date",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "modificationStartTime",
          "location": "query",
          "required": false,
          "description": "Start of search time range for modified date",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "modificationEndTime",
          "location": "query",
          "required": false,
          "description": "End of search time range for modified date",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("listChecks"), "objectType": z.enum(["vserver"]).optional().describe("Object type to be handled"), "objectId": z.string().optional().describe("ID of the object, to be handled"), "status": z.enum(["queued", "running", "skipped", "cancelled", "failed", "warn", "successful"]).optional().describe("Status of the handle"), "checkCollectionId": z.number().optional().describe("ID of check collection if started in scope of a collection"), "checkTemplateId": z.number().optional().describe("Check Template for this check"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "creationStartTime": z.string().optional().describe("Start of search time range for created date"), "creationEndTime": z.string().optional().describe("End of search time range for created date"), "modificationStartTime": z.string().optional().describe("Start of search time range for modified date"), "modificationEndTime": z.string().optional().describe("End of search time range for modified date") }) as any,
  },
  {
    ...{
      "id": "troubleshooting_startCheck",
      "domain": "troubleshooting",
      "name": "startCheck",
      "method": "POST",
      "path": "/v1/troubleshooting/checks",
      "summary": "Start check",
      "description": "Start a new check",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [
        "objectType",
        "objectId",
        "checkTemplateId",
        "checkCollectionId"
      ],
      "paramMeta": [
        {
          "name": "objectType",
          "location": "body",
          "required": true,
          "description": "Object type to be handled",
          "type": "enum(vserver)",
          "deprecated": false,
          "enumValues": [
            "vserver"
          ]
        },
        {
          "name": "objectId",
          "location": "body",
          "required": true,
          "description": "ID of the object, to be handled",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "checkTemplateId",
          "location": "body",
          "required": true,
          "description": "Check Template for this check",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "checkCollectionId",
          "location": "body",
          "required": false,
          "description": "Check Collection for this check",
          "type": "number",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("startCheck"), "objectType": z.enum(["vserver"]).describe("Object type to be handled"), "objectId": z.string().describe("ID of the object, to be handled"), "checkTemplateId": z.number().describe("Check Template for this check"), "checkCollectionId": z.number().describe("Check Collection for this check").optional() }) as any,
  },
  {
    ...{
      "id": "troubleshooting_getCheck",
      "domain": "troubleshooting",
      "name": "getCheck",
      "method": "GET",
      "path": "/v1/troubleshooting/checks/{checkId}",
      "summary": "Get check",
      "description": "Get a single check by id",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "checkId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "checkId",
          "location": "path",
          "required": true,
          "description": "Check's id",
          "type": "number",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("getCheck"), "checkId": z.number().describe("Check's id") }) as any,
  },
  {
    ...{
      "id": "troubleshooting_cancelCheck",
      "domain": "troubleshooting",
      "name": "cancelCheck",
      "method": "PATCH",
      "path": "/v1/troubleshooting/checks/{checkId}",
      "summary": "Cancel check",
      "description": "Cancel check",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "checkId"
      ],
      "queryParams": [],
      "bodyParams": [
        "status"
      ],
      "paramMeta": [
        {
          "name": "checkId",
          "location": "path",
          "required": true,
          "description": "Check's id",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "status",
          "location": "body",
          "required": false,
          "description": "Status can be only set to cancelled",
          "type": "enum(cancelled)",
          "deprecated": false,
          "enumValues": [
            "cancelled"
          ]
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("cancelCheck"), "checkId": z.number().describe("Check's id"), "status": z.enum(["cancelled"]).describe("Status can be only set to cancelled").optional() }) as any,
  },
  {
    ...{
      "id": "troubleshooting_listCheckCollections",
      "domain": "troubleshooting",
      "name": "listCheckCollections",
      "method": "GET",
      "path": "/v1/troubleshooting/check-collections",
      "summary": "List check collections",
      "description": "List and filter all check collections",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "objectType",
        "objectId",
        "checkCollectionTemplateId",
        "excludeCheckStatuses",
        "page",
        "size",
        "orderBy",
        "creationStartTime",
        "creationEndTime",
        "modificationStartTime",
        "modificationEndTime"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "objectType",
          "location": "query",
          "required": false,
          "description": "Object type to be handled",
          "type": "enum(vserver)",
          "deprecated": false,
          "enumValues": [
            "vserver"
          ]
        },
        {
          "name": "objectId",
          "location": "query",
          "required": false,
          "description": "ID of the object, to be handled",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "checkCollectionTemplateId",
          "location": "query",
          "required": false,
          "description": "Check Collection Template for this check collection",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "excludeCheckStatuses",
          "location": "query",
          "required": false,
          "description": "Check statuses to exclude",
          "type": "enum(queued|running|skipped|cancelled|failed|warn|successful)[]",
          "deprecated": false
        },
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "creationStartTime",
          "location": "query",
          "required": false,
          "description": "Start of search time range for created date",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "creationEndTime",
          "location": "query",
          "required": false,
          "description": "End of search time range for created date",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "modificationStartTime",
          "location": "query",
          "required": false,
          "description": "Start of search time range for modified date",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "modificationEndTime",
          "location": "query",
          "required": false,
          "description": "End of search time range for modified date",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("listCheckCollections"), "objectType": z.enum(["vserver"]).optional().describe("Object type to be handled"), "objectId": z.string().optional().describe("ID of the object, to be handled"), "checkCollectionTemplateId": z.number().optional().describe("Check Collection Template for this check collection"), "excludeCheckStatuses": z.array(z.enum(["queued", "running", "skipped", "cancelled", "failed", "warn", "successful"])).optional().describe("Check statuses to exclude"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "creationStartTime": z.string().optional().describe("Start of search time range for created date"), "creationEndTime": z.string().optional().describe("End of search time range for created date"), "modificationStartTime": z.string().optional().describe("Start of search time range for modified date"), "modificationEndTime": z.string().optional().describe("End of search time range for modified date") }) as any,
  },
  {
    ...{
      "id": "troubleshooting_startCheckCollection",
      "domain": "troubleshooting",
      "name": "startCheckCollection",
      "method": "POST",
      "path": "/v1/troubleshooting/check-collections",
      "summary": "Start check collection",
      "description": "Start a new check collection",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [
        "objectType",
        "objectId",
        "checkCollectionTemplateId"
      ],
      "paramMeta": [
        {
          "name": "objectType",
          "location": "body",
          "required": true,
          "description": "Object type to be handled",
          "type": "enum(vserver)",
          "deprecated": false,
          "enumValues": [
            "vserver"
          ]
        },
        {
          "name": "objectId",
          "location": "body",
          "required": true,
          "description": "ID of the object, to be handled",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "checkCollectionTemplateId",
          "location": "body",
          "required": true,
          "description": "Check Template for this check collection",
          "type": "number",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("startCheckCollection"), "objectType": z.enum(["vserver"]).describe("Object type to be handled"), "objectId": z.string().describe("ID of the object, to be handled"), "checkCollectionTemplateId": z.number().describe("Check Template for this check collection") }) as any,
  },
  {
    ...{
      "id": "troubleshooting_getCheckCollection",
      "domain": "troubleshooting",
      "name": "getCheckCollection",
      "method": "GET",
      "path": "/v1/troubleshooting/check-collections/{checkCollectionId}",
      "summary": "Get check collection",
      "description": "Get a single check collection by id",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "checkCollectionId"
      ],
      "queryParams": [
        "excludeCheckStatuses"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "checkCollectionId",
          "location": "path",
          "required": true,
          "description": "Check collection's id",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "excludeCheckStatuses",
          "location": "query",
          "required": false,
          "description": "Check statuses to exclude",
          "type": "enum(queued|running|skipped|cancelled|failed|warn|successful)[]",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("getCheckCollection"), "checkCollectionId": z.number().describe("Check collection's id"), "excludeCheckStatuses": z.array(z.enum(["queued", "running", "skipped", "cancelled", "failed", "warn", "successful"])).optional().describe("Check statuses to exclude") }) as any,
  },
  {
    ...{
      "id": "troubleshooting_cancelCheckCollection",
      "domain": "troubleshooting",
      "name": "cancelCheckCollection",
      "method": "PATCH",
      "path": "/v1/troubleshooting/check-collections/{checkCollectionId}",
      "summary": "Cancel check collection",
      "description": "Cancel check collection",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "checkCollectionId"
      ],
      "queryParams": [],
      "bodyParams": [
        "status"
      ],
      "paramMeta": [
        {
          "name": "checkCollectionId",
          "location": "path",
          "required": true,
          "description": "Check collection's id",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "status",
          "location": "body",
          "required": false,
          "description": "Status can be only set to cancelled",
          "type": "enum(cancelled)",
          "deprecated": false,
          "enumValues": [
            "cancelled"
          ]
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("cancelCheckCollection"), "checkCollectionId": z.number().describe("Check collection's id"), "status": z.enum(["cancelled"]).describe("Status can be only set to cancelled").optional() }) as any,
  },
  {
    ...{
      "id": "troubleshooting_listCheckCollectionTemplates",
      "domain": "troubleshooting",
      "name": "listCheckCollectionTemplates",
      "method": "GET",
      "path": "/v1/troubleshooting/check-collection-templates",
      "summary": "List check collection templates",
      "description": "List and filter all check collection templates",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "objectType",
        "page",
        "size",
        "orderBy",
        "creationStartTime",
        "creationEndTime",
        "modificationStartTime",
        "modificationEndTime"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "objectType",
          "location": "query",
          "required": false,
          "description": "Object type for which the check template can be used",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "creationStartTime",
          "location": "query",
          "required": false,
          "description": "Start of search time range for created date",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "creationEndTime",
          "location": "query",
          "required": false,
          "description": "End of search time range for created date",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "modificationStartTime",
          "location": "query",
          "required": false,
          "description": "Start of search time range for modified date",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "modificationEndTime",
          "location": "query",
          "required": false,
          "description": "End of search time range for modified date",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("listCheckCollectionTemplates"), "objectType": z.string().optional().describe("Object type for which the check template can be used"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "creationStartTime": z.string().optional().describe("Start of search time range for created date"), "creationEndTime": z.string().optional().describe("End of search time range for created date"), "modificationStartTime": z.string().optional().describe("Start of search time range for modified date"), "modificationEndTime": z.string().optional().describe("End of search time range for modified date") }) as any,
  },
  {
    ...{
      "id": "troubleshooting_getCheckCollectionTemplate",
      "domain": "troubleshooting",
      "name": "getCheckCollectionTemplate",
      "method": "GET",
      "path": "/v1/troubleshooting/check-collection-templates/{checkCollectionTemplateId}",
      "summary": "Get check",
      "description": "Get a single check collection template by id",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "checkCollectionTemplateId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "checkCollectionTemplateId",
          "location": "path",
          "required": true,
          "description": "Check collection template's id",
          "type": "number",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("getCheckCollectionTemplate"), "checkCollectionTemplateId": z.number().describe("Check collection template's id") }) as any,
  },
  {
    ...{
      "id": "troubleshooting_listRemedies",
      "domain": "troubleshooting",
      "name": "listRemedies",
      "method": "GET",
      "path": "/v1/troubleshooting/remedies",
      "summary": "List remedy",
      "description": "List and filter all remedy",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "objectType",
        "objectId",
        "status",
        "remedyCollectionId",
        "remedyTemplateId",
        "page",
        "size",
        "orderBy",
        "creationStartTime",
        "creationEndTime",
        "modificationStartTime",
        "modificationEndTime"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "objectType",
          "location": "query",
          "required": false,
          "description": "Object type to be handled",
          "type": "enum(vserver)",
          "deprecated": false,
          "enumValues": [
            "vserver"
          ]
        },
        {
          "name": "objectId",
          "location": "query",
          "required": false,
          "description": "ID of the object, to be handled",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "status",
          "location": "query",
          "required": false,
          "description": "Status of the handle",
          "type": "enum(queued|running|skipped|cancelled|failed|warn|successful)",
          "deprecated": false,
          "enumValues": [
            "queued",
            "running",
            "skipped",
            "cancelled",
            "failed",
            "warn",
            "successful"
          ]
        },
        {
          "name": "remedyCollectionId",
          "location": "query",
          "required": false,
          "description": "ID of remedy collection if started in scope of a collection",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "remedyTemplateId",
          "location": "query",
          "required": false,
          "description": "Remedy Template for this check",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "creationStartTime",
          "location": "query",
          "required": false,
          "description": "Start of search time range for created date",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "creationEndTime",
          "location": "query",
          "required": false,
          "description": "End of search time range for created date",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "modificationStartTime",
          "location": "query",
          "required": false,
          "description": "Start of search time range for modified date",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "modificationEndTime",
          "location": "query",
          "required": false,
          "description": "End of search time range for modified date",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("listRemedies"), "objectType": z.enum(["vserver"]).optional().describe("Object type to be handled"), "objectId": z.string().optional().describe("ID of the object, to be handled"), "status": z.enum(["queued", "running", "skipped", "cancelled", "failed", "warn", "successful"]).optional().describe("Status of the handle"), "remedyCollectionId": z.number().optional().describe("ID of remedy collection if started in scope of a collection"), "remedyTemplateId": z.number().optional().describe("Remedy Template for this check"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "creationStartTime": z.string().optional().describe("Start of search time range for created date"), "creationEndTime": z.string().optional().describe("End of search time range for created date"), "modificationStartTime": z.string().optional().describe("Start of search time range for modified date"), "modificationEndTime": z.string().optional().describe("End of search time range for modified date") }) as any,
  },
  {
    ...{
      "id": "troubleshooting_startRemedy",
      "domain": "troubleshooting",
      "name": "startRemedy",
      "method": "POST",
      "path": "/v1/troubleshooting/remedies",
      "summary": "Start remedy",
      "description": "Start a new remedy",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [
        "objectType",
        "objectId",
        "remedyTemplateId",
        "remedyCollectionId"
      ],
      "paramMeta": [
        {
          "name": "objectType",
          "location": "body",
          "required": true,
          "description": "Object type to be handled",
          "type": "enum(vserver)",
          "deprecated": false,
          "enumValues": [
            "vserver"
          ]
        },
        {
          "name": "objectId",
          "location": "body",
          "required": true,
          "description": "ID of the object, to be handled",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "remedyTemplateId",
          "location": "body",
          "required": true,
          "description": "Remedy Template for this remedy",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "remedyCollectionId",
          "location": "body",
          "required": false,
          "description": "Remedy Collection for this remedy",
          "type": "number",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("startRemedy"), "objectType": z.enum(["vserver"]).describe("Object type to be handled"), "objectId": z.string().describe("ID of the object, to be handled"), "remedyTemplateId": z.number().describe("Remedy Template for this remedy"), "remedyCollectionId": z.number().describe("Remedy Collection for this remedy").optional() }) as any,
  },
  {
    ...{
      "id": "troubleshooting_getRemedy",
      "domain": "troubleshooting",
      "name": "getRemedy",
      "method": "GET",
      "path": "/v1/troubleshooting/remedies/{remedyId}",
      "summary": "Get remedy",
      "description": "Get a single remedy by id",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "remedyId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "remedyId",
          "location": "path",
          "required": true,
          "description": "Remedy's id",
          "type": "number",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("getRemedy"), "remedyId": z.number().describe("Remedy's id") }) as any,
  },
  {
    ...{
      "id": "troubleshooting_cancelRemedy",
      "domain": "troubleshooting",
      "name": "cancelRemedy",
      "method": "PATCH",
      "path": "/v1/troubleshooting/remedies/{remedyId}",
      "summary": "Cancel remedy",
      "description": "Cancel remedy",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "remedyId"
      ],
      "queryParams": [],
      "bodyParams": [
        "status"
      ],
      "paramMeta": [
        {
          "name": "remedyId",
          "location": "path",
          "required": true,
          "description": "Remedy's id",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "status",
          "location": "body",
          "required": false,
          "description": "Status can be only set to cancelled",
          "type": "enum(cancelled)",
          "deprecated": false,
          "enumValues": [
            "cancelled"
          ]
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("cancelRemedy"), "remedyId": z.number().describe("Remedy's id"), "status": z.enum(["cancelled"]).describe("Status can be only set to cancelled").optional() }) as any,
  },
  {
    ...{
      "id": "instances_start",
      "domain": "instances",
      "name": "start",
      "method": "POST",
      "path": "/v1/compute/instances/{instanceId}/actions/start",
      "summary": "Start a compute instance / resource identified by its id",
      "description": "Starting a compute instance / resource is like powering on a real server. If the compute instance / resource is already started nothing will happen. You may check the current status anytime when getting information about a compute instance / resource.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "instanceId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the compute instance / resource to be started in rescue mode.",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("start"), "instanceId": z.number().int().describe("The identifier of the compute instance / resource to be started in rescue mode.") }) as any,
  },
  {
    ...{
      "id": "instances_restart",
      "domain": "instances",
      "name": "restart",
      "method": "POST",
      "path": "/v1/compute/instances/{instanceId}/actions/restart",
      "summary": "Restart a compute instance / resource identified by its id.",
      "description": "To restart a compute instance that has been identified by its id, you should perform a restart action on it.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "instanceId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the compute instance / resource to be started in rescue mode.",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("restart"), "instanceId": z.number().int().describe("The identifier of the compute instance / resource to be started in rescue mode.") }) as any,
  },
  {
    ...{
      "id": "instances_stop",
      "domain": "instances",
      "name": "stop",
      "method": "POST",
      "path": "/v1/compute/instances/{instanceId}/actions/stop",
      "summary": "Stop compute instance / resource by its id",
      "description": "Stopping a compute instance / resource is like powering off a real server. So please be aware that data may be lost. Alternatively you may log in and shut your compute instance / resource gracefully via the operating system. If the compute instance / resource is already stopped nothing will happen. You may check the current status anytime when getting information about a compute instance / resource.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "instanceId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the compute instance / resource to be started in rescue mode.",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("stop"), "instanceId": z.number().int().describe("The identifier of the compute instance / resource to be started in rescue mode.") }) as any,
  },
  {
    ...{
      "id": "instances_shutdown",
      "domain": "instances",
      "name": "shutdown",
      "method": "POST",
      "path": "/v1/compute/instances/{instanceId}/actions/shutdown",
      "summary": "Shutdown compute instance / resource by its id",
      "description": "Shutdown an compute instance / resource. This is similar to pressing the power button on a physical machine. This will send an ACPI event for the guest OS, which should then proceed to a clean shutdown.",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "instanceId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the compute instance / resource to be started in rescue mode.",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("shutdown"), "instanceId": z.number().int().describe("The identifier of the compute instance / resource to be started in rescue mode.") }) as any,
  },
  {
    ...{
      "id": "instances_rescue",
      "domain": "instances",
      "name": "rescue",
      "method": "POST",
      "path": "/v1/compute/instances/{instanceId}/actions/rescue",
      "summary": "Rescue a compute instance / resource identified by its id",
      "description": "You can reboot your instance in rescue mode to resolve system issues. Rescue system is Linux based and its booted instead of your regular operating system. The disk containing your operating sytstem, software and your data is already mounted for you to access and repair/modify files. After a reboot your compute instance will boot your operating system. Please note that this is for advanced users.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "instanceId"
      ],
      "queryParams": [],
      "bodyParams": [
        "rootPassword",
        "sshKeys",
        "userData"
      ],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the compute instance / resource to be started in rescue mode.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "rootPassword",
          "location": "body",
          "required": false,
          "description": "`secretId` of the password to login into rescue system for the `root` user.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "sshKeys",
          "location": "body",
          "required": false,
          "description": "Array of `secretId`s of public SSH keys for logging into rescue system as `root` user.",
          "type": "integer[]",
          "deprecated": false
        },
        {
          "name": "userData",
          "location": "body",
          "required": false,
          "description": "[Cloud-Init](https://cloud-init.io/) Config in order to customize during start of compute instance.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("rescue"), "instanceId": z.number().int().describe("The identifier of the compute instance / resource to be started in rescue mode."), "rootPassword": z.number().int().describe("`secretId` of the password to login into rescue system for the `root` user.").optional(), "sshKeys": z.array(z.number().int()).describe("Array of `secretId`s of public SSH keys for logging into rescue system as `root` user.").optional(), "userData": z.string().describe("[Cloud-Init](https://cloud-init.io/) Config in order to customize during start of compute instance.").optional() }) as any,
  },
  {
    ...{
      "id": "instances_resetPassword",
      "domain": "instances",
      "name": "resetPassword",
      "method": "POST",
      "path": "/v1/compute/instances/{instanceId}/actions/resetPassword",
      "summary": "Reset password for a compute instance / resource referenced by an id",
      "description": "Reset password for a compute instance / resource referenced by an id. This will reset the current password to the password that you provided in the body of this request.",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "instanceId"
      ],
      "queryParams": [],
      "bodyParams": [
        "sshKeys",
        "rootPassword",
        "userData"
      ],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the compute instance / resource to be started in rescue mode.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "sshKeys",
          "location": "body",
          "required": false,
          "description": "Array of `secretId`s of public SSH keys for logging into as `defaultUser` with administrator/root privileges. Applies to Linux/BSD systems. Please refer to Secrets Management API.",
          "type": "integer[]",
          "deprecated": false
        },
        {
          "name": "rootPassword",
          "location": "body",
          "required": false,
          "description": "`secretId` of the password for the `defaultUser` with administrator/root privileges. For Linux/BSD please use SSH, for Windows RDP. Please refer to Secrets Management API.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "userData",
          "location": "body",
          "required": false,
          "description": "[Cloud-Init](https://cloud-init.io/) Config in order to customize during start of compute instance.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("resetPassword"), "instanceId": z.number().int().describe("The identifier of the compute instance / resource to be started in rescue mode."), "sshKeys": z.array(z.number().int()).describe("Array of `secretId`s of public SSH keys for logging into as `defaultUser` with administrator/root privileges. Applies to Linux/BSD systems. Please refer to Secrets Management API.").optional(), "rootPassword": z.number().int().describe("`secretId` of the password for the `defaultUser` with administrator/root privileges. For Linux/BSD please use SSH, for Windows RDP. Please refer to Secrets Management API.").optional(), "userData": z.string().describe("[Cloud-Init](https://cloud-init.io/) Config in order to customize during start of compute instance.").optional() }) as any,
  },
  {
    ...{
      "id": "instances_list",
      "domain": "instances",
      "name": "list",
      "method": "GET",
      "path": "/v1/compute/instances",
      "summary": "List instances",
      "description": "List and filter all instances in your account",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "name",
        "displayName",
        "dataCenter",
        "region",
        "instanceId",
        "instanceIds",
        "status",
        "productIds",
        "addOnIds",
        "productTypes",
        "ipConfig",
        "suspended",
        "search",
        "customerId",
        "tenantId"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "query",
          "required": false,
          "description": "The name of the instance",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "displayName",
          "location": "query",
          "required": false,
          "description": "The display name of the instance",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "dataCenter",
          "location": "query",
          "required": false,
          "description": "The data center of the instance",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "region",
          "location": "query",
          "required": false,
          "description": "The Region of the instance",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "instanceId",
          "location": "query",
          "required": false,
          "description": "The identifier of the instance (deprecated)",
          "type": "integer",
          "deprecated": true
        },
        {
          "name": "instanceIds",
          "location": "query",
          "required": false,
          "description": "Comma separated instances identifiers",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "status",
          "location": "query",
          "required": false,
          "description": "The status of the instance",
          "type": "enum(provisioning|uninstalled|running|stopped|error|installing|unknown|manual_provisioning|product_not_available|verification_required|rescue|pending_payment|other|reset_password)",
          "deprecated": false,
          "enumValues": [
            "provisioning",
            "uninstalled",
            "running",
            "stopped",
            "error",
            "installing",
            "unknown",
            "manual_provisioning",
            "product_not_available",
            "verification_required",
            "rescue",
            "pending_payment",
            "other",
            "reset_password"
          ]
        },
        {
          "name": "productIds",
          "location": "query",
          "required": false,
          "description": "Identifiers of the instance products",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "addOnIds",
          "location": "query",
          "required": false,
          "description": "Identifiers of Addons the instances have",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "productTypes",
          "location": "query",
          "required": false,
          "description": "Comma separated instance's category depending on Product Id",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "ipConfig",
          "location": "query",
          "required": false,
          "description": "Filter instances that have an ip config",
          "type": "boolean",
          "deprecated": false
        },
        {
          "name": "suspended",
          "location": "query",
          "required": false,
          "description": "Filter instances by suspension state. When set to false, suspended instances are excluded from the response. Any other value returns all instances (default behavior).",
          "type": "boolean",
          "deprecated": false
        },
        {
          "name": "search",
          "location": "query",
          "required": false,
          "description": "Full text search when listing the instances. Can be searched by `name`, `displayName`, `ipAddress`",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "customerId",
          "location": "query",
          "required": false,
          "description": "Filter by customer ID",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "tenantId",
          "location": "query",
          "required": false,
          "description": "Filter by tenant ID",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("list"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "name": z.string().optional().describe("The name of the instance"), "displayName": z.string().optional().describe("The display name of the instance"), "dataCenter": z.string().optional().describe("The data center of the instance"), "region": z.string().optional().describe("The Region of the instance"), "instanceId": z.number().int().optional().describe("The identifier of the instance (deprecated)"), "instanceIds": z.string().optional().describe("Comma separated instances identifiers"), "status": z.enum(["provisioning", "uninstalled", "running", "stopped", "error", "installing", "unknown", "manual_provisioning", "product_not_available", "verification_required", "rescue", "pending_payment", "other", "reset_password"]).optional().describe("The status of the instance"), "productIds": z.string().optional().describe("Identifiers of the instance products"), "addOnIds": z.string().optional().describe("Identifiers of Addons the instances have"), "productTypes": z.string().optional().describe("Comma separated instance's category depending on Product Id"), "ipConfig": z.boolean().optional().describe("Filter instances that have an ip config"), "suspended": z.boolean().optional().describe("Filter instances by suspension state. When set to false, suspended instances are excluded from the response. Any other value returns all instances (default behavior)."), "search": z.string().optional().describe("Full text search when listing the instances. Can be searched by `name`, `displayName`, `ipAddress`"), "customerId": z.string().optional().describe("Filter by customer ID"), "tenantId": z.string().optional().describe("Filter by tenant ID") }) as any,
  },
  {
    ...{
      "id": "instances_create",
      "domain": "instances",
      "name": "create",
      "method": "POST",
      "path": "/v1/compute/instances",
      "summary": "Create a new instance",
      "description": "Create a new instance for your account with the provided parameters.         <table>           <tr><th>ProductId</th><th>Product</th><th>Disk Size</th></tr>           <tr><td>V153</td><td>Cloud VPS 4</td><td>100 GB SSD</td></tr>           <tr><td>V154</td><td>Cloud VPS 6</td><td>200 GB SSD</td></tr>           <tr><td>V155</td><td>Cloud VPS 8</td><td>300 GB SSD</td></tr>           <tr><td>V156</td><td>Cloud VPS 12</td><td>400 GB SSD</td></tr>           <tr><td>V157</td><td>Cloud VPS 16</td><td>500 GB SSD</td></tr>           <tr><td>V158</td><td>Cloud VPS 18</td><td>600 GB SSD</td></tr>           <tr><td>V159</td><td>Cloud VPS Plus 4</td><td>150 GB NVMe</td></tr>           <tr><td>V160</td><td>Cloud VPS Plus 6</td><td>300 GB NVMe</td></tr>           <tr><td>V161</td><td>Cloud VPS Plus 8</td><td>450 GB NVMe</td></tr>           <tr><td>V162</td><td>Cloud VPS Plus 12</td><td>600 GB NVMe</td></tr>           <tr><td>V163</td><td>Cloud VPS Plus 16</td><td>750 GB NVMe</td></tr>           <tr><td>V164</td><td>Cloud VPS Plus 18</td><td>900 GB NVMe</td></tr>           <tr><td>V93</td><td>VPS 10 Storage</td><td>300 GB SSD</td></tr>          <tr><td>V96</td><td>VPS 20 Storage</td><td>400 GB SSD</td></tr>           <tr><td>V99</td><td>VPS 30 Storage</td><td>1000 GB SSD</td></tr>           <tr><td>V102</td><td>VPS 40 Storage</td><td>1200 GB SSD</td></tr>           <tr><td>V105</td><td>VPS 50 Storage</td><td>1400 GB SSD</td></tr>           <tr><td>V8</td><td>VDS S</td><td>180 GB NVMe</td></tr>           <tr><td>V9</td><td>VDS M</td><td>240 GB NVMe</td></tr>           <tr><td>V10</td><td>VDS L</td><td>360 GB NVMe</td></tr>           <tr><td>V11</td><td>VDS XL</td><td>480 GB NVMe</td></tr>           <tr><td>V16</td><td>VDS XXL</td><td>720 GB NVMe</td></tr>           </table>",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [
        "imageId",
        "productId",
        "region",
        "sshKeys",
        "rootPassword",
        "userData",
        "license",
        "period",
        "displayName",
        "defaultUser",
        "addOns",
        "applicationId"
      ],
      "paramMeta": [
        {
          "name": "imageId",
          "location": "body",
          "required": false,
          "description": "ImageId to be used to setup the compute instance. Default is Ubuntu 22.04",
          "type": "string",
          "deprecated": false,
          "defaultValue": "afecbb85-e2fc-46f0-9684-b46b1faf00bb"
        },
        {
          "name": "productId",
          "location": "body",
          "required": false,
          "description": "Default is V153",
          "type": "string",
          "deprecated": false,
          "defaultValue": "V153"
        },
        {
          "name": "region",
          "location": "body",
          "required": false,
          "description": "Instance Region where the compute instance should be located. Default is EU",
          "type": "enum(EU|US-central|US-east|US-west|SIN|UK|AUS|JPN|IND)",
          "deprecated": false,
          "enumValues": [
            "EU",
            "US-central",
            "US-east",
            "US-west",
            "SIN",
            "UK",
            "AUS",
            "JPN",
            "IND"
          ],
          "defaultValue": "EU"
        },
        {
          "name": "sshKeys",
          "location": "body",
          "required": false,
          "description": "Array of `secretId`s of public SSH keys for logging into as `defaultUser` with administrator/root privileges. Applies to Linux/BSD systems. Please refer to Secrets Management API.",
          "type": "integer[]",
          "deprecated": false
        },
        {
          "name": "rootPassword",
          "location": "body",
          "required": false,
          "description": "`secretId` of the password for the `defaultUser` with administrator/root privileges. For Linux/BSD please use SSH, for Windows RDP. Please refer to Secrets Management API.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "userData",
          "location": "body",
          "required": false,
          "description": "[Cloud-Init](https://cloud-init.io/) Config in order to customize during start of compute instance.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "license",
          "location": "body",
          "required": false,
          "description": "Additional licence in order to enhance your chosen product, mainly needed for software licenses on your product (not needed for windows).",
          "type": "enum(cPanel5|cPanel30|cPanel50|cPanel100|cPanel150|cPanel200|cPanel250|cPanel300|cPanel350|cPanel400|cPanel450|cPanel500|cPanel550|cPanel600|cPanel650|cPanel700|cPanel750|cPanel800|cPanel850|cPanel900|cPanel950|cPanel1000|PleskAdmin|PleskHost|PleskPro)",
          "deprecated": false,
          "enumValues": [
            "cPanel5",
            "cPanel30",
            "cPanel50",
            "cPanel100",
            "cPanel150",
            "cPanel200",
            "cPanel250",
            "cPanel300",
            "cPanel350",
            "cPanel400",
            "cPanel450",
            "cPanel500",
            "cPanel550",
            "cPanel600",
            "cPanel650",
            "cPanel700",
            "cPanel750",
            "cPanel800",
            "cPanel850",
            "cPanel900",
            "cPanel950",
            "cPanel1000",
            "PleskAdmin",
            "PleskHost",
            "PleskPro"
          ]
        },
        {
          "name": "period",
          "location": "body",
          "required": true,
          "description": "Initial contract period in months. Available periods are: 1, 12 and 24 months. Default to 1 month",
          "type": "integer",
          "deprecated": false,
          "defaultValue": 1
        },
        {
          "name": "displayName",
          "location": "body",
          "required": false,
          "description": "The display name of the instance. Pass an empty string to leave it unset.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "defaultUser",
          "location": "body",
          "required": false,
          "description": "Default user name created for login during (re-)installation with administrative privileges. Allowed values for Linux/BSD are `admin` (use sudo to apply administrative privileges like root) or `root`. Allowed values for Windows are `admin` (has administrative privileges like administrator) or `administrator`.",
          "type": "enum(root|admin|administrator)",
          "deprecated": false,
          "enumValues": [
            "root",
            "admin",
            "administrator"
          ],
          "defaultValue": "admin"
        },
        {
          "name": "addOns",
          "location": "body",
          "required": false,
          "description": "Set attributes in the addons object for the corresponding ones that need to be added to the instance",
          "type": "object",
          "deprecated": false
        },
        {
          "name": "applicationId",
          "location": "body",
          "required": false,
          "description": "Application ID",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("create"), "imageId": z.string().default("afecbb85-e2fc-46f0-9684-b46b1faf00bb").describe("ImageId to be used to setup the compute instance. Default is Ubuntu 22.04"), "productId": z.string().min(1).default("V153").describe("Default is V153"), "region": z.enum(["EU", "US-central", "US-east", "US-west", "SIN", "UK", "AUS", "JPN", "IND"]).default("EU").describe("Instance Region where the compute instance should be located. Default is EU"), "sshKeys": z.array(z.number().int()).describe("Array of `secretId`s of public SSH keys for logging into as `defaultUser` with administrator/root privileges. Applies to Linux/BSD systems. Please refer to Secrets Management API.").optional(), "rootPassword": z.number().int().describe("`secretId` of the password for the `defaultUser` with administrator/root privileges. For Linux/BSD please use SSH, for Windows RDP. Please refer to Secrets Management API.").optional(), "userData": z.string().describe("[Cloud-Init](https://cloud-init.io/) Config in order to customize during start of compute instance.").optional(), "license": z.enum(["cPanel5", "cPanel30", "cPanel50", "cPanel100", "cPanel150", "cPanel200", "cPanel250", "cPanel300", "cPanel350", "cPanel400", "cPanel450", "cPanel500", "cPanel550", "cPanel600", "cPanel650", "cPanel700", "cPanel750", "cPanel800", "cPanel850", "cPanel900", "cPanel950", "cPanel1000", "PleskAdmin", "PleskHost", "PleskPro"]).describe("Additional licence in order to enhance your chosen product, mainly needed for software licenses on your product (not needed for windows).").optional(), "period": z.number().int().default(1).describe("Initial contract period in months. Available periods are: 1, 12 and 24 months. Default to 1 month"), "displayName": z.string().max(255).describe("The display name of the instance. Pass an empty string to leave it unset.").optional(), "defaultUser": z.enum(["root", "admin", "administrator"]).default("admin").describe("Default user name created for login during (re-)installation with administrative privileges. Allowed values for Linux/BSD are `admin` (use sudo to apply administrative privileges like root) or `root`. Allowed values for Windows are `admin` (has administrative privileges like administrator) or `administrator`."), "addOns": z.object({ "privateNetworking": z.looseObject({}).describe("Set this attribute if you want to upgrade your instance with the Private Networking addon.   Please provide an empty object for the time being as value. There will be more configuration possible   in the future.").optional(), "additionalIps": z.looseObject({}).describe("Set this attribute if you want to upgrade your instance with the Additional IPs addon. Please provide an empty object for the time being as value. There will be more configuration possible in the future.").optional(), "backup": z.looseObject({}).describe("Set this attribute if you want to upgrade your instance with the Automated backup addon.     Please provide an empty object for the time being as value. There will be more configuration possible     in the future.").optional(), "extraStorage": z.object({ "ssd": z.array(z.string()).describe("Specify the size in TB and the quantity").optional(), "nvme": z.array(z.string()).describe("Specify the size in TB and the quantity").optional() }).describe("Set this attribute if you want to upgrade your instance with the Extra Storage addon.").optional(), "customImage": z.looseObject({}).describe("Set this attribute if you want to upgrade your instance with the Custom Images addon.   Please provide an empty object for the time being as value. There will be more configuration possible   in the future.").optional(), "addonsIds": z.array(z.object({ "id": z.number().int().describe("Id of the Addon. Please refer to list [here](https://contabo.com/en/product-list/?show_ids=true)."), "quantity": z.number().int().describe("The number of Addons you wish to aquire.") })).optional() }).describe("Set attributes in the addons object for the corresponding ones that need to be added to the instance").optional(), "applicationId": z.string().describe("Application ID").optional() }) as any,
  },
  {
    ...{
      "id": "instances_checkRegionChange",
      "domain": "instances",
      "name": "checkRegionChange",
      "method": "GET",
      "path": "/v1/compute/instances/{instanceId}/regionChange/check",
      "summary": "Check if the instance can be moved to another host",
      "description": "Verifies preconditions with CMS before relocating the instance from its current host. Returns no content when the check succeeds. When CMS responds with an error list, returns that payload with the same HTTP status as CMS.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "instanceId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the instance",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("checkRegionChange"), "instanceId": z.number().int().describe("The identifier of the instance") }) as any,
  },
  {
    ...{
      "id": "instances_requestRegionChange",
      "domain": "instances",
      "name": "requestRegionChange",
      "method": "POST",
      "path": "/v1/compute/instances/{instanceId}/regionChange",
      "summary": "Request instance region change",
      "description": "Starts a region change for the instance via CMS. Returns the support ticket number when the operation was accepted.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "instanceId"
      ],
      "queryParams": [],
      "bodyParams": [
        "region",
        "method"
      ],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the instance",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "region",
          "location": "body",
          "required": true,
          "description": "Target region identifier passed to CMS",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "method",
          "location": "body",
          "required": true,
          "description": "Region change method as defined by CMS",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("requestRegionChange"), "instanceId": z.number().int().describe("The identifier of the instance"), "region": z.string().describe("Target region identifier passed to CMS"), "method": z.string().describe("Region change method as defined by CMS") }) as any,
  },
  {
    ...{
      "id": "instances_get",
      "domain": "instances",
      "name": "get",
      "method": "GET",
      "path": "/v1/compute/instances/{instanceId}",
      "summary": "Get specific instance by id",
      "description": "Get attributes values to a specific instance on your account.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "instanceId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the instance",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("get"), "instanceId": z.number().int().describe("The identifier of the instance") }) as any,
  },
  {
    ...{
      "id": "instances_update",
      "domain": "instances",
      "name": "update",
      "method": "PATCH",
      "path": "/v1/compute/instances/{instanceId}",
      "summary": "Update specific instance",
      "description": "Update specific instance by instanceId.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "instanceId"
      ],
      "queryParams": [],
      "bodyParams": [
        "displayName"
      ],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the instance",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "displayName",
          "location": "body",
          "required": false,
          "description": "The display name of the instance. Pass an empty string to clear it.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("update"), "instanceId": z.number().int().describe("The identifier of the instance"), "displayName": z.string().max(255).describe("The display name of the instance. Pass an empty string to clear it.").optional() }) as any,
  },
  {
    ...{
      "id": "instances_reinstall",
      "domain": "instances",
      "name": "reinstall",
      "method": "PUT",
      "path": "/v1/compute/instances/{instanceId}",
      "summary": "Reinstall specific instance",
      "description": "You can reinstall a specific instance with a new image and optionally add ssh keys, a root password or cloud-init.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "instanceId"
      ],
      "queryParams": [],
      "bodyParams": [
        "imageId",
        "sshKeys",
        "rootPassword",
        "userData",
        "defaultUser",
        "applicationId"
      ],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the instance",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "imageId",
          "location": "body",
          "required": true,
          "description": "ImageId to be used to setup the compute instance.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "sshKeys",
          "location": "body",
          "required": false,
          "description": "Array of `secretId`s of public SSH keys for logging into as `defaultUser` with administrator/root privileges. Applies to Linux/BSD systems. Please refer to Secrets Management API.",
          "type": "integer[]",
          "deprecated": false
        },
        {
          "name": "rootPassword",
          "location": "body",
          "required": false,
          "description": "`secretId` of the password for the `defaultUser` with administrator/root privileges. For Linux/BSD please use SSH, for Windows RDP. Please refer to Secrets Management API.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "userData",
          "location": "body",
          "required": false,
          "description": "[Cloud-Init](https://cloud-init.io/) Config in order to customize during start of compute instance.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "defaultUser",
          "location": "body",
          "required": false,
          "description": "Default user name created for login during (re-)installation with administrative privileges. Allowed values for Linux/BSD are `admin` (use sudo to apply administrative privileges like root) or `root`. Allowed values for Windows are `admin` (has administrative privileges like administrator) or `administrator`.",
          "type": "enum(root|admin|administrator)",
          "deprecated": false,
          "enumValues": [
            "root",
            "admin",
            "administrator"
          ]
        },
        {
          "name": "applicationId",
          "location": "body",
          "required": false,
          "description": "Application ID",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("reinstall"), "instanceId": z.number().int().describe("The identifier of the instance"), "imageId": z.string().describe("ImageId to be used to setup the compute instance."), "sshKeys": z.array(z.number().int()).describe("Array of `secretId`s of public SSH keys for logging into as `defaultUser` with administrator/root privileges. Applies to Linux/BSD systems. Please refer to Secrets Management API.").optional(), "rootPassword": z.number().int().describe("`secretId` of the password for the `defaultUser` with administrator/root privileges. For Linux/BSD please use SSH, for Windows RDP. Please refer to Secrets Management API.").optional(), "userData": z.string().describe("[Cloud-Init](https://cloud-init.io/) Config in order to customize during start of compute instance.").optional(), "defaultUser": z.enum(["root", "admin", "administrator"]).describe("Default user name created for login during (re-)installation with administrative privileges. Allowed values for Linux/BSD are `admin` (use sudo to apply administrative privileges like root) or `root`. Allowed values for Windows are `admin` (has administrative privileges like administrator) or `administrator`.").optional(), "applicationId": z.string().describe("Application ID").optional() }) as any,
  },
  {
    ...{
      "id": "instances_listProducts",
      "domain": "instances",
      "name": "listProducts",
      "method": "GET",
      "path": "/v1/compute/instances/{instanceId}/products/available",
      "summary": "Get the available products of a specific instance",
      "description": "Get all products the instance can be upgraded to, excluding the currently assigned one. Use the `offerId` of the desired product to submit the upgrade.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "instanceId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the instance",
          "type": "integer",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("listProducts"), "instanceId": z.number().int().describe("The identifier of the instance") }) as any,
  },
  {
    ...{
      "id": "instances_cancel",
      "domain": "instances",
      "name": "cancel",
      "method": "POST",
      "path": "/v1/compute/instances/{instanceId}/cancel",
      "summary": "Cancel specific instance by id",
      "description": "Your are free to cancel a previously created instance at any time.",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "instanceId"
      ],
      "queryParams": [],
      "bodyParams": [
        "cancelDate"
      ],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the instance",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "cancelDate",
          "location": "body",
          "required": false,
          "description": "Date of cancellation",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("cancel"), "instanceId": z.number().int().describe("The identifier of the instance"), "cancelDate": z.string().describe("Date of cancellation").optional() }) as any,
  },
  {
    ...{
      "id": "instances_upgrade",
      "domain": "instances",
      "name": "upgrade",
      "method": "POST",
      "path": "/v1/compute/instances/{instanceId}/upgrade",
      "summary": "Upgrading instance capabilities",
      "description": "In order to enhance your instance with additional features you can purchase add-ons.   Currently only firewalling and private network addon is allowed.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "instanceId"
      ],
      "queryParams": [],
      "bodyParams": [
        "privateNetworking",
        "backup"
      ],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the instance",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "privateNetworking",
          "location": "body",
          "required": false,
          "description": "Set this attribute if you want to upgrade your instance with the Private Networking addon. Please provide an empty object for the time being as value. There will be more configuration possible in the future.",
          "type": "object",
          "deprecated": false
        },
        {
          "name": "backup",
          "location": "body",
          "required": false,
          "description": "Set this attribute if you want to upgrade your instance with the Automated Backup addon.   Please provide an empty object for the time being as value. There will be more configuration possible   in the future.",
          "type": "object",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("upgrade"), "instanceId": z.number().int().describe("The identifier of the instance"), "privateNetworking": z.looseObject({}).describe("Set this attribute if you want to upgrade your instance with the Private Networking addon. Please provide an empty object for the time being as value. There will be more configuration possible in the future.").optional(), "backup": z.looseObject({}).describe("Set this attribute if you want to upgrade your instance with the Automated Backup addon.   Please provide an empty object for the time being as value. There will be more configuration possible   in the future.").optional() }) as any,
  },
  {
    ...{
      "id": "audits_instanceActions",
      "domain": "audits",
      "name": "instanceActions",
      "method": "GET",
      "path": "/v1/compute/instances/actions/audits",
      "summary": "List history about your actions (audit) triggered via the API",
      "description": "List and filters the history about your actions your triggered via the API.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "instanceId",
        "requestId",
        "changedBy",
        "startDate",
        "endDate"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "instanceId",
          "location": "query",
          "required": false,
          "description": "The identifier of the instancesActions.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "requestId",
          "location": "query",
          "required": false,
          "description": "The requestId of the API call which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "changedBy",
          "location": "query",
          "required": false,
          "description": "changedBy of the user which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "startDate",
          "location": "query",
          "required": false,
          "description": "Start of search time range.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "endDate",
          "location": "query",
          "required": false,
          "description": "End of search time range.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("instanceActions"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "instanceId": z.number().int().optional().describe("The identifier of the instancesActions."), "requestId": z.string().optional().describe("The requestId of the API call which led to the change."), "changedBy": z.string().optional().describe("changedBy of the user which led to the change."), "startDate": z.string().optional().describe("Start of search time range."), "endDate": z.string().optional().describe("End of search time range.") }) as any,
  },
  {
    ...{
      "id": "audits_instances",
      "domain": "audits",
      "name": "instances",
      "method": "GET",
      "path": "/v1/compute/instances/audits",
      "summary": "List history about your instances (audit)",
      "description": "List and filters the history about your instances.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "instanceId",
        "requestId",
        "changedBy",
        "startDate",
        "endDate"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "instanceId",
          "location": "query",
          "required": false,
          "description": "The identifier of the instances.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "requestId",
          "location": "query",
          "required": false,
          "description": "The requestId of the API call which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "changedBy",
          "location": "query",
          "required": false,
          "description": "changedBy of the user which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "startDate",
          "location": "query",
          "required": false,
          "description": "Start of search time range.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "endDate",
          "location": "query",
          "required": false,
          "description": "End of search time range.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("instances"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "instanceId": z.number().int().optional().describe("The identifier of the instances."), "requestId": z.string().optional().describe("The requestId of the API call which led to the change."), "changedBy": z.string().optional().describe("changedBy of the user which led to the change."), "startDate": z.string().optional().describe("Start of search time range."), "endDate": z.string().optional().describe("End of search time range.") }) as any,
  },
  {
    ...{
      "id": "images_list",
      "domain": "images",
      "name": "list",
      "method": "GET",
      "path": "/v1/compute/images",
      "summary": "List available standard and custom images",
      "description": "List and filter all available standard images provided by [Contabo](https://contabo.com) and your uploaded custom images.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "name",
        "standardImage",
        "gpu",
        "search"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "query",
          "required": false,
          "description": "The name of the image",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "standardImage",
          "location": "query",
          "required": false,
          "description": "Flag indicating that image is either a standard (true) or a custom image (false)",
          "type": "boolean",
          "deprecated": false
        },
        {
          "name": "gpu",
          "location": "query",
          "required": false,
          "description": "Flag indicating that image can be used with for a GPU product.",
          "type": "boolean",
          "deprecated": false
        },
        {
          "name": "search",
          "location": "query",
          "required": false,
          "description": "full text search on image name or image os type",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("list"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "name": z.string().optional().describe("The name of the image"), "standardImage": z.boolean().optional().describe("Flag indicating that image is either a standard (true) or a custom image (false)"), "gpu": z.boolean().optional().describe("Flag indicating that image can be used with for a GPU product."), "search": z.string().optional().describe("full text search on image name or image os type") }) as any,
  },
  {
    ...{
      "id": "images_create",
      "domain": "images",
      "name": "create",
      "method": "POST",
      "path": "/v1/compute/images",
      "summary": "Provide a custom image",
      "description": "In order to provide a custom image please specify an URL from where the image can be directly downloaded. A custom image must be in either `.iso` or `.qcow2` format. Other formats will be rejected. Please note that downloading can take a while depending on network speed resp. bandwidth and size of image. You can check the status by retrieving information about the image via a GET request. Download will be rejected if you have exceeded your limits.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [
        "name",
        "description",
        "url",
        "osType",
        "version"
      ],
      "paramMeta": [
        {
          "name": "name",
          "location": "body",
          "required": true,
          "description": "Image Name",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "description",
          "location": "body",
          "required": false,
          "description": "Image Description",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "url",
          "location": "body",
          "required": true,
          "description": "URL from where the image has been downloaded / provided.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "osType",
          "location": "body",
          "required": true,
          "description": "Provided type of operating system (OS). Please specify `Windows` for MS Windows and `Linux` for other OS. Specifying wrong OS type may lead to disfunctional cloud instance.",
          "type": "enum(Windows|Linux)",
          "deprecated": false,
          "enumValues": [
            "Windows",
            "Linux"
          ]
        },
        {
          "name": "version",
          "location": "body",
          "required": true,
          "description": "Version number to distinguish the contents of an image. Could be the version of the operating system for example.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("create"), "name": z.string().describe("Image Name"), "description": z.string().describe("Image Description").optional(), "url": z.string().describe("URL from where the image has been downloaded / provided."), "osType": z.enum(["Windows", "Linux"]).describe("Provided type of operating system (OS). Please specify `Windows` for MS Windows and `Linux` for other OS. Specifying wrong OS type may lead to disfunctional cloud instance."), "version": z.string().describe("Version number to distinguish the contents of an image. Could be the version of the operating system for example.") }) as any,
  },
  {
    ...{
      "id": "images_get",
      "domain": "images",
      "name": "get",
      "method": "GET",
      "path": "/v1/compute/images/{imageId}",
      "summary": "Get details about a specific image by its id",
      "description": "Get details about a specific image. This could be either a standard or custom image. In case of an custom image you can also check the download status",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "imageId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "imageId",
          "location": "path",
          "required": true,
          "description": "The identifier of the image",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("get"), "imageId": z.string().describe("The identifier of the image") }) as any,
  },
  {
    ...{
      "id": "images_update",
      "domain": "images",
      "name": "update",
      "method": "PATCH",
      "path": "/v1/compute/images/{imageId}",
      "summary": "Update custom image name by its id",
      "description": "Update name of the custom image",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "imageId"
      ],
      "queryParams": [],
      "bodyParams": [
        "name",
        "description"
      ],
      "paramMeta": [
        {
          "name": "imageId",
          "location": "path",
          "required": true,
          "description": "The identifier of the image",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "body",
          "required": false,
          "description": "Image Name",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "description",
          "location": "body",
          "required": false,
          "description": "Image Description",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("update"), "imageId": z.string().describe("The identifier of the image"), "name": z.string().describe("Image Name").optional(), "description": z.string().describe("Image Description").optional() }) as any,
  },
  {
    ...{
      "id": "images_delete",
      "domain": "images",
      "name": "delete",
      "method": "DELETE",
      "path": "/v1/compute/images/{imageId}",
      "summary": "Delete an uploaded custom image by its id",
      "description": "Your are free to delete a previously uploaded custom images at any time",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "imageId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "imageId",
          "location": "path",
          "required": true,
          "description": "The identifier of the image",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("delete"), "imageId": z.string().describe("The identifier of the image") }) as any,
  },
  {
    ...{
      "id": "images_stats",
      "domain": "images",
      "name": "stats",
      "method": "GET",
      "path": "/v1/compute/images/stats",
      "summary": "List statistics regarding the customer's custom images",
      "description": "List statistics regarding the customer's custom images such as the number of custom images uploaded, used disk space, free available disk space and total available disk space",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": []
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("stats") }) as any,
  },
  {
    ...{
      "id": "snapshots_list",
      "domain": "snapshots",
      "name": "list",
      "method": "GET",
      "path": "/v1/compute/instances/{instanceId}/snapshots",
      "summary": "List snapshots",
      "description": "List and filter all your snapshots for a specific instance",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "instanceId"
      ],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "name"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the instance",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "query",
          "required": false,
          "description": "Filter as substring match for snapshots names.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("list"), "instanceId": z.number().int().describe("The identifier of the instance"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "name": z.string().optional().describe("Filter as substring match for snapshots names.") }) as any,
  },
  {
    ...{
      "id": "snapshots_create",
      "domain": "snapshots",
      "name": "create",
      "method": "POST",
      "path": "/v1/compute/instances/{instanceId}/snapshots",
      "summary": "Create a new instance snapshot",
      "description": "Create a new snapshot for instance, with name and description attributes",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "instanceId"
      ],
      "queryParams": [],
      "bodyParams": [
        "name",
        "description"
      ],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the instance",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "body",
          "required": true,
          "description": "The name of the snapshot. It may contain letters, numbers, spaces, dashes. There is a limit of 30 characters per snapshot.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "description",
          "location": "body",
          "required": false,
          "description": "The description of the snapshot. There is a limit of 255 characters per snapshot.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("create"), "instanceId": z.number().int().describe("The identifier of the instance"), "name": z.string().min(1).max(30).describe("The name of the snapshot. It may contain letters, numbers, spaces, dashes. There is a limit of 30 characters per snapshot."), "description": z.string().min(1).max(255).describe("The description of the snapshot. There is a limit of 255 characters per snapshot.").optional() }) as any,
  },
  {
    ...{
      "id": "snapshots_get",
      "domain": "snapshots",
      "name": "get",
      "method": "GET",
      "path": "/v1/compute/instances/{instanceId}/snapshots/{snapshotId}",
      "summary": "Retrieve a specific snapshot by id",
      "description": "Get all attributes for a specific snapshot",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "instanceId",
        "snapshotId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the instance",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "snapshotId",
          "location": "path",
          "required": true,
          "description": "The identifier of the snapshot",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("get"), "instanceId": z.number().int().describe("The identifier of the instance"), "snapshotId": z.string().describe("The identifier of the snapshot") }) as any,
  },
  {
    ...{
      "id": "snapshots_update",
      "domain": "snapshots",
      "name": "update",
      "method": "PATCH",
      "path": "/v1/compute/instances/{instanceId}/snapshots/{snapshotId}",
      "summary": "Update specific snapshot by id",
      "description": "Update attributes of a snapshot. You may only specify the attributes you want to change. If an attribute is not set, it will retain its original value.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "instanceId",
        "snapshotId"
      ],
      "queryParams": [],
      "bodyParams": [
        "name",
        "description"
      ],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the instance",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "snapshotId",
          "location": "path",
          "required": true,
          "description": "The identifier of the snapshot",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "body",
          "required": false,
          "description": "The name of the snapshot. Tags may contain only letters, numbers, spaces, dashes. There is a limit of 30 characters per snapshot.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "description",
          "location": "body",
          "required": false,
          "description": "The description of the snapshot. There is a limit of 255 characters per snapshot.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("update"), "instanceId": z.number().int().describe("The identifier of the instance"), "snapshotId": z.string().describe("The identifier of the snapshot"), "name": z.string().min(1).max(30).describe("The name of the snapshot. Tags may contain only letters, numbers, spaces, dashes. There is a limit of 30 characters per snapshot.").optional(), "description": z.string().min(1).max(255).describe("The description of the snapshot. There is a limit of 255 characters per snapshot.").optional() }) as any,
  },
  {
    ...{
      "id": "snapshots_delete",
      "domain": "snapshots",
      "name": "delete",
      "method": "DELETE",
      "path": "/v1/compute/instances/{instanceId}/snapshots/{snapshotId}",
      "summary": "Delete existing snapshot by id",
      "description": "Delete existing instance snapshot by id",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "instanceId",
        "snapshotId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the instance",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "snapshotId",
          "location": "path",
          "required": true,
          "description": "The identifier of the snapshot",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("delete"), "instanceId": z.number().int().describe("The identifier of the instance"), "snapshotId": z.string().describe("The identifier of the snapshot") }) as any,
  },
  {
    ...{
      "id": "snapshots_rollback",
      "domain": "snapshots",
      "name": "rollback",
      "method": "POST",
      "path": "/v1/compute/instances/{instanceId}/snapshots/{snapshotId}/rollback",
      "summary": "Revert the instance to a particular snapshot based on its identifier",
      "description": "Rollback the instance to a specific snapshot. In case the snapshot is not the latest one, it will automatically delete all the newer snapshots of the instance",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "instanceId",
        "snapshotId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "instanceId",
          "location": "path",
          "required": true,
          "description": "The identifier of the instance",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "snapshotId",
          "location": "path",
          "required": true,
          "description": "The identifier of the snapshot",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("rollback"), "instanceId": z.number().int().describe("The identifier of the instance"), "snapshotId": z.string().describe("The identifier of the snapshot") }) as any,
  },
  {
    ...{
      "id": "audits_images",
      "domain": "audits",
      "name": "images",
      "method": "GET",
      "path": "/v1/compute/images/audits",
      "summary": "List history about your custom images (audit)",
      "description": "List and filters the history about your custom images.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "imageId",
        "requestId",
        "changedBy",
        "startDate",
        "endDate"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "imageId",
          "location": "query",
          "required": false,
          "description": "The identifier of the image.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "requestId",
          "location": "query",
          "required": false,
          "description": "The requestId of the API call which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "changedBy",
          "location": "query",
          "required": false,
          "description": "UserId of the user which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "startDate",
          "location": "query",
          "required": false,
          "description": "Start of search time range.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "endDate",
          "location": "query",
          "required": false,
          "description": "End of search time range.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("images"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "imageId": z.string().optional().describe("The identifier of the image."), "requestId": z.string().optional().describe("The requestId of the API call which led to the change."), "changedBy": z.string().optional().describe("UserId of the user which led to the change."), "startDate": z.string().optional().describe("Start of search time range."), "endDate": z.string().optional().describe("End of search time range.") }) as any,
  },
  {
    ...{
      "id": "audits_snapshots",
      "domain": "audits",
      "name": "snapshots",
      "method": "GET",
      "path": "/v1/compute/snapshots/audits",
      "summary": "List history about your snapshots (audit) triggered via the API",
      "description": "List and filters the history about your snapshots your triggered via the API.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "instanceId",
        "snapshotId",
        "requestId",
        "changedBy",
        "startDate",
        "endDate"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "instanceId",
          "location": "query",
          "required": false,
          "description": "The identifier of the instance",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "snapshotId",
          "location": "query",
          "required": false,
          "description": "The identifier of the snapshot",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "requestId",
          "location": "query",
          "required": false,
          "description": "The requestId of the API call which led to the change",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "changedBy",
          "location": "query",
          "required": false,
          "description": "changedBy of the user which led to the change",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "startDate",
          "location": "query",
          "required": false,
          "description": "Start of search time range.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "endDate",
          "location": "query",
          "required": false,
          "description": "End of search time range.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("snapshots"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "instanceId": z.number().int().optional().describe("The identifier of the instance"), "snapshotId": z.string().optional().describe("The identifier of the snapshot"), "requestId": z.string().optional().describe("The requestId of the API call which led to the change"), "changedBy": z.string().optional().describe("changedBy of the user which led to the change"), "startDate": z.string().optional().describe("Start of search time range."), "endDate": z.string().optional().describe("End of search time range.") }) as any,
  },
  {
    ...{
      "id": "domains_listHandles",
      "domain": "domains",
      "name": "listHandles",
      "method": "GET",
      "path": "/v1/domains/handles",
      "summary": "List all handles",
      "description": "List and filter all your handles",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "name",
        "showDefaults",
        "search",
        "countries",
        "handleType",
        "firstName",
        "lastName"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "query",
          "required": false,
          "description": "Filter as substring match for handle name.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "showDefaults",
          "location": "query",
          "required": false,
          "description": "Filter handles to show or not the public handles",
          "type": "boolean",
          "deprecated": false
        },
        {
          "name": "search",
          "location": "query",
          "required": false,
          "description": "full text search on handles on handleid, organization name, handlename ",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "countries",
          "location": "query",
          "required": false,
          "description": "list of country codes to filter handles that are available in these countries (comma separated)",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "handleType",
          "location": "query",
          "required": false,
          "description": "Filter handles by type, e.g. person, organization.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "firstName",
          "location": "query",
          "required": false,
          "description": "Filter handles by first name.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "lastName",
          "location": "query",
          "required": false,
          "description": "Filter handles by last name.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("listHandles"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "name": z.string().optional().describe("Filter as substring match for handle name."), "showDefaults": z.boolean().optional().describe("Filter handles to show or not the public handles"), "search": z.string().optional().describe("full text search on handles on handleid, organization name, handlename "), "countries": z.string().optional().describe("list of country codes to filter handles that are available in these countries (comma separated)"), "handleType": z.string().optional().describe("Filter handles by type, e.g. person, organization."), "firstName": z.string().optional().describe("Filter handles by first name."), "lastName": z.string().optional().describe("Filter handles by last name.") }) as any,
  },
  {
    ...{
      "id": "domains_createHandle",
      "domain": "domains",
      "name": "createHandle",
      "method": "POST",
      "path": "/v1/domains/handles",
      "summary": "Create specific handle",
      "description": "Create specific handle",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [
        "handleType",
        "firstName",
        "alias",
        "lastName",
        "organization",
        "email",
        "gender",
        "birthInfo",
        "address",
        "phone",
        "fax",
        "nicItEntityType",
        "legalStatus",
        "pin",
        "sidnLegalForm",
        "sidnLegalFormRegNo"
      ],
      "paramMeta": [
        {
          "name": "handleType",
          "location": "body",
          "required": true,
          "description": "The type of the handle",
          "type": "enum(person|organization)",
          "deprecated": false,
          "enumValues": [
            "person",
            "organization"
          ]
        },
        {
          "name": "firstName",
          "location": "body",
          "required": true,
          "description": "Handle first name",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "alias",
          "location": "body",
          "required": false,
          "description": "Customer-chosen alias for the handle. Unique per customer (exact, case-sensitive). Optional for now.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "lastName",
          "location": "body",
          "required": true,
          "description": "Handle last name",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "organization",
          "location": "body",
          "required": false,
          "description": "The organization of the handle",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "email",
          "location": "body",
          "required": true,
          "description": "Handle email",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "gender",
          "location": "body",
          "required": true,
          "description": "Handle gender",
          "type": "enum(male|female|na)",
          "deprecated": false,
          "enumValues": [
            "male",
            "female",
            "na"
          ]
        },
        {
          "name": "birthInfo",
          "location": "body",
          "required": false,
          "description": "The birth info of the handle",
          "type": "object",
          "deprecated": false
        },
        {
          "name": "address",
          "location": "body",
          "required": true,
          "description": "Address details for handle",
          "type": "object",
          "deprecated": false
        },
        {
          "name": "phone",
          "location": "body",
          "required": true,
          "description": "Handle phone",
          "type": "object",
          "deprecated": false
        },
        {
          "name": "fax",
          "location": "body",
          "required": false,
          "description": "Handle fax",
          "type": "object",
          "deprecated": false
        },
        {
          "name": "nicItEntityType",
          "location": "body",
          "required": false,
          "description": "NIC.it entity type (required for .it registrant contacts). Valid values: natural_person, individual_firm, non_profit, public_org, other, company, foreign_legal_entity.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "legalStatus",
          "location": "body",
          "required": false,
          "description": "Legal status of an organization handle. Applies to organization handles only and is ignored for person handles. Sent to AFNIC as AFNIC_PM_LEGAL_STATUS, which is required for every .fr contact. Defaults to company when omitted.",
          "type": "enum(company|association|other)",
          "deprecated": false,
          "enumValues": [
            "company",
            "association",
            "other"
          ]
        },
        {
          "name": "pin",
          "location": "body",
          "required": false,
          "description": "Registration code / fiscal code. Required for .it registrant contacts (NIC.it NIC_IT_REG_CODE — codice fiscale or VAT number).",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "sidnLegalForm",
          "location": "body",
          "required": false,
          "description": "SIDN legal form for .nl contacts (SIDN_LEGAL_FORM). Free-form per the SIDN schema — e.g. BV, NV, Stichting, Eenmanszaak, VOF.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "sidnLegalFormRegNo",
          "location": "body",
          "required": false,
          "description": "SIDN legal form registration number for .nl contacts (KvK / Chamber of Commerce number, SIDN_LEGAL_REG_NO).",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("createHandle"), "handleType": z.enum(["person", "organization"]).describe("The type of the handle"), "firstName": z.string().min(1).max(255).describe("Handle first name"), "alias": z.string().min(1).max(255).describe("Customer-chosen alias for the handle. Unique per customer (exact, case-sensitive). Optional for now.").optional(), "lastName": z.string().min(1).max(255).describe("Handle last name"), "organization": z.string().min(1).max(255).describe("The organization of the handle").optional(), "email": z.string().min(1).max(255).describe("Handle email"), "gender": z.enum(["male", "female", "na"]).describe("Handle gender"), "birthInfo": z.object({ "date": z.string().describe("Date").optional(), "city": z.string().min(1).max(255).describe("City").optional(), "zipCode": z.string().min(1).max(50).describe("Zipcode").optional(), "country": z.string().min(1).max(100).describe("Country").optional() }).describe("The birth info of the handle").optional(), "address": z.object({ "street": z.string().min(1).max(255).describe("Street"), "streetNumber": z.string().min(1).max(255).describe("Street Number"), "city": z.string().min(1).max(100).describe("City"), "country": z.string().min(1).max(100).describe("Country"), "zipCode": z.string().min(1).max(50).describe("ZipCode"), "siret": z.string().min(1).max(255).describe("Siret").optional(), "region": z.string().min(1).max(255).describe("Region").optional() }).describe("Address details for handle"), "phone": z.object({ "prefix": z.string().min(1).max(5).describe("prefix"), "number": z.string().min(1).max(50).describe("number") }).describe("Handle phone"), "fax": z.object({ "prefix": z.string().min(1).max(5).describe("prefix"), "number": z.string().min(1).max(50).describe("number") }).describe("Handle fax").optional(), "nicItEntityType": z.string().describe("NIC.it entity type (required for .it registrant contacts). Valid values: natural_person, individual_firm, non_profit, public_org, other, company, foreign_legal_entity.").optional(), "legalStatus": z.enum(["company", "association", "other"]).describe("Legal status of an organization handle. Applies to organization handles only and is ignored for person handles. Sent to AFNIC as AFNIC_PM_LEGAL_STATUS, which is required for every .fr contact. Defaults to company when omitted.").optional(), "pin": z.string().min(1).max(255).describe("Registration code / fiscal code. Required for .it registrant contacts (NIC.it NIC_IT_REG_CODE — codice fiscale or VAT number).").optional(), "sidnLegalForm": z.string().min(1).max(255).describe("SIDN legal form for .nl contacts (SIDN_LEGAL_FORM). Free-form per the SIDN schema — e.g. BV, NV, Stichting, Eenmanszaak, VOF.").optional(), "sidnLegalFormRegNo": z.string().min(1).max(255).describe("SIDN legal form registration number for .nl contacts (KvK / Chamber of Commerce number, SIDN_LEGAL_REG_NO).").optional() }) as any,
  },
  {
    ...{
      "id": "domains_getHandle",
      "domain": "domains",
      "name": "getHandle",
      "method": "GET",
      "path": "/v1/domains/handles/{handleId}",
      "summary": "Get specific handle",
      "description": "Get specific handle",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "handleId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "handleId",
          "location": "path",
          "required": true,
          "description": "The identifier of the handle",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("getHandle"), "handleId": z.string().describe("The identifier of the handle") }) as any,
  },
  {
    ...{
      "id": "domains_deleteHandle",
      "domain": "domains",
      "name": "deleteHandle",
      "method": "DELETE",
      "path": "/v1/domains/handles/{handleId}",
      "summary": "Remove specific handle",
      "description": "Remove specific handle",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "handleId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "handleId",
          "location": "path",
          "required": true,
          "description": "The identifier of the handle",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("deleteHandle"), "handleId": z.string().describe("The identifier of the handle") }) as any,
  },
  {
    ...{
      "id": "domains_updateHandle",
      "domain": "domains",
      "name": "updateHandle",
      "method": "PUT",
      "path": "/v1/domains/handles/{handleId}",
      "summary": "Update specific handle",
      "description": "Update specific handle",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "handleId"
      ],
      "queryParams": [],
      "bodyParams": [
        "alias",
        "email",
        "gender",
        "birthInfo",
        "address",
        "phone",
        "fax",
        "nicItEntityType",
        "legalStatus",
        "pin",
        "sidnLegalForm",
        "sidnLegalFormRegNo"
      ],
      "paramMeta": [
        {
          "name": "handleId",
          "location": "path",
          "required": true,
          "description": "The identifier of the handle",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "alias",
          "location": "body",
          "required": false,
          "description": "Customer-chosen alias for the handle. Unique per customer (exact, case-sensitive). Optional for now.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "email",
          "location": "body",
          "required": true,
          "description": "Handle email",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "gender",
          "location": "body",
          "required": true,
          "description": "Handle gender",
          "type": "enum(male|female|na)",
          "deprecated": false,
          "enumValues": [
            "male",
            "female",
            "na"
          ]
        },
        {
          "name": "birthInfo",
          "location": "body",
          "required": false,
          "description": "The birth info of the handle",
          "type": "object",
          "deprecated": false
        },
        {
          "name": "address",
          "location": "body",
          "required": true,
          "description": "Address details for handle",
          "type": "object",
          "deprecated": false
        },
        {
          "name": "phone",
          "location": "body",
          "required": true,
          "description": "Handle phone",
          "type": "object",
          "deprecated": false
        },
        {
          "name": "fax",
          "location": "body",
          "required": false,
          "description": "Handle fax",
          "type": "object",
          "deprecated": false
        },
        {
          "name": "nicItEntityType",
          "location": "body",
          "required": false,
          "description": "NIC.it entity type (required for .it registrant contacts). Valid values: natural_person, individual_firm, non_profit, public_org, other, company, foreign_legal_entity.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "legalStatus",
          "location": "body",
          "required": false,
          "description": "Legal status of an organization handle. Applies to organization handles only and is ignored for person handles. Sent to AFNIC as AFNIC_PM_LEGAL_STATUS, which is required for every .fr contact. Defaults to company when omitted.",
          "type": "enum(company|association|other)",
          "deprecated": false,
          "enumValues": [
            "company",
            "association",
            "other"
          ]
        },
        {
          "name": "pin",
          "location": "body",
          "required": false,
          "description": "Registration code / fiscal code. Required for .it registrant contacts (NIC.it NIC_IT_REG_CODE — codice fiscale or VAT number).",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "sidnLegalForm",
          "location": "body",
          "required": false,
          "description": "SIDN legal form for .nl contacts (SIDN_LEGAL_FORM). Free-form per the SIDN schema — e.g. BV, NV, Stichting, Eenmanszaak, VOF.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "sidnLegalFormRegNo",
          "location": "body",
          "required": false,
          "description": "SIDN legal form registration number for .nl contacts (KvK / Chamber of Commerce number, SIDN_LEGAL_REG_NO).",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("updateHandle"), "handleId": z.string().describe("The identifier of the handle"), "alias": z.string().min(1).max(255).describe("Customer-chosen alias for the handle. Unique per customer (exact, case-sensitive). Optional for now.").optional(), "email": z.string().min(1).max(255).describe("Handle email"), "gender": z.enum(["male", "female", "na"]).describe("Handle gender"), "birthInfo": z.object({ "date": z.string().describe("Date").optional(), "city": z.string().min(1).max(255).describe("City").optional(), "zipCode": z.string().min(1).max(50).describe("Zipcode").optional(), "country": z.string().min(1).max(100).describe("Country").optional() }).describe("The birth info of the handle").optional(), "address": z.object({ "street": z.string().min(1).max(255).describe("Street"), "streetNumber": z.string().min(1).max(255).describe("Street Number"), "city": z.string().min(1).max(100).describe("City"), "country": z.string().min(1).max(100).describe("Country"), "zipCode": z.string().min(1).max(50).describe("ZipCode"), "siret": z.string().min(1).max(255).describe("Siret").optional(), "region": z.string().min(1).max(255).describe("Region").optional() }).describe("Address details for handle"), "phone": z.object({ "prefix": z.string().min(1).max(5).describe("prefix"), "number": z.string().min(1).max(50).describe("number") }).describe("Handle phone"), "fax": z.object({ "prefix": z.string().min(1).max(5).describe("prefix"), "number": z.string().min(1).max(50).describe("number") }).describe("Handle fax").optional(), "nicItEntityType": z.string().describe("NIC.it entity type (required for .it registrant contacts). Valid values: natural_person, individual_firm, non_profit, public_org, other, company, foreign_legal_entity.").optional(), "legalStatus": z.enum(["company", "association", "other"]).describe("Legal status of an organization handle. Applies to organization handles only and is ignored for person handles. Sent to AFNIC as AFNIC_PM_LEGAL_STATUS, which is required for every .fr contact. Defaults to company when omitted.").optional(), "pin": z.string().min(1).max(255).describe("Registration code / fiscal code. Required for .it registrant contacts (NIC.it NIC_IT_REG_CODE — codice fiscale or VAT number).").optional(), "sidnLegalForm": z.string().min(1).max(255).describe("SIDN legal form for .nl contacts (SIDN_LEGAL_FORM). Free-form per the SIDN schema — e.g. BV, NV, Stichting, Eenmanszaak, VOF.").optional(), "sidnLegalFormRegNo": z.string().min(1).max(255).describe("SIDN legal form registration number for .nl contacts (KvK / Chamber of Commerce number, SIDN_LEGAL_REG_NO).").optional() }) as any,
  },
  {
    ...{
      "id": "domains_setDefaultHandle",
      "domain": "domains",
      "name": "setDefaultHandle",
      "method": "PATCH",
      "path": "/v1/domains/handles/{handleId}/default",
      "summary": "Set default handle",
      "description": "Set default handle",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "handleId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "handleId",
          "location": "path",
          "required": true,
          "description": "The identifier of the handle",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("setDefaultHandle"), "handleId": z.string().describe("The identifier of the handle") }) as any,
  },
  {
    ...{
      "id": "domains_checkAvailability",
      "domain": "domains",
      "name": "checkAvailability",
      "method": "POST",
      "path": "/v1/registries-domains/{domain}/check-availability",
      "summary": "Check domain availablility",
      "description": "Check if a specific domain is available or not",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "domain"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "domain",
          "location": "path",
          "required": true,
          "description": "Domain Name",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("checkAvailability"), "domain": z.string().describe("Domain Name") }) as any,
  },
  {
    ...{
      "id": "domains_list",
      "domain": "domains",
      "name": "list",
      "method": "GET",
      "path": "/v1/domains",
      "summary": "List all domains",
      "description": "List and filter all your domains",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "sld",
        "tld",
        "status",
        "handleId"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "sld",
          "location": "query",
          "required": false,
          "description": "Filter as substring match for domain sld.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "tld",
          "location": "query",
          "required": false,
          "description": "Filter as substring match for domain tld.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "status",
          "location": "query",
          "required": false,
          "description": "Filter domains by status",
          "type": "enum(ready|processing|transferring in|transferring out|manual_task|transferred|error|cancelled|abuse)",
          "deprecated": false,
          "enumValues": [
            "ready",
            "processing",
            "transferring in",
            "transferring out",
            "manual_task",
            "transferred",
            "error",
            "cancelled",
            "abuse"
          ]
        },
        {
          "name": "handleId",
          "location": "query",
          "required": false,
          "description": "Filter domains by contact/handle id. Matches the handle as owner, admin, tech, or zone contact.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("list"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "sld": z.string().optional().describe("Filter as substring match for domain sld."), "tld": z.string().optional().describe("Filter as substring match for domain tld."), "status": z.enum(["ready", "processing", "transferring in", "transferring out", "manual_task", "transferred", "error", "cancelled", "abuse"]).optional().describe("Filter domains by status"), "handleId": z.string().optional().describe("Filter domains by contact/handle id. Matches the handle as owner, admin, tech, or zone contact.") }) as any,
  },
  {
    ...{
      "id": "domains_order",
      "domain": "domains",
      "name": "order",
      "method": "POST",
      "path": "/v1/domains",
      "summary": "Create or transfer a domain",
      "description": "Create or transfer a domain",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [
        "domain",
        "authCode",
        "handles",
        "nameservers",
        "resourceType",
        "resourceId"
      ],
      "paramMeta": [
        {
          "name": "domain",
          "location": "body",
          "required": true,
          "description": "Domain name",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "authCode",
          "location": "body",
          "required": false,
          "description": "The domain auth code",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "handles",
          "location": "body",
          "required": true,
          "description": "The handles of the domain",
          "type": "object",
          "deprecated": false
        },
        {
          "name": "nameservers",
          "location": "body",
          "required": true,
          "description": "Nameservers",
          "type": "unknown[]",
          "deprecated": false
        },
        {
          "name": "resourceType",
          "location": "body",
          "required": false,
          "description": "The identifier of the resource type",
          "type": "enum(instance|server|package)",
          "deprecated": false,
          "enumValues": [
            "instance",
            "server",
            "package"
          ]
        },
        {
          "name": "resourceId",
          "location": "body",
          "required": false,
          "description": "The identifier of the resource id",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("order"), "domain": z.string().describe("Domain name"), "authCode": z.string().describe("The domain auth code").optional(), "handles": z.object({ "owner": z.string().describe("Domain's owner handle"), "admin": z.string().describe("Domain's admin handle"), "tech": z.string().describe("Domain's tech handle"), "zone": z.string().describe("Domain's zone handle") }).describe("The handles of the domain"), "nameservers": z.array(z.object({ "hostname": z.array(z.string()).describe("Nameservers"), "ipV4": z.array(z.string()).describe("IPv4 of nameserver").optional(), "ipV6": z.array(z.string()).describe("IPv6 of nameserver").optional() })).describe("Nameservers"), "resourceType": z.enum(["instance", "server", "package"]).describe("The identifier of the resource type").optional(), "resourceId": z.string().describe("The identifier of the resource id").optional() }) as any,
  },
  {
    ...{
      "id": "domains_listPendingActions",
      "domain": "domains",
      "name": "listPendingActions",
      "method": "GET",
      "path": "/v1/domains/pending-actions",
      "summary": "List pending domain actions",
      "description": "List the calling customer's domains with an unacknowledged outbound transfer (ACK/NACK) pending. Live OpusDNS read for OpusDNS-routed customers; empty payload (no upstream call) for everyone else.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": []
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("listPendingActions") }) as any,
  },
  {
    ...{
      "id": "domains_suggest",
      "domain": "domains",
      "name": "suggest",
      "method": "GET",
      "path": "/v1/domains/suggestions",
      "summary": "Suggest domains",
      "description": "Return available domain-name suggestions for a query across a TLD set.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "query",
        "tlds",
        "limit",
        "premium"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "query",
          "location": "query",
          "required": true,
          "description": "Desired name to base suggestions on (bare label or domain).",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "tlds",
          "location": "query",
          "required": false,
          "description": "TLDs to include. Repeat the parameter per TLD. Defaults to com, net, org, info, de, at, ch, me, ai.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "limit",
          "location": "query",
          "required": false,
          "description": "Maximum number of suggestions to return (1-100).",
          "type": "number",
          "deprecated": false
        },
        {
          "name": "premium",
          "location": "query",
          "required": false,
          "description": "Whether to include premium-priced suggestions.",
          "type": "boolean",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("suggest"), "query": z.string().describe("Desired name to base suggestions on (bare label or domain)."), "tlds": z.array(z.string()).optional().describe("TLDs to include. Repeat the parameter per TLD. Defaults to com, net, org, info, de, at, ch, me, ai."), "limit": z.number().optional().describe("Maximum number of suggestions to return (1-100)."), "premium": z.boolean().optional().describe("Whether to include premium-priced suggestions.") }) as any,
  },
  {
    ...{
      "id": "domains_get",
      "domain": "domains",
      "name": "get",
      "method": "GET",
      "path": "/v1/domains/{domain}",
      "summary": "List specific domain",
      "description": "List specific domain",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "domain"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "domain",
          "location": "path",
          "required": true,
          "description": "Domain Name",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("get"), "domain": z.string().describe("Domain Name") }) as any,
  },
  {
    ...{
      "id": "domains_update",
      "domain": "domains",
      "name": "update",
      "method": "PATCH",
      "path": "/v1/domains/{domain}",
      "summary": "Update a specific domain",
      "description": "Update nameservers and handles for a specific domain",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "domain"
      ],
      "queryParams": [],
      "bodyParams": [
        "nameservers",
        "handles"
      ],
      "paramMeta": [
        {
          "name": "domain",
          "location": "path",
          "required": true,
          "description": "Domain Name",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "nameservers",
          "location": "body",
          "required": false,
          "description": "Nameservers",
          "type": "unknown[]",
          "deprecated": false
        },
        {
          "name": "handles",
          "location": "body",
          "required": false,
          "description": "The handles of the domain",
          "type": "object",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("update"), "domain": z.string().describe("Domain Name"), "nameservers": z.array(z.object({ "hostname": z.array(z.string()).describe("Nameservers"), "ipV4": z.array(z.string()).describe("IPv4 of nameserver").optional(), "ipV6": z.array(z.string()).describe("IPv6 of nameserver").optional() })).describe("Nameservers").optional(), "handles": z.object({ "owner": z.string().describe("Domain's owner handle"), "admin": z.string().describe("Domain's admin handle"), "tech": z.string().describe("Domain's tech handle"), "zone": z.string().describe("Domain's zone handle") }).describe("The handles of the domain").optional() }) as any,
  },
  {
    ...{
      "id": "domains_cancel",
      "domain": "domains",
      "name": "cancel",
      "method": "POST",
      "path": "/v1/domains/{domain}/cancel",
      "summary": "Cancel a specific domain",
      "description": "Cancel a specific domain",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "domain"
      ],
      "queryParams": [],
      "bodyParams": [
        "reason",
        "reasonText",
        "cancelDate"
      ],
      "paramMeta": [
        {
          "name": "domain",
          "location": "path",
          "required": true,
          "description": "Domain Name",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "reason",
          "location": "body",
          "required": false,
          "description": "Reason for cancelling an domain",
          "type": "enum(Technical issues / Outages / Performance|Too expensive / price|Product not needed anymore|Bad customer support|Switch to a different Contabo product|Missing features|Other)",
          "deprecated": false,
          "enumValues": [
            "Technical issues / Outages / Performance",
            "Too expensive / price",
            "Product not needed anymore",
            "Bad customer support",
            "Switch to a different Contabo product",
            "Missing features",
            "Other"
          ]
        },
        {
          "name": "reasonText",
          "location": "body",
          "required": false,
          "description": "Reason Text when `Other` reason got selected while cancelling an domain",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "cancelDate",
          "location": "body",
          "required": false,
          "description": "Date of cancellation",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("cancel"), "domain": z.string().describe("Domain Name"), "reason": z.enum(["Technical issues / Outages / Performance", "Too expensive / price", "Product not needed anymore", "Bad customer support", "Switch to a different Contabo product", "Missing features", "Other"]).describe("Reason for cancelling an domain").optional(), "reasonText": z.string().describe("Reason Text when `Other` reason got selected while cancelling an domain").optional(), "cancelDate": z.string().describe("Date of cancellation").optional() }) as any,
  },
  {
    ...{
      "id": "domains_getAuthCode",
      "domain": "domains",
      "name": "getAuthCode",
      "method": "POST",
      "path": "/v1/domains/{domain}/generate-auth-code",
      "summary": "Get auth code for a domain",
      "description": "Get auth code for a domain by id",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "domain"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "domain",
          "location": "path",
          "required": true,
          "description": "Domain Name",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("getAuthCode"), "domain": z.string().describe("Domain Name") }) as any,
  },
  {
    ...{
      "id": "domains_revokeCancel",
      "domain": "domains",
      "name": "revokeCancel",
      "method": "POST",
      "path": "/v1/domains/{domain}/revoke-cancellation",
      "summary": "Revoke cancellation for a specific domain",
      "description": "Revoke cancellation for a specific domain",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "domain"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "domain",
          "location": "path",
          "required": true,
          "description": "Domain Name",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("revokeCancel"), "domain": z.string().describe("Domain Name") }) as any,
  },
  {
    ...{
      "id": "domains_confirmTransferOut",
      "domain": "domains",
      "name": "confirmTransferOut",
      "method": "POST",
      "path": "/v1/domains/{domain}/transfer-out",
      "summary": "Confirm transfer out for a domain",
      "description": "Confirm transfer out for a domain",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "domain"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "domain",
          "location": "path",
          "required": true,
          "description": "Domain Name",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("confirmTransferOut"), "domain": z.string().describe("Domain Name") }) as any,
  },
  {
    ...{
      "id": "domains_revokeTransferOut",
      "domain": "domains",
      "name": "revokeTransferOut",
      "method": "DELETE",
      "path": "/v1/domains/{domain}/transfer-out",
      "summary": "Revoke transfer out for a domain",
      "description": "Revoke transfer out for a domain",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "domain"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "domain",
          "location": "path",
          "required": true,
          "description": "Domain Name",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("revokeTransferOut"), "domain": z.string().describe("Domain Name") }) as any,
  },
  {
    ...{
      "id": "audits_handles",
      "domain": "audits",
      "name": "handles",
      "method": "GET",
      "path": "/v1/domains/handles/audits",
      "summary": "List history about your handles (audit)",
      "description": "List and filters the history about your handles.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "handleId",
        "requestId",
        "changedBy",
        "startDate",
        "endDate"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "handleId",
          "location": "query",
          "required": false,
          "description": "The identifier of the handle.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "requestId",
          "location": "query",
          "required": false,
          "description": "The requestId of the API call which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "changedBy",
          "location": "query",
          "required": false,
          "description": "UserId of the user which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "startDate",
          "location": "query",
          "required": false,
          "description": "Start of search time range.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "endDate",
          "location": "query",
          "required": false,
          "description": "End of search time range.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("handles"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "handleId": z.string().optional().describe("The identifier of the handle."), "requestId": z.string().optional().describe("The requestId of the API call which led to the change."), "changedBy": z.string().optional().describe("UserId of the user which led to the change."), "startDate": z.string().optional().describe("Start of search time range."), "endDate": z.string().optional().describe("End of search time range.") }) as any,
  },
  {
    ...{
      "id": "audits_domains",
      "domain": "audits",
      "name": "domains",
      "method": "GET",
      "path": "/v1/domains/audits",
      "summary": "List history about your Domains (audit)",
      "description": "List and filters the history about your Domains.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "domain",
        "requestId",
        "changedBy",
        "startDate",
        "endDate"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "domain",
          "location": "query",
          "required": false,
          "description": "The domain name.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "requestId",
          "location": "query",
          "required": false,
          "description": "The requestId of the API call which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "changedBy",
          "location": "query",
          "required": false,
          "description": "UserId of the user which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "startDate",
          "location": "query",
          "required": false,
          "description": "Start of search time range.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "endDate",
          "location": "query",
          "required": false,
          "description": "End of search time range.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("domains"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "domain": z.string().optional().describe("The domain name."), "requestId": z.string().optional().describe("The requestId of the API call which led to the change."), "changedBy": z.string().optional().describe("UserId of the user which led to the change."), "startDate": z.string().optional().describe("Start of search time range."), "endDate": z.string().optional().describe("End of search time range.") }) as any,
  },
  {
    ...{
      "id": "objectStorage_list",
      "domain": "objectStorage",
      "name": "list",
      "method": "GET",
      "path": "/v1/object-storages",
      "summary": "List all your object storages",
      "description": "List and filter all object storages in your account",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "dataCenterName",
        "s3TenantId",
        "region",
        "displayName"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "dataCenterName",
          "location": "query",
          "required": false,
          "description": "Filter for Object Storage locations.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "s3TenantId",
          "location": "query",
          "required": false,
          "description": "Filter for Object Storage S3 tenantId.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "region",
          "location": "query",
          "required": false,
          "description": "Filter for Object Storage by regions. Available regions: EU, US-central, SIN",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "displayName",
          "location": "query",
          "required": false,
          "description": "Filter for Object Storage by display name.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("list"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "dataCenterName": z.string().min(1).optional().describe("Filter for Object Storage locations."), "s3TenantId": z.string().optional().describe("Filter for Object Storage S3 tenantId."), "region": z.string().optional().describe("Filter for Object Storage by regions. Available regions: EU, US-central, SIN"), "displayName": z.string().optional().describe("Filter for Object Storage by display name.") }) as any,
  },
  {
    ...{
      "id": "objectStorage_create",
      "domain": "objectStorage",
      "name": "create",
      "method": "POST",
      "path": "/v1/object-storages",
      "summary": "Create a new object storage",
      "description": "Create / purchase a new object storage in your account. Please note that you can only buy one object storage per location. You can actually increase the object storage space via `POST` to `/v1/object-storages/{objectStorageId}/resize`",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [
        "region",
        "autoScaling",
        "totalPurchasedSpaceTB",
        "displayName"
      ],
      "paramMeta": [
        {
          "name": "region",
          "location": "body",
          "required": true,
          "description": "Region where the object storage should be located. Default is EU. Available regions: EU, US-central, SIN",
          "type": "string",
          "deprecated": false,
          "defaultValue": "EU"
        },
        {
          "name": "autoScaling",
          "location": "body",
          "required": false,
          "description": "Autoscaling settings",
          "type": "object",
          "deprecated": false
        },
        {
          "name": "totalPurchasedSpaceTB",
          "location": "body",
          "required": true,
          "description": "Amount of purchased / requested object storage in TB.",
          "type": "number",
          "deprecated": false,
          "defaultValue": 0.25
        },
        {
          "name": "displayName",
          "location": "body",
          "required": false,
          "description": "Display name helps to differentiate between object storages, especially if they are in the same region. If display name is not provided, it will be generated. Display name can be changed any time.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("create"), "region": z.string().min(1).default("EU").describe("Region where the object storage should be located. Default is EU. Available regions: EU, US-central, SIN"), "autoScaling": z.object({ "state": z.enum(["enabled", "disabled"]).describe("State of the autoscaling for the current object storage."), "sizeLimitTB": z.number().describe("Autoscaling size limit for the current object storage.") }).describe("Autoscaling settings").optional(), "totalPurchasedSpaceTB": z.number().default(0.25).describe("Amount of purchased / requested object storage in TB."), "displayName": z.string().min(1).max(255).describe("Display name helps to differentiate between object storages, especially if they are in the same region. If display name is not provided, it will be generated. Display name can be changed any time.").optional() }) as any,
  },
  {
    ...{
      "id": "objectStorage_listDataCenters",
      "domain": "objectStorage",
      "name": "listDataCenters",
      "method": "GET",
      "path": "/v1/data-centers",
      "summary": "List data centers",
      "description": "List all data centers and their corresponding regions.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "slug",
        "name",
        "regionName",
        "regionSlug"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "slug",
          "location": "query",
          "required": false,
          "description": "Filter as match for data centers.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "name",
          "location": "query",
          "required": false,
          "description": "Filter for Object Storages regions.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "regionName",
          "location": "query",
          "required": false,
          "description": "Filter for Object Storage region names.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "regionSlug",
          "location": "query",
          "required": false,
          "description": "Filter for Object Storage region slugs.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("listDataCenters"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "slug": z.string().min(1).optional().describe("Filter as match for data centers."), "name": z.string().min(1).optional().describe("Filter for Object Storages regions."), "regionName": z.string().min(1).optional().describe("Filter for Object Storage region names."), "regionSlug": z.string().min(1).optional().describe("Filter for Object Storage region slugs.") }) as any,
  },
  {
    ...{
      "id": "objectStorage_get",
      "domain": "objectStorage",
      "name": "get",
      "method": "GET",
      "path": "/v1/object-storages/{objectStorageId}",
      "summary": "Get specific object storage by its id",
      "description": "Get data for a specific object storage on your account.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "objectStorageId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "objectStorageId",
          "location": "path",
          "required": true,
          "description": "The identifier of the object storage.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("get"), "objectStorageId": z.string().describe("The identifier of the object storage.") }) as any,
  },
  {
    ...{
      "id": "objectStorage_update",
      "domain": "objectStorage",
      "name": "update",
      "method": "PATCH",
      "path": "/v1/object-storages/{objectStorageId}",
      "summary": "Modifies the display name of object storage",
      "description": "Modifies the display name of object storage. Display name must be unique.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "objectStorageId"
      ],
      "queryParams": [],
      "bodyParams": [
        "displayName"
      ],
      "paramMeta": [
        {
          "name": "objectStorageId",
          "location": "path",
          "required": true,
          "description": "The identifier of the object storage.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "displayName",
          "location": "body",
          "required": true,
          "description": "Display name helps to differentiate between object storages, especially if they are in the same region.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("update"), "objectStorageId": z.string().describe("The identifier of the object storage."), "displayName": z.string().min(1).max(255).describe("Display name helps to differentiate between object storages, especially if they are in the same region.") }) as any,
  },
  {
    ...{
      "id": "objectStorage_upgrade",
      "domain": "objectStorage",
      "name": "upgrade",
      "method": "POST",
      "path": "/v1/object-storages/{objectStorageId}/resize",
      "summary": "Upgrade object storage size resp. update autoscaling settings.",
      "description": "Upgrade object storage size. You can also adjust the autoscaling settings for your object storage. Autoscaling allows you to automatically purchase storage capacity on a monthly basis up to the specified limit.",
      "deprecated": false,
      "write": true,
      "destructive": false,
      "pathParams": [
        "objectStorageId"
      ],
      "queryParams": [],
      "bodyParams": [
        "autoScaling",
        "totalPurchasedSpaceTB"
      ],
      "paramMeta": [
        {
          "name": "objectStorageId",
          "location": "path",
          "required": true,
          "description": "The identifier of the object storage.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "autoScaling",
          "location": "body",
          "required": false,
          "description": "New monthly object storage size limit for autoscaling if enabled.",
          "type": "object",
          "deprecated": false
        },
        {
          "name": "totalPurchasedSpaceTB",
          "location": "body",
          "required": false,
          "description": "New total object storage limit. If this number is larger than before you will also be billed for the added storage space. No downgrade possible.",
          "type": "number",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("upgrade"), "objectStorageId": z.string().describe("The identifier of the object storage."), "autoScaling": z.object({ "state": z.enum(["enabled", "disabled"]).describe("State of the autoscaling for the current object storage.").optional(), "sizeLimitTB": z.number().describe("Autoscaling size limit for the current object storage.").optional() }).describe("New monthly object storage size limit for autoscaling if enabled.").optional(), "totalPurchasedSpaceTB": z.number().describe("New total object storage limit. If this number is larger than before you will also be billed for the added storage space. No downgrade possible.").optional() }) as any,
  },
  {
    ...{
      "id": "objectStorage_stats",
      "domain": "objectStorage",
      "name": "stats",
      "method": "GET",
      "path": "/v1/object-storages/{objectStorageId}/stats",
      "summary": "List usage statistics about the specified object storage",
      "description": "List usage statistics about the specified object storage such as the number of objects uploaded / created, used object storage space. Please note that the usage statistics are updated regularly and are not live usage statistics.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [
        "objectStorageId"
      ],
      "queryParams": [],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "objectStorageId",
          "location": "path",
          "required": true,
          "description": "The identifier of the object storage.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("stats"), "objectStorageId": z.string().describe("The identifier of the object storage.") }) as any,
  },
  {
    ...{
      "id": "objectStorage_cancel",
      "domain": "objectStorage",
      "name": "cancel",
      "method": "PATCH",
      "path": "/v1/object-storages/{objectStorageId}/cancel",
      "summary": "Cancels the specified object storage at the next possible date",
      "description": "Cancels the specified object storage at the next possible date. Please be aware of your contract periods.",
      "deprecated": false,
      "write": true,
      "destructive": true,
      "pathParams": [
        "objectStorageId"
      ],
      "queryParams": [],
      "bodyParams": [
        "cancelDate"
      ],
      "paramMeta": [
        {
          "name": "objectStorageId",
          "location": "path",
          "required": true,
          "description": "The identifier of the object storage.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "cancelDate",
          "location": "body",
          "required": false,
          "description": "Date of cancellation",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("cancel"), "objectStorageId": z.string().describe("The identifier of the object storage."), "cancelDate": z.string().describe("Date of cancellation").optional() }) as any,
  },
  {
    ...{
      "id": "audits_objectStorages",
      "domain": "audits",
      "name": "objectStorages",
      "method": "GET",
      "path": "/v1/object-storages/audits",
      "summary": "List history about your object storages (audit)",
      "description": "List and filters the history about your object storages.",
      "deprecated": false,
      "write": false,
      "destructive": false,
      "pathParams": [],
      "queryParams": [
        "page",
        "size",
        "orderBy",
        "objectStorageId",
        "requestId",
        "changedBy",
        "startDate",
        "endDate"
      ],
      "bodyParams": [],
      "paramMeta": [
        {
          "name": "page",
          "location": "query",
          "required": false,
          "description": "Number of page to be fetched.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "size",
          "location": "query",
          "required": false,
          "description": "Number of elements per page.",
          "type": "integer",
          "deprecated": false
        },
        {
          "name": "orderBy",
          "location": "query",
          "required": false,
          "description": "Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`.",
          "type": "string[]",
          "deprecated": false
        },
        {
          "name": "objectStorageId",
          "location": "query",
          "required": false,
          "description": "The identifier of the object storage.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "requestId",
          "location": "query",
          "required": false,
          "description": "The requestId of the API call which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "changedBy",
          "location": "query",
          "required": false,
          "description": "changedBy of the user which led to the change.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "startDate",
          "location": "query",
          "required": false,
          "description": "Start of search time range.",
          "type": "string",
          "deprecated": false
        },
        {
          "name": "endDate",
          "location": "query",
          "required": false,
          "description": "End of search time range.",
          "type": "string",
          "deprecated": false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.strictObject({ operation: z.literal("objectStorages"), "page": z.number().int().optional().describe("Number of page to be fetched."), "size": z.number().int().optional().describe("Number of elements per page."), "orderBy": z.array(z.string()).optional().describe("Specify fields and ordering (ASC for ascending, DESC for descending) in following format `field:ASC|DESC`."), "objectStorageId": z.string().optional().describe("The identifier of the object storage."), "requestId": z.string().optional().describe("The requestId of the API call which led to the change."), "changedBy": z.string().optional().describe("changedBy of the user which led to the change."), "startDate": z.string().optional().describe("Start of search time range."), "endDate": z.string().optional().describe("End of search time range.") }) as any,
  },
];
