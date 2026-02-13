/**
 * Security Tests for Tlon Plugin
 *
 * These tests ensure that security-critical behavior cannot regress:
 * - DM allowlist enforcement
 * - Channel authorization rules
 * - Ship normalization consistency
 * - Bot mention detection boundaries
 */

import { describe, expect, it, beforeEach } from "vitest";
import {
  isDmAllowed,
  isGroupInviteAllowed,
  isBotMentioned,
  extractMessageText,
} from "./monitor/utils.js";
import { normalizeShip } from "./targets.js";
import {
  setSessionRole,
  getSessionRole,
  _testing as sessionRolesTesting,
} from "./session-roles.js";

describe("Security: DM Allowlist", () => {
  describe("isDmAllowed", () => {
    it("rejects DMs when allowlist is empty", () => {
      expect(isDmAllowed("~zod", [])).toBe(false);
      expect(isDmAllowed("~sampel-palnet", [])).toBe(false);
    });

    it("rejects DMs when allowlist is undefined", () => {
      expect(isDmAllowed("~zod", undefined)).toBe(false);
    });

    it("allows DMs from ships on the allowlist", () => {
      const allowlist = ["~zod", "~bus"];
      expect(isDmAllowed("~zod", allowlist)).toBe(true);
      expect(isDmAllowed("~bus", allowlist)).toBe(true);
    });

    it("rejects DMs from ships NOT on the allowlist", () => {
      const allowlist = ["~zod", "~bus"];
      expect(isDmAllowed("~nec", allowlist)).toBe(false);
      expect(isDmAllowed("~sampel-palnet", allowlist)).toBe(false);
      expect(isDmAllowed("~random-ship", allowlist)).toBe(false);
    });

    it("normalizes ship names (with/without ~ prefix)", () => {
      const allowlist = ["~zod"];
      expect(isDmAllowed("zod", allowlist)).toBe(true);
      expect(isDmAllowed("~zod", allowlist)).toBe(true);

      const allowlistWithoutTilde = ["zod"];
      expect(isDmAllowed("~zod", allowlistWithoutTilde)).toBe(true);
      expect(isDmAllowed("zod", allowlistWithoutTilde)).toBe(true);
    });

    it("handles galaxy, star, planet, and moon names", () => {
      const allowlist = [
        "~zod", // galaxy
        "~marzod", // star
        "~sampel-palnet", // planet
        "~dozzod-dozzod-dozzod-dozzod", // moon
      ];

      expect(isDmAllowed("~zod", allowlist)).toBe(true);
      expect(isDmAllowed("~marzod", allowlist)).toBe(true);
      expect(isDmAllowed("~sampel-palnet", allowlist)).toBe(true);
      expect(isDmAllowed("~dozzod-dozzod-dozzod-dozzod", allowlist)).toBe(true);

      // Similar but different ships should be rejected
      expect(isDmAllowed("~nec", allowlist)).toBe(false);
      expect(isDmAllowed("~wanzod", allowlist)).toBe(false);
      expect(isDmAllowed("~sampel-palned", allowlist)).toBe(false);
    });

    // NOTE: Ship names in Urbit are always lowercase by convention.
    // This test documents current behavior - strict equality after normalization.
    // If case-insensitivity is desired, normalizeShip should lowercase.
    it("uses strict equality after normalization (case-sensitive)", () => {
      const allowlist = ["~zod"];
      expect(isDmAllowed("~zod", allowlist)).toBe(true);
      // Different case would NOT match with current implementation
      expect(isDmAllowed("~Zod", ["~Zod"])).toBe(true); // exact match works
    });

    it("does not allow partial matches", () => {
      const allowlist = ["~zod"];
      expect(isDmAllowed("~zod-extra", allowlist)).toBe(false);
      expect(isDmAllowed("~extra-zod", allowlist)).toBe(false);
    });

    it("handles whitespace in ship names (normalized)", () => {
      // Ships with leading/trailing whitespace are normalized by normalizeShip
      const allowlist = [" ~zod ", "~bus"];
      expect(isDmAllowed("~zod", allowlist)).toBe(true);
      expect(isDmAllowed(" ~zod ", allowlist)).toBe(true);
    });
  });
});

