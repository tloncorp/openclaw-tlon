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

/**
 * Generate a unique approval ID in the format: {type}-{timestamp}-{shortHash}
 */
export function generateApprovalId(type: ApprovalType): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 6);
  return `${type}-${timestamp}-${randomPart}`;
}

/**
 * Create a pending approval object.
 */
export function createPendingApproval(params: CreateApprovalParams): PendingApproval {
  return {
    id: generateApprovalId(params.type),
    type: params.type,
    requestingShip: params.requestingShip,
    channelNest: params.channelNest,
    groupFlag: params.groupFlag,
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

/**
 * Format a notification message for the owner about a pending approval.
 */
export function formatApprovalRequest(approval: PendingApproval): string {
  const preview = approval.messagePreview ? `\n"${truncate(approval.messagePreview, 100)}"` : "";

  switch (approval.type) {
    case "dm":
      return (
        `New DM request from ${approval.requestingShip}:${preview}\n\n` +
        `Reply "approve" or "deny" (ID: ${approval.id})`
      );

    case "channel":
      return (
        `${approval.requestingShip} mentioned you in ${approval.channelNest}:${preview}\n\n` +
        `Reply "approve" to allow ${approval.requestingShip} in this channel, or "deny"\n` +
        `(ID: ${approval.id})`
      );

    case "group":
      return (
        `Group invite from ${approval.requestingShip} to join ${approval.groupFlag}\n\n` +
        `Reply "approve" to join this group, or "deny"\n` +
        `(ID: ${approval.id})`
      );
  }
}

export type ApprovalResponse = {
  action: "approve" | "deny";
  id?: string;
};

/**
 * Parse an owner's response to an approval request.
 * Supports formats:
 *   - "approve" / "deny" (applies to most recent pending)
 *   - "approve dm-1234567890-abc" / "deny dm-1234567890-abc" (specific ID)
 */
export function parseApprovalResponse(text: string): ApprovalResponse | null {
  const trimmed = text.trim().toLowerCase();

  // Match "approve" or "deny" optionally followed by an ID
  const match = trimmed.match(/^(approve|deny)(?:\s+(.+))?$/);
  if (!match) {
    return null;
  }

  const action = match[1] as "approve" | "deny";
  const id = match[2]?.trim();

  return { action, id };
}

/**
 * Check if a message text looks like an approval response.
 * Used to determine if we should intercept the message before normal processing.
 */
export function isApprovalResponse(text: string): boolean {
  const trimmed = text.trim().toLowerCase();
  return trimmed.startsWith("approve") || trimmed.startsWith("deny");
}

/**
 * Find a pending approval by ID, or return the most recent if no ID specified.
 */
export function findPendingApproval(
  pendingApprovals: PendingApproval[],
  id?: string,
): PendingApproval | undefined {
  if (id) {
    return pendingApprovals.find((a) => a.id === id);
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

/**
 * Format a confirmation message after an approval action.
 */
export function formatApprovalConfirmation(approval: PendingApproval, action: "approve" | "deny"): string {
  const actionText = action === "approve" ? "Approved" : "Denied";

  switch (approval.type) {
    case "dm":
      if (action === "approve") {
        return `${actionText} DM access for ${approval.requestingShip}. They can now message the bot.`;
      }
      return `${actionText} DM request from ${approval.requestingShip}.`;

    case "channel":
      if (action === "approve") {
        return `${actionText} ${approval.requestingShip} for ${approval.channelNest}. They can now interact in this channel.`;
      }
      return `${actionText} ${approval.requestingShip} for ${approval.channelNest}.`;

    case "group":
      if (action === "approve") {
        return `${actionText} group invite from ${approval.requestingShip} to ${approval.groupFlag}. Joining group...`;
      }
      return `${actionText} group invite from ${approval.requestingShip} to ${approval.groupFlag}.`;
  }
}
