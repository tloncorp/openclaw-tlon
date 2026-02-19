export declare function hasHelpOrVersion(argv: string[]): boolean;
export declare function hasFlag(argv: string[], name: string): boolean;
export declare function getFlagValue(argv: string[], name: string): string | null | undefined;
export declare function getVerboseFlag(argv: string[], options?: {
    includeDebug?: boolean;
}): boolean;
export declare function getPositiveIntFlagValue(argv: string[], name: string): number | null | undefined;
export declare function getCommandPath(argv: string[], depth?: number): string[];
export declare function getPrimaryCommand(argv: string[]): string | null;
export declare function buildParseArgv(params: {
    programName?: string;
    rawArgs?: string[];
    fallbackArgv?: string[];
}): string[];
export declare function shouldMigrateStateFromPath(path: string[]): boolean;
export declare function shouldMigrateState(argv: string[]): boolean;
