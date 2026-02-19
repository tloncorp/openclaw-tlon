import type { OpenClawConfig } from "../config/config.js";
export type SkillInstallRequest = {
    workspaceDir: string;
    skillName: string;
    installId: string;
    timeoutMs?: number;
    config?: OpenClawConfig;
};
export type SkillInstallResult = {
    ok: boolean;
    message: string;
    stdout: string;
    stderr: string;
    code: number | null;
};
export declare function installSkill(params: SkillInstallRequest): Promise<SkillInstallResult>;
