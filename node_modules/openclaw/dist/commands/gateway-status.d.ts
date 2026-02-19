import type { RuntimeEnv } from "../runtime.js";
export declare function gatewayStatusCommand(opts: {
    url?: string;
    token?: string;
    password?: string;
    timeout?: unknown;
    json?: boolean;
    ssh?: string;
    sshIdentity?: string;
    sshAuto?: boolean;
}, runtime: RuntimeEnv): Promise<void>;
