import { Mock } from "vitest";
import type { AgentBinding } from "../config/types.agents.js";
import type { HooksConfig } from "../config/types.hooks.js";
import type { PluginRegistry } from "../plugins/registry.js";
export declare const setTestPluginRegistry: (registry: PluginRegistry) => void;
export declare const resetTestPluginRegistry: () => void;
export declare const setTestConfigRoot: (root: string) => void;
export declare const testTailnetIPv4: {
    value: string | undefined;
};
export declare const piSdkMock: {
    enabled: boolean;
    discoverCalls: number;
    models: Array<{
        id: string;
        name?: string;
        provider: string;
        contextWindow?: number;
        reasoning?: boolean;
    }>;
};
export declare const cronIsolatedRun: Mock<() => Promise<{
    status: string;
    summary: string;
}>>;
export declare const agentCommand: Mock<() => void>;
export declare const getReplyFromConfig: Mock<() => void>;
export declare const testState: {
    agentConfig: Record<string, unknown> | undefined;
    agentsConfig: Record<string, unknown> | undefined;
    bindingsConfig: AgentBinding[] | undefined;
    channelsConfig: Record<string, unknown> | undefined;
    sessionStorePath: string | undefined;
    sessionConfig: Record<string, unknown> | undefined;
    allowFrom: string[] | undefined;
    cronStorePath: string | undefined;
    cronEnabled: boolean | undefined;
    gatewayBind: "auto" | "lan" | "tailnet" | "loopback" | undefined;
    gatewayAuth: Record<string, unknown> | undefined;
    gatewayControlUi: Record<string, unknown> | undefined;
    hooksConfig: HooksConfig | undefined;
    canvasHostPort: number | undefined;
    legacyIssues: Array<{
        path: string;
        message: string;
    }>;
    legacyParsed: Record<string, unknown>;
    migrationConfig: Record<string, unknown> | null;
    migrationChanges: string[];
};
export declare const testIsNixMode: {
    value: boolean;
};
export declare const sessionStoreSaveDelayMs: {
    value: number;
};
export declare const embeddedRunMock: {
    activeIds: Set<string>;
    abortCalls: string[];
    waitCalls: string[];
    waitResults: Map<string, boolean>;
};
