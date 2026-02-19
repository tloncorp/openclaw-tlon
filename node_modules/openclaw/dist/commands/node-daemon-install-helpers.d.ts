import type { NodeDaemonRuntime } from "./node-daemon-runtime.js";
type WarnFn = (message: string, title?: string) => void;
export type NodeInstallPlan = {
    programArguments: string[];
    workingDirectory?: string;
    environment: Record<string, string | undefined>;
    description?: string;
};
export declare function buildNodeInstallPlan(params: {
    env: Record<string, string | undefined>;
    host: string;
    port: number;
    tls?: boolean;
    tlsFingerprint?: string;
    nodeId?: string;
    displayName?: string;
    runtime: NodeDaemonRuntime;
    devMode?: boolean;
    nodePath?: string;
    warn?: WarnFn;
}): Promise<NodeInstallPlan>;
export {};
