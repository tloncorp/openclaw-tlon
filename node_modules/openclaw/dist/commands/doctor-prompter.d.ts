import { confirm, select } from "@clack/prompts";
import type { RuntimeEnv } from "../runtime.js";
export type DoctorOptions = {
    workspaceSuggestions?: boolean;
    yes?: boolean;
    nonInteractive?: boolean;
    deep?: boolean;
    repair?: boolean;
    force?: boolean;
    generateGatewayToken?: boolean;
};
export type DoctorPrompter = {
    confirm: (params: Parameters<typeof confirm>[0]) => Promise<boolean>;
    confirmRepair: (params: Parameters<typeof confirm>[0]) => Promise<boolean>;
    confirmAggressive: (params: Parameters<typeof confirm>[0]) => Promise<boolean>;
    confirmSkipInNonInteractive: (params: Parameters<typeof confirm>[0]) => Promise<boolean>;
    select: <T>(params: Parameters<typeof select>[0], fallback: T) => Promise<T>;
    shouldRepair: boolean;
    shouldForce: boolean;
};
export declare function createDoctorPrompter(params: {
    runtime: RuntimeEnv;
    options: DoctorOptions;
}): DoctorPrompter;
