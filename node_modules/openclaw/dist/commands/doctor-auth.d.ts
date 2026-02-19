import type { OpenClawConfig } from "../config/config.js";
import type { DoctorPrompter } from "./doctor-prompter.js";
export declare function maybeRepairAnthropicOAuthProfileId(cfg: OpenClawConfig, prompter: DoctorPrompter): Promise<OpenClawConfig>;
export declare function maybeRemoveDeprecatedCliAuthProfiles(cfg: OpenClawConfig, prompter: DoctorPrompter): Promise<OpenClawConfig>;
export declare function noteAuthProfileHealth(params: {
    cfg: OpenClawConfig;
    prompter: DoctorPrompter;
    allowKeychainPrompt: boolean;
}): Promise<void>;
