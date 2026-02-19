import type { Command } from "commander";
import type { ProgramContext } from "./context.js";
type CommandRegisterParams = {
    program: Command;
    ctx: ProgramContext;
    argv: string[];
};
type RouteSpec = {
    match: (path: string[]) => boolean;
    loadPlugins?: boolean;
    run: (argv: string[]) => Promise<boolean>;
};
export type CommandRegistration = {
    id: string;
    register: (params: CommandRegisterParams) => void;
    routes?: RouteSpec[];
};
export declare const commandRegistry: CommandRegistration[];
export declare function registerProgramCommands(program: Command, ctx: ProgramContext, argv?: string[]): void;
export declare function findRoutedCommand(path: string[]): RouteSpec | null;
export {};
