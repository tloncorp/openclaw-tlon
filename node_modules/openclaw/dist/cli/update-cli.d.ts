import type { Command } from "commander";
export type UpdateCommandOptions = {
    json?: boolean;
    restart?: boolean;
    channel?: string;
    tag?: string;
    timeout?: string;
    yes?: boolean;
};
export type UpdateStatusOptions = {
    json?: boolean;
    timeout?: string;
};
export type UpdateWizardOptions = {
    timeout?: string;
};
export declare function updateStatusCommand(opts: UpdateStatusOptions): Promise<void>;
export declare function updateCommand(opts: UpdateCommandOptions): Promise<void>;
export declare function updateWizardCommand(opts?: UpdateWizardOptions): Promise<void>;
export declare function registerUpdateCli(program: Command): void;
