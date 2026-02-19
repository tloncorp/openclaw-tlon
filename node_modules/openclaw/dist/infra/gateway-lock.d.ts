export type GatewayLockHandle = {
    lockPath: string;
    configPath: string;
    release: () => Promise<void>;
};
export type GatewayLockOptions = {
    env?: NodeJS.ProcessEnv;
    timeoutMs?: number;
    pollIntervalMs?: number;
    staleMs?: number;
    allowInTests?: boolean;
    platform?: NodeJS.Platform;
};
export declare class GatewayLockError extends Error {
    readonly cause?: unknown | undefined;
    constructor(message: string, cause?: unknown | undefined);
}
export declare function acquireGatewayLock(opts?: GatewayLockOptions): Promise<GatewayLockHandle | null>;
