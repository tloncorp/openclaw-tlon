import type { OnboardOptions } from "../commands/onboard-types.js";
import type { OpenClawConfig } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
import type { GatewayWizardSettings, WizardFlow } from "./onboarding.types.js";
import type { WizardPrompter } from "./prompts.js";
type FinalizeOnboardingOptions = {
    flow: WizardFlow;
    opts: OnboardOptions;
    baseConfig: OpenClawConfig;
    nextConfig: OpenClawConfig;
    workspaceDir: string;
    settings: GatewayWizardSettings;
    prompter: WizardPrompter;
    runtime: RuntimeEnv;
};
export declare function finalizeOnboardingWizard(options: FinalizeOnboardingOptions): Promise<void>;
export {};