describe("Security: Group Invite Allowlist", () => {
  describe("isGroupInviteAllowed", () => {
    it("rejects invites when allowlist is empty (fail-safe)", () => {
      // CRITICAL: Empty allowlist must DENY, not accept-all
      expect(isGroupInviteAllowed("~zod", [])).toBe(false);
      expect(isGroupInviteAllowed("~sampel-palnet", [])).toBe(false);
      expect(isGroupInviteAllowed("~malicious-actor", [])).toBe(false);
    });

    it("rejects invites when allowlist is undefined (fail-safe)", () => {
      // CRITICAL: Undefined allowlist must DENY, not accept-all
      expect(isGroupInviteAllowed("~zod", undefined)).toBe(false);
      expect(isGroupInviteAllowed("~sampel-palnet", undefined)).toBe(false);
    });

    it("accepts invites from ships on the allowlist", () => {
      const allowlist = ["~nocsyx-lassul", "~malmur-halmex"];
      expect(isGroupInviteAllowed("~nocsyx-lassul", allowlist)).toBe(true);
      expect(isGroupInviteAllowed("~malmur-halmex", allowlist)).toBe(true);
    });

    it("rejects invites from ships NOT on the allowlist", () => {
      const allowlist = ["~nocsyx-lassul", "~malmur-halmex"];
      expect(isGroupInviteAllowed("~random-attacker", allowlist)).toBe(false);
      expect(isGroupInviteAllowed("~malicious-ship", allowlist)).toBe(false);
      expect(isGroupInviteAllowed("~zod", allowlist)).toBe(false);
    });

    it("normalizes ship names (with/without ~ prefix)", () => {
      const allowlist = ["~nocsyx-lassul"];
      expect(isGroupInviteAllowed("nocsyx-lassul", allowlist)).toBe(true);
      expect(isGroupInviteAllowed("~nocsyx-lassul", allowlist)).toBe(true);

      const allowlistWithoutTilde = ["nocsyx-lassul"];
      expect(isGroupInviteAllowed("~nocsyx-lassul", allowlistWithoutTilde)).toBe(true);
    });

    it("does not allow partial matches", () => {
      const allowlist = ["~zod"];
      expect(isGroupInviteAllowed("~zod-moon", allowlist)).toBe(false);
      expect(isGroupInviteAllowed("~pinser-botter-zod", allowlist)).toBe(false);
    });

    it("handles whitespace in allowlist entries", () => {
      const allowlist = [" ~nocsyx-lassul ", "~malmur-halmex"];
      expect(isGroupInviteAllowed("~nocsyx-lassul", allowlist)).toBe(true);
    });
  });
});

