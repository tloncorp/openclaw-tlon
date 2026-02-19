import type { OpenClawConfig } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
export declare function createQuietRuntime(runtime: RuntimeEnv): RuntimeEnv;
export declare function requireValidConfig(runtime: RuntimeEnv): Promise<OpenClawConfig | null>;
