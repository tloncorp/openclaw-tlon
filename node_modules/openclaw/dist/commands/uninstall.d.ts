import type { RuntimeEnv } from "../runtime.js";
export type UninstallOptions = {
    service?: boolean;
    state?: boolean;
    workspace?: boolean;
    app?: boolean;
    all?: boolean;
    yes?: boolean;
    nonInteractive?: boolean;
    dryRun?: boolean;
};
export declare function uninstallCommand(runtime: RuntimeEnv, opts: UninstallOptions): Promise<void>;
