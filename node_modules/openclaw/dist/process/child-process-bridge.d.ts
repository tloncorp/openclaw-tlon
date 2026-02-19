import type { ChildProcess } from "node:child_process";
export type ChildProcessBridgeOptions = {
    signals?: NodeJS.Signals[];
    onSignal?: (signal: NodeJS.Signals) => void;
};
export declare function attachChildProcessBridge(child: ChildProcess, { signals, onSignal }?: ChildProcessBridgeOptions): {
    detach: () => void;
};
