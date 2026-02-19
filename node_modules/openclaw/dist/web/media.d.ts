import { type MediaKind } from "../media/constants.js";
import { optimizeImageToPng } from "../media/image-ops.js";
export type WebMediaResult = {
    buffer: Buffer;
    contentType?: string;
    kind: MediaKind;
    fileName?: string;
};
export declare function loadWebMedia(mediaUrl: string, maxBytes?: number): Promise<WebMediaResult>;
export declare function loadWebMediaRaw(mediaUrl: string, maxBytes?: number): Promise<WebMediaResult>;
export declare function optimizeImageToJpeg(buffer: Buffer, maxBytes: number, opts?: {
    contentType?: string;
    fileName?: string;
}): Promise<{
    buffer: Buffer;
    optimizedSize: number;
    resizeSide: number;
    quality: number;
}>;
export { optimizeImageToPng };
