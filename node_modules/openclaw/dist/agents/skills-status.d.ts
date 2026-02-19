import type { OpenClawConfig } from "../config/config.js";
import { type SkillEntry, type SkillEligibilityContext, type SkillInstallSpec } from "./skills.js";
export type SkillStatusConfigCheck = {
    path: string;
    value: unknown;
    satisfied: boolean;
};
export type SkillInstallOption = {
    id: string;
    kind: SkillInstallSpec["kind"];
    label: string;
    bins: string[];
};
export type SkillStatusEntry = {
    name: string;
    description: string;
    source: string;
    filePath: string;
    baseDir: string;
    skillKey: string;
    primaryEnv?: string;
    emoji?: string;
    homepage?: string;
    always: boolean;
    disabled: boolean;
    blockedByAllowlist: boolean;
    eligible: boolean;
    requirements: {
        bins: string[];
        anyBins: string[];
        env: string[];
        config: string[];
        os: string[];
    };
    missing: {
        bins: string[];
        anyBins: string[];
        env: string[];
        config: string[];
        os: string[];
    };
    configChecks: SkillStatusConfigCheck[];
    install: SkillInstallOption[];
};
export type SkillStatusReport = {
    workspaceDir: string;
    managedSkillsDir: string;
    skills: SkillStatusEntry[];
};
export declare function buildWorkspaceSkillStatus(workspaceDir: string, opts?: {
    config?: OpenClawConfig;
    managedSkillsDir?: string;
    entries?: SkillEntry[];
    eligibility?: SkillEligibilityContext;
}): SkillStatusReport;
