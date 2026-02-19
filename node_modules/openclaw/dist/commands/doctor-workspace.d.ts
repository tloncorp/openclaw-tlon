export declare const MEMORY_SYSTEM_PROMPT: string;
export declare function shouldSuggestMemorySystem(workspaceDir: string): Promise<boolean>;
export type LegacyWorkspaceDetection = {
    activeWorkspace: string;
    legacyDirs: string[];
};
export declare function detectLegacyWorkspaceDirs(params: {
    workspaceDir: string;
}): LegacyWorkspaceDetection;
export declare function formatLegacyWorkspaceWarning(detection: LegacyWorkspaceDetection): string;
