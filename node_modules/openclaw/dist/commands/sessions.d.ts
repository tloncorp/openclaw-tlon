import type { RuntimeEnv } from "../runtime.js";
export declare function sessionsCommand(opts: {
    json?: boolean;
    store?: string;
    active?: string;
}, runtime: RuntimeEnv): Promise<void>;
