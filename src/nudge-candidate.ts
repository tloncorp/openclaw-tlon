/**
 * Candidate send state for two-signal nudge confirmation.
 *
 * A successful `message:sent` to ownerShip during a heartbeat session is stored
 * as a "candidate" here. The candidate is only promoted to a confirmed nudge
 * when it is paired with a matching `lastNudgeStage` settings-store update,
 * regardless of which signal arrives first.
 *
 * Keyed by accountId — each account has at most one candidate at a time.
 */

export type NudgeCandidate = {
  accountId: string;
  sessionKey: string;
  sentAt: number;
  ownerShip: string;
  content: string;
  provider: string | null;
  model: string | null;
};

export type ConfirmedNudge = {
  accountId: string;
  sessionKey: string;
  sentAt: number;
  ownerShip: string;
  nudgeStage: 1 | 2 | 3;
  content: string;
  provider: string | null;
  model: string | null;
};

/** TTL for unconfirmed candidates (10 minutes). Longer than the 5-minute settings refresh interval to give the stale-subscription fallback time to deliver a missed lastNudgeStage update. */
const CANDIDATE_TTL_MS = 10 * 60 * 1000;

const candidates = new Map<string, NudgeCandidate>();
const pendingStageSignals = new Map<string, { stage: 1 | 2 | 3; observedAt: number }>();
const confirmationCallbacks = new Map<string, (confirmed: ConfirmedNudge) => void>();

function isNudgeStage(stage: number): stage is 1 | 2 | 3 {
  return stage === 1 || stage === 2 || stage === 3;
}

function cleanupStaleCandidates(now = Date.now()): void {
  for (const [key, candidate] of candidates) {
    if (now - candidate.sentAt > CANDIDATE_TTL_MS) {
      candidates.delete(key);
    }
  }
}

function cleanupStaleStageSignals(now = Date.now()): void {
  for (const [key, signal] of pendingStageSignals) {
    if (now - signal.observedAt > CANDIDATE_TTL_MS) {
      pendingStageSignals.delete(key);
    }
  }
}

function buildConfirmedNudge(
  candidate: NudgeCandidate,
  stage: 1 | 2 | 3,
): ConfirmedNudge {
  return {
    accountId: candidate.accountId,
    sessionKey: candidate.sessionKey,
    sentAt: candidate.sentAt,
    ownerShip: candidate.ownerShip,
    nudgeStage: stage,
    content: candidate.content,
    provider: candidate.provider,
    model: candidate.model,
  };
}

function emitConfirmedNudge(accountId: string, confirmed: ConfirmedNudge | null): ConfirmedNudge | null {
  if (confirmed) {
    confirmationCallbacks.get(accountId)?.(confirmed);
  }
  return confirmed;
}

function consumePendingConfirmation(accountId: string): ConfirmedNudge | null {
  const candidate = candidates.get(accountId);
  const signal = pendingStageSignals.get(accountId);
  if (!candidate || !signal) {
    return null;
  }
  candidates.delete(accountId);
  pendingStageSignals.delete(accountId);
  return buildConfirmedNudge(candidate, signal.stage);
}

export function setCandidateSend(
  accountId: string,
  candidate: NudgeCandidate,
): ConfirmedNudge | null {
  cleanupStaleCandidates();
  cleanupStaleStageSignals();

  // Always keep the most recent candidate — if the same heartbeat session
  // produces multiple owner-targeted sends, we attribute to the latest one.
  candidates.set(accountId, candidate);
  return emitConfirmedNudge(accountId, consumePendingConfirmation(accountId));
}

export function getCandidateSend(accountId: string): NudgeCandidate | null {
  cleanupStaleCandidates();
  cleanupStaleStageSignals();
  return candidates.get(accountId) ?? null;
}

export function clearCandidateSend(accountId: string): void {
  candidates.delete(accountId);
  pendingStageSignals.delete(accountId);
}

/** Clear all candidate state (shutdown cleanup). */
export function clearAllCandidates(): void {
  candidates.clear();
  pendingStageSignals.clear();
}

export function confirmNudgeCandidate(
  accountId: string,
  lastNudgeStage: number,
): ConfirmedNudge | null {
  cleanupStaleCandidates();
  cleanupStaleStageSignals();
  if (!isNudgeStage(lastNudgeStage)) {return null;}
  pendingStageSignals.set(accountId, {
    stage: lastNudgeStage,
    observedAt: Date.now(),
  });
  return emitConfirmedNudge(accountId, consumePendingConfirmation(accountId));
}

export function registerConfirmedNudgeCallback(
  accountId: string,
  cb: (confirmed: ConfirmedNudge) => void,
): void {
  confirmationCallbacks.set(accountId, cb);
}

export function clearConfirmedNudgeCallback(accountId: string): void {
  confirmationCallbacks.delete(accountId);
}

export const _testing = {
  clearAll: () => {
    candidates.clear();
    pendingStageSignals.clear();
    confirmationCallbacks.clear();
  },
  getCandidateTtlMs: () => CANDIDATE_TTL_MS,
};
