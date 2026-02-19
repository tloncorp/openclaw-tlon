import type { OpenClawConfig } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
export type RemovalResult = {
    ok: boolean;
    skipped?: boolean;
};
export declare function collectWorkspaceDirs(cfg: OpenClawConfig | undefined): string[];
export declare function isPathWithin(child: string, parent: string): boolean;
export declare function removePath(target: string, runtime: RuntimeEnv, opts?: {
    dryRun?: boolean;
    label?: string;
}): Promise<RemovalResult>;
export declare function listAgentSessionDirs(stateDir: string): Promise<string[]>;
