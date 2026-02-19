import type { OpenClawConfig } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
import type { DoctorOptions, DoctorPrompter } from "./doctor-prompter.js";
export declare function maybeRepairGatewayDaemon(params: {
    cfg: OpenClawConfig;
    runtime: RuntimeEnv;
    prompter: DoctorPrompter;
    options: DoctorOptions;
    gatewayDetailsMessage: string;
    healthOk: boolean;
}): Promise<void>;
