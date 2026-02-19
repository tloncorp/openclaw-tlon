import type { Api, Model } from "@mariozechner/pi-ai";
import type { AuthProfileStore } from "../../agents/auth-profiles.js";
import type { OpenClawConfig } from "../../config/config.js";
import type { ModelRow } from "./list.types.js";
export declare function loadModelRegistry(cfg: OpenClawConfig): Promise<{
    registry: import("../../agents/pi-model-discovery.js").ModelRegistry;
    models: Model<Api>[];
    availableKeys: Set<string>;
}>;
export declare function toModelRow(params: {
    model?: Model<Api>;
    key: string;
    tags: string[];
    aliases?: string[];
    availableKeys?: Set<string>;
    cfg?: OpenClawConfig;
    authStore?: AuthProfileStore;
}): ModelRow;
