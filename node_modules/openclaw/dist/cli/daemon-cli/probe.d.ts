export declare function probeGatewayStatus(opts: {
    url: string;
    token?: string;
    password?: string;
    timeoutMs: number;
    json?: boolean;
    configPath?: string;
}): Promise<{
    readonly ok: true;
    error?: undefined;
} | {
    readonly ok: false;
    readonly error: string;
}>;
