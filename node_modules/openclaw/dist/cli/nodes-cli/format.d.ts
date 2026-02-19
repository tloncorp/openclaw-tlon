import type { NodeListNode, PairingList } from "./types.js";
export declare function formatAge(msAgo: number): string;
export declare function parsePairingList(value: unknown): PairingList;
export declare function parseNodeList(value: unknown): NodeListNode[];
export declare function formatPermissions(raw: unknown): string | null;
