import type { OpenClawConfig } from "../../../config/config.js";
import type { OnboardOptions } from "../../onboard-types.js";
export declare function resolveNonInteractiveWorkspaceDir(params: {
    opts: OnboardOptions;
    baseConfig: OpenClawConfig;
    defaultWorkspaceDir: string;
}): string;
