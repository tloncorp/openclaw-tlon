import type { OpenClawConfig } from "../config/types.js";
import type { GatewayDaemonRuntime } from "./daemon-runtime.js";
type WarnFn = (message: string, title?: string) => void;
export type GatewayInstallPlan = {
    programArguments: string[];
    workingDirectory?: string;
    environment: Record<string, string | undefined>;
};
export declare function resolveGatewayDevMode(argv?: string[]): boolean;
export declare function buildGatewayInstallPlan(params: {
    env: Record<string, string | undefined>;
    port: number;
    runtime: GatewayDaemonRuntime;
    token?: string;
    devMode?: boolean;
    nodePath?: string;
    warn?: WarnFn;
    /** Full config to extract env vars from (env vars + inline env keys). */
    config?: OpenClawConfig;
}): Promise<GatewayInstallPlan>;
export declare function gatewayInstallErrorHint(platform?: NodeJS.Platform): string;
export {};
