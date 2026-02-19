import { ClientSideConnection } from "@agentclientprotocol/sdk";
import { type ChildProcess } from "node:child_process";
export type AcpClientOptions = {
    cwd?: string;
    serverCommand?: string;
    serverArgs?: string[];
    serverVerbose?: boolean;
    verbose?: boolean;
};
export type AcpClientHandle = {
    client: ClientSideConnection;
    agent: ChildProcess;
    sessionId: string;
};
export declare function createAcpClient(opts?: AcpClientOptions): Promise<AcpClientHandle>;
export declare function runAcpClientInteractive(opts?: AcpClientOptions): Promise<void>;
