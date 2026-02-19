import type { CliDeps } from "../../cli/deps.js";
import type { createSubsystemLogger } from "../../logging/subsystem.js";
import type { HooksConfigResolved } from "../hooks.js";
type SubsystemLogger = ReturnType<typeof createSubsystemLogger>;
export declare function createGatewayHooksRequestHandler(params: {
    deps: CliDeps;
    getHooksConfig: () => HooksConfigResolved | null;
    bindHost: string;
    port: number;
    logHooks: SubsystemLogger;
}): import("../server-http.js").HooksRequestHandler;
export {};
