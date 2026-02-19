import { type BrowserServerState } from "./server-context.js";
export declare function startBrowserControlServerFromConfig(): Promise<BrowserServerState | null>;
export declare function stopBrowserControlServer(): Promise<void>;
