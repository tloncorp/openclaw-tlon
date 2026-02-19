export type FormatDurationSecondsOptions = {
    decimals?: number;
    unit?: "s" | "seconds";
};
export declare function formatDurationSeconds(ms: number, options?: FormatDurationSecondsOptions): string;
export type FormatDurationMsOptions = {
    decimals?: number;
    unit?: "s" | "seconds";
};
export declare function formatDurationMs(ms: number, options?: FormatDurationMsOptions): string;
