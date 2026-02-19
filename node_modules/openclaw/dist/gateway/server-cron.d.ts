import type { CliDeps } from "../cli/deps.js";
import { loadConfig } from "../config/config.js";
import { CronService } from "../cron/service.js";
export type GatewayCronState = {
    cron: CronService;
    storePath: string;
    cronEnabled: boolean;
};
export declare function buildGatewayCronService(params: {
    cfg: ReturnType<typeof loadConfig>;
    deps: CliDeps;
    broadcast: (event: string, payload: unknown, opts?: {
        dropIfSlow?: boolean;
    }) => void;
}): GatewayCronState;
