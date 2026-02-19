import type { RuntimeEnv } from "../runtime.js";
export type ResetScope = "config" | "config+creds+sessions" | "full";
export type ResetOptions = {
    scope?: ResetScope;
    yes?: boolean;
    nonInteractive?: boolean;
    dryRun?: boolean;
};
export declare function resetCommand(runtime: RuntimeEnv, opts: ResetOptions): Promise<void>;
