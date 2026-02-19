import type { WebClient as SlackWebClient } from "@slack/web-api";
import type { SlackFile } from "../types.js";
/**
 * Fetches a URL with Authorization header, handling cross-origin redirects.
 * Node.js fetch strips Authorization headers on cross-origin redirects for security.
 * Slack's file URLs redirect to CDN domains with pre-signed URLs that don't need the
 * Authorization header, so we handle the initial auth request manually.
 */
export declare function fetchWithSlackAuth(url: string, token: string): Promise<Response>;
export declare function resolveSlackMedia(params: {
    files?: SlackFile[];
    token: string;
    maxBytes: number;
}): Promise<{
    path: string;
    contentType?: string;
    placeholder: string;
} | null>;
export type SlackThreadStarter = {
    text: string;
    userId?: string;
    ts?: string;
    files?: SlackFile[];
};
export declare function resolveSlackThreadStarter(params: {
    channelId: string;
    threadTs: string;
    client: SlackWebClient;
}): Promise<SlackThreadStarter | null>;
