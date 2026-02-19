export declare function upsertSharedEnvVar(params: {
    key: string;
    value: string;
    env?: NodeJS.ProcessEnv;
}): {
    path: string;
    updated: boolean;
    created: boolean;
};
