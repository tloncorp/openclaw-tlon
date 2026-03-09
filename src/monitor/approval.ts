import { randomUUID } from "node:crypto";
/**
 * Approval system for managing DM, channel mention, and group invite approvals.
 *
 * When an unknown ship tries to interact with the bot, the owner receives
 * a notification and can approve or deny the request via slash commands
 * (/approve, /deny, /block).
 */

import type { PendingApproval } from "../settings.js";

export type { PendingApproval };

export type ApprovalType = "dm" | "channel" | "group";

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
  };
};

// ============================================================================
// Display Context — pass human-readable names without breaking purity
// ============================================================================

/** Display hints for human-readable formatting. Callers resolve these from caches/lookups. */
export type DisplayContext = {
  /** Map from ship name (~ship) to human-readable nickname */
  shipNames?: Map<string, string>;
  /** Map from channel nest (chat/~host/name) to human-readable channel display name */
  channelNames?: Map<string, string>;
  /** Map from group flag (~host/name) to human-readable group title */
  groupNames?: Map<string, string>;
};

function displayShip(ship: string, ctx?: DisplayContext): string {
  const name = ctx?.shipNames?.get(ship);
  return name ? `${ship} (${name})` : ship;
}

function displayChannel(nest: string, ctx?: DisplayContext): string {
  const name = ctx?.channelNames?.get(nest);
  return name ? `${name} (${nest})` : nest;
}

function displayGroup(flag: string, ctx?: DisplayContext, titleOverride?: string): string {
  const name = titleOverride || ctx?.groupNames?.get(flag);
  return name ? `${name} (${flag})` : flag;
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
// Approval Request Formatting
// ============================================================================

function actionHintsDm(id: string): string {
  return [
    `  /approve ${id} — allow this ship to DM`,
    `  /deny ${id} — decline (they can try again)`,
    `  /block ${id} — block this ship`,
  ].join("\n");
}

function actionHintsChannel(id: string): string {
  return [
    `  /approve ${id} — allow this ship in this channel`,
    `  /deny ${id} — decline (they can try again)`,
    `  /block ${id} — block this ship`,
  ].join("\n");
}

function actionHintsGroup(id: string): string {
  return [
    `  /approve ${id} — join this group`,
    `  /deny ${id} — decline the invite`,
    `  /block ${id} — block this ship`,
  ].join("\n");
}

/**
 * Format a notification message for the owner about a pending approval.
 */
export function formatApprovalRequest(approval: PendingApproval, ctx?: DisplayContext): string {
  const preview = approval.messagePreview
    ? `\n"${truncate(approval.messagePreview, 100)}"`
    : "";

  switch (approval.type) {
    case "dm":
      return [
        `DM request from ${displayShip(approval.requestingShip, ctx)}`,
        preview,
        "",
        actionHintsDm(approval.id),
      ].join("\n");

    case "channel":
      return [
        `${displayShip(approval.requestingShip, ctx)} mentioned the bot in ${displayChannel(approval.channelNest ?? "", ctx)}`,
        preview,
        "",
        actionHintsChannel(approval.id),
      ].join("\n");

    case "group":
      return [
        `Group invite from ${displayShip(approval.requestingShip, ctx)} to join ${displayGroup(approval.groupFlag ?? "", ctx, approval.groupTitle)}`,
        "",
        actionHintsGroup(approval.id),
      ].join("\n");
  }
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
  const ship = displayShip(approval.requestingShip, ctx);

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
export function formatBlockedList(ships: string[], ctx?: DisplayContext): string {
  if (ships.length === 0) {
    return "No ships are currently blocked.";
  }
  const lines = ships.map((s) => `  ${displayShip(s, ctx)}`);
  return [
    `Blocked ships (${ships.length}):`,
    ...lines,
    "",
    "To unblock: `/unblock ~ship-name`",
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
    const ship = displayShip(a.requestingShip, ctx);
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
    "Use /approve, /deny, or /block with the ID.",
  ].join("\n");
}
