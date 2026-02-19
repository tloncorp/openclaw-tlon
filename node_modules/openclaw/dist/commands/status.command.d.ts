import type { RuntimeEnv } from "../runtime.js";
export declare function statusCommand(opts: {
    json?: boolean;
    deep?: boolean;
    usage?: boolean;
    timeoutMs?: number;
    verbose?: boolean;
    all?: boolean;
}, runtime: RuntimeEnv): Promise<void>;
