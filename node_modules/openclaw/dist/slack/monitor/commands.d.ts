import type { SlackSlashCommandConfig } from "../../config/config.js";
export declare function normalizeSlackSlashCommandName(raw: string): string;
export declare function resolveSlackSlashCommandConfig(raw?: SlackSlashCommandConfig): Required<SlackSlashCommandConfig>;
export declare function buildSlackSlashCommandMatcher(name: string): RegExp;
