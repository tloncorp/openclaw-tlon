import type { OpenClawConfig } from "../config/config.js";
type DoctorPrompterLike = {
    confirmSkipInNonInteractive: (params: {
        message: string;
        initialValue?: boolean;
    }) => Promise<boolean>;
};
export declare function noteStateIntegrity(cfg: OpenClawConfig, prompter: DoctorPrompterLike, configPath?: string): Promise<void>;
export declare function noteWorkspaceBackupTip(workspaceDir: string): void;
export {};
