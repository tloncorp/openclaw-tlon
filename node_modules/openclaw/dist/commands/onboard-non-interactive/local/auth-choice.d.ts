import type { OpenClawConfig } from "../../../config/config.js";
import type { RuntimeEnv } from "../../../runtime.js";
import type { AuthChoice, OnboardOptions } from "../../onboard-types.js";
export declare function applyNonInteractiveAuthChoice(params: {
    nextConfig: OpenClawConfig;
    authChoice: AuthChoice;
    opts: OnboardOptions;
    runtime: RuntimeEnv;
    baseConfig: OpenClawConfig;
}): Promise<OpenClawConfig | null>;
