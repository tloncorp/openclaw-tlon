import type { RuntimeEnv } from "../../runtime.js";
export declare function modelsStatusCommand(opts: {
    json?: boolean;
    plain?: boolean;
    check?: boolean;
    probe?: boolean;
    probeProvider?: string;
    probeProfile?: string | string[];
    probeTimeout?: string;
    probeConcurrency?: string;
    probeMaxTokens?: string;
    agent?: string;
}, runtime: RuntimeEnv): Promise<void>;
