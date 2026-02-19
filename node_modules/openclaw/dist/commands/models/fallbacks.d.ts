import type { RuntimeEnv } from "../../runtime.js";
export declare function modelsFallbacksListCommand(opts: {
    json?: boolean;
    plain?: boolean;
}, runtime: RuntimeEnv): Promise<void>;
export declare function modelsFallbacksAddCommand(modelRaw: string, runtime: RuntimeEnv): Promise<void>;
export declare function modelsFallbacksRemoveCommand(modelRaw: string, runtime: RuntimeEnv): Promise<void>;
export declare function modelsFallbacksClearCommand(runtime: RuntimeEnv): Promise<void>;
