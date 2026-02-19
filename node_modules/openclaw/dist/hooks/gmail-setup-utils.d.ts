import { type SpawnResult } from "../process/exec.js";
export declare function resolvePythonExecutablePath(): Promise<string | undefined>;
export declare function ensureDependency(bin: string, brewArgs: string[]): Promise<void>;
export declare function ensureGcloudAuth(): Promise<void>;
export declare function runGcloud(args: string[]): Promise<SpawnResult>;
export declare function ensureTopic(projectId: string, topicName: string): Promise<void>;
export declare function ensureSubscription(projectId: string, subscription: string, topicName: string, pushEndpoint: string): Promise<void>;
export declare function ensureTailscaleEndpoint(params: {
    mode: "off" | "serve" | "funnel";
    path: string;
    port?: number;
    target?: string;
    token?: string;
}): Promise<string>;
export declare function resolveProjectIdFromGogCredentials(): Promise<string | null>;
