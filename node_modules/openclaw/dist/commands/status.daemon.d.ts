type DaemonStatusSummary = {
    label: string;
    installed: boolean | null;
    loadedText: string;
    runtimeShort: string | null;
};
export declare function getDaemonStatusSummary(): Promise<DaemonStatusSummary>;
export declare function getNodeDaemonStatusSummary(): Promise<DaemonStatusSummary>;
export {};
