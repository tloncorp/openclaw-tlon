import type { AnyAgentTool } from "./tools/common.js";
type HookContext = {
    agentId?: string;
    sessionKey?: string;
};
type HookOutcome = {
    blocked: true;
    reason: string;
} | {
    blocked: false;
    params: unknown;
};
declare function isPlainObject(value: unknown): value is Record<string, unknown>;
export declare function runBeforeToolCallHook(args: {
    toolName: string;
    params: unknown;
    toolCallId?: string;
    ctx?: HookContext;
}): Promise<HookOutcome>;
export declare function wrapToolWithBeforeToolCallHook(tool: AnyAgentTool, ctx?: HookContext): AnyAgentTool;
export declare const __testing: {
    runBeforeToolCallHook: typeof runBeforeToolCallHook;
    isPlainObject: typeof isPlainObject;
};
export {};
