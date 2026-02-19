/**
 * Formatting utilities for sandbox CLI output
 */
export declare function formatStatus(running: boolean): string;
export declare function formatSimpleStatus(running: boolean): string;
export declare function formatImageMatch(matches: boolean): string;
export declare function formatAge(ms: number): string;
/**
 * Type guard and counter utilities
 */
export type ContainerItem = {
    running: boolean;
    imageMatch: boolean;
    containerName: string;
    sessionKey: string;
    image: string;
    createdAtMs: number;
    lastUsedAtMs: number;
};
export declare function countRunning<T extends {
    running: boolean;
}>(items: T[]): number;
export declare function countMismatches<T extends {
    imageMatch: boolean;
}>(items: T[]): number;
