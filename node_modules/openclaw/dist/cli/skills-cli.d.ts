import type { Command } from "commander";
import { type SkillStatusReport } from "../agents/skills-status.js";
export type SkillsListOptions = {
    json?: boolean;
    eligible?: boolean;
    verbose?: boolean;
};
export type SkillInfoOptions = {
    json?: boolean;
};
export type SkillsCheckOptions = {
    json?: boolean;
};
/**
 * Format the skills list output
 */
export declare function formatSkillsList(report: SkillStatusReport, opts: SkillsListOptions): string;
/**
 * Format detailed info for a single skill
 */
export declare function formatSkillInfo(report: SkillStatusReport, skillName: string, opts: SkillInfoOptions): string;
/**
 * Format a check/summary of all skills status
 */
export declare function formatSkillsCheck(report: SkillStatusReport, opts: SkillsCheckOptions): string;
/**
 * Register the skills CLI commands
 */
export declare function registerSkillsCli(program: Command): void;
