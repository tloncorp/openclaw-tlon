import { Command } from "commander";
export declare function registerCompletionCli(program: Command): void;
export declare function installCompletion(shell: string, yes: boolean, binName?: string): Promise<void>;
