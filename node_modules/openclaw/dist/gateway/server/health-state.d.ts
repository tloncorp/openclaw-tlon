import type { Snapshot } from "../protocol/index.js";
import { type HealthSummary } from "../../commands/health.js";
export declare function buildGatewaySnapshot(): Snapshot;
export declare function getHealthCache(): HealthSummary | null;
export declare function getHealthVersion(): number;
export declare function incrementPresenceVersion(): number;
export declare function getPresenceVersion(): number;
export declare function setBroadcastHealthUpdate(fn: ((snap: HealthSummary) => void) | null): void;
export declare function refreshGatewayHealthSnapshot(opts?: {
    probe?: boolean;
}): Promise<HealthSummary>;
