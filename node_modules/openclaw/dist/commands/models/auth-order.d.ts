import type { RuntimeEnv } from "../../runtime.js";
export declare function modelsAuthOrderGetCommand(opts: {
    provider: string;
    agent?: string;
    json?: boolean;
}, runtime: RuntimeEnv): Promise<void>;
export declare function modelsAuthOrderClearCommand(opts: {
    provider: string;
    agent?: string;
}, runtime: RuntimeEnv): Promise<void>;
export declare function modelsAuthOrderSetCommand(opts: {
    provider: string;
    agent?: string;
    order: string[];
}, runtime: RuntimeEnv): Promise<void>;
