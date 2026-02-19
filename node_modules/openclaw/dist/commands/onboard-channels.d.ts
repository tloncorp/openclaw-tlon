import type { OpenClawConfig } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import type { ChannelChoice } from "./onboard-types.js";
import type { SetupChannelsOptions } from "./onboarding/types.js";
export declare function noteChannelStatus(params: {
    cfg: OpenClawConfig;
    prompter: WizardPrompter;
    options?: SetupChannelsOptions;
    accountOverrides?: Partial<Record<ChannelChoice, string>>;
}): Promise<void>;
export declare function setupChannels(cfg: OpenClawConfig, runtime: RuntimeEnv, prompter: WizardPrompter, options?: SetupChannelsOptions): Promise<OpenClawConfig>;
