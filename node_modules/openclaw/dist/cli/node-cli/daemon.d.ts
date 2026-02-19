type NodeDaemonInstallOptions = {
    host?: string;
    port?: string | number;
    tls?: boolean;
    tlsFingerprint?: string;
    nodeId?: string;
    displayName?: string;
    runtime?: string;
    force?: boolean;
    json?: boolean;
};
type NodeDaemonLifecycleOptions = {
    json?: boolean;
};
type NodeDaemonStatusOptions = {
    json?: boolean;
};
export declare function runNodeDaemonInstall(opts: NodeDaemonInstallOptions): Promise<void>;
export declare function runNodeDaemonUninstall(opts?: NodeDaemonLifecycleOptions): Promise<void>;
export declare function runNodeDaemonStart(opts?: NodeDaemonLifecycleOptions): Promise<void>;
export declare function runNodeDaemonRestart(opts?: NodeDaemonLifecycleOptions): Promise<void>;
export declare function runNodeDaemonStop(opts?: NodeDaemonLifecycleOptions): Promise<void>;
export declare function runNodeDaemonStatus(opts?: NodeDaemonStatusOptions): Promise<void>;
export {};
