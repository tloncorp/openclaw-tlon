import type { ContentBlock, ToolKind } from "@agentclientprotocol/sdk";
export type GatewayAttachment = {
    type: string;
    mimeType: string;
    content: string;
};
export declare function extractTextFromPrompt(prompt: ContentBlock[]): string;
export declare function extractAttachmentsFromPrompt(prompt: ContentBlock[]): GatewayAttachment[];
export declare function formatToolTitle(name: string | undefined, args: Record<string, unknown> | undefined): string;
export declare function inferToolKind(name?: string): ToolKind;
