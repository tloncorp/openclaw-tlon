export declare function resolveSandboxPath(params: {
    filePath: string;
    cwd: string;
    root: string;
}): {
    resolved: string;
    relative: string;
};
export declare function assertSandboxPath(params: {
    filePath: string;
    cwd: string;
    root: string;
}): Promise<{
    resolved: string;
    relative: string;
}>;
