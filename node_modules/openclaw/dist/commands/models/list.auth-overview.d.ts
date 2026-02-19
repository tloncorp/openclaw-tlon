import type { OpenClawConfig } from "../../config/config.js";
import type { ProviderAuthOverview } from "./list.types.js";
import { type AuthProfileStore } from "../../agents/auth-profiles.js";
export declare function resolveProviderAuthOverview(params: {
    provider: string;
    cfg: OpenClawConfig;
    store: AuthProfileStore;
    modelsPath: string;
}): ProviderAuthOverview;
