import type { OpenClawConfig, GatewayAuthConfig } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
import type { WizardPrompter } from "../wizard/prompts.js";
type GatewayAuthChoice = "token" | "password";
export declare function buildGatewayAuthConfig(params: {
    existing?: GatewayAuthConfig;
    mode: GatewayAuthChoice;
    token?: string;
    password?: string;
}): GatewayAuthConfig | undefined;
export declare function promptAuthConfig(cfg: OpenClawConfig, runtime: RuntimeEnv, prompter: WizardPrompter): Promise<OpenClawConfig>;
export {};
