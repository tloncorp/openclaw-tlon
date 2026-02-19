export declare function getNodesTheme(): {
    rich: boolean;
    heading: (value: string) => string;
    ok: (value: string) => string;
    warn: (value: string) => string;
    muted: (value: string) => string;
    error: (value: string) => string;
};
export declare function runNodesCommand(label: string, action: () => Promise<void>): Promise<void>;
