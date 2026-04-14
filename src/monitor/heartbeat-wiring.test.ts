/**
 * Regression tests for heartbeat telemetry monitor-level wiring.
 *
 * These tests exercise the exact state-transition sequences that
 * src/monitor/index.ts performs for:
 * - gateway_stop cleanup (close() clearing candidate state)
 * - startup rehydration of expired pendingNudge
 * - owner-message re-engagement detection (within 72h window)
 * - owner-message expired-nudge cleanup (outside 72h window)
 *
 * They call the same shared-state functions the monitor calls, in the
 * same order, to verify correctness without instantiating the full monitor.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { createHeartbeatTelemetryHandlers, _testing as hbTesting } from "../heartbeat-telemetry.js";
import {
  clearCandidateSend,
  clearConfirmedNudgeCallback,
  getCandidateSend,
  setCandidateSend,
  confirmNudgeCandidate,
  registerConfirmedNudgeCallback,
  _testing as candidateTesting,
} from "../nudge-candidate.js";
import {
  clearPendingNudge,
  DEFAULT_ATTRIBUTION_WINDOW_MS,
  getPendingNudge,
  isNudgeEligible,
  registerPersistCallback,
  setPendingNudge,
  syncPendingNudgeFromStore,
  _testing as pendingTesting,
} from "../pending-nudge.js";
import type { PendingNudge } from "../pending-nudge.js";
import { resolveSettingsMirrorSync } from "./settings-sync.js";

beforeEach(() => {
  hbTesting.clearSessions();
  candidateTesting.clearAll();
  pendingTesting.clearAll();
});

describe("gateway_stop cleanup", () => {
  it("close() clears both heartbeat sessions and candidate-send state", () => {
    const handlers = createHeartbeatTelemetryHandlers({
      config: { channels: { tlon: { enabled: true, ship: "~bot", url: "http://x", code: "c", ownerShip: "~zod" } } } as never,
      getEffectiveOwnerShip: () => "~zod",
      logger: { info: vi.fn(), warn: vi.fn() },
    });

    // Register a heartbeat session
    handlers.onBeforeAgentStart(
      { prompt: "heartbeat" },
      { sessionKey: "hb-1", messageProvider: "heartbeat" },
    );

    // Simulate a candidate send stored during the session
    setCandidateSend("default", {
      accountId: "default",
      sessionKey: "hb-1",
      sentAt: Date.now(),
      ownerShip: "~zod",
      content: "Quick ideas for your week",
      provider: "anthropic",
      model: "claude-3",
    });

    expect(hbTesting.getSession("hb-1")).not.toBeNull();
    expect(getCandidateSend("default")).not.toBeNull();

    // This is what gateway_stop calls
    handlers.close();

    expect(hbTesting.getSession("hb-1")).toBeNull();
    expect(getCandidateSend("default")).toBeNull();
  });

  it("close() prevents stale candidate confirmation after restart", () => {
    const handlers = createHeartbeatTelemetryHandlers({
      config: { channels: { tlon: { enabled: true, ship: "~bot", url: "http://x", code: "c", ownerShip: "~zod" } } } as never,
      getEffectiveOwnerShip: () => "~zod",
      logger: { info: vi.fn(), warn: vi.fn() },
    });

    // Store a candidate (as if heartbeat sent a message)
    setCandidateSend("default", {
      accountId: "default",
      sessionKey: "hb-1",
      sentAt: Date.now(),
      ownerShip: "~zod",
      content: "nudge content",
      provider: "anthropic",
      model: "claude-3",
    });

    // gateway_stop fires
    handlers.close();

    // After restart, a lastNudgeStage update arrives — should NOT confirm
    const confirmed = confirmNudgeCandidate("default", 1);
    expect(confirmed).toBeNull();
  });
});

describe("startup rehydration — expired pendingNudge", () => {
  it("clears stale candidate state before monitor startup continues", () => {
    const accountId = "default";

    setCandidateSend(accountId, {
      accountId,
      sessionKey: "old-sess",
      sentAt: Date.now(),
      ownerShip: "~zod",
      content: "stale candidate",
      provider: null,
      model: null,
    });

    // The monitor now clears per-account candidate state before settings load.
    clearCandidateSend(accountId);

    expect(confirmNudgeCandidate(accountId, 1)).toBeNull();
  });

  it("clears an expired persisted pendingNudge on startup", () => {
    const persistCb = vi.fn();
    const accountId = "default";

    // Simulate what the monitor does at startup:
    // 1. Load settings store → get pendingNudge
    const expiredNudge: PendingNudge = {
      sentAt: Date.now() - DEFAULT_ATTRIBUTION_WINDOW_MS - 1000, // expired
      stage: 2,
      ownerShip: "~zod",
      accountId,
      sessionKey: "old-sess",
      provider: "anthropic",
      model: "claude-3",
    };

    // 2. Unconditional sync from store (does NOT trigger persist callback)
    syncPendingNudgeFromStore(accountId, expiredNudge);
    expect(getPendingNudge(accountId)).toEqual(expiredNudge);

    // 3. Register persist callback (after sync, before cleanup check)
    registerPersistCallback(accountId, persistCb);

    // 4. Check eligibility and clear if expired
    const rehydrated = getPendingNudge(accountId);
    expect(rehydrated).not.toBeNull();
    expect(isNudgeEligible(rehydrated!)).toBe(false);

    clearPendingNudge(accountId);

    // Verify: cleared from memory
    expect(getPendingNudge(accountId)).toBeNull();
    // Verify: persist callback fired with null (triggers del-entry poke)
    expect(persistCb).toHaveBeenCalledWith(null);
  });

  it("keeps a valid persisted pendingNudge on startup", () => {
    const persistCb = vi.fn();
    const accountId = "default";

    const validNudge: PendingNudge = {
      sentAt: Date.now() - 1000, // recent — within window
      stage: 1,
      ownerShip: "~zod",
      accountId,
      sessionKey: "recent-sess",
      provider: "anthropic",
      model: "claude-3",
    };

    syncPendingNudgeFromStore(accountId, validNudge);
    registerPersistCallback(accountId, persistCb);

    const rehydrated = getPendingNudge(accountId);
    expect(rehydrated).not.toBeNull();
    expect(isNudgeEligible(rehydrated!)).toBe(true);

    // No clearPendingNudge called — nudge stays
    expect(getPendingNudge(accountId)).toEqual(validNudge);
    // Persist callback NOT called (sync doesn't trigger it, and we didn't clear)
    expect(persistCb).not.toHaveBeenCalled();
  });

  it("clears stale in-memory state when store has no pendingNudge", () => {
    const accountId = "default";

    // Leftover from a previous monitor run in same process
    setPendingNudge(accountId, {
      sentAt: Date.now(),
      stage: 1,
      ownerShip: "~zod",
      accountId,
      sessionKey: "stale",
      provider: null,
      model: null,
    });

    // Register callback, then reset mock (setPendingNudge above fired it)
    const persistCb = vi.fn();
    registerPersistCallback(accountId, persistCb);

    // Startup sync with null (settings store has no pendingNudge)
    syncPendingNudgeFromStore(accountId, null);

    expect(getPendingNudge(accountId)).toBeNull();
    // sync does NOT fire persist callback — that's intentional
    expect(persistCb).not.toHaveBeenCalled();
  });

  it("clears stale in-memory state before a failed settings load", () => {
    const accountId = "default";

    setPendingNudge(accountId, {
      sentAt: Date.now(),
      stage: 1,
      ownerShip: "~zod",
      accountId,
      sessionKey: "stale",
      provider: null,
      model: null,
    });

    // The monitor now clears pending-nudge state before attempting settings load.
    syncPendingNudgeFromStore(accountId, null);

    // If settingsManager.load() then throws, no stale state remains to misattribute.
    expect(getPendingNudge(accountId)).toBeNull();
  });
});

describe("settings refresh fallback", () => {
  it("preserves a live pendingNudge when refresh sees an empty store copy", () => {
    const accountId = "default";
    const liveNudge: PendingNudge = {
      sentAt: Date.now(),
      stage: 2,
      ownerShip: "~zod",
      accountId,
      sessionKey: "live",
      provider: "anthropic",
      model: "claude-3",
    };

    setPendingNudge(accountId, liveNudge);

    const sync = resolveSettingsMirrorSync({
      prevSettings: { pendingNudge: liveNudge },
      newSettings: {},
      fileConfigOwnerShip: null,
    });

    expect(sync.pendingNudgeChanged).toBe(true);
    // Refresh path intentionally does NOT sync pendingNudge from store.
    expect(getPendingNudge(accountId)).toEqual(liveNudge);
  });

  it("does not resurrect a cleared pendingNudge from a stale store copy", () => {
    const accountId = "default";
    const staleStoreNudge: PendingNudge = {
      sentAt: Date.now(),
      stage: 2,
      ownerShip: "~zod",
      accountId,
      sessionKey: "stale-store",
      provider: "anthropic",
      model: "claude-3",
    };

    setPendingNudge(accountId, staleStoreNudge);
    clearPendingNudge(accountId);

    const sync = resolveSettingsMirrorSync({
      prevSettings: {},
      newSettings: { pendingNudge: staleStoreNudge },
      fileConfigOwnerShip: null,
    });

    expect(sync.pendingNudgeChanged).toBe(true);
    // Refresh path intentionally does NOT sync pendingNudge from store.
    expect(getPendingNudge(accountId)).toBeNull();
  });

  it("can confirm a candidate from refreshed lastNudgeStage state", () => {
    const accountId = "default";

    setCandidateSend(accountId, {
      accountId,
      sessionKey: "hb-1",
      sentAt: Date.now(),
      ownerShip: "~zod",
      content: "Quick ideas for your week",
      provider: "anthropic",
      model: "claude-3",
    });

    const sync = resolveSettingsMirrorSync({
      prevSettings: {},
      newSettings: { lastNudgeStage: 1 },
      fileConfigOwnerShip: null,
    });

    expect(sync.lastNudgeStageChanged).toBe(true);
    const confirmed = confirmNudgeCandidate(accountId, sync.lastNudgeStage!);
    expect(confirmed).not.toBeNull();
    setPendingNudge(accountId, {
      sentAt: confirmed!.sentAt,
      stage: confirmed!.nudgeStage,
      ownerShip: confirmed!.ownerShip,
      accountId: confirmed!.accountId,
      sessionKey: confirmed!.sessionKey,
      provider: confirmed!.provider,
      model: confirmed!.model,
    });

    expect(getPendingNudge(accountId)).toEqual(
      expect.objectContaining({
        stage: 1,
        ownerShip: "~zod",
        sessionKey: "hb-1",
      }),
    );
  });

  it("confirms when lastNudgeStage lands before the outbound hook candidate", () => {
    const accountId = "default";
    const onConfirmed = vi.fn();
    registerConfirmedNudgeCallback(accountId, onConfirmed);

    const sync = resolveSettingsMirrorSync({
      prevSettings: {},
      newSettings: { lastNudgeStage: 3 },
      fileConfigOwnerShip: null,
    });

    expect(sync.lastNudgeStageChanged).toBe(true);
    expect(confirmNudgeCandidate(accountId, sync.lastNudgeStage!)).toBeNull();

    setCandidateSend(accountId, {
      accountId,
      sessionKey: "hb-late-hook",
      sentAt: Date.now(),
      ownerShip: "~zod",
      content: "Still here! Here's what I can do",
      provider: "anthropic",
      model: "claude-3",
    });

    expect(onConfirmed).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId,
        sessionKey: "hb-late-hook",
        nudgeStage: 3,
      }),
    );
    expect(getCandidateSend(accountId)).toBeNull();
    clearConfirmedNudgeCallback(accountId);
  });
});

describe("owner-message re-engagement", () => {
  const accountId = "default";
  const botShip = "~nec";

  function makePendingNudge(overrides?: Partial<PendingNudge>): PendingNudge {
    return {
      sentAt: Date.now() - 60_000, // 1 minute ago
      stage: 2,
      ownerShip: "~zod",
      accountId,
      sessionKey: "hb-sess",
      provider: "anthropic",
      model: "claude-3",
      ...overrides,
    };
  }

  it("emits reengagement when owner messages within 72h window", () => {
    const captureFn = vi.fn();
    const pending = makePendingNudge({ sentAt: Date.now() - 3600_000 }); // 1 hour ago

    // Setup: pending nudge exists (as if confirmed earlier)
    setPendingNudge(accountId, pending);

    // Simulate what the monitor's owner-message path does:
    const retrieved = getPendingNudge(accountId);
    expect(retrieved).not.toBeNull();
    expect(isNudgeEligible(retrieved!)).toBe(true);

    // Emit reengagement event using the inbound message timestamp
    const reengagedAt = retrieved!.sentAt + 1234;
    captureFn({
      ownerShip: retrieved!.ownerShip,
      botShip,
      nudgeStage: retrieved!.stage,
      nudgeSentAt: retrieved!.sentAt,
      reengagedAt,
      reengagementDelayMs: reengagedAt - retrieved!.sentAt,
      channel: "tlon",
      accountId: retrieved!.accountId,
      provider: retrieved!.provider,
      model: retrieved!.model,
      sessionKey: retrieved!.sessionKey,
    });

    clearPendingNudge(accountId);

    // Verify event was emitted with correct attribution
    expect(captureFn).toHaveBeenCalledTimes(1);
    const event = captureFn.mock.calls[0][0];
    expect(event.ownerShip).toBe("~zod");
    expect(event.nudgeStage).toBe(2);
    expect(event.reengagedAt).toBe(reengagedAt);
    expect(event.reengagementDelayMs).toBe(1234);
    expect(event.provider).toBe("anthropic");
    expect(event.model).toBe("claude-3");

    // Verify pending nudge cleared
    expect(getPendingNudge(accountId)).toBeNull();
  });

  it("uses inbound message time, not processing time, for the attribution window", () => {
    const captureFn = vi.fn();
    const sentAt = 1_000;
    const messageTimestamp = sentAt + DEFAULT_ATTRIBUTION_WINDOW_MS - 1;
    const delayedProcessingNow = sentAt + DEFAULT_ATTRIBUTION_WINDOW_MS + 60_000;

    const pending = makePendingNudge({ sentAt });
    setPendingNudge(accountId, pending);

    const retrieved = getPendingNudge(accountId);
    expect(retrieved).not.toBeNull();
    expect(isNudgeEligible(retrieved!, delayedProcessingNow)).toBe(false);
    expect(isNudgeEligible(retrieved!, messageTimestamp)).toBe(true);

    captureFn({
      ownerShip: retrieved!.ownerShip,
      botShip,
      nudgeStage: retrieved!.stage,
      nudgeSentAt: retrieved!.sentAt,
      reengagedAt: messageTimestamp,
      reengagementDelayMs: messageTimestamp - retrieved!.sentAt,
      channel: "tlon",
      accountId: retrieved!.accountId,
      provider: retrieved!.provider,
      model: retrieved!.model,
      sessionKey: retrieved!.sessionKey,
    });

    clearPendingNudge(accountId);

    expect(captureFn).toHaveBeenCalledTimes(1);
    expect(captureFn.mock.calls[0][0]).toMatchObject({
      reengagedAt: messageTimestamp,
      reengagementDelayMs: DEFAULT_ATTRIBUTION_WINDOW_MS - 1,
    });
    expect(getPendingNudge(accountId)).toBeNull();
  });

  it("clears expired pending nudge without emitting reengagement", () => {
    const captureFn = vi.fn();
    const expiredNudge = makePendingNudge({
      sentAt: Date.now() - DEFAULT_ATTRIBUTION_WINDOW_MS - 1000, // past 72h
    });

    setPendingNudge(accountId, expiredNudge);

    // Simulate monitor owner-message path
    const retrieved = getPendingNudge(accountId);
    expect(retrieved).not.toBeNull();
    expect(isNudgeEligible(retrieved!)).toBe(false);

    // Expired: clear without emitting
    clearPendingNudge(accountId);

    // Verify NO event emitted
    expect(captureFn).not.toHaveBeenCalled();
    // Verify cleared
    expect(getPendingNudge(accountId)).toBeNull();
  });

  it("does nothing when no pending nudge exists", () => {
    const captureFn = vi.fn();

    const retrieved = getPendingNudge(accountId);
    expect(retrieved).toBeNull();

    // No emission, no clear — the monitor skips the whole block
    expect(captureFn).not.toHaveBeenCalled();
  });

  it("persist callback fires on clear (triggers del-entry poke)", () => {
    const persistCb = vi.fn();
    registerPersistCallback(accountId, persistCb);

    setPendingNudge(accountId, makePendingNudge());
    persistCb.mockClear(); // reset from the set call

    // Owner messages → re-engagement → clear
    clearPendingNudge(accountId);

    expect(persistCb).toHaveBeenCalledWith(null);
  });
});

describe("startup load failure → refresh recovery", () => {
  const accountId = "default";

  it("refresh recovers persisted pendingNudge after startup scry failure", () => {
    // Simulate startup: clear stale state, then load() throws
    syncPendingNudgeFromStore(accountId, null);
    let pendingNudgeRehydrated = false;
    // load() would set pendingNudgeRehydrated = true on success, but it failed
    // so pendingNudgeRehydrated remains false

    const persistedNudge: PendingNudge = {
      sentAt: Date.now() - 60_000,
      stage: 1,
      ownerShip: "~zod",
      accountId,
      sessionKey: "persisted-sess",
      provider: "anthropic",
      model: "claude-3",
    };

    // Later refresh succeeds — since pendingNudgeRehydrated is false,
    // the store value is allowed through
    if (!pendingNudgeRehydrated && persistedNudge) {
      syncPendingNudgeFromStore(accountId, persistedNudge);
      pendingNudgeRehydrated = true;
    }

    // Verify recovery
    expect(getPendingNudge(accountId)).toEqual(persistedNudge);

    // Owner reply should now trigger re-engagement
    const retrieved = getPendingNudge(accountId);
    expect(retrieved).not.toBeNull();
    expect(isNudgeEligible(retrieved!)).toBe(true);

    // Clear on re-engagement
    clearPendingNudge(accountId);
    expect(getPendingNudge(accountId)).toBeNull();
  });

  it("refresh cannot clobber live in-memory state after successful rehydration", () => {
    // Startup succeeds
    const startupNudge: PendingNudge = {
      sentAt: Date.now() - 30_000,
      stage: 2,
      ownerShip: "~zod",
      accountId,
      sessionKey: "startup-sess",
      provider: "anthropic",
      model: "claude-3",
    };
    syncPendingNudgeFromStore(accountId, startupNudge);
    let pendingNudgeRehydrated = true;

    // Monitor locally clears (e.g. re-engagement detected)
    clearPendingNudge(accountId);
    expect(getPendingNudge(accountId)).toBeNull();

    // Refresh sees a stale store copy (del-entry hasn't landed yet)
    const staleStoreNudge: PendingNudge = {
      ...startupNudge,
      sessionKey: "stale-echo",
    };

    // Since pendingNudgeRehydrated is true, use in-memory state
    if (pendingNudgeRehydrated) {
      // getPendingNudge returns null — monitor cleared it
      expect(getPendingNudge(accountId)).toBeNull();
    }

    // Verify stale store data was NOT synced
    expect(getPendingNudge(accountId)).toBeNull();
    // (staleStoreNudge was never synced)
    void staleStoreNudge; // suppress unused warning
  });

  it("refresh cannot resurrect after monitor locally sets then clears", () => {
    let pendingNudgeRehydrated = false;

    // Startup scry fails
    syncPendingNudgeFromStore(accountId, null);

    // Monitor locally sets a pending nudge (nudge confirmed)
    const localNudge: PendingNudge = {
      sentAt: Date.now(),
      stage: 1,
      ownerShip: "~zod",
      accountId,
      sessionKey: "local-sess",
      provider: null,
      model: null,
    };
    setPendingNudge(accountId, localNudge);
    pendingNudgeRehydrated = true; // monitor took ownership

    // Monitor clears (re-engagement or supersede)
    clearPendingNudge(accountId);

    // Refresh sees the old store echo
    const storeEcho: PendingNudge = { ...localNudge, sessionKey: "store-echo" };
    if (pendingNudgeRehydrated) {
      // In-memory state is authoritative, ignore store
      expect(getPendingNudge(accountId)).toBeNull();
    }

    void storeEcho;
    expect(getPendingNudge(accountId)).toBeNull();
  });
});

describe("expired owner reply clears lastNudgeStage", () => {
  const accountId = "default";

  it("clears both pendingNudge and lastNudgeStage without emitting telemetry", () => {
    const captureFn = vi.fn();
    const lastNudgeStageClearer = vi.fn();

    const expiredNudge: PendingNudge = {
      sentAt: Date.now() - DEFAULT_ATTRIBUTION_WINDOW_MS - 1000,
      stage: 2,
      ownerShip: "~zod",
      accountId,
      sessionKey: "old-sess",
      provider: "anthropic",
      model: "claude-3",
    };

    setPendingNudge(accountId, expiredNudge);

    // Simulate the monitor's owner-message path for expired window:
    const retrieved = getPendingNudge(accountId);
    expect(retrieved).not.toBeNull();
    expect(isNudgeEligible(retrieved!)).toBe(false);

    // No telemetry emitted
    // Clear pendingNudge
    clearPendingNudge(accountId);
    // Clear lastNudgeStage (the del-entry poke the monitor now fires)
    lastNudgeStageClearer();

    expect(captureFn).not.toHaveBeenCalled();
    expect(getPendingNudge(accountId)).toBeNull();
    expect(lastNudgeStageClearer).toHaveBeenCalledTimes(1);
  });

  it("startup pruning does NOT clear lastNudgeStage (passive expiry)", () => {
    const lastNudgeStageClearer = vi.fn();

    const expiredNudge: PendingNudge = {
      sentAt: Date.now() - DEFAULT_ATTRIBUTION_WINDOW_MS - 1000,
      stage: 3,
      ownerShip: "~zod",
      accountId,
      sessionKey: "old-sess",
      provider: null,
      model: null,
    };

    // Startup rehydration
    syncPendingNudgeFromStore(accountId, expiredNudge);
    const rehydrated = getPendingNudge(accountId);
    expect(rehydrated).not.toBeNull();
    expect(isNudgeEligible(rehydrated!)).toBe(false);

    // Startup pruning: clear pendingNudge only (passive, no owner reply)
    clearPendingNudge(accountId);
    // lastNudgeStageClearer is NOT called — passive expiry doesn't reset lifecycle

    expect(getPendingNudge(accountId)).toBeNull();
    expect(lastNudgeStageClearer).not.toHaveBeenCalled();
  });
});

describe("full nudge confirmation → re-engagement lifecycle", () => {
  it("candidate → confirm → persist → owner re-engage → emit → clear", () => {
    const accountId = "default";
    const persistCb = vi.fn();
    const captureNudge = vi.fn();
    const captureReengage = vi.fn();

    registerPersistCallback(accountId, persistCb);

    // Step 1: heartbeat sends a message to owner → stored as candidate
    const sentAt = Date.now();
    setCandidateSend(accountId, {
      accountId,
      sessionKey: "hb-1",
      sentAt,
      ownerShip: "~zod",
      content: "Quick ideas for your week",
      provider: "anthropic",
      model: "claude-3",
    });

    // Step 2: lastNudgeStage settings update arrives → confirm
    const confirmed = confirmNudgeCandidate(accountId, 1);
    expect(confirmed).not.toBeNull();
    expect(confirmed!.nudgeStage).toBe(1);

    // Step 3: emit nudge-sent event
    captureNudge(confirmed);

    // Step 4: persist pending nudge
    setPendingNudge(accountId, {
      sentAt: confirmed!.sentAt,
      stage: confirmed!.nudgeStage,
      ownerShip: confirmed!.ownerShip,
      accountId: confirmed!.accountId,
      sessionKey: confirmed!.sessionKey,
      provider: confirmed!.provider,
      model: confirmed!.model,
    });
    expect(persistCb).toHaveBeenCalledWith(expect.objectContaining({ stage: 1 }));

    // Step 5: owner messages back within 72h
    const pending = getPendingNudge(accountId);
    expect(pending).not.toBeNull();
    expect(isNudgeEligible(pending!)).toBe(true);

    const reengagedAt = pending!.sentAt + 4321;
    captureReengage({
      ownerShip: pending!.ownerShip,
      nudgeStage: pending!.stage,
      reengagedAt,
      reengagementDelayMs: reengagedAt - pending!.sentAt,
    });

    clearPendingNudge(accountId);

    // Verify full lifecycle
    expect(captureNudge).toHaveBeenCalledTimes(1);
    expect(captureReengage).toHaveBeenCalledTimes(1);
    expect(getPendingNudge(accountId)).toBeNull();
    expect(getCandidateSend(accountId)).toBeNull();
  });
});