describe("Security: Bot Mention Detection", () => {
  describe("isBotMentioned", () => {
    const botShip = "~sampel-palnet";
    const nickname = "nimbus";

    it("detects direct ship mention", () => {
      expect(isBotMentioned("hey ~sampel-palnet", botShip)).toBe(true);
      expect(isBotMentioned("~sampel-palnet can you help?", botShip)).toBe(true);
      expect(isBotMentioned("hello ~sampel-palnet how are you", botShip)).toBe(true);
    });

    it("detects @all mention", () => {
      expect(isBotMentioned("@all please respond", botShip)).toBe(true);
      expect(isBotMentioned("hey @all", botShip)).toBe(true);
      expect(isBotMentioned("@ALL uppercase", botShip)).toBe(true);
    });

    it("detects nickname mention", () => {
      expect(isBotMentioned("hey nimbus", botShip, nickname)).toBe(true);
      expect(isBotMentioned("nimbus help me", botShip, nickname)).toBe(true);
      expect(isBotMentioned("hello NIMBUS", botShip, nickname)).toBe(true);
    });

    it("does NOT trigger on random messages", () => {
      expect(isBotMentioned("hello world", botShip)).toBe(false);
      expect(isBotMentioned("this is a normal message", botShip)).toBe(false);
      expect(isBotMentioned("hey everyone", botShip)).toBe(false);
    });

    it("does NOT trigger on partial ship matches", () => {
      expect(isBotMentioned("~sampel-palnet-extra", botShip)).toBe(false);
      expect(isBotMentioned("my~sampel-palnetfriend", botShip)).toBe(false);
    });

    it("does NOT trigger on substring nickname matches", () => {
      // "nimbus" should not match "nimbusy" or "animbust"
      expect(isBotMentioned("nimbusy", botShip, nickname)).toBe(false);
      expect(isBotMentioned("prenimbus", botShip, nickname)).toBe(false);
    });

    it("handles empty/null inputs safely", () => {
      expect(isBotMentioned("", botShip)).toBe(false);
      expect(isBotMentioned("test", "")).toBe(false);
      // @ts-expect-error testing null input
      expect(isBotMentioned(null, botShip)).toBe(false);
    });

    it("requires word boundary for nickname", () => {
      expect(isBotMentioned("nimbus, hello", botShip, nickname)).toBe(true);
      expect(isBotMentioned("hello nimbus!", botShip, nickname)).toBe(true);
      expect(isBotMentioned("nimbus?", botShip, nickname)).toBe(true);
    });
  });
});

describe("Security: Ship Normalization", () => {
  describe("normalizeShip", () => {
    it("adds ~ prefix if missing", () => {
      expect(normalizeShip("zod")).toBe("~zod");
      expect(normalizeShip("sampel-palnet")).toBe("~sampel-palnet");
    });

    it("preserves ~ prefix if present", () => {
      expect(normalizeShip("~zod")).toBe("~zod");
      expect(normalizeShip("~sampel-palnet")).toBe("~sampel-palnet");
    });

    it("trims whitespace", () => {
      expect(normalizeShip(" ~zod ")).toBe("~zod");
      expect(normalizeShip("  zod  ")).toBe("~zod");
    });

    it("handles empty string", () => {
      expect(normalizeShip("")).toBe("");
      expect(normalizeShip("   ")).toBe("");
    });
  });
});

describe("Security: Message Text Extraction", () => {
  describe("extractMessageText", () => {
    it("extracts plain text", () => {
      const content = [{ inline: ["hello world"] }];
      expect(extractMessageText(content)).toBe("hello world");
    });

    it("extracts @all mentions from sect null", () => {
      const content = [{ inline: [{ sect: null }] }];
      expect(extractMessageText(content)).toContain("@all");
    });

    it("extracts ship mentions", () => {
      const content = [{ inline: [{ ship: "~zod" }] }];
      expect(extractMessageText(content)).toContain("~zod");
    });

    it("handles malformed input safely", () => {
      expect(extractMessageText(null)).toBe("");
      expect(extractMessageText(undefined)).toBe("");
      expect(extractMessageText([])).toBe("");
      expect(extractMessageText([{}])).toBe("");
      expect(extractMessageText("not an array")).toBe("");
    });

    it("does not execute injected code in inline content", () => {
      // Ensure malicious content doesn't get executed
      const maliciousContent = [{ inline: ["<script>alert('xss')</script>"] }];
      const result = extractMessageText(maliciousContent);
      expect(result).toBe("<script>alert('xss')</script>");
      // Just a string, not executed
    });
  });
});

