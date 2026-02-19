import { Writable } from "node:stream";
import type { GatewayService } from "../../daemon/service.js";
export type DaemonAction = "install" | "uninstall" | "start" | "stop" | "restart";
export type DaemonActionResponse = {
    ok: boolean;
    action: DaemonAction;
    result?: string;
    message?: string;
    error?: string;
    hints?: string[];
    warnings?: string[];
    service?: {
        label: string;
        loaded: boolean;
        loadedText: string;
        notLoadedText: string;
    };
};
export declare function emitDaemonActionJson(payload: DaemonActionResponse): void;
export declare function buildDaemonServiceSnapshot(service: GatewayService, loaded: boolean): {
    label: string;
    loaded: boolean;
    loadedText: string;
    notLoadedText: string;
};
export declare function createNullWriter(): Writable;
