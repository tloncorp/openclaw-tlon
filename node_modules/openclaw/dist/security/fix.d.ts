import { type ExecFn } from "./windows-acl.js";
export type SecurityFixChmodAction = {
    kind: "chmod";
    path: string;
    mode: number;
    ok: boolean;
    skipped?: string;
    error?: string;
};
export type SecurityFixIcaclsAction = {
    kind: "icacls";
    path: string;
    command: string;
    ok: boolean;
    skipped?: string;
    error?: string;
};
export type SecurityFixAction = SecurityFixChmodAction | SecurityFixIcaclsAction;
export type SecurityFixResult = {
    ok: boolean;
    stateDir: string;
    configPath: string;
    configWritten: boolean;
    changes: string[];
    actions: SecurityFixAction[];
    errors: string[];
};
export declare function fixSecurityFootguns(opts?: {
    env?: NodeJS.ProcessEnv;
    stateDir?: string;
    configPath?: string;
    platform?: NodeJS.Platform;
    exec?: ExecFn;
}): Promise<SecurityFixResult>;
