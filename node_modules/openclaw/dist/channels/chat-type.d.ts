export type NormalizedChatType = "direct" | "group" | "channel";
export declare function normalizeChatType(raw?: string): NormalizedChatType | undefined;
