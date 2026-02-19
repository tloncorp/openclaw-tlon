/**
 * LLM-based slug generator for session memory filenames
 */
import type { OpenClawConfig } from "../config/config.js";
/**
 * Generate a short 1-2 word filename slug from session content using LLM
 */
export declare function generateSlugViaLLM(params: {
    sessionContent: string;
    cfg: OpenClawConfig;
}): Promise<string | null>;
