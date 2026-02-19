export declare function getShellConfig(): {
    shell: string;
    args: string[];
};
export declare function sanitizeBinaryOutput(text: string): string;
export declare function killProcessTree(pid: number): void;
