type DeliveryPayload = {
    text?: string;
    mediaUrl?: string;
    mediaUrls?: string[];
};
export declare function pickSummaryFromOutput(text: string | undefined): string | undefined;
export declare function pickSummaryFromPayloads(payloads: Array<{
    text?: string | undefined;
}>): string | undefined;
export declare function pickLastNonEmptyTextFromPayloads(payloads: Array<{
    text?: string | undefined;
}>): string | undefined;
/**
 * Check if all payloads are just heartbeat ack responses (HEARTBEAT_OK).
 * Returns true if delivery should be skipped because there's no real content.
 */
export declare function isHeartbeatOnlyResponse(payloads: DeliveryPayload[], ackMaxChars: number): boolean;
export declare function resolveHeartbeatAckMaxChars(agentCfg?: {
    heartbeat?: {
        ackMaxChars?: number;
    };
}): number;
export {};
