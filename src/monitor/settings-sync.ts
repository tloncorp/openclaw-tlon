/**
 * Pure helper for settings mirror synchronization.
 *
 * The single source of truth for ownerShip, pendingNudge, and lastNudgeStage
 * transition detection. Called from the settings onChange handler.
 */

import type { PendingNudge } from "../pending-nudge.js";
import type { TlonSettingsStore } from "../settings.js";
import { normalizeShip } from "../targets.js";

export type SettingsMirrorSyncResult = {
  ownerShipChanged: boolean;
  effectiveOwnerShip: string | null;
  pendingNudgeChanged: boolean;
  pendingNudge: PendingNudge | null;
  lastNudgeStageChanged: boolean;
  lastNudgeStage: number | undefined;
};

export function resolveSettingsMirrorSync(params: {
  prevSettings: TlonSettingsStore;
  newSettings: TlonSettingsStore;
  fileConfigOwnerShip: string | null;
}): SettingsMirrorSyncResult {
  const { prevSettings, newSettings, fileConfigOwnerShip } = params;

  // ownerShip: compare string values (normalize for comparison)
  const prevOwner = prevSettings.ownerShip;
  const newOwner = newSettings.ownerShip;
  const normalizedPrevOwner = prevOwner ? normalizeShip(prevOwner) : null;
  const normalizedNewOwner = newOwner ? normalizeShip(newOwner) : null;
  const ownerShipChanged = normalizedPrevOwner !== normalizedNewOwner;
  const effectiveOwnerShip: string | null = normalizedNewOwner ?? fileConfigOwnerShip;

  // pendingNudge: reference equality since applySettingsUpdate uses shallow spread
  const pendingNudgeChanged = prevSettings.pendingNudge !== newSettings.pendingNudge;
  const pendingNudge: PendingNudge | null = newSettings.pendingNudge ?? null;

  // lastNudgeStage: value equality on primitive
  const lastNudgeStageChanged = prevSettings.lastNudgeStage !== newSettings.lastNudgeStage;
  const lastNudgeStage = newSettings.lastNudgeStage;

  return {
    ownerShipChanged,
    effectiveOwnerShip,
    pendingNudgeChanged,
    pendingNudge,
    lastNudgeStageChanged,
    lastNudgeStage,
  };
}
