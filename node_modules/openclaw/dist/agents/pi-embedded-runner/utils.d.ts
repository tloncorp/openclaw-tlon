import type { ThinkingLevel } from "@mariozechner/pi-agent-core";
import type { ReasoningLevel, ThinkLevel } from "../../auto-reply/thinking.js";
import type { OpenClawConfig } from "../../config/config.js";
import type { ExecToolDefaults } from "../bash-tools.js";
export declare function mapThinkingLevel(level?: ThinkLevel): ThinkingLevel;
export declare function resolveExecToolDefaults(config?: OpenClawConfig): ExecToolDefaults | undefined;
export declare function describeUnknownError(error: unknown): string;
export type { ReasoningLevel, ThinkLevel };
