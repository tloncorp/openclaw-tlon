export declare function buildSystemdUnit({ description, programArguments, workingDirectory, environment, }: {
    description?: string;
    programArguments: string[];
    workingDirectory?: string;
    environment?: Record<string, string | undefined>;
}): string;
export declare function parseSystemdExecStart(value: string): string[];
export declare function parseSystemdEnvAssignment(raw: string): {
    key: string;
    value: string;
} | null;
