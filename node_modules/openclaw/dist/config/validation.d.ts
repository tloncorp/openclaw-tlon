import type { OpenClawConfig, ConfigValidationIssue } from "./types.js";
export declare function validateConfigObject(raw: unknown): {
    ok: true;
    config: OpenClawConfig;
} | {
    ok: false;
    issues: ConfigValidationIssue[];
};
export declare function validateConfigObjectWithPlugins(raw: unknown): {
    ok: true;
    config: OpenClawConfig;
    warnings: ConfigValidationIssue[];
} | {
    ok: false;
    issues: ConfigValidationIssue[];
    warnings: ConfigValidationIssue[];
};
