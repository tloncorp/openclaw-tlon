import type { OpenClawConfig } from "../config/config.js";
import type { WizardPrompter } from "../wizard/prompts.js";
export declare function promptRemoteGatewayConfig(cfg: OpenClawConfig, prompter: WizardPrompter): Promise<OpenClawConfig>;
