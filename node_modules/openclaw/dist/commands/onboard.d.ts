import type { RuntimeEnv } from "../runtime.js";
import type { OnboardOptions } from "./onboard-types.js";
export declare function onboardCommand(opts: OnboardOptions, runtime?: RuntimeEnv): Promise<void>;
export type { OnboardOptions } from "./onboard-types.js";
