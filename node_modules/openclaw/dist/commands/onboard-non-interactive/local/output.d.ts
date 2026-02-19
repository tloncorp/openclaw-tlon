import type { RuntimeEnv } from "../../../runtime.js";
import type { OnboardOptions } from "../../onboard-types.js";
export declare function logNonInteractiveOnboardingJson(params: {
    opts: OnboardOptions;
    runtime: RuntimeEnv;
    mode: "local" | "remote";
    workspaceDir?: string;
    authChoice?: string;
    gateway?: {
        port: number;
        bind: string;
        authMode: string;
        tailscaleMode: string;
    };
    installDaemon?: boolean;
    daemonRuntime?: string;
    skipSkills?: boolean;
    skipHealth?: boolean;
}): void;
