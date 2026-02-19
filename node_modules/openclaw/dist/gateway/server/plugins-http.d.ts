import type { IncomingMessage, ServerResponse } from "node:http";
import type { createSubsystemLogger } from "../../logging/subsystem.js";
import type { PluginRegistry } from "../../plugins/registry.js";
type SubsystemLogger = ReturnType<typeof createSubsystemLogger>;
export type PluginHttpRequestHandler = (req: IncomingMessage, res: ServerResponse) => Promise<boolean>;
export declare function createGatewayPluginRequestHandler(params: {
    registry: PluginRegistry;
    log: SubsystemLogger;
}): PluginHttpRequestHandler;
export {};
