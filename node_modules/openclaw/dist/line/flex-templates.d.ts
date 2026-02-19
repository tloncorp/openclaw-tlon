import type { messagingApi } from "@line/bot-sdk";
type FlexContainer = messagingApi.FlexContainer;
type FlexBubble = messagingApi.FlexBubble;
type FlexCarousel = messagingApi.FlexCarousel;
type FlexBox = messagingApi.FlexBox;
type FlexText = messagingApi.FlexText;
type FlexImage = messagingApi.FlexImage;
type FlexButton = messagingApi.FlexButton;
type FlexComponent = messagingApi.FlexComponent;
type Action = messagingApi.Action;
export interface ListItem {
    title: string;
    subtitle?: string;
    action?: Action;
}
export interface CardAction {
    label: string;
    action: Action;
}
/**
 * Create an info card with title, body, and optional footer
 *
 * Editorial design: Clean hierarchy with accent bar, generous spacing,
 * and subtle background zones for visual separation.
 */
export declare function createInfoCard(title: string, body: string, footer?: string): FlexBubble;
/**
 * Create a list card with title and multiple items
 *
 * Editorial design: Numbered/bulleted list with clear visual hierarchy,
 * accent dots for each item, and generous spacing.
 */
export declare function createListCard(title: string, items: ListItem[]): FlexBubble;
/**
 * Create an image card with image, title, and optional body text
 */
export declare function createImageCard(imageUrl: string, title: string, body?: string, options?: {
    aspectRatio?: "1:1" | "1.51:1" | "1.91:1" | "4:3" | "16:9" | "20:13" | "2:1" | "3:1";
    aspectMode?: "cover" | "fit";
    action?: Action;
}): FlexBubble;
/**
 * Create an action card with title, body, and action buttons
 */
export declare function createActionCard(title: string, body: string, actions: CardAction[], options?: {
    imageUrl?: string;
    aspectRatio?: "1:1" | "1.51:1" | "1.91:1" | "4:3" | "16:9" | "20:13" | "2:1" | "3:1";
}): FlexBubble;
/**
 * Create a carousel container from multiple bubbles
 * LINE allows max 12 bubbles in a carousel
 */
export declare function createCarousel(bubbles: FlexBubble[]): FlexCarousel;
/**
 * Create a notification bubble (for alerts, status updates)
 *
 * Editorial design: Bold status indicator with accent color,
 * clear typography, optional icon for context.
 */
export declare function createNotificationBubble(text: string, options?: {
    icon?: string;
    type?: "info" | "success" | "warning" | "error";
    title?: string;
}): FlexBubble;
/**
 * Create a receipt/summary card (for orders, transactions, data tables)
 *
 * Editorial design: Clean table layout with alternating row backgrounds,
 * prominent total section, and clear visual hierarchy.
 */
export declare function createReceiptCard(params: {
    title: string;
    subtitle?: string;
    items: Array<{
        name: string;
        value: string;
        highlight?: boolean;
    }>;
    total?: {
        label: string;
        value: string;
    };
    footer?: string;
}): FlexBubble;
/**
 * Create a calendar event card (for meetings, appointments, reminders)
 *
 * Editorial design: Date as hero, strong typographic hierarchy,
 * color-blocked zones, full text wrapping for readability.
 */
export declare function createEventCard(params: {
    title: string;
    date: string;
    time?: string;
    location?: string;
    description?: string;
    calendar?: string;
    isAllDay?: boolean;
    action?: Action;
}): FlexBubble;
/**
 * Create a calendar agenda card showing multiple events
 *
 * Editorial timeline design: Time-focused left column with event details
 * on the right. Visual accent bars indicate event priority/recency.
 */
export declare function createAgendaCard(params: {
    title: string;
    subtitle?: string;
    events: Array<{
        title: string;
        time?: string;
        location?: string;
        calendar?: string;
        isNow?: boolean;
    }>;
    footer?: string;
}): FlexBubble;
/**
 * Create a media player card for Sonos, Spotify, Apple Music, etc.
 *
 * Editorial design: Album art hero with gradient overlay for text,
 * prominent now-playing indicator, refined playback controls.
 */
export declare function createMediaPlayerCard(params: {
    title: string;
    subtitle?: string;
    source?: string;
    imageUrl?: string;
    isPlaying?: boolean;
    progress?: string;
    controls?: {
        previous?: {
            data: string;
        };
        play?: {
            data: string;
        };
        pause?: {
            data: string;
        };
        next?: {
            data: string;
        };
    };
    extraActions?: Array<{
        label: string;
        data: string;
    }>;
}): FlexBubble;
/**
 * Create an Apple TV remote card with a D-pad and control rows.
 */
export declare function createAppleTvRemoteCard(params: {
    deviceName: string;
    status?: string;
    actionData: {
        up: string;
        down: string;
        left: string;
        right: string;
        select: string;
        menu: string;
        home: string;
        play: string;
        pause: string;
        volumeUp: string;
        volumeDown: string;
        mute: string;
    };
}): FlexBubble;
/**
 * Create a device control card for Apple TV, smart home devices, etc.
 *
 * Editorial design: Device-focused header with status indicator,
 * clean control grid with clear visual hierarchy.
 */
export declare function createDeviceControlCard(params: {
    deviceName: string;
    deviceType?: string;
    status?: string;
    isOnline?: boolean;
    imageUrl?: string;
    controls: Array<{
        label: string;
        icon?: string;
        data: string;
        style?: "primary" | "secondary";
    }>;
}): FlexBubble;
/**
 * Wrap a FlexContainer in a FlexMessage
 */
export declare function toFlexMessage(altText: string, contents: FlexContainer): messagingApi.FlexMessage;
export type { FlexContainer, FlexBubble, FlexCarousel, FlexBox, FlexText, FlexImage, FlexButton, FlexComponent, Action, };
