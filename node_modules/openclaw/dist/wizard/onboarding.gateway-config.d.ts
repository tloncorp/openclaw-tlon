import type { OpenClawConfig } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
import type { GatewayWizardSettings, QuickstartGatewayDefaults, WizardFlow } from "./onboarding.types.js";
import type { WizardPrompter } from "./prompts.js";
type ConfigureGatewayOptions = {
    flow: WizardFlow;
    baseConfig: OpenClawConfig;
    nextConfig: OpenClawConfig;
    localPort: number;
    quickstartGateway: QuickstartGatewayDefaults;
    prompter: WizardPrompter;
    runtime: RuntimeEnv;
};
type ConfigureGatewayResult = {
    nextConfig: OpenClawConfig;
    settings: GatewayWizardSettings;
};
export declare function configureGatewayForOnboarding(opts: ConfigureGatewayOptions): Promise<ConfigureGatewayResult>;
export {};
