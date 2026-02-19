export type A2UIVersion = "v0.8" | "v0.9";
export declare function buildA2UITextJsonl(text: string): string;
export declare function validateA2UIJsonl(jsonl: string): {
    version: A2UIVersion;
    messageCount: number;
};
