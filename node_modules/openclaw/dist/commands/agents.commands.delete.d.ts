import type { RuntimeEnv } from "../runtime.js";
type AgentsDeleteOptions = {
    id: string;
    force?: boolean;
    json?: boolean;
};
export declare function agentsDeleteCommand(opts: AgentsDeleteOptions, runtime?: RuntimeEnv): Promise<void>;
export {};
