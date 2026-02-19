import type { WizardSession } from "../wizard/session.js";
export declare function createWizardSessionTracker(): {
    wizardSessions: Map<string, WizardSession>;
    findRunningWizard: () => string | null;
    purgeWizardSession: (id: string) => void;
};
