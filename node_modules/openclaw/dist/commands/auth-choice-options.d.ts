import type { AuthProfileStore } from "../agents/auth-profiles.js";
import type { AuthChoice } from "./onboard-types.js";
export type AuthChoiceOption = {
    value: AuthChoice;
    label: string;
    hint?: string;
};
export type AuthChoiceGroupId = "openai" | "anthropic" | "google" | "copilot" | "openrouter" | "ai-gateway" | "moonshot" | "zai" | "xiaomi" | "opencode-zen" | "minimax" | "synthetic" | "venice" | "qwen";
export type AuthChoiceGroup = {
    value: AuthChoiceGroupId;
    label: string;
    hint?: string;
    options: AuthChoiceOption[];
};
export declare function buildAuthChoiceOptions(params: {
    store: AuthProfileStore;
    includeSkip: boolean;
}): AuthChoiceOption[];
export declare function buildAuthChoiceGroups(params: {
    store: AuthProfileStore;
    includeSkip: boolean;
}): {
    groups: AuthChoiceGroup[];
    skipOption?: AuthChoiceOption;
};
