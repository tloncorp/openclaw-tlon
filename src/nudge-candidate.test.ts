import { beforeEach, describe, expect, it } from "vitest";
import {
  setCandidateSend,
  getCandidateSend,
  clearCandidateSend,
  confirmNudgeCandidate,
  _testing,
} from "./nudge-candidate.js";

describe("nudge-candidate", () => {
  beforeEach(() => {
    _testing.clearAll();
  });

  describe("set/get/clear lifecycle", () => {
    it("stores and retrieves a candidate", () => {
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: 1000,
        ownerShip: "~sampel-palnet",
        content: "Hello owner",
        provider: "anthropic",
        model: "claude-3",
      });
      const candidate = getCandidateSend("default");
      expect(candidate).toMatchObject({
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: 1000,
        ownerShip: "~sampel-palnet",
        content: "Hello owner",
        provider: "anthropic",
        model: "claude-3",
        ambiguous: false,
      });
    });

    it("clears a candidate", () => {
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: 1000,
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
      setCandidateSend("account-a", {
        accountId: "account-a",
        sessionKey: "sess-a",
        sentAt: 1000,
        ownerShip: "~ship-a",
        content: "msg-a",
        provider: null,
        model: null,
      });
      setCandidateSend("account-b", {
        accountId: "account-b",
        sessionKey: "sess-b",
        sentAt: 2000,
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

  describe("ambiguity detection", () => {
    it("first send in session is not ambiguous", () => {
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: 1000,
        ownerShip: "~owner",
        content: "first",
        provider: null,
        model: null,
      });
      expect(getCandidateSend("default")?.ambiguous).toBe(false);
    });

    it("second send in same session marks ambiguous", () => {
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
      expect(getCandidateSend("default")?.ambiguous).toBe(true);
    });

    it("different session replaces and is not ambiguous", () => {
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: 1000,
        ownerShip: "~owner",
        content: "first",
        provider: null,
        model: null,
      });
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-2",
        sentAt: 2000,
        ownerShip: "~owner",
        content: "second",
        provider: null,
        model: null,
      });
      const candidate = getCandidateSend("default");
      expect(candidate?.sessionKey).toBe("sess-2");
      expect(candidate?.ambiguous).toBe(false);
    });
  });

  describe("confirmNudgeCandidate", () => {
    it("confirms a valid candidate with the given stage", () => {
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: 1000,
        ownerShip: "~owner",
        content: "nudge content",
        provider: "anthropic",
        model: "claude-3",
      });
      const confirmed = confirmNudgeCandidate("default", 2);
      expect(confirmed).toMatchObject({
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: 1000,
        ownerShip: "~owner",
        nudgeStage: 2,
        content: "nudge content",
        provider: "anthropic",
        model: "claude-3",
      });
      // Candidate is cleared after confirmation
      expect(getCandidateSend("default")).toBeNull();
    });

    it("returns null and clears ambiguous candidate", () => {
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
      expect(confirmed).toBeNull();
      expect(getCandidateSend("default")).toBeNull();
    });

    it("returns null when no candidate exists", () => {
      expect(confirmNudgeCandidate("default", 1)).toBeNull();
    });

    it("uses lastNudgeStage for stage, not content", () => {
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: 1000,
        ownerShip: "~owner",
        content: "Quick ideas for your week", // stage 1 marker
        provider: null,
        model: null,
      });
      const confirmed = confirmNudgeCandidate("default", 3);
      expect(confirmed?.nudgeStage).toBe(3);
    });

    it("carries provider/model from candidate", () => {
      setCandidateSend("default", {
        accountId: "default",
        sessionKey: "sess-1",
        sentAt: 1000,
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
  });
});