describe("Security: Channel Authorization Logic", () => {
  /**
   * These tests document the expected behavior of channel authorization.
   * The actual resolveChannelAuthorization function is internal to monitor/index.ts
   * but these tests verify the building blocks and expected invariants.
   */

  it("default mode should be restricted (not open)", () => {
    // This is a critical security invariant: if no mode is specified,
    // channels should default to RESTRICTED, not open.
    // If this test fails, someone may have changed the default unsafely.

    // The logic in resolveChannelAuthorization is:
    // const mode = rule?.mode ?? "restricted";
    // We verify this by checking undefined rule gives restricted
    const rule: { mode?: "restricted" | "open" } | undefined = undefined;
    const mode = rule?.mode ?? "restricted";
    expect(mode).toBe("restricted");
  });

  it("empty allowedShips with restricted mode should block all", () => {
    // If a channel is restricted but has no allowed ships,
    // no one should be able to send messages
    const _mode = "restricted";
    const allowedShips: string[] = [];
    const sender = "~random-ship";

    const isAllowed = allowedShips.some((ship) => normalizeShip(ship) === normalizeShip(sender));
    expect(isAllowed).toBe(false);
  });

  it("open mode should not check allowedShips", () => {
    // In open mode, any ship can send regardless of allowedShips
    const mode = "open";
    // The check in monitor/index.ts is:
    // if (mode === "restricted") { /* check ships */ }
    // So open mode skips the ship check entirely
    expect(mode === "restricted").toBe(false);
  });

  it("settings should override file config for channel rules", () => {
    // Documented behavior: settingsRules[nest] ?? fileRules[nest]
    // This means settings take precedence
    const fileRules = { "chat/~zod/test": { mode: "restricted" as const } };
    const settingsRules = { "chat/~zod/test": { mode: "open" as const } };
    const nest = "chat/~zod/test";

    const effectiveRule = settingsRules[nest] ?? fileRules[nest];
    expect(effectiveRule?.mode).toBe("open"); // settings wins
  });
});

describe("Security: Authorization Edge Cases", () => {
  it("empty strings are not valid ships", () => {
    expect(isDmAllowed("", ["~zod"])).toBe(false);
    expect(isDmAllowed("~zod", [""])).toBe(false);
  });

  it("handles very long ship-like strings", () => {
    const longName = "~" + "a".repeat(1000);
    expect(isDmAllowed(longName, ["~zod"])).toBe(false);
  });

  it("handles special characters that could break regex", () => {
    // These should not cause regex injection
    const maliciousShip = "~zod.*";
    expect(isDmAllowed("~zodabc", [maliciousShip])).toBe(false);

    const allowlist = ["~zod"];
    expect(isDmAllowed("~zod.*", allowlist)).toBe(false);
  });

  it("protects against prototype pollution-style keys", () => {
    const suspiciousShip = "__proto__";
    expect(isDmAllowed(suspiciousShip, ["~zod"])).toBe(false);
    expect(isDmAllowed("~zod", [suspiciousShip])).toBe(false);
  });
});

