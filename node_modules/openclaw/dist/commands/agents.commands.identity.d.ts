import type { RuntimeEnv } from "../runtime.js";
type AgentsSetIdentityOptions = {
    agent?: string;
    workspace?: string;
    identityFile?: string;
    name?: string;
    emoji?: string;
    theme?: string;
    avatar?: string;
    fromIdentity?: boolean;
    json?: boolean;
};
export declare function agentsSetIdentityCommand(opts: AgentsSetIdentityOptions, runtime?: RuntimeEnv): Promise<void>;
export {};
