import type { ChannelChoice } from "../onboard-types.js";
import type { ChannelOnboardingAdapter } from "./types.js";
export declare function getChannelOnboardingAdapter(channel: ChannelChoice): ChannelOnboardingAdapter | undefined;
export declare function listChannelOnboardingAdapters(): ChannelOnboardingAdapter[];
export declare const getProviderOnboardingAdapter: typeof getChannelOnboardingAdapter;
export declare const listProviderOnboardingAdapters: typeof listChannelOnboardingAdapters;
