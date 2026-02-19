import { type LogLevel } from "./levels.js";
export type ConsoleStyle = "pretty" | "compact" | "json";
type ConsoleSettings = {
    level: LogLevel;
    style: ConsoleStyle;
};
export type ConsoleLoggerSettings = ConsoleSettings;
export declare function getConsoleSettings(): ConsoleLoggerSettings;
export declare function getResolvedConsoleSettings(): ConsoleLoggerSettings;
export declare function routeLogsToStderr(): void;
export declare function setConsoleSubsystemFilter(filters?: string[] | null): void;
export declare function setConsoleTimestampPrefix(enabled: boolean): void;
export declare function shouldLogSubsystemToConsole(subsystem: string): boolean;
/**
 * Route console.* calls through file logging while still emitting to stdout/stderr.
 * This keeps user-facing output unchanged but guarantees every console call is captured in log files.
 */
export declare function enableConsoleCapture(): void;
export {};
