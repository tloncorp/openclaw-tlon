import type { ChannelPluginCatalogEntry } from "../../channels/plugins/catalog.js";
import type { OpenClawConfig } from "../../config/config.js";
import type { RuntimeEnv } from "../../runtime.js";
import type { WizardPrompter } from "../../wizard/prompts.js";
type InstallResult = {
    cfg: OpenClawConfig;
    installed: boolean;
};
export declare function ensureOnboardingPluginInstalled(params: {
    cfg: OpenClawConfig;
    entry: ChannelPluginCatalogEntry;
    prompter: WizardPrompter;
    runtime: RuntimeEnv;
    workspaceDir?: string;
}): Promise<InstallResult>;
export declare function reloadOnboardingPluginRegistry(params: {
    cfg: OpenClawConfig;
    runtime: RuntimeEnv;
    workspaceDir?: string;
}): void;
export {};
