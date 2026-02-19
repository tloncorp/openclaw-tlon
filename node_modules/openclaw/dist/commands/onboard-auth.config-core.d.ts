import type { OpenClawConfig } from "../config/config.js";
export declare function applyZaiConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyOpenrouterProviderConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyVercelAiGatewayProviderConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyVercelAiGatewayConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyOpenrouterConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyMoonshotProviderConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyMoonshotConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyKimiCodeProviderConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyKimiCodeConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applySyntheticProviderConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applySyntheticConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyXiaomiProviderConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyXiaomiConfig(cfg: OpenClawConfig): OpenClawConfig;
/**
 * Apply Venice provider configuration without changing the default model.
 * Registers Venice models and sets up the provider, but preserves existing model selection.
 */
export declare function applyVeniceProviderConfig(cfg: OpenClawConfig): OpenClawConfig;
/**
 * Apply Venice provider configuration AND set Venice as the default model.
 * Use this when Venice is the primary provider choice during onboarding.
 */
export declare function applyVeniceConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyAuthProfileConfig(cfg: OpenClawConfig, params: {
    profileId: string;
    provider: string;
    mode: "api_key" | "oauth" | "token";
    email?: string;
    preferProfileFirst?: boolean;
}): OpenClawConfig;
