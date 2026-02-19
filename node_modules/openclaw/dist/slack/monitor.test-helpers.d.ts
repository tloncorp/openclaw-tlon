type SlackHandler = (args: unknown) => Promise<void>;
export declare const getSlackTestState: () => void;
export declare const getSlackHandlers: () => Map<string, SlackHandler> | undefined;
export declare const getSlackClient: () => Record<string, unknown> | undefined;
export declare const flush: () => Promise<unknown>;
export declare function waitForSlackEvent(name: string): Promise<void>;
export declare const defaultSlackTestConfig: () => {
    messages: {
        responsePrefix: string;
        ackReaction: string;
        ackReactionScope: string;
    };
    channels: {
        slack: {
            dm: {
                enabled: boolean;
                policy: string;
                allowFrom: string[];
            };
            groupPolicy: string;
        };
    };
};
export declare function resetSlackTestState(config?: Record<string, unknown>): void;
export {};
