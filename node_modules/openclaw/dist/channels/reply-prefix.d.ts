import type { GetReplyOptions } from "../auto-reply/types.js";
import type { OpenClawConfig } from "../config/config.js";
import { type ResponsePrefixContext } from "../auto-reply/reply/response-prefix-template.js";
type ModelSelectionContext = Parameters<NonNullable<GetReplyOptions["onModelSelected"]>>[0];
export type ReplyPrefixContextBundle = {
    prefixContext: ResponsePrefixContext;
    responsePrefix?: string;
    responsePrefixContextProvider: () => ResponsePrefixContext;
    onModelSelected: (ctx: ModelSelectionContext) => void;
};
export declare function createReplyPrefixContext(params: {
    cfg: OpenClawConfig;
    agentId: string;
}): ReplyPrefixContextBundle;
export {};
