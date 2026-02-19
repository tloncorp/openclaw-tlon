export type RestartAttempt = {
    ok: boolean;
    method: "launchctl" | "systemd" | "supervisor";
    detail?: string;
    tried?: string[];
};
export declare function setGatewaySigusr1RestartPolicy(opts?: {
    allowExternal?: boolean;
}): void;
export declare function isGatewaySigusr1RestartExternallyAllowed(): boolean;
export declare function authorizeGatewaySigusr1Restart(delayMs?: number): void;
export declare function consumeGatewaySigusr1RestartAuthorization(): boolean;
export declare function triggerOpenClawRestart(): RestartAttempt;
export type ScheduledRestart = {
    ok: boolean;
    pid: number;
    signal: "SIGUSR1";
    delayMs: number;
    reason?: string;
    mode: "emit" | "signal";
};
export declare function scheduleGatewaySigusr1Restart(opts?: {
    delayMs?: number;
    reason?: string;
}): ScheduledRestart;
export declare const __testing: {
    resetSigusr1State(): void;
};
