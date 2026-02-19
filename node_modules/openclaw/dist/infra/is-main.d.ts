type IsMainModuleOptions = {
    currentFile: string;
    argv?: string[];
    env?: NodeJS.ProcessEnv;
    cwd?: string;
};
export declare function isMainModule({ currentFile, argv, env, cwd, }: IsMainModuleOptions): boolean;
export {};
