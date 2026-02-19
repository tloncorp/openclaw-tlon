import type { SandboxConfig, SandboxDockerConfig } from "./types.js";
export declare function execDocker(args: string[], opts?: {
    allowFailure?: boolean;
}): Promise<{
    stdout: string;
    stderr: string;
    code: number;
}>;
export declare function readDockerPort(containerName: string, port: number): Promise<number | null>;
export declare function ensureDockerImage(image: string): Promise<void>;
export declare function dockerContainerState(name: string): Promise<{
    exists: boolean;
    running: boolean;
}>;
export declare function buildSandboxCreateArgs(params: {
    name: string;
    cfg: SandboxDockerConfig;
    scopeKey: string;
    createdAtMs?: number;
    labels?: Record<string, string>;
    configHash?: string;
}): string[];
export declare function ensureSandboxContainer(params: {
    sessionKey: string;
    workspaceDir: string;
    agentWorkspaceDir: string;
    cfg: SandboxConfig;
}): Promise<string>;
