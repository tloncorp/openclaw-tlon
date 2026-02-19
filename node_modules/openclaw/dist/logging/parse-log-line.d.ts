export type ParsedLogLine = {
    time?: string;
    level?: string;
    subsystem?: string;
    module?: string;
    message: string;
    raw: string;
};
export declare function parseLogLine(raw: string): ParsedLogLine | null;
