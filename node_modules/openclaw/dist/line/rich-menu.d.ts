import { messagingApi } from "@line/bot-sdk";
type RichMenuRequest = messagingApi.RichMenuRequest;
type RichMenuResponse = messagingApi.RichMenuResponse;
type RichMenuArea = messagingApi.RichMenuArea;
type Action = messagingApi.Action;
export interface RichMenuSize {
    width: 2500;
    height: 1686 | 843;
}
export interface RichMenuAreaRequest {
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    action: Action;
}
export interface CreateRichMenuParams {
    size: RichMenuSize;
    selected?: boolean;
    name: string;
    chatBarText: string;
    areas: RichMenuAreaRequest[];
}
interface RichMenuOpts {
    channelAccessToken?: string;
    accountId?: string;
    verbose?: boolean;
}
/**
 * Create a new rich menu
 * @returns The rich menu ID
 */
export declare function createRichMenu(menu: CreateRichMenuParams, opts?: RichMenuOpts): Promise<string>;
/**
 * Upload an image for a rich menu
 * Image requirements:
 * - Format: JPEG or PNG
 * - Size: Must match the rich menu size (2500x1686 or 2500x843)
 * - Max file size: 1MB
 */
export declare function uploadRichMenuImage(richMenuId: string, imagePath: string, opts?: RichMenuOpts): Promise<void>;
/**
 * Set the default rich menu for all users
 */
export declare function setDefaultRichMenu(richMenuId: string, opts?: RichMenuOpts): Promise<void>;
/**
 * Cancel the default rich menu
 */
export declare function cancelDefaultRichMenu(opts?: RichMenuOpts): Promise<void>;
/**
 * Get the default rich menu ID
 */
export declare function getDefaultRichMenuId(opts?: RichMenuOpts): Promise<string | null>;
/**
 * Link a rich menu to a specific user
 */
export declare function linkRichMenuToUser(userId: string, richMenuId: string, opts?: RichMenuOpts): Promise<void>;
/**
 * Link a rich menu to multiple users (up to 500)
 */
export declare function linkRichMenuToUsers(userIds: string[], richMenuId: string, opts?: RichMenuOpts): Promise<void>;
/**
 * Unlink a rich menu from a specific user
 */
export declare function unlinkRichMenuFromUser(userId: string, opts?: RichMenuOpts): Promise<void>;
/**
 * Unlink rich menus from multiple users (up to 500)
 */
export declare function unlinkRichMenuFromUsers(userIds: string[], opts?: RichMenuOpts): Promise<void>;
/**
 * Get the rich menu linked to a specific user
 */
export declare function getRichMenuIdOfUser(userId: string, opts?: RichMenuOpts): Promise<string | null>;
/**
 * Get a list of all rich menus
 */
export declare function getRichMenuList(opts?: RichMenuOpts): Promise<RichMenuResponse[]>;
/**
 * Get a specific rich menu by ID
 */
export declare function getRichMenu(richMenuId: string, opts?: RichMenuOpts): Promise<RichMenuResponse | null>;
/**
 * Delete a rich menu
 */
export declare function deleteRichMenu(richMenuId: string, opts?: RichMenuOpts): Promise<void>;
/**
 * Create a rich menu alias
 */
export declare function createRichMenuAlias(richMenuId: string, aliasId: string, opts?: RichMenuOpts): Promise<void>;
/**
 * Delete a rich menu alias
 */
export declare function deleteRichMenuAlias(aliasId: string, opts?: RichMenuOpts): Promise<void>;
/**
 * Create a standard 2x3 grid layout for rich menu areas
 * Returns 6 areas in a 2-row, 3-column layout
 */
export declare function createGridLayout(height: 1686 | 843, actions: [Action, Action, Action, Action, Action, Action]): RichMenuAreaRequest[];
/**
 * Create a message action (sends text when tapped)
 */
export declare function messageAction(label: string, text?: string): Action;
/**
 * Create a URI action (opens a URL when tapped)
 */
export declare function uriAction(label: string, uri: string): Action;
/**
 * Create a postback action (sends data to webhook when tapped)
 */
export declare function postbackAction(label: string, data: string, displayText?: string): Action;
/**
 * Create a datetime picker action
 */
export declare function datetimePickerAction(label: string, data: string, mode: "date" | "time" | "datetime", options?: {
    initial?: string;
    max?: string;
    min?: string;
}): Action;
/**
 * Create a default help/status/settings menu
 * This is a convenience function to quickly set up a standard menu
 */
export declare function createDefaultMenuConfig(): CreateRichMenuParams;
export type { RichMenuRequest, RichMenuResponse, RichMenuArea, Action };