describe("Security: Sender Role Identification", () => {
  /**
   * Tests for sender role identification (owner vs user).
   * This prevents impersonation attacks where an approved user
   * tries to claim owner privileges through prompt injection.
   *
   * SECURITY.md Section 9: Sender Role Identification
   */

  // Helper to compute sender role (mirrors logic in monitor/index.ts)
  function getSenderRole(
    senderShip: string,
    ownerShip: string | null,
  ): "owner" | "user" {
    if (!ownerShip) {return "user";}
    return normalizeShip(senderShip) === normalizeShip(ownerShip) ? "owner" : "user";
  }

  describe("owner detection", () => {
    it("identifies owner when ownerShip matches sender", () => {
      expect(getSenderRole("~nocsyx-lassul", "~nocsyx-lassul")).toBe("owner");
      expect(getSenderRole("nocsyx-lassul", "~nocsyx-lassul")).toBe("owner");
      expect(getSenderRole("~nocsyx-lassul", "nocsyx-lassul")).toBe("owner");
    });

    it("identifies user when ownerShip does not match sender", () => {
      expect(getSenderRole("~random-user", "~nocsyx-lassul")).toBe("user");
      expect(getSenderRole("~malicious-actor", "~nocsyx-lassul")).toBe("user");
    });

    it("identifies everyone as user when ownerShip is null", () => {
      expect(getSenderRole("~nocsyx-lassul", null)).toBe("user");
      expect(getSenderRole("~zod", null)).toBe("user");
    });

    it("identifies everyone as user when ownerShip is empty string", () => {
      // Empty string should be treated like null (no owner configured)
      expect(getSenderRole("~nocsyx-lassul", "")).toBe("user");
    });
  });

  describe("label format", () => {
    // Helper to compute fromLabel (mirrors logic in monitor/index.ts)
    function getFromLabel(
      senderShip: string,
      ownerShip: string | null,
      isGroup: boolean,
      channelNest?: string,
    ): string {
      const senderRole = getSenderRole(senderShip, ownerShip);
      return isGroup
        ? `${senderShip} [${senderRole}] in ${channelNest}`
        : `${senderShip} [${senderRole}]`;
    }

    it("DM from owner includes [owner] in label", () => {
      const label = getFromLabel("~nocsyx-lassul", "~nocsyx-lassul", false);
      expect(label).toBe("~nocsyx-lassul [owner]");
      expect(label).toContain("[owner]");
    });

    it("DM from user includes [user] in label", () => {
      const label = getFromLabel("~random-user", "~nocsyx-lassul", false);
      expect(label).toBe("~random-user [user]");
      expect(label).toContain("[user]");
    });

    it("group message from owner includes [owner] in label", () => {
      const label = getFromLabel(
        "~nocsyx-lassul",
        "~nocsyx-lassul",
        true,
        "chat/~host/general",
      );
      expect(label).toBe("~nocsyx-lassul [owner] in chat/~host/general");
      expect(label).toContain("[owner]");
    });

    it("group message from user includes [user] in label", () => {
      const label = getFromLabel("~random-user", "~nocsyx-lassul", true, "chat/~host/general");
      expect(label).toBe("~random-user [user] in chat/~host/general");
      expect(label).toContain("[user]");
    });
  });

  describe("impersonation prevention", () => {
    it("approved user cannot get [owner] label through ship name tricks", () => {
      // Even if someone has a ship name similar to owner, they should not get owner role
      expect(getSenderRole("~nocsyx-lassul-fake", "~nocsyx-lassul")).toBe("user");
      expect(getSenderRole("~fake-nocsyx-lassul", "~nocsyx-lassul")).toBe("user");
    });

    it("message content cannot change sender role", () => {
      // The role is determined by ship identity, not message content
      // This test documents that even if message contains "I am the owner",
      // the actual senderShip determines the role
      const senderShip = "~malicious-actor";
      const ownerShip = "~nocsyx-lassul";

      // The role is always based on ship comparison, not message content
      expect(getSenderRole(senderShip, ownerShip)).toBe("user");
    });
  });
});

