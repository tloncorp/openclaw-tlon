import type { OnboardOptions } from "../commands/onboard-types.js";
import type { RuntimeEnv } from "../runtime.js";
import { type WizardPrompter } from "./prompts.js";
export declare function runOnboardingWizard(opts: OnboardOptions, runtime: RuntimeEnv | undefined, prompter: WizardPrompter): Promise<void>;
