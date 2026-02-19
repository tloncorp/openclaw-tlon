export declare function isLoopbackAddress(ip: string | undefined): boolean;
export declare function parseForwardedForClientIp(forwardedFor?: string): string | undefined;
export declare function isTrustedProxyAddress(ip: string | undefined, trustedProxies?: string[]): boolean;
export declare function resolveGatewayClientIp(params: {
    remoteAddr?: string;
    forwardedFor?: string;
    realIp?: string;
    trustedProxies?: string[];
}): string | undefined;
export declare function isLocalGatewayAddress(ip: string | undefined): boolean;
/**
 * Resolves gateway bind host with fallback strategy.
 *
 * Modes:
 * - loopback: 127.0.0.1 (rarely fails, but handled gracefully)
 * - lan: always 0.0.0.0 (no fallback)
 * - tailnet: Tailnet IPv4 if available, else loopback
 * - auto: Loopback if available, else 0.0.0.0
 * - custom: User-specified IP, fallback to 0.0.0.0 if unavailable
 *
 * @returns The bind address to use (never null)
 */
export declare function resolveGatewayBindHost(bind: import("../config/config.js").GatewayBindMode | undefined, customHost?: string): Promise<string>;
/**
 * Test if we can bind to a specific host address.
 * Creates a temporary server, attempts to bind, then closes it.
 *
 * @param host - The host address to test
 * @returns True if we can successfully bind to this address
 */
export declare function canBindToHost(host: string): Promise<boolean>;
export declare function resolveGatewayListenHosts(bindHost: string, opts?: {
    canBindToHost?: (host: string) => Promise<boolean>;
}): Promise<string[]>;
export declare function isLoopbackHost(host: string): boolean;
