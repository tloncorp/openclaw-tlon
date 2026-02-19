export declare function startGatewayTailscaleExposure(params: {
    tailscaleMode: "off" | "serve" | "funnel";
    resetOnExit?: boolean;
    port: number;
    controlUiBasePath?: string;
    logTailscale: {
        info: (msg: string) => void;
        warn: (msg: string) => void;
    };
}): Promise<(() => Promise<void>) | null>;
