export type CliProfileParseResult = {
    ok: true;
    profile: string | null;
    argv: string[];
} | {
    ok: false;
    error: string;
};
export declare function parseCliProfileArgs(argv: string[]): CliProfileParseResult;
export declare function applyCliProfileEnv(params: {
    profile: string;
    env?: Record<string, string | undefined>;
    homedir?: () => string;
}): void;
