import type { RuntimeEnv } from "../../runtime.js";
export declare function modelsImageFallbacksListCommand(opts: {
    json?: boolean;
    plain?: boolean;
}, runtime: RuntimeEnv): Promise<void>;
export declare function modelsImageFallbacksAddCommand(modelRaw: string, runtime: RuntimeEnv): Promise<void>;
export declare function modelsImageFallbacksRemoveCommand(modelRaw: string, runtime: RuntimeEnv): Promise<void>;
export declare function modelsImageFallbacksClearCommand(runtime: RuntimeEnv): Promise<void>;
