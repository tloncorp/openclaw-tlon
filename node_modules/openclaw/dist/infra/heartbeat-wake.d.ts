export type HeartbeatRunResult = {
    status: "ran";
    durationMs: number;
} | {
    status: "skipped";
    reason: string;
} | {
    status: "failed";
    reason: string;
};
export type HeartbeatWakeHandler = (opts: {
    reason?: string;
}) => Promise<HeartbeatRunResult>;
export declare function setHeartbeatWakeHandler(next: HeartbeatWakeHandler | null): void;
export declare function requestHeartbeatNow(opts?: {
    reason?: string;
    coalesceMs?: number;
}): void;
export declare function hasHeartbeatWakeHandler(): boolean;
export declare function hasPendingHeartbeatWake(): boolean;
