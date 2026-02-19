import type { OpenClawConfig } from "../../config/config.js";
import type { ReplyPayload } from "../types.js";
import type { CommandHandler } from "./commands-types.js";
export declare function resolveModelsCommandReply(params: {
    cfg: OpenClawConfig;
    commandBodyNormalized: string;
}): Promise<ReplyPayload | null>;
export declare const handleModelsCommand: CommandHandler;
