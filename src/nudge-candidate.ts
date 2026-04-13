/**
 * Candidate send state for two-signal nudge confirmation.
 *
 * A successful `message:sent` to ownerShip during a heartbeat session is stored
 * as a "candidate" here. The candidate is only promoted to a confirmed nudge
 * when the monitor detects a matching `lastNudgeStage` settings-store update.
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
  ambiguous: boolean;
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

/** TTL for unconfirmed candidates (5 minutes). */
const CANDIDATE_TTL_MS = 5 * 60 * 1000;

const candidates = new Map<string, NudgeCandidate>();

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

export function setCandidateSend(
  accountId: string,
  candidate: Omit<NudgeCandidate, "ambiguous">,
): void {
  cleanupStaleCandidates();

  const existing = candidates.get(accountId);
  if (existing && existing.sessionKey === candidate.sessionKey) {
    // Second owner-targeted send in same session → ambiguous
    candidates.set(accountId, { ...candidate, ambiguous: true });
  } else {
    // New session or first send → fresh candidate
    candidates.set(accountId, { ...candidate, ambiguous: false });
  }
}

export function getCandidateSend(accountId: string): NudgeCandidate | null {
  cleanupStaleCandidates();
  return candidates.get(accountId) ?? null;
}

export function clearCandidateSend(accountId: string): void {
  candidates.delete(accountId);
}

/** Clear all candidate state (shutdown cleanup). */
export function clearAllCandidates(): void {
  candidates.clear();
}

export function confirmNudgeCandidate(
  accountId: string,
  lastNudgeStage: number,
): ConfirmedNudge | null {
  cleanupStaleCandidates();
  if (!isNudgeStage(lastNudgeStage)) {return null;}
  const candidate = candidates.get(accountId);
  if (!candidate) {return null;}
  candidates.delete(accountId);
  if (candidate.ambiguous) {return null;}
  return {
    accountId: candidate.accountId,
    sessionKey: candidate.sessionKey,
    sentAt: candidate.sentAt,
    ownerShip: candidate.ownerShip,
    nudgeStage: lastNudgeStage,
    content: candidate.content,
    provider: candidate.provider,
    model: candidate.model,
  };
}

export const _testing = {
  clearAll: () => candidates.clear(),
  getCandidateTtlMs: () => CANDIDATE_TTL_MS,
};
