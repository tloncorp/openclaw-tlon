import type { RuntimeEnv } from "../../runtime.js";
export declare function ensureConfigReady(params: {
    runtime: RuntimeEnv;
    commandPath?: string[];
}): Promise<void>;
