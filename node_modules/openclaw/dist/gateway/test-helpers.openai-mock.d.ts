export declare function installOpenAiResponsesMock(params?: {
    baseUrl?: string;
}): {
    baseUrl: string;
    restore: () => void;
};
