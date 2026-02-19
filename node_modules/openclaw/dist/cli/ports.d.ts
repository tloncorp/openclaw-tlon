export type PortProcess = {
    pid: number;
    command?: string;
};
export type ForceFreePortResult = {
    killed: PortProcess[];
    waitedMs: number;
    escalatedToSigkill: boolean;
};
export declare function parseLsofOutput(output: string): PortProcess[];
export declare function listPortListeners(port: number): PortProcess[];
export declare function forceFreePort(port: number): PortProcess[];
export declare function forceFreePortAndWait(port: number, opts?: {
    /** Total wait budget across signals. */
    timeoutMs?: number;
    /** Poll interval for checking whether lsof reports listeners. */
    intervalMs?: number;
    /** How long to wait after SIGTERM before escalating to SIGKILL. */
    sigtermTimeoutMs?: number;
}): Promise<ForceFreePortResult>;
