import type { CronJob } from "../../cron/types.js";
import type { GatewayRpcOpts } from "../gateway-rpc.js";
export declare const getCronChannelOptions: () => string;
export declare function warnIfCronSchedulerDisabled(opts: GatewayRpcOpts): Promise<void>;
export declare function parseDurationMs(input: string): number | null;
export declare function parseAtMs(input: string): number | null;
export declare function printCronList(jobs: CronJob[], runtime?: import("../../runtime.js").RuntimeEnv): void;
