export declare function parsePort(raw: unknown): number | null;
export declare const toOptionString: (value: unknown) => string | undefined;
export declare function describeUnknownError(err: unknown): string;
export declare function extractGatewayMiskeys(parsed: unknown): {
    hasGatewayToken: boolean;
    hasRemoteToken: boolean;
};
export declare function renderGatewayServiceStopHints(env?: NodeJS.ProcessEnv): string[];
export declare function maybeExplainGatewayServiceStop(): Promise<void>;
