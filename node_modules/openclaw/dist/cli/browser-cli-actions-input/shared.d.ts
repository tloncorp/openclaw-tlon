import type { Command } from "commander";
import type { BrowserFormField } from "../../browser/client-actions-core.js";
import { type BrowserParentOpts } from "../browser-cli-shared.js";
export type BrowserActionContext = {
    parent: BrowserParentOpts;
    profile: string | undefined;
};
export declare function resolveBrowserActionContext(cmd: Command, parentOpts: (cmd: Command) => BrowserParentOpts): BrowserActionContext;
export declare function callBrowserAct<T = unknown>(params: {
    parent: BrowserParentOpts;
    profile?: string;
    body: Record<string, unknown>;
    timeoutMs?: number;
}): Promise<T>;
export declare function requireRef(ref: string | undefined): string | null;
export declare function readFields(opts: {
    fields?: string;
    fieldsFile?: string;
}): Promise<BrowserFormField[]>;
