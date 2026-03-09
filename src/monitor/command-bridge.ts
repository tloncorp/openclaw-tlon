/**
 * Command Bridge
 *
 * Bridges OpenClaw slash commands (registered at plugin init) with the monitor's
 * approval state (available after the SSE connection starts). The monitor calls
 * setBridge() when it starts; slash command handlers call getBridge().
 */

export interface ApprovalCommandBridge {
  /** Handle /approve, /deny, /block. Returns response text. */
  handleAction(action: "approve" | "deny" | "block", id?: string): Promise<string>;
  /** Get formatted pending approvals list. */
  getPendingList(): Promise<string>;
  /** Get formatted blocked ships list. */
  getBlockedList(): Promise<string>;
  /** Handle /unblock ~ship. Returns response text. */
  handleUnblock(ship: string): Promise<string>;
}

let bridge: ApprovalCommandBridge | null = null;

export function setBridge(b: ApprovalCommandBridge): void {
  bridge = b;
}

export function getBridge(): ApprovalCommandBridge | null {
  return bridge;
}
