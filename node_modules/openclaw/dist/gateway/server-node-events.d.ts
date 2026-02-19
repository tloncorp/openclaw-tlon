import type { NodeEvent, NodeEventContext } from "./server-node-events-types.js";
export declare const handleNodeEvent: (ctx: NodeEventContext, nodeId: string, evt: NodeEvent) => Promise<void>;
