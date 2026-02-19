export type RelaySmokeTest = "qr";
export declare function parseRelaySmokeTest(args: string[], env: NodeJS.ProcessEnv): RelaySmokeTest | null;
export declare function runRelaySmokeTest(test: RelaySmokeTest): Promise<void>;
