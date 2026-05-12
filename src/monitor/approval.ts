import { randomUUID } from "node:crypto";
import {
  TLON_A2UI_ACTION_SEND_MESSAGE,
  type A2UIComponent,
} from "@tloncorp/api";
/**
 * Approval system for managing DM, channel mention, and group invite approvals.
 *
 * When an unknown ship tries to interact with the bot, the owner receives
 * a notification and can approve or deny the request via slash commands
 * (/allow, /reject, /ban).
 */

import type { PendingApproval } from "../settings.js";
import { makeA2UIBlob, type TlonA2UIBlob } from "../urbit/blob.js";

export type { PendingApproval };

export type ApprovalType = "dm" | "channel" | "group";
export const APPROVAL_REQUEST_NOTIFICATION_TEXT = "Approval request";

export type CreateApprovalParams = {
  type: ApprovalType;
  requestingShip: string;
  channelNest?: string;
  groupFlag?: string;
  groupTitle?: string;
  messagePreview?: string;
  originalMessage?: {
    messageId: string;
    messageText: string;
    messageContent: unknown;
    timestamp: number;
    parentId?: string;
    isThreadReply?: boolean;
    blob?: string;
  };
};

// ============================================================================
// Display Context — pass human-readable names without breaking purity
// ============================================================================

/** Display hints for human-readable formatting. Callers resolve these from caches/lookups. */
export type DisplayContext = {
  /** Map from channel nest (chat/~host/name) to human-readable channel display name */
  channelNames?: Map<string, string>;
  /** Map from group flag (~host/name) to human-readable group title */
  groupNames?: Map<string, string>;
};

function displayChannel(nest: string, ctx?: DisplayContext): string {
  const name = ctx?.channelNames?.get(nest);
  return name ? `${name} (${nest})` : nest;
}

function displayGroup(flag: string, ctx?: DisplayContext, titleOverride?: string): string {
  const name = titleOverride || ctx?.groupNames?.get(flag);
  return name ? `${name} (${flag})` : flag;
}

// ============================================================================
// Emoji Reaction Mapping
// ============================================================================

/** Map a reaction emoji to an approval action. Returns undefined for unrecognized emoji. */
export function emojiToApprovalAction(emoji: string): "approve" | "deny" | "block" | undefined {
  switch (emoji) {
    case "👍":
      return "approve";
    case "👎":
      return "deny";
    case "🛑":
      return "block";
    default:
      return undefined;
  }
}

// ============================================================================
// Notification Message ID Normalization
// ============================================================================

/**
 * Normalize a message ID for comparison between sendDm return values and SSE event IDs.
 * sendDm returns "~ship/170.141.184.XXX", SSE events use "170.141.184.XXX" (bare timestamp).
 * This strips the ship prefix and dots so both forms compare equal.
 */
export function normalizeNotificationId(id: string): string {
  // Strip ship prefix: "~zod/170.141..." → "170.141..."
  if (id.includes("/") && id.startsWith("~")) {
    id = id.slice(id.indexOf("/") + 1);
  }
  // Strip dots: "170.141.184..." → "170141184..."
  return id.replace(/\./g, "");
}

// ============================================================================
// Approval Expiration
// ============================================================================

/** Pending approvals expire after 48 hours. */
export const APPROVAL_TTL_MS = 48 * 60 * 60 * 1000;

/** Check if a pending approval has expired. */
export function isExpired(approval: PendingApproval): boolean {
  return Date.now() - approval.timestamp > APPROVAL_TTL_MS;
}

/** Filter out expired approvals from a list. */
export function pruneExpired(approvals: PendingApproval[]): PendingApproval[] {
  return approvals.filter((a) => !isExpired(a));
}

// ============================================================================
// Approval ID Generation
// ============================================================================

/**
 * Generate a short approval ID: type-prefix char + 4 hex chars.
 * e.g. "da1b2" for dm, "cc3d4" for channel, "g5f6e" for group.
 */
export function generateApprovalId(type: ApprovalType, existingIds: string[] = []): string {
  const prefix = type[0]; // 'd', 'c', or 'g'
  for (let attempt = 0; attempt < 10; attempt++) {
    const shortId = randomUUID().slice(0, 4);
    const id = `${prefix}${shortId}`;
    if (!existingIds.includes(id)) {
      return id;
    }
  }
  // Fallback: use 8 chars to avoid collision
  return `${prefix}${randomUUID().slice(0, 8)}`;
}

/**
 * Create a pending approval object.
 */
export function createPendingApproval(
  params: CreateApprovalParams,
  existingIds: string[] = [],
): PendingApproval {
  return {
    id: generateApprovalId(params.type, existingIds),
    type: params.type,
    requestingShip: params.requestingShip,
    channelNest: params.channelNest,
    groupFlag: params.groupFlag,
    groupTitle: params.groupTitle,
    messagePreview: params.messagePreview,
    originalMessage: params.originalMessage,
    timestamp: Date.now(),
  };
}

