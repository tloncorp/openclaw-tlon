import type { OpenClawConfig } from "../../config/config.js";
import type { AnyAgentTool } from "./common.js";
import { coerceImageAssistantText, decodeDataUrl, type ImageModelConfig } from "./image-tool.helpers.js";
export declare const __testing: {
    readonly decodeDataUrl: typeof decodeDataUrl;
    readonly coerceImageAssistantText: typeof coerceImageAssistantText;
};
/**
 * Resolve the effective image model config for the `image` tool.
 *
 * - Prefer explicit config (`agents.defaults.imageModel`).
 * - Otherwise, try to "pair" the primary model with an image-capable model:
 *   - same provider (best effort)
 *   - fall back to OpenAI/Anthropic when available
 */
export declare function resolveImageModelConfigForTool(params: {
    cfg?: OpenClawConfig;
    agentDir: string;
}): ImageModelConfig | null;
export declare function createImageTool(options?: {
    config?: OpenClawConfig;
    agentDir?: string;
    sandboxRoot?: string;
    /** If true, the model has native vision capability and images in the prompt are auto-injected */
    modelHasVision?: boolean;
}): AnyAgentTool | null;
