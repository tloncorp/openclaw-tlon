import type { RuntimeEnv } from "../runtime.js";
type SandboxExplainOptions = {
    session?: string;
    agent?: string;
    json: boolean;
};
export declare function sandboxExplainCommand(opts: SandboxExplainOptions, runtime: RuntimeEnv): Promise<void>;
export {};
