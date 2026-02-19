export declare const formatAge: (ms: number | null | undefined) => string;
export declare const formatDuration: (ms: number | null | undefined) => string;
export declare function formatGatewayAuthUsed(auth: {
    token?: string;
    password?: string;
} | null): "token" | "password" | "token+password" | "none";
export declare function redactSecrets(text: string): string;
