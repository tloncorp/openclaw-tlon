import type { Command } from "commander";
type SubCliRegistrar = (program: Command) => Promise<void> | void;
type SubCliEntry = {
    name: string;
    description: string;
    register: SubCliRegistrar;
};
export declare function getSubCliEntries(): SubCliEntry[];
export declare function registerSubCliByName(program: Command, name: string): Promise<boolean>;
export declare function registerSubCliCommands(program: Command, argv?: string[]): void;
export {};
