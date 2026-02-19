import type { RuntimeEnv } from "../../runtime.js";
export declare function modelsAuthSetupTokenCommand(opts: {
    provider?: string;
    yes?: boolean;
}, runtime: RuntimeEnv): Promise<void>;
export declare function modelsAuthPasteTokenCommand(opts: {
    provider?: string;
    profileId?: string;
    expiresIn?: string;
}, runtime: RuntimeEnv): Promise<void>;
export declare function modelsAuthAddCommand(_opts: Record<string, never>, runtime: RuntimeEnv): Promise<void>;
type LoginOptions = {
    provider?: string;
    method?: string;
    setDefault?: boolean;
};
export declare function modelsAuthLoginCommand(opts: LoginOptions, runtime: RuntimeEnv): Promise<void>;
export {};