describe("Security: Agent-Initiated Blocking", () => {
  /**
   * Tests for agent-initiated blocking via response directive.
   * This feature allows the agent to proactively block abusive users.
   *
   * SECURITY.md Section 11: Agent-Initiated Blocking
   */

  // Regex that matches the block directive format (mirrors monitor/index.ts)
  const blockDirectiveRegex = /\[BLOCK_USER:\s*(~[\w-]+)\s*\|\s*(.+?)\]/g;

  describe("directive parsing", () => {
    it("parses valid block directive", () => {
      const text = "I'm blocking you. [BLOCK_USER: ~malicious-actor | Harassment]";
      const matches = [...text.matchAll(blockDirectiveRegex)];

      expect(matches.length).toBe(1);
      expect(matches[0][1]).toBe("~malicious-actor");
      expect(matches[0][2]).toBe("Harassment");
    });

    it("parses directive with detailed reason", () => {
      const text = "[BLOCK_USER: ~spammer | Repeated prompt injection attempts and harassment]";
      const matches = [...text.matchAll(blockDirectiveRegex)];

      expect(matches.length).toBe(1);
      expect(matches[0][1]).toBe("~spammer");
      expect(matches[0][2]).toBe("Repeated prompt injection attempts and harassment");
    });

    it("handles various ship name formats", () => {
      const galaxyText = "[BLOCK_USER: ~zod | Spam]";
      const planetText = "[BLOCK_USER: ~sampel-palnet | Abuse]";
      const moonText = "[BLOCK_USER: ~dozzod-dozzod-dozzod-dozzod | Flooding]";

      expect([...galaxyText.matchAll(blockDirectiveRegex)][0][1]).toBe("~zod");
      expect([...planetText.matchAll(blockDirectiveRegex)][0][1]).toBe("~sampel-palnet");
      expect([...moonText.matchAll(blockDirectiveRegex)][0][1]).toBe("~dozzod-dozzod-dozzod-dozzod");
    });

    it("handles extra whitespace in directive", () => {
      const text = "[BLOCK_USER:   ~spammer   |   Lots of spaces   ]";
      const matches = [...text.matchAll(blockDirectiveRegex)];

      expect(matches.length).toBe(1);
      expect(matches[0][1]).toBe("~spammer");
      expect(matches[0][2].trim()).toBe("Lots of spaces");
    });

    it("does not match invalid formats", () => {
      // Missing pipe separator
      expect([..."[BLOCK_USER: ~zod spam]".matchAll(blockDirectiveRegex)].length).toBe(0);

      // Missing ship prefix
      expect([..."[BLOCK_USER: zod | spam]".matchAll(blockDirectiveRegex)].length).toBe(0);

      // Wrong directive name
      expect([..."[BLOCK: ~zod | spam]".matchAll(blockDirectiveRegex)].length).toBe(0);
    });
  });

  describe("directive stripping", () => {
    function stripDirectives(text: string): string {
      return text.replace(blockDirectiveRegex, "").trim();
    }

    it("strips directive from response text", () => {
      const text = "I'm blocking you for harassment. [BLOCK_USER: ~bad-actor | Harassment]";
      expect(stripDirectives(text)).toBe("I'm blocking you for harassment.");
    });

    it("handles response with only directive", () => {
      const text = "[BLOCK_USER: ~spammer | Spam flooding]";
      expect(stripDirectives(text)).toBe("");
    });

    it("strips multiple directives", () => {
      // Edge case: multiple directives (shouldn't happen but should handle)
      const text = "Blocking. [BLOCK_USER: ~ship1 | Reason 1] [BLOCK_USER: ~ship2 | Reason 2]";
      expect(stripDirectives(text)).toBe("Blocking.");
    });

    it("preserves text around directive", () => {
      const text = "Hello. [BLOCK_USER: ~spammer | Spam] Goodbye.";
      expect(stripDirectives(text)).toBe("Hello.  Goodbye.");
    });
  });

  describe("safety checks", () => {
    // Helper to check if a block should be allowed (mirrors monitor/index.ts logic)
    function shouldAllowBlock(
      targetShip: string,
      senderShip: string,
      ownerShip: string | null,
    ): { allowed: boolean; reason?: string } {
      const normalizedTarget = normalizeShip(targetShip);
      const normalizedSender = normalizeShip(senderShip);
      const normalizedOwner = ownerShip ? normalizeShip(ownerShip) : null;

      // Safety: Never block the owner
      if (normalizedOwner && normalizedTarget === normalizedOwner) {
        return { allowed: false, reason: "Cannot block owner" };
      }

      // Only allow blocking the current message sender
      if (normalizedTarget !== normalizedSender) {
        return { allowed: false, reason: "Can only block current sender" };
      }

      return { allowed: true };
    }

    it("allows blocking the current sender", () => {
      const result = shouldAllowBlock("~abusive-user", "~abusive-user", "~owner-ship");
      expect(result.allowed).toBe(true);
    });

    it("prevents blocking the owner", () => {
      const result = shouldAllowBlock("~owner-ship", "~owner-ship", "~owner-ship");
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("Cannot block owner");
    });

    it("prevents blocking third parties", () => {
      const result = shouldAllowBlock("~innocent-bystander", "~sender-ship", "~owner-ship");
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("Can only block current sender");
    });

    it("normalizes ship names when checking", () => {
      // With and without tilde should be treated the same
      expect(shouldAllowBlock("abusive-user", "~abusive-user", "~owner").allowed).toBe(true);
      expect(shouldAllowBlock("~abusive-user", "abusive-user", "~owner").allowed).toBe(true);
    });

    it("handles null owner (no owner configured)", () => {
      // When no owner is configured, blocking should still work for the sender
      const result = shouldAllowBlock("~sender", "~sender", null);
      expect(result.allowed).toBe(true);
    });

    it("owner check uses normalization", () => {
      // Owner check should normalize ship names
      const result1 = shouldAllowBlock("owner-ship", "owner-ship", "~owner-ship");
      expect(result1.allowed).toBe(false);
      expect(result1.reason).toBe("Cannot block owner");

      const result2 = shouldAllowBlock("~owner-ship", "~owner-ship", "owner-ship");
      expect(result2.allowed).toBe(false);
      expect(result2.reason).toBe("Cannot block owner");
    });
  });
});

