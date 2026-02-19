import type { OpenClawConfig } from "../../config/config.js";
import type { RuntimeEnv } from "../../runtime.js";
import type { OnboardOptions } from "../onboard-types.js";
export declare function runNonInteractiveOnboardingLocal(params: {
    opts: OnboardOptions;
    runtime: RuntimeEnv;
    baseConfig: OpenClawConfig;
}): Promise<void>;
