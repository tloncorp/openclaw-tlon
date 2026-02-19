import type { AgentTool } from "@mariozechner/pi-agent-core";
export type ApplyPatchSummary = {
    added: string[];
    modified: string[];
    deleted: string[];
};
export type ApplyPatchResult = {
    summary: ApplyPatchSummary;
    text: string;
};
export type ApplyPatchToolDetails = {
    summary: ApplyPatchSummary;
};
type ApplyPatchOptions = {
    cwd: string;
    sandboxRoot?: string;
    signal?: AbortSignal;
};
export declare function createApplyPatchTool(options?: {
    cwd?: string;
    sandboxRoot?: string;
}): AgentTool<any, ApplyPatchToolDetails>;
export declare function applyPatch(input: string, options: ApplyPatchOptions): Promise<ApplyPatchResult>;
export {};
