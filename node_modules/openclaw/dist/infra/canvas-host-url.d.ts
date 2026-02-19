type HostSource = string | null | undefined;
type CanvasHostUrlParams = {
    canvasPort?: number;
    hostOverride?: HostSource;
    requestHost?: HostSource;
    forwardedProto?: HostSource | HostSource[];
    localAddress?: HostSource;
    scheme?: "http" | "https";
};
export declare function resolveCanvasHostUrl(params: CanvasHostUrlParams): string | undefined;
export {};
