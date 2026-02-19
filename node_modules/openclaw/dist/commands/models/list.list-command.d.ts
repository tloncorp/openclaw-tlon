import type { RuntimeEnv } from "../../runtime.js";
export declare function modelsListCommand(opts: {
    all?: boolean;
    local?: boolean;
    provider?: string;
    json?: boolean;
    plain?: boolean;
}, runtime: RuntimeEnv): Promise<void>;
