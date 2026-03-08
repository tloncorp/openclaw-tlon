import { randomUUID } from "node:crypto";
/**
 * Approval system for managing DM, channel mention, and group invite approvals.
 *
 * When an unknown ship tries to interact with the bot, the owner receives
 * a notification and can approve or deny the request.
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

// ============================================================================
// Command Aliases
// ============================================================================

/** Map of natural-language aliases to canonical approval actions. */
export const APPROVAL_ALIASES: Record<string, "approve" | "deny" | "block"> = {
  approve: "approve",
  yes: "approve",
  y: "approve",
  ok: "approve",
  accept: "approve",
  allow: "approve",
  deny: "deny",
  no: "deny",
  n: "deny",
  reject: "deny",
  decline: "deny",
  block: "block",
  ban: "block",
};

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

const ACTION_HINTS_DM = [
  "  yes - allow this ship to DM the bot",
  "  no - decline (they can try again)",
  "  block - permanently block this ship",
].join("\n");

const ACTION_HINTS_CHANNEL = [
  "  yes - allow this ship in this channel",
  "  no - decline (they can try again)",
  "  block - permanently block this ship",
].join("\n");

const ACTION_HINTS_GROUP = [
  "  yes - join this group",
  "  no - decline the invite",
  "  block - permanently block this ship",
].join("\n");

/**
 * Format a notification message for the owner about a pending approval.
 */
export function formatApprovalRequest(approval: PendingApproval, ctx?: DisplayContext): string {
  const preview = approval.messagePreview
    ? `\n"${truncate(approval.messagePreview, 100)}"`
    : "";
  const idTag = `(#${approval.id})`;

  switch (approval.type) {
    case "dm":
      return [
        `DM request from ${displayShip(approval.requestingShip, ctx)}`,
        preview,
        "",
        ACTION_HINTS_DM,
        "",
        idTag,
      ].join("\n");

    case "channel":
      return [
        `${displayShip(approval.requestingShip, ctx)} mentioned the bot in ${displayChannel(approval.channelNest ?? "", ctx)}`,
        preview,
        "",
        ACTION_HINTS_CHANNEL,
        "",
        idTag,
      ].join("\n");

    case "group":
      return [
        `Group invite from ${displayShip(approval.requestingShip, ctx)} to join ${displayGroup(approval.groupFlag ?? "", ctx, approval.groupTitle)}`,
        "",
        ACTION_HINTS_GROUP,
        "",
        idTag,
      ].join("\n");
  }
}

// ============================================================================
// Approval Response Parsing
// ============================================================================

export type ApprovalResponse = {
  action: "approve" | "deny" | "block";
  id?: string;
};

/**
 * Parse an owner's response to an approval request.
 * Supports natural-language aliases (yes/no/ok/accept/deny/reject/block/ban etc.)
 * and optional #ID targeting.
 */
export function parseApprovalResponse(text: string): ApprovalResponse | null {
  const trimmed = text.trim().toLowerCase();
  if (!trimmed) {
    return null;
  }

  // Split into first word and remainder
  const spaceIndex = trimmed.indexOf(" ");
  const firstWord = spaceIndex === -1 ? trimmed : trimmed.substring(0, spaceIndex);
  const remainder = spaceIndex === -1 ? undefined : trimmed.substring(spaceIndex + 1).trim();

  const action = APPROVAL_ALIASES[firstWord];
  if (!action) {
    return null;
  }

  // Strip leading '#' from ID if present; discard multi-word remainder
  // (e.g. "yes I agree" should not treat "i agree" as an ID)
  const rawId = remainder ? remainder.replace(/^#/, "").trim() : undefined;
  const id = rawId && !rawId.includes(" ") ? rawId : undefined;

  return { action, id: id || undefined };
}

/**
 * Check if a message text looks like an approval response.
 * Uses exact first-word matching against aliases (not prefix matching).
 */
export function isApprovalResponse(text: string): boolean {
  const trimmed = text.trim().toLowerCase();
  if (!trimmed) {
    return false;
  }
  const spaceIndex = trimmed.indexOf(" ");
  const firstWord = spaceIndex === -1 ? trimmed : trimmed.substring(0, spaceIndex);
  return firstWord in APPROVAL_ALIASES;
}

/**
 * Find a pending approval by ID, or return the most recent if no ID specified.
 * Supports prefix matching for shortened IDs.
 */
export function findPendingApproval(
  pendingApprovals: PendingApproval[],
  id?: string,
): PendingApproval | undefined {
  if (id) {
    // Exact match first
    const exact = pendingApprovals.find((a) => a.id === id);
    if (exact) {
      return exact;
    }
    // Prefix match (for partial input or old-format IDs)
    const prefixMatches = pendingApprovals.filter((a) => a.id.startsWith(id));
    if (prefixMatches.length === 1) {
      return prefixMatches[0];
    }
    return undefined;
  }
  // Return most recent
  return pendingApprovals[pendingApprovals.length - 1];
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
// Admin Commands
// ============================================================================

export type AdminCommand =
  | { type: "unblock"; ship: string }
  | { type: "blocked" }
  | { type: "pending" }
  | { type: "help" }
  | { type: "version" };

/**
 * Parse an admin command from owner message.
 * Supports:
 *   - "unblock ~ship" - unblock a specific ship
 *   - "blocked" - list all blocked ships
 *   - "pending" - list all pending approvals
 *   - "help" / "commands" / "?" - show help
 */
export function parseAdminCommand(text: string): AdminCommand | null {
  const trimmed = text.trim().toLowerCase();

  if (trimmed === "help" || trimmed === "commands" || trimmed === "?") {
    return { type: "help" };
  }

  if (trimmed === "version" || trimmed === "v") {
    return { type: "version" };
  }

  if (trimmed === "blocked") {
    return { type: "blocked" };
  }

  if (trimmed === "pending") {
    return { type: "pending" };
  }

  // "unblock ~ship" - unblock a specific ship
  const unblockMatch = trimmed.match(/^unblock\s+(~[\w-]+)$/);
  if (unblockMatch) {
    return { type: "unblock", ship: unblockMatch[1] };
  }

  return null;
}

/**
 * Check if a message text looks like an admin command.
 */
export function isAdminCommand(text: string): boolean {
  return parseAdminCommand(text) !== null;
}

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
    'To unblock: "unblock ~ship-name"',
  ].join("\n");
}

/**
 * Format the list of pending approvals for display to owner.
 */
export function formatPendingList(approvals: PendingApproval[], ctx?: DisplayContext): string {
  if (approvals.length === 0) {
    return "No pending approval requests.";
  }

  const entries = approvals.map((a) => {
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
    `Pending requests (${approvals.length}):`,
    "",
    ...entries,
    "",
    "Reply yes/no/block, optionally with a # ID.",
  ].join("\n");
}

/**
 * Format the help text for owner commands.
 */
export function formatHelpText(): string {
  return [
    "Available commands:",
    "",
    "Approval responses:",
    "  yes / approve / ok / accept / allow - approve a request",
    "  no / deny / reject / decline - deny a request",
    "  block / ban - permanently block the ship",
    "",
    "  Add a # ID to target a specific request:",
    "  e.g., yes #da1b2 or block #cc3d4",
    "",
    "Admin commands:",
    "  pending - show pending approval requests",
    "  blocked - show blocked ships",
    "  unblock ~ship-name - unblock a ship",
    "  version - show plugin version",
    "  help - show this message",
  ].join("\n");
}
