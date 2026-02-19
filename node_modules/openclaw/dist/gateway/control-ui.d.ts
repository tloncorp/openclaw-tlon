import type { IncomingMessage, ServerResponse } from "node:http";
import type { OpenClawConfig } from "../config/config.js";
export type ControlUiRequestOptions = {
    basePath?: string;
    config?: OpenClawConfig;
    agentId?: string;
};
export type ControlUiAvatarResolution = {
    kind: "none";
    reason: string;
} | {
    kind: "local";
    filePath: string;
} | {
    kind: "remote";
    url: string;
} | {
    kind: "data";
    url: string;
};
export declare function handleControlUiAvatarRequest(req: IncomingMessage, res: ServerResponse, opts: {
    basePath?: string;
    resolveAvatar: (agentId: string) => ControlUiAvatarResolution;
}): boolean;
export declare function handleControlUiHttpRequest(req: IncomingMessage, res: ServerResponse, opts?: ControlUiRequestOptions): boolean;
