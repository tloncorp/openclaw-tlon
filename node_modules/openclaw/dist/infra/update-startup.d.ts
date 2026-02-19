import type { loadConfig } from "../config/config.js";
export declare function runGatewayUpdateCheck(params: {
    cfg: ReturnType<typeof loadConfig>;
    log: {
        info: (msg: string, meta?: Record<string, unknown>) => void;
    };
    isNixMode: boolean;
    allowInTests?: boolean;
}): Promise<void>;
export declare function scheduleGatewayUpdateCheck(params: {
    cfg: ReturnType<typeof loadConfig>;
    log: {
        info: (msg: string, meta?: Record<string, unknown>) => void;
    };
    isNixMode: boolean;
}): void;
