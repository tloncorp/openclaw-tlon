import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  setCandidateSend,
  getCandidateSend,
  clearCandidateSend,
  confirmNudgeCandidate,
  registerConfirmedNudgeCallback,
  _testing,
} from "./nudge-candidate.js";

describe("nudge-candidate", () => {
  beforeEach(() => {
    _testing.clearAll();
  });

  describe("set/get/clear lifecycle", () => {
    it("stores and retrieves a candidate", () => {
      const now = Date.now();
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: now,
        ownerShip: "~sampel-palnet",
        content: "Hello owner",
        provider: "anthropic",
        model: "claude-3",
      });
      const candidate = getCandidateSend("default");
      expect(candidate).toMatchObject({
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: now,
        ownerShip: "~sampel-palnet",
        content: "Hello owner",
        provider: "anthropic",
        model: "claude-3",
      });
    });

    it("clears a candidate", () => {
      const now = Date.now();
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: now,
        ownerShip: "~sampel-palnet",
        content: "Hello",
        provider: null,
        model: null,
      });
      clearCandidateSend("default");
      expect(getCandidateSend("default")).toBeNull();
    });

    it("returns null for unknown account", () => {
      expect(getCandidateSend("unknown")).toBeNull();
    });
  });

  describe("account isolation", () => {
    it("different accounts are independent", () => {
      const now = Date.now();
      setCandidateSend("account-a", {
        accountId: "account-a",
        sessionKey: "sess-a",
        sentAt: now,
        ownerShip: "~ship-a",
        content: "msg-a",
        provider: null,
        model: null,
      });
      setCandidateSend("account-b", {
        accountId: "account-b",
        sessionKey: "sess-b",
        sentAt: now + 1000,
        ownerShip: "~ship-b",
        content: "msg-b",
        provider: null,
        model: null,
      });

      clearCandidateSend("account-a");
      expect(getCandidateSend("account-a")).toBeNull();
      expect(getCandidateSend("account-b")).not.toBeNull();
    });
  });

  describe("same-session multiple sends", () => {
    it("keeps the most recent candidate from the same session", () => {
      const now = Date.now();
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: now,
        ownerShip: "~owner",
        content: "first",
        provider: null,
        model: null,
      });
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: now + 1000,
        ownerShip: "~owner",
        content: "second",
        provider: null,
        model: null,
      });
      const candidate = getCandidateSend("default");
      expect(candidate?.content).toBe("second");
      expect(candidate?.sentAt).toBe(now + 1000);
    });

    it("different session replaces candidate", () => {
      const now = Date.now();
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: now,
        ownerShip: "~owner",
        content: "first",
        provider: null,
        model: null,
      });
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-2",
        sentAt: now + 1000,
        ownerShip: "~owner",
        content: "second",
        provider: null,
        model: null,
      });
      const candidate = getCandidateSend("default");
      expect(candidate?.sessionKey).toBe("sess-2");
    });
  });

  describe("confirmNudgeCandidate", () => {
    it("confirms a valid candidate with the given stage", () => {
      const now = Date.now();
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: now,
        ownerShip: "~owner",
        content: "nudge content",
        provider: "anthropic",
        model: "claude-3",
      });
      const confirmed = confirmNudgeCandidate("default", 2);
      expect(confirmed).toMatchObject({
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: now,
        ownerShip: "~owner",
        nudgeStage: 2,
        content: "nudge content",
        provider: "anthropic",
        model: "claude-3",
      });
      // Candidate is cleared after confirmation
      expect(getCandidateSend("default")).toBeNull();
    });

    it("confirms the most recent candidate after same-session multiple sends", () => {
      const now = Date.now();
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: now,
        ownerShip: "~owner",
        content: "first",
        provider: null,
        model: null,
      });
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: now + 1000,
        ownerShip: "~owner",
        content: "second",
        provider: null,
        model: null,
      });
      const confirmed = confirmNudgeCandidate("default", 1);
      expect(confirmed).not.toBeNull();
      expect(confirmed?.content).toBe("second");
      expect(confirmed?.sentAt).toBe(now + 1000);
      expect(getCandidateSend("default")).toBeNull();
    });

    it("returns null when no candidate exists", () => {
      expect(confirmNudgeCandidate("default", 1)).toBeNull();
    });

    it("confirms when the stage update arrives before the candidate send", () => {
      const onConfirmed = vi.fn();
      registerConfirmedNudgeCallback("default", onConfirmed);

      expect(confirmNudgeCandidate("default", 2)).toBeNull();
      expect(getCandidateSend("default")).toBeNull();

      const confirmed = setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: Date.now(),
        ownerShip: "~owner",
        content: "nudge content",
        provider: "anthropic",
        model: "claude-3",
      });

      expect(confirmed).toMatchObject({
        accountId: "default",
        sessionKey: "sess-1",
        ownerShip: "~owner",
        nudgeStage: 2,
      });
      expect(onConfirmed).toHaveBeenCalledWith(
        expect.objectContaining({
          accountId: "default",
          sessionKey: "sess-1",
          nudgeStage: 2,
        }),
      );
      expect(getCandidateSend("default")).toBeNull();
    });

    it("returns null for invalid stages and preserves the candidate", () => {
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: Date.now(),
        ownerShip: "~owner",
        content: "msg",
        provider: null,
        model: null,
      });
      expect(confirmNudgeCandidate("default", 4)).toBeNull();
      expect(getCandidateSend("default")).not.toBeNull();
    });

    it("uses lastNudgeStage for stage, not content", () => {
      const now = Date.now();
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: now,
        ownerShip: "~owner",
        content: "Quick ideas for your week", // stage 1 marker
        provider: null,
        model: null,
      });
      const confirmed = confirmNudgeCandidate("default", 3);
      expect(confirmed?.nudgeStage).toBe(3);
    });

    it("carries provider/model from candidate", () => {
      const now = Date.now();
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: now,
        ownerShip: "~owner",
        content: "msg",
        provider: "openai",
        model: "gpt-4",
      });
      const confirmed = confirmNudgeCandidate("default", 1);
      expect(confirmed?.provider).toBe("openai");
      expect(confirmed?.model).toBe("gpt-4");
    });
  });

  describe("TTL cleanup", () => {
    it("removes stale candidates on set", () => {
      const ttlMs = _testing.getCandidateTtlMs();

      // Set a candidate with old sentAt
      _testing.clearAll();
      setCandidateSend("stale-account", {
        accountId: "stale-account",
        sessionKey: "old-sess",
        sentAt: Date.now() - ttlMs - 1000,
        ownerShip: "~old-owner",
        content: "old",
        provider: null,
        model: null,
      });

      // Setting a new candidate triggers cleanup
      setCandidateSend("fresh-account", {
        accountId: "fresh-account",
        sessionKey: "new-sess",
        sentAt: Date.now(),
        ownerShip: "~new-owner",
        content: "new",
        provider: null,
        model: null,
      });

      expect(getCandidateSend("stale-account")).toBeNull();
      expect(getCandidateSend("fresh-account")).not.toBeNull();
    });

    it("removes stale candidates on get", () => {
      const ttlMs = _testing.getCandidateTtlMs();

      setCandidateSend("stale-account", {
        accountId: "stale-account",
        sessionKey: "old-sess",
        sentAt: Date.now() - ttlMs - 1000,
        ownerShip: "~old-owner",
        content: "old",
        provider: null,
        model: null,
      });

      expect(getCandidateSend("stale-account")).toBeNull();
    });

    it("removes stale candidates on confirm", () => {
      const ttlMs = _testing.getCandidateTtlMs();

      setCandidateSend("stale-account", {
        accountId: "stale-account",
        sessionKey: "old-sess",
        sentAt: Date.now() - ttlMs - 1000,
        ownerShip: "~old-owner",
        content: "old",
        provider: null,
        model: null,
      });

      expect(confirmNudgeCandidate("stale-account", 1)).toBeNull();
      expect(getCandidateSend("stale-account")).toBeNull();
    });

    it("clearing the candidate also clears any pending stage signal", () => {
      expect(confirmNudgeCandidate("default", 1)).toBeNull();
      clearCandidateSend("default");

      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: Date.now(),
        ownerShip: "~owner",
        content: "msg",
        provider: null,
        model: null,
      });

      expect(getCandidateSend("default")).not.toBeNull();
    });
  });
});
