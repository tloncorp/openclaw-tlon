import type { ResolvedMemorySearchConfig } from "../agents/memory-search.js";
export declare function computeMemoryManagerCacheKey(params: {
    agentId: string;
    workspaceDir: string;
    settings: ResolvedMemorySearchConfig;
}): string;
