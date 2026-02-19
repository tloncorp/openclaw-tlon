import { type TaglineOptions } from "./tagline.js";
type BannerOptions = TaglineOptions & {
    argv?: string[];
    commit?: string | null;
    columns?: number;
    richTty?: boolean;
};
export declare function formatCliBannerLine(version: string, options?: BannerOptions): string;
export declare function formatCliBannerArt(options?: BannerOptions): string;
export declare function emitCliBanner(version: string, options?: BannerOptions): void;
export declare function hasEmittedCliBanner(): boolean;
export {};
