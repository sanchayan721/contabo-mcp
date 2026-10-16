export interface McpTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: Record<string, boolean>;
  call(args: unknown): Promise<{ content: { type: "text"; text: string }[]; isError?: boolean }>;
}