/**
 * Truncate text to a maximum length with ellipsis.
 */
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + "...";
}

// ============================================================================
// Approval Request A2UI
// ============================================================================

type ApprovalA2UIParams = {
  type: ApprovalType;
  requestId: string;
  requestingShip: string;
  messagePreview?: string;
  channelDisplay?: string;
  channelNest?: string;
  groupDisplay?: string;
  groupFlag?: string;
  groupTitle?: string;
};

function approvalTarget(params: ApprovalA2UIParams): string {
  if (params.type === "channel") {
    return params.channelDisplay ?? params.channelNest ?? "this channel";
  }
  if (params.type === "group") {
    return params.groupDisplay ?? params.groupTitle ?? params.groupFlag ?? "this group";
  }
  return "";
}

function approvalTitle(params: ApprovalA2UIParams): string {
  switch (params.type) {
    case "dm":
      return `DM request from ${params.requestingShip}`;
    case "channel":
      return `${params.requestingShip} mentioned the bot in ${approvalTarget(params)}`;
    case "group":
      return `Group invite from ${params.requestingShip}`;
  }
}

function approvalCopy(params: ApprovalA2UIParams): string | undefined {
  if (params.messagePreview) {
    return `Message: "${truncate(params.messagePreview, 100)}"`;
  }
  if (params.type === "group") {
    return approvalTarget(params);
  }
  return undefined;
}

function approvalAllowNote(params: ApprovalA2UIParams): string {
  switch (params.type) {
    case "dm":
      return "Allow lets the bot process and respond to DMs from this user.";
    case "channel":
      return "Allow lets the bot process and respond to this ship in this channel.";
    case "group":
      return "Allow joins this group so the bot can participate there.";
  }
}

function buildApprovalA2UIBlobFromParams(params: ApprovalA2UIParams): TlonA2UIBlob {
  const copy = approvalCopy(params);
  const bodyChildren = copy
    ? ["eyebrow", "title", "copy", "divider", "details", "actions"]
    : ["eyebrow", "title", "divider", "details", "actions"];
  const copyComponents: A2UIComponent[] = copy
    ? [
        {
          id: "copy",
          component: "Text",
          variant: "caption",
          text: copy,
        },
      ]
    : [];

  const components: A2UIComponent[] = [
    { id: "root", component: "Card", child: "body" },
    {
      id: "body",
      component: "Column",
      children: bodyChildren,
    },
    {
      id: "eyebrow",
      component: "Text",
      variant: "caption",
      text: APPROVAL_REQUEST_NOTIFICATION_TEXT,
    },
    {
      id: "title",
      component: "Text",
      variant: "h3",
      text: approvalTitle(params),
    },
    ...copyComponents,
    { id: "divider", component: "Divider" },
    {
      id: "details",
      component: "Column",
      children: ["allowNote", "rejectNote", "banNote"],
    },
    {
      id: "allowNote",
      component: "Text",
      variant: "caption",
      text: approvalAllowNote(params),
    },
    {
      id: "rejectNote",
      component: "Text",
      variant: "caption",
      text: "Reject declines this request. They can try again later.",
    },
    {
      id: "banNote",
      component: "Text",
      variant: "caption",
      text: "Ban blocks this ship from contacting the bot.",
    },
    {
      id: "actions",
      component: "Row",
      children: ["allow", "reject", "ban"],
    },
    {
      id: "allow",
      component: "Button",
      variant: "primary",
      child: "allowLabel",
      action: {
        event: {
          name: TLON_A2UI_ACTION_SEND_MESSAGE,
          context: { text: `/allow ${params.requestId}` },
        },
      },
    },
    { id: "allowLabel", component: "Text", text: "Allow" },
    {
      id: "reject",
      component: "Button",
      child: "rejectLabel",
      action: {
        event: {
          name: TLON_A2UI_ACTION_SEND_MESSAGE,
          context: { text: `/reject ${params.requestId}` },
        },
      },
    },
    { id: "rejectLabel", component: "Text", text: "Reject" },
    {
      id: "ban",
      component: "Button",
      variant: "borderless",
      child: "banLabel",
      action: {
        event: {
          name: TLON_A2UI_ACTION_SEND_MESSAGE,
          context: { text: `/ban ${params.requestId}` },
        },
      },
    },
    { id: "banLabel", component: "Text", text: "Ban" },
  ];

  return makeA2UIBlob(`approval-${params.requestId}`, "root", components);
}

function displayChannelForApproval(
  nest: string | undefined,
  ctx?: DisplayContext,
): string | undefined {
  if (!nest) {
    return undefined;
  }
  return displayChannel(nest, ctx);
}

function displayGroupForApproval(
  flag: string | undefined,
  titleOverride: string | undefined,
  ctx?: DisplayContext,
): string | undefined {
  if (!flag && !titleOverride) {
    return undefined;
  }
  if (!flag) {
    return titleOverride;
  }
  return displayGroup(flag, ctx, titleOverride);
}

