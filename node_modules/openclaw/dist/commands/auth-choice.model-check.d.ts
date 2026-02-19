import type { OpenClawConfig } from "../config/config.js";
import type { WizardPrompter } from "../wizard/prompts.js";
export declare function warnIfModelConfigLooksOff(config: OpenClawConfig, prompter: WizardPrompter, options?: {
    agentId?: string;
    agentDir?: string;
}): Promise<void>;
