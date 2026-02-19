export type TypingCallbacks = {
    onReplyStart: () => Promise<void>;
    onIdle?: () => void;
};
export declare function createTypingCallbacks(params: {
    start: () => Promise<void>;
    stop?: () => Promise<void>;
    onStartError: (err: unknown) => void;
    onStopError?: (err: unknown) => void;
}): TypingCallbacks;