export function buildApprovalA2UIBlob(
  approval: PendingApproval,
  ctx?: DisplayContext,
): TlonA2UIBlob {
  return buildApprovalA2UIBlobFromParams({
    type: approval.type,
    requestId: approval.id,
    requestingShip: approval.requestingShip,
    messagePreview: approval.messagePreview,
    channelNest: approval.channelNest,
    channelDisplay: displayChannelForApproval(approval.channelNest, ctx),
    groupFlag: approval.groupFlag,
    groupTitle: approval.groupTitle,
    groupDisplay: displayGroupForApproval(approval.groupFlag, approval.groupTitle, ctx),
  });
}

// ============================================================================
// Approval Lookup & Removal
// ============================================================================

/**
 * Find a pending approval by ID, or return the most recent if no ID specified.
 * Supports prefix matching for shortened IDs.
 * Skips expired approvals.
 */
export function findPendingApproval(
  pendingApprovals: PendingApproval[],
  id?: string,
): PendingApproval | undefined {
  const active = pruneExpired(pendingApprovals);
  if (id) {
    // Exact match first
    const exact = active.find((a) => a.id === id);
    if (exact) {
      return exact;
    }
    // Prefix match (for partial input or old-format IDs)
    const prefixMatches = active.filter((a) => a.id.startsWith(id));
    if (prefixMatches.length === 1) {
      return prefixMatches[0];
    }
    return undefined;
  }
  // Return most recent
  return active[active.length - 1];
}

/**
 * Check if there's already a pending approval for the same ship/channel/group combo.
 * Used to avoid sending duplicate notifications.
 */
export function hasDuplicatePending(
  pendingApprovals: PendingApproval[],
  type: ApprovalType,
  requestingShip: string,
  channelNest?: string,
  groupFlag?: string,
): boolean {
  return pendingApprovals.some((approval) => {
    if (approval.type !== type || approval.requestingShip !== requestingShip) {
      return false;
    }
    if (type === "channel" && approval.channelNest !== channelNest) {
      return false;
    }
    if (type === "group" && approval.groupFlag !== groupFlag) {
      return false;
    }
    return true;
  });
}

/**
 * Remove a pending approval from the list by ID.
 */
export function removePendingApproval(
  pendingApprovals: PendingApproval[],
  id: string,
): PendingApproval[] {
  return pendingApprovals.filter((a) => a.id !== id);
}

// ============================================================================
// Approval Confirmation Formatting
// ============================================================================

/**
 * Format a confirmation message after an approval action.
 */
export function formatApprovalConfirmation(
  approval: PendingApproval,
  action: "approve" | "deny" | "block",
  ctx?: DisplayContext,
): string {
  const ship = approval.requestingShip;

  if (action === "block") {
    return `Blocked ${ship}. They will no longer be able to contact the bot.`;
  }

  switch (approval.type) {
    case "dm":
      if (action === "approve") {
        return `Approved DM access for ${ship}. They can now message the bot.`;
      }
      return `Denied DM request from ${ship}.`;

    case "channel": {
      const channel = displayChannel(approval.channelNest ?? "", ctx);
      if (action === "approve") {
        return `Approved ${ship} for ${channel}. They can now interact in this channel.`;
      }
      return `Denied ${ship} for ${channel}.`;
    }

    case "group": {
      const group = displayGroup(approval.groupFlag ?? "", ctx, approval.groupTitle);
      if (action === "approve") {
        return `Approved group invite from ${ship} to ${group}. Joining group...`;
      }
      return `Denied group invite from ${ship} to ${group}.`;
    }
  }
}

// ============================================================================
// List Formatting
// ============================================================================

/**
 * Format the list of blocked ships for display to owner.
 */
export function formatBlockedList(ships: string[]): string {
  if (ships.length === 0) {
    return "No ships are currently blocked.";
  }
  const lines = ships.map((s) => `  ${s}`);
  return [
    `Blocked ships (${ships.length}):`,
    ...lines,
    "",
    "To unban: `/unban ~ship-name`",
  ].join("\n");
}

/**
 * Format the list of pending approvals for display to owner.
 */
export function formatPendingList(approvals: PendingApproval[], ctx?: DisplayContext): string {
  const active = pruneExpired(approvals);
  if (active.length === 0) {
    return "No pending approval requests.";
  }

  const entries = active.map((a) => {
    const ship = a.requestingShip;
    const preview = a.messagePreview ? `\n    "${truncate(a.messagePreview, 80)}"` : "";

    switch (a.type) {
      case "dm":
        return `  #${a.id} - DM from ${ship}${preview}`;
      case "channel":
        return `  #${a.id} - Mention in ${displayChannel(a.channelNest ?? "", ctx)} by ${ship}${preview}`;
      case "group":
        return `  #${a.id} - Group invite from ${ship} to ${displayGroup(a.groupFlag ?? "", ctx, a.groupTitle)}`;
    }
  });

  return [
    `Pending requests (${active.length}):`,
    "",
    ...entries,
    "",
    "Use /allow, /reject, or /ban with the ID.",
  ].join("\n");
}
