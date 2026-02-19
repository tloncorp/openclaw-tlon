import type { Server } from "node:http";
import { type Express } from "express";
import { type RuntimeEnv } from "../runtime.js";
export declare function attachMediaRoutes(app: Express, ttlMs?: number, _runtime?: RuntimeEnv): void;
export declare function startMediaServer(port: number, ttlMs?: number, runtime?: RuntimeEnv): Promise<Server>;
