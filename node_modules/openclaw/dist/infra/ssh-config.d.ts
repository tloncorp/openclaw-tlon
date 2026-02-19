import type { SshParsedTarget } from "./ssh-tunnel.js";
export type SshResolvedConfig = {
    user?: string;
    host?: string;
    port?: number;
    identityFiles: string[];
};
export declare function parseSshConfigOutput(output: string): SshResolvedConfig;
export declare function resolveSshConfig(target: SshParsedTarget, opts?: {
    identity?: string;
    timeoutMs?: number;
}): Promise<SshResolvedConfig | null>;
