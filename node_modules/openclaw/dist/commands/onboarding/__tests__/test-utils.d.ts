import type { RuntimeEnv } from "../../../runtime.js";
import type { WizardPrompter } from "../../../wizard/prompts.js";
export declare const makeRuntime: (overrides?: Partial<RuntimeEnv>) => RuntimeEnv;
export declare const makePrompter: (overrides?: Partial<WizardPrompter>) => WizardPrompter;
