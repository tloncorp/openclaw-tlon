import type { OpenClawConfig } from "../../config/config.js";
import type { RuntimeEnv } from "../../runtime.js";
import type { OnboardOptions } from "../onboard-types.js";
export declare function runNonInteractiveOnboardingRemote(params: {
    opts: OnboardOptions;
    runtime: RuntimeEnv;
    baseConfig: OpenClawConfig;
}): Promise<void>;
