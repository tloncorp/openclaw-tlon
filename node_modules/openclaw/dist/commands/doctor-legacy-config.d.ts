import type { OpenClawConfig } from "../config/config.js";
export declare function normalizeLegacyConfigValues(cfg: OpenClawConfig): {
    config: OpenClawConfig;
    changes: string[];
};
