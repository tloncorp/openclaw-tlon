import type { Command } from "commander";
export type MessageCliHelpers = {
    withMessageBase: (command: Command) => Command;
    withMessageTarget: (command: Command) => Command;
    withRequiredMessageTarget: (command: Command) => Command;
    runMessageAction: (action: string, opts: Record<string, unknown>) => Promise<void>;
};
export declare function createMessageCliHelpers(message: Command, messageChannelOptions: string): MessageCliHelpers;
