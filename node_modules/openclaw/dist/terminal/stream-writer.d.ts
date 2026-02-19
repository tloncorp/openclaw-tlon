export type SafeStreamWriterOptions = {
    beforeWrite?: () => void;
    onBrokenPipe?: (err: NodeJS.ErrnoException, stream: NodeJS.WriteStream) => void;
};
export type SafeStreamWriter = {
    write: (stream: NodeJS.WriteStream, text: string) => boolean;
    writeLine: (stream: NodeJS.WriteStream, text: string) => boolean;
    reset: () => void;
    isClosed: () => boolean;
};
export declare function createSafeStreamWriter(options?: SafeStreamWriterOptions): SafeStreamWriter;
