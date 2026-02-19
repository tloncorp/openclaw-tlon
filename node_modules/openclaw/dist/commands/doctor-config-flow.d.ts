import type { OpenClawConfig } from "../config/config.js";
import type { DoctorOptions } from "./doctor-prompter.js";
export declare function loadAndMaybeMigrateDoctorConfig(params: {
    options: DoctorOptions;
    confirm: (p: {
        message: string;
        initialValue: boolean;
    }) => Promise<boolean>;
}): Promise<{
    cfg: OpenClawConfig;
    path: string;
    shouldWriteConfig: boolean;
}>;
