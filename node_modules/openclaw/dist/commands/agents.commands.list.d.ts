import type { RuntimeEnv } from "../runtime.js";
type AgentsListOptions = {
    json?: boolean;
    bindings?: boolean;
};
export declare function agentsListCommand(opts: AgentsListOptions, runtime?: RuntimeEnv): Promise<void>;
export {};
