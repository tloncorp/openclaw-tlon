import type { RuntimeEnv } from "../runtime.js";
type SandboxListOptions = {
    browser: boolean;
    json: boolean;
};
type SandboxRecreateOptions = {
    all: boolean;
    session?: string;
    agent?: string;
    browser: boolean;
    force: boolean;
};
export declare function sandboxListCommand(opts: SandboxListOptions, runtime: RuntimeEnv): Promise<void>;
export declare function sandboxRecreateCommand(opts: SandboxRecreateOptions, runtime: RuntimeEnv): Promise<void>;
export {};
