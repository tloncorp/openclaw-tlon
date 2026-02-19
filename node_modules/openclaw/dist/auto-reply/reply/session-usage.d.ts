import { type NormalizedUsage } from "../../agents/usage.js";
import { type SessionSystemPromptReport } from "../../config/sessions.js";
export declare function persistSessionUsageUpdate(params: {
    storePath?: string;
    sessionKey?: string;
    usage?: NormalizedUsage;
    modelUsed?: string;
    providerUsed?: string;
    contextTokensUsed?: number;
    systemPromptReport?: SessionSystemPromptReport;
    cliSessionId?: string;
    logLabel?: string;
}): Promise<void>;