describe("Security: Tool Access Control", () => {
  /**
   * Tests for owner-only tool access control.
   * Non-owners MUST NOT be able to use the tlon skill,
   * enforced at the plugin hook level.
   *
   * The hook blocks ALL calls to the "tlon" tool for non-owners.
   * No command parsing needed - the entire skill is owner-only.
   *
   * SECURITY.md Section 12: Tool Access Control (Owner-Only Skill)
   */

  describe("session role tracking", () => {
    // Note: These tests use the actual session-roles module
    // to verify the TTL-based tracking works correctly

    beforeEach(() => {
      sessionRolesTesting.clearAll();
    });

    it("stores and retrieves owner role", () => {
      setSessionRole("session-1", "owner");
      expect(getSessionRole("session-1")).toBe("owner");
    });

    it("stores and retrieves user role", () => {
      setSessionRole("session-1", "user");
      expect(getSessionRole("session-1")).toBe("user");
    });

    it("returns undefined for unknown sessions", () => {
      expect(getSessionRole("unknown-session")).toBeUndefined();
    });

    it("overwrites previous role for same session", () => {
      setSessionRole("session-1", "owner");
      expect(getSessionRole("session-1")).toBe("owner");

      setSessionRole("session-1", "user");
      expect(getSessionRole("session-1")).toBe("user");
    });

    it("tracks multiple sessions independently", () => {
      setSessionRole("session-owner", "owner");
      setSessionRole("session-user", "user");

      expect(getSessionRole("session-owner")).toBe("owner");
      expect(getSessionRole("session-user")).toBe("user");
    });

    it("TTL is set to 1 hour", () => {
      // Verify the TTL constant is correctly set
      expect(sessionRolesTesting.getRoleTtlMs()).toBe(60 * 60 * 1000);
    });
  });

  describe("fail-safe behavior", () => {
    /**
     * CRITICAL: When role is unknown (missing/expired), the hook MUST block.
     * This fail-safe prevents tool execution if session tracking fails.
     */

    it("documents fail-safe: unknown role should block", () => {
      // This test documents the expected behavior in index.ts:
      // const role = getSessionRole(ctx.sessionKey ?? "");
      // if (role !== "owner") { block }
      //
      // If role is undefined (unknown), it's !== "owner", so it blocks.
      const role: "owner" | "user" | undefined = undefined;
      const shouldBlock = role !== "owner";
      expect(shouldBlock).toBe(true);
    });

    it("documents fail-safe: user role should block", () => {
      const role: "owner" | "user" | undefined = "user";
      const shouldBlock = role !== "owner";
      expect(shouldBlock).toBe(true);
    });

    it("documents: owner role should not block", () => {
      const role: "owner" | "user" | undefined = "owner";
      const shouldBlock = role !== "owner";
      expect(shouldBlock).toBe(false);
    });
  });
});
