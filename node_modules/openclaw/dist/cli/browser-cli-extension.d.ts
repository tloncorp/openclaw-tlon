import type { Command } from "commander";
export declare function installChromeExtension(opts?: {
    stateDir?: string;
    sourceDir?: string;
}): Promise<{
    path: string;
}>;
export declare function registerBrowserExtensionCommands(browser: Command, parentOpts: (cmd: Command) => {
    json?: boolean;
}): void;
