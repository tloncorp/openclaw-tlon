export type GatewayBonjourAdvertiser = {
    stop: () => Promise<void>;
};
export type GatewayBonjourAdvertiseOpts = {
    instanceName?: string;
    gatewayPort: number;
    sshPort?: number;
    gatewayTlsEnabled?: boolean;
    gatewayTlsFingerprintSha256?: string;
    canvasPort?: number;
    tailnetDns?: string;
    cliPath?: string;
    /**
     * Minimal mode - omit sensitive fields (cliPath, sshPort) from TXT records.
     * Reduces information disclosure for better operational security.
     */
    minimal?: boolean;
};
export declare function startGatewayBonjourAdvertiser(opts: GatewayBonjourAdvertiseOpts): Promise<GatewayBonjourAdvertiser>;
