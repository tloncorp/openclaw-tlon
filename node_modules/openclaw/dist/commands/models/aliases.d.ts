import type { RuntimeEnv } from "../../runtime.js";
export declare function modelsAliasesListCommand(opts: {
    json?: boolean;
    plain?: boolean;
}, runtime: RuntimeEnv): Promise<void>;
export declare function modelsAliasesAddCommand(aliasRaw: string, modelRaw: string, runtime: RuntimeEnv): Promise<void>;
export declare function modelsAliasesRemoveCommand(aliasRaw: string, runtime: RuntimeEnv): Promise<void>;
