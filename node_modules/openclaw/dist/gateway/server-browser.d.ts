export type BrowserControlServer = {
    stop: () => Promise<void>;
};
export declare function startBrowserControlServerIfEnabled(): Promise<BrowserControlServer | null>;
