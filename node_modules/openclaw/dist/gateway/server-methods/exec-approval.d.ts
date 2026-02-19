import type { ExecApprovalForwarder } from "../../infra/exec-approval-forwarder.js";
import type { ExecApprovalManager } from "../exec-approval-manager.js";
import type { GatewayRequestHandlers } from "./types.js";
export declare function createExecApprovalHandlers(manager: ExecApprovalManager, opts?: {
    forwarder?: ExecApprovalForwarder;
}): GatewayRequestHandlers;
