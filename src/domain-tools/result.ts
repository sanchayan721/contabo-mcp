import { z } from "zod";

export interface ToolCallResult {
  content: { type: "text"; text: string }[];
  isError?: boolean;
}

export class ToolCallResultFactory {
  public success(result: unknown): ToolCallResult {
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }

  public failure(message: string): ToolCallResult {
    return { content: [{ type: "text", text: message }], isError: true };
  }

  public invalidArguments(error: z.ZodError): ToolCallResult {
    return this.failure(this.formatIssues(error));
  }

  private formatIssues(error: z.ZodError): string {
    const lines = error.issues.map((issue) => {
      const path = issue.path.length ? issue.path.join(".") : "(root)";
      return `- ${path}: ${issue.message}`;
    });

    return `Invalid arguments:\n${lines.join("\n")}`;
  }
}
