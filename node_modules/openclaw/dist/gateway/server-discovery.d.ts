import fs from "node:fs";
import { runExec } from "../process/exec.js";
export type ResolveBonjourCliPathOptions = {
    env?: NodeJS.ProcessEnv;
    argv?: string[];
    execPath?: string;
    cwd?: string;
    statSync?: (path: string) => fs.Stats;
};
export declare function formatBonjourInstanceName(displayName: string): string;
export declare function resolveBonjourCliPath(opts?: ResolveBonjourCliPathOptions): string | undefined;
export declare function resolveTailnetDnsHint(opts?: {
    env?: NodeJS.ProcessEnv;
    exec?: typeof runExec;
    enabled?: boolean;
}): Promise<string | undefined>;
