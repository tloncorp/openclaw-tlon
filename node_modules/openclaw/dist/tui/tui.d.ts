import type { TuiOptions } from "./tui-types.js";
export { resolveFinalAssistantText } from "./tui-formatters.js";
export type { TuiOptions } from "./tui-types.js";
export declare function createEditorSubmitHandler(params: {
    editor: {
        setText: (value: string) => void;
        addToHistory: (value: string) => void;
    };
    handleCommand: (value: string) => Promise<void> | void;
    sendMessage: (value: string) => Promise<void> | void;
    handleBangLine: (value: string) => Promise<void> | void;
}): (text: string) => void;
export declare function runTui(opts: TuiOptions): Promise<void>;
