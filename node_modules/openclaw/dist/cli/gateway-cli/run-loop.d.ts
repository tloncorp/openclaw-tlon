import type { startGatewayServer } from "../../gateway/server.js";
import type { defaultRuntime } from "../../runtime.js";
export declare function runGatewayLoop(params: {
    start: () => Promise<Awaited<ReturnType<typeof startGatewayServer>>>;
    runtime: typeof defaultRuntime;
}): Promise<void>;
