export declare function startGatewayDiscovery(params: {
    machineDisplayName: string;
    port: number;
    gatewayTls?: {
        enabled: boolean;
        fingerprintSha256?: string;
    };
    canvasPort?: number;
    wideAreaDiscoveryEnabled: boolean;
    wideAreaDiscoveryDomain?: string | null;
    tailscaleMode: "off" | "serve" | "funnel";
    /** mDNS/Bonjour discovery mode (default: minimal). */
    mdnsMode?: "off" | "minimal" | "full";
    logDiscovery: {
        info: (msg: string) => void;
        warn: (msg: string) => void;
    };
}): Promise<{
    bonjourStop: (() => Promise<void>) | null;
}>;
