import type { OpenClawConfig } from "../config/config.js";
import type { MemoryIndexManager } from "./manager.js";
export type MemorySearchManagerResult = {
    manager: MemoryIndexManager | null;
    error?: string;
};
export declare function getMemorySearchManager(params: {
    cfg: OpenClawConfig;
    agentId: string;
}): Promise<MemorySearchManagerResult>;
