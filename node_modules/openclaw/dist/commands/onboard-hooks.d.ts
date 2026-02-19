import type { OpenClawConfig } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
import type { WizardPrompter } from "../wizard/prompts.js";
export declare function setupInternalHooks(cfg: OpenClawConfig, runtime: RuntimeEnv, prompter: WizardPrompter): Promise<OpenClawConfig>;
