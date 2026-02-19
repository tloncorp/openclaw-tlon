export type ExtraGatewayService = {
    platform: "darwin" | "linux" | "win32";
    label: string;
    detail: string;
    scope: "user" | "system";
    marker?: "openclaw" | "clawdbot" | "moltbot";
    legacy?: boolean;
};
export type FindExtraGatewayServicesOptions = {
    deep?: boolean;
};
export declare function renderGatewayServiceCleanupHints(env?: Record<string, string | undefined>): string[];
export declare function findExtraGatewayServices(env: Record<string, string | undefined>, opts?: FindExtraGatewayServicesOptions): Promise<ExtraGatewayService[]>;
