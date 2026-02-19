import type { RuntimeEnv } from "../runtime.js";
import { type CliDeps } from "../cli/outbound-send-deps.js";
export declare function messageCommand(opts: Record<string, unknown>, deps: CliDeps, runtime: RuntimeEnv): Promise<void>;
