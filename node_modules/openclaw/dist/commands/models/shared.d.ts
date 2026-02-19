import { DEFAULT_MODEL, DEFAULT_PROVIDER } from "../../agents/defaults.js";
import { modelKey } from "../../agents/model-selection.js";
import { type OpenClawConfig } from "../../config/config.js";
export declare const ensureFlagCompatibility: (opts: {
    json?: boolean;
    plain?: boolean;
}) => void;
export declare const formatTokenK: (value?: number | null) => string;
export declare const formatMs: (value?: number | null) => string;
export declare function updateConfig(mutator: (cfg: OpenClawConfig) => OpenClawConfig): Promise<OpenClawConfig>;
export declare function resolveModelTarget(params: {
    raw: string;
    cfg: OpenClawConfig;
}): {
    provider: string;
    model: string;
};
export declare function buildAllowlistSet(cfg: OpenClawConfig): Set<string>;
export declare function normalizeAlias(alias: string): string;
export declare function resolveKnownAgentId(params: {
    cfg: OpenClawConfig;
    rawAgentId?: string | null;
}): string | undefined;
export { modelKey };
export { DEFAULT_MODEL, DEFAULT_PROVIDER };
/**
 * Model key format: "provider/model"
 *
 * The model key is displayed in `/model status` and used to reference models.
 * When using `/model <key>`, use the exact format shown (e.g., "openrouter/moonshotai/kimi-k2").
 *
 * For providers with hierarchical model IDs (e.g., OpenRouter), the model ID may include
 * sub-providers (e.g., "moonshotai/kimi-k2"), resulting in a key like "openrouter/moonshotai/kimi-k2".
 */
