export type ProgramContext = {
    programVersion: string;
    channelOptions: string[];
    messageChannelOptions: string;
    agentChannelOptions: string;
};
export declare function createProgramContext(): ProgramContext;
