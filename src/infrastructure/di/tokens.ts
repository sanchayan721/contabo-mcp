import type { InjectionToken } from "tsyringe";
import type { Config } from "../config/index";
import type { ContaboClient } from "../../client";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

export const DI_TOKENS = {
  Config: Symbol("Config") as InjectionToken<Config>,
  ContaboClient: Symbol("ContaboClient") as InjectionToken<ContaboClient>,
  McpServer: Symbol("McpServer") as InjectionToken<McpServer>,
} as const;
