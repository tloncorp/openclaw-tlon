import type { AuthProfileStore } from "../agents/auth-profiles.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import type { AuthChoice } from "./onboard-types.js";
export declare function promptAuthChoiceGrouped(params: {
    prompter: WizardPrompter;
    store: AuthProfileStore;
    includeSkip: boolean;
}): Promise<AuthChoice>;
