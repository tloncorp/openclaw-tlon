import type { RuntimeEnv } from "../runtime.js";
type DashboardOptions = {
    noOpen?: boolean;
};
export declare function dashboardCommand(runtime?: RuntimeEnv, options?: DashboardOptions): Promise<void>;
export {};
