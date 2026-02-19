import { Container } from "@mariozechner/pi-tui";
import { AssistantMessageComponent } from "./assistant-message.js";
import { ToolExecutionComponent } from "./tool-execution.js";
export declare class ChatLog extends Container {
    private toolById;
    private streamingRuns;
    private toolsExpanded;
    clearAll(): void;
    addSystem(text: string): void;
    addUser(text: string): void;
    private resolveRunId;
    startAssistant(text: string, runId?: string): AssistantMessageComponent;
    updateAssistant(text: string, runId?: string): void;
    finalizeAssistant(text: string, runId?: string): void;
    startTool(toolCallId: string, toolName: string, args: unknown): ToolExecutionComponent;
    updateToolArgs(toolCallId: string, args: unknown): void;
    updateToolResult(toolCallId: string, result: unknown, opts?: {
        isError?: boolean;
        partial?: boolean;
    }): void;
    setToolsExpanded(expanded: boolean): void;
}
