import type { GatewayBonjourBeacon } from "../../infra/bonjour-discovery.js";
export type GatewayDiscoverOpts = {
    timeout?: string;
    json?: boolean;
};
export declare function parseDiscoverTimeoutMs(raw: unknown, fallbackMs: number): number;
export declare function pickBeaconHost(beacon: GatewayBonjourBeacon): string | null;
export declare function pickGatewayPort(beacon: GatewayBonjourBeacon): number;
export declare function dedupeBeacons(beacons: GatewayBonjourBeacon[]): GatewayBonjourBeacon[];
export declare function renderBeaconLines(beacon: GatewayBonjourBeacon, rich: boolean): string[];
