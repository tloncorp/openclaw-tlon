/**
 * Display utilities for sandbox CLI
 */
import type { SandboxBrowserInfo, SandboxContainerInfo } from "../agents/sandbox.js";
import type { RuntimeEnv } from "../runtime.js";
export declare function displayContainers(containers: SandboxContainerInfo[], runtime: RuntimeEnv): void;
export declare function displayBrowsers(browsers: SandboxBrowserInfo[], runtime: RuntimeEnv): void;
export declare function displaySummary(containers: SandboxContainerInfo[], browsers: SandboxBrowserInfo[], runtime: RuntimeEnv): void;
export declare function displayRecreatePreview(containers: SandboxContainerInfo[], browsers: SandboxBrowserInfo[], runtime: RuntimeEnv): void;
export declare function displayRecreateResult(result: {
    successCount: number;
    failCount: number;
}, runtime: RuntimeEnv): void;
