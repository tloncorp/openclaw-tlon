import { type GatewayDaemonRuntime } from "./daemon-runtime.js";
export type NodeDaemonRuntime = GatewayDaemonRuntime;
export declare const DEFAULT_NODE_DAEMON_RUNTIME: GatewayDaemonRuntime;
export declare const NODE_DAEMON_RUNTIME_OPTIONS: {
    value: GatewayDaemonRuntime;
    label: string;
    hint?: string;
}[];
export declare function isNodeDaemonRuntime(value: string | undefined): value is NodeDaemonRuntime;
