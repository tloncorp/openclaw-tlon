/**
 * Security Integration Tests
 *
 * Tests security features that protect the bot:
 * - Tool access control (owner can use restricted tools, non-owner blocked)
 * - Slash commands for block management (/banned, /unban)
 * - Blocked ships cannot DM the bot (Urbit-level blocking)
 *
 * TEST ENVIRONMENT:
 *   ~zod = bot ship
 *   ~ten = test user (configured as ownerShip)
 *   ~mug = third-party ship (non-owner, for security tests)
 */
import { describe, test, expect, beforeAll } from "vitest";
import { getFixtures, waitFor, requireThirdParty, type TestFixtures } from "../lib/index.js";

describe("security", () => {
  let fixtures: TestFixtures;

  beforeAll(async () => {
    fixtures = await getFixtures();
  }, 180_000);

  /**
   * Extract nickname from a contacts /v1/self scry result.
   * Handles both string and { value: string } shapes.
   */
  function extractNickname(profile: Record<string, unknown> | undefined): string {
    const p = (profile ?? {}) as {
      nickname?: string | { value?: string | null } | null;
      nickName?: string | { value?: string | null } | null;
    };
    const fromField =
      typeof p.nickname === "string"
        ? p.nickname
        : (p.nickname as { value?: string | null } | null | undefined)?.value;
    const fromAlt =
      typeof p.nickName === "string"
        ? p.nickName
        : (p.nickName as { value?: string | null } | null | undefined)?.value;
    return fromField ?? fromAlt ?? "";
  }

  /**
   * Query the bot's blocked ship list via direct scry.
   */
  async function getBlockedShips(): Promise<string[]> {
    const raw = await fixtures.botState.scry<string[]>("chat", "/blocked");
    return Array.isArray(raw) ? raw : [];
  }

  // =========================================================================
  // 1. Tool Access Control
  // =========================================================================

  describe("tool access control", () => {
    test("owner can use the tlon tool", async () => {
      // Owner (~ten) asks the bot to update its profile nickname via the tlon tool.
      // If before_tool_call blocked the owner, the tool wouldn't execute and
      // the nickname would never change on the bot ship.
      const nicknameToken = `sec-${Date.now().toString(36)}`;
      const prompt = `Use the tlon tool to update your profile nickname to exactly "${nicknameToken}" and confirm when done.`;
      console.log(`\n[TEST] Sending prompt: "${prompt}"`);

      const response = await fixtures.client.prompt(prompt);
      console.log(`[TEST] Response success: ${response.success}`);
      console.log(`[TEST] Response text: ${response.text?.slice(0, 300)}`);

      if (!response.success) {
        throw new Error(response.error ?? "Prompt failed");
      }

      // Verify the nickname actually changed on the bot ship via scry.
      // This proves the tlon tool was invoked, not just that the LLM replied.
      console.log(`[TEST] Waiting for bot nickname to be "${nicknameToken}"...`);
      const updated = await waitFor(async () => {
        const selfProfile = await fixtures.botState.scry<Record<string, unknown>>(
          "contacts",
          "/v1/self",
        );
        const currentNickname = extractNickname(selfProfile);
        console.log(`[TEST] Current bot nickname: "${currentNickname}"`);
        return currentNickname === nicknameToken ? true : undefined;
      }, 30_000);

      expect(updated).toBe(true);
    });

    test("non-owner cannot use restricted tools", async () => {
      requireThirdParty(fixtures);

      // Snapshot current bot nickname via scry
      const beforeProfile = await fixtures.botState.scry<Record<string, unknown>>(
        "contacts",
        "/v1/self",
      );
      const beforeNickname = extractNickname(beforeProfile);
      console.log(`\n[TEST] Bot nickname before: "${beforeNickname}"`);

      // ~mug (non-owner) asks bot to update nickname via tlon tool.
      // before_tool_call should block the tlon tool for non-owners.
      const token = `mug-${Date.now().toString(36)}`;
      const prompt = `Use the tlon tool to update your profile nickname to exactly "${token}" and confirm when done.`;
      console.log(`[TEST] Sending prompt as ${fixtures.thirdPartyShip}: "${prompt}"`);

      // LLM processing for non-owner can be slow (tool attempt, blocked, retry/explain)
      const response = await fixtures.thirdPartyClient.prompt(prompt, { timeoutMs: 90_000 });
      console.log(`[TEST] Response success: ${response.success}`);
      console.log(`[TEST] Response text: ${response.text?.slice(0, 300)}`);

      // Bot should respond (DMs work). We don't assert on the response text because
      // the LLM's phrasing is non-deterministic — the real test is the scry below.
      expect(response.success).toBe(true);

      // Verify nickname did NOT change (proves tool was actually blocked)
      const afterProfile = await fixtures.botState.scry<Record<string, unknown>>(
        "contacts",
        "/v1/self",
      );
      const afterNickname = extractNickname(afterProfile);
      console.log(`[TEST] Bot nickname after: "${afterNickname}"`);
      expect(afterNickname).not.toBe(token);
    });
  });

  // =========================================================================
  // 2. Slash Commands: Block Management
  // =========================================================================

  describe("slash commands: block management", () => {
    test("'/banned' command lists blocked ships", async () => {
      // Block ~nec so the list isn't empty
      console.log("\n[TEST] Blocking ~nec...");
      await fixtures.botState.poke({
        app: "chat",
        mark: "chat-block-ship",
        json: { ship: "~nec" },
      });
      await new Promise((resolve) => setTimeout(resolve, 3000));

      try {
        const response = await fixtures.client.prompt("/banned");
        console.log(`[TEST] Response: ${response.text?.slice(0, 500)}`);

        if (!response.success) {
          throw new Error(response.error ?? "/banned command failed");
        }

        // Response should contain the blocked ship
        expect(response.text ?? "").toContain("~nec");
      } finally {
        // Always clean up the block
        await fixtures.botState.poke({
          app: "chat",
          mark: "chat-unblock-ship",
          json: { ship: "~nec" },
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    });

    test("'/unban ~ship' removes a blocked ship", async () => {
      // Block ~nec, then unban via slash command
      console.log("\n[TEST] Blocking ~nec for unban test...");
      await fixtures.botState.poke({
        app: "chat",
        mark: "chat-block-ship",
        json: { ship: "~nec" },
      });
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Verify block is active via scry
      const blockedBefore = await getBlockedShips();
      console.log(`[TEST] Blocked ships before: ${JSON.stringify(blockedBefore)}`);
      expect(blockedBefore).toContain("~nec");

      // Send /unban command
      const response = await fixtures.client.prompt("/unban ~nec");
      console.log(`[TEST] Response: ${response.text?.slice(0, 500)}`);

      if (!response.success) {
        // Clean up in case of failure
        await fixtures.botState.poke({
          app: "chat",
          mark: "chat-unblock-ship",
          json: { ship: "~nec" },
        });
        throw new Error(response.error ?? "/unban command failed");
      }

      // Verify unblock via scry
      const blockedAfter = await getBlockedShips();
      console.log(`[TEST] Blocked ships after: ${JSON.stringify(blockedAfter)}`);
      expect(blockedAfter).not.toContain("~nec");
    });

    test("'/unban ~ship' reports when ship is not blocked", async () => {
      // Owner sends /unban ~wanzod for a ship that's not blocked
      const response = await fixtures.client.prompt("/unban ~wanzod");
      console.log(`\n[TEST] Response: ${response.text?.slice(0, 500)}`);

      if (!response.success) {
        throw new Error(response.error ?? "Prompt failed");
      }

      // Response should indicate the ship is not blocked
      expect(response.text?.toLowerCase() ?? "").toContain("not blocked");
    });
  });

  // =========================================================================
  // 3. Blocking (Requires 3rd Ship)
  // =========================================================================

  describe("blocking", () => {
    test("blocked non-owner DMs are silently ignored", async () => {
      requireThirdParty(fixtures);

      // Block ~mug via direct poke (Urbit-level block — chat agent drops messages)
      console.log(`\n[TEST] Blocking ${fixtures.thirdPartyShip}...`);
      await fixtures.botState.poke({
        app: "chat",
        mark: "chat-block-ship",
        json: { ship: fixtures.thirdPartyShip },
      });
      await new Promise((resolve) => setTimeout(resolve, 3000));

      try {
        // ~mug sends DM — the Urbit chat agent should silently drop it
        console.log(`[TEST] Sending DM as blocked ${fixtures.thirdPartyShip}...`);
        const response = await fixtures.thirdPartyClient.prompt(
          "Are you there? Please respond.",
          { timeoutMs: 20_000 },
        );

        console.log(`[TEST] Response success: ${response.success}`);
        console.log(`[TEST] Response error: ${response.error}`);

        // Bot should NOT respond — message never reached the SSE stream
        expect(response.success).toBe(false);
      } finally {
        // Always unblock to restore DM access for subsequent tests
        console.log(`[TEST] Unblocking ${fixtures.thirdPartyShip}...`);
        await fixtures.botState.poke({
          app: "chat",
          mark: "chat-unblock-ship",
          json: { ship: fixtures.thirdPartyShip },
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    });

    test.skip("agent blocks abusive non-owner via [BLOCK_USER] directive", () => {
      // Cannot test reliably: depends on LLM spontaneously generating
      // [BLOCK_USER: ~ship | reason] in response to abusive input.
    });
  });

  // =========================================================================
  // 4. DM Allowlist Authorization
  // =========================================================================

  describe("DM allowlist authorization", () => {
    /**
     * Seed the bot's dmAllowlist in the settings store via direct poke.
     */
    async function seedDmAllowlist(ships: string[]): Promise<void> {
      await fixtures.botState.poke({
        app: "settings",
        mark: "settings-event",
        json: {
          "put-entry": {
            desk: "moltbot",
            "bucket-key": "tlon",
            "entry-key": "dmAllowlist",
            value: ships,
          },
        },
      });
      // Give the settings subscription time to propagate
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    /**
     * Read dmAllowlist from bot's settings store via scry.
     */
    async function getDmAllowlist(): Promise<string[]> {
      const raw = await fixtures.botState.scry<{
        all?: Record<string, Record<string, { dmAllowlist?: string[] }>>;
      }>("settings", "/all");
      return raw?.all?.moltbot?.tlon?.dmAllowlist ?? [];
    }

    test("blocked ship on allowlist is still blocked (Urbit-level)", async () => {
      requireThirdParty(fixtures);

      // Ensure the third party ship is on the allowlist
      const currentList = await getDmAllowlist();
      if (!currentList.includes(fixtures.thirdPartyShip)) {
        await seedDmAllowlist([...currentList, fixtures.thirdPartyShip]);
      }

      // Block the ship via Tlon's native blocking
      // Urbit's chat agent drops messages from blocked ships at the protocol
      // level, so the message never reaches the bot's SSE stream — regardless
      // of the allowlist state.
      console.log(`\n[TEST] Blocking ${fixtures.thirdPartyShip} (while on allowlist)...`);
      await fixtures.botState.poke({
        app: "chat",
        mark: "chat-block-ship",
        json: { ship: fixtures.thirdPartyShip },
      });
      await new Promise((resolve) => setTimeout(resolve, 3000));

      try {
        // Third party sends DM — Urbit drops it before it reaches the bot
        console.log(`[TEST] Sending DM as blocked+allowlisted ${fixtures.thirdPartyShip}...`);
        const response = await fixtures.thirdPartyClient.prompt(
          "Testing blocked ship on allowlist. Please respond.",
          { timeoutMs: 20_000 },
        );

        console.log(`[TEST] Response success: ${response.success}`);
        console.log(`[TEST] Response error: ${response.error}`);

        expect(response.success).toBe(false);
      } finally {
        // Clean up: unblock the ship
        console.log(`[TEST] Unblocking ${fixtures.thirdPartyShip}...`);
        await fixtures.botState.poke({
          app: "chat",
          mark: "chat-unblock-ship",
          json: { ship: fixtures.thirdPartyShip },
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    });

    test("emoji reaction on notification approves DM request", async () => {
      requireThirdParty(fixtures);

      // 1. Remove third party from DM allowlist so their next DM triggers approval
      const currentList = await getDmAllowlist();
      if (currentList.includes(fixtures.thirdPartyShip)) {
        await seedDmAllowlist(currentList.filter((s) => s !== fixtures.thirdPartyShip));
        console.log(`\n[TEST] Removed ${fixtures.thirdPartyShip} from DM allowlist`);
      }

      // 2. Third party sends DM — should trigger an approval request to owner
      console.log(`[TEST] ${fixtures.thirdPartyShip} sending DM to trigger approval...`);
      const dmPromise = fixtures.thirdPartyClient.prompt(
        "Hello, requesting approval via reaction test.",
        { timeoutMs: 90_000 },
      );

      // 3. Wait for pending approval with notificationMessageId to appear
      console.log("[TEST] Waiting for pending approval with notification message ID...");
      const approval = await waitFor(async () => {
        const settings = await fixtures.botState.scry<{
          all?: Record<string, Record<string, { pendingApprovals?: string }>>;
        }>("settings", "/all");
        const raw = settings?.all?.moltbot?.tlon?.pendingApprovals;
        if (!raw) return undefined;
        const approvals = JSON.parse(raw) as Array<{
          id: string;
          requestingShip: string;
          notificationMessageId?: string;
        }>;
        const match = approvals.find(
          (a) => a.requestingShip === fixtures.thirdPartyShip && a.notificationMessageId,
        );
        if (match) {
          console.log(`[TEST] Found pending approval #${match.id} with notif ID: ${match.notificationMessageId}`);
        }
        return match;
      }, 30_000, 2000, "pending approval with notificationMessageId");

      // 4. Find the notification message in owner's DM channel with the bot
      // We need the post in writ-id format (~ship/ud-timestamp) for the react poke
      console.log("[TEST] Looking up notification message in owner's DMs...");
      const posts = await fixtures.userState.channelPosts(fixtures.botShip, 10);
      const botPosts = (posts ?? [])
        .filter((p: any) => {
          const authorId = p.authorId ?? p.author;
          return authorId === fixtures.botShip;
        })
        .sort((a: any, b: any) => (b.sentAt ?? 0) - (a.sentAt ?? 0));

      // The most recent bot post should be the approval notification
      const notifPost = botPosts[0] as { id?: string; sentAt?: number } | undefined;
      expect(notifPost).toBeDefined();
      console.log(`[TEST] Notification post ID: ${notifPost!.id}, sentAt: ${notifPost!.sentAt}`);

      // 5. Owner reacts 👍 to the notification message
      // The react poke goes to the owner's own chat agent, which relays via Ames
      const postId = String(notifPost!.id);
      // Construct writ-id: author/id — the chatAction format requires this
      const writId = postId.includes("/") ? postId : `${fixtures.botShip}/${postId}`;
      console.log(`[TEST] Owner reacting 👍 to message ${writId}...`);

      await fixtures.userState.poke({
        app: "chat",
        mark: "chat-dm-action-1",
        json: {
          ship: fixtures.botShip,
          diff: {
            id: writId,
            delta: {
              "add-react": {
                react: "👍",
                author: fixtures.userShip,
              },
            },
          },
        },
      });

      // 6. Wait for the approval to be processed (removed from pending)
      // Give ames time to relay the reaction from ~ten → ~zod
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("[TEST] Waiting for approval to be processed...");
      await waitFor(async () => {
        const settings = await fixtures.botState.scry<{
          all?: Record<string, Record<string, { pendingApprovals?: string }>>;
        }>("settings", "/all");
        const raw = settings?.all?.moltbot?.tlon?.pendingApprovals;
        if (!raw) return true; // No approvals = processed
        const approvals = JSON.parse(raw) as Array<{ requestingShip: string }>;
        const still = approvals.find((a) => a.requestingShip === fixtures.thirdPartyShip);
        if (!still) {
          console.log("[TEST] Approval processed — no longer pending");
          return true;
        }
        return undefined;
      }, 40_000, 2000, "approval to be processed");

      // 7. Verify the third party is now on the DM allowlist
      const updatedList = await getDmAllowlist();
      console.log(`[TEST] DM allowlist after reaction: ${JSON.stringify(updatedList)}`);
      expect(updatedList).toContain(fixtures.thirdPartyShip);

      // Wait for the third party's original DM to complete
      try {
        await dmPromise;
      } catch {
        // OK if it times out — the approval replay might not produce a response
      }
    }, 120_000);

    test("deny reaction removes pending approval without allowlisting or blocking", async () => {
      requireThirdParty(fixtures);

      // 1. Ensure third party is not blocked and not on the allowlist
      try {
        await fixtures.botState.poke({
          app: "chat",
          mark: "chat-unblock-ship",
          json: { ship: fixtures.thirdPartyShip },
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch {
        // Ignore if ship was not blocked
      }

      const currentList = await getDmAllowlist();
      if (currentList.includes(fixtures.thirdPartyShip)) {
        await seedDmAllowlist(currentList.filter((s) => s !== fixtures.thirdPartyShip));
        console.log(`\n[TEST] Removed ${fixtures.thirdPartyShip} from DM allowlist`);
      }

      // 2. Third party sends DM — should trigger an approval request to owner
      console.log(`[TEST] ${fixtures.thirdPartyShip} sending DM to trigger deny reaction...`);
      const dmPromise = fixtures.thirdPartyClient.prompt(
        "Hello, requesting denial via reaction test.",
        { timeoutMs: 30_000 },
      );

      // 3. Wait for pending approval with notificationMessageId
      console.log("[TEST] Waiting for pending approval with notification message ID...");
      await waitFor(async () => {
        const settings = await fixtures.botState.scry<{
          all?: Record<string, Record<string, { pendingApprovals?: string }>>;
        }>("settings", "/all");
        const raw = settings?.all?.moltbot?.tlon?.pendingApprovals;
        if (!raw) return undefined;
        const approvals = JSON.parse(raw) as Array<{
          id: string;
          requestingShip: string;
          notificationMessageId?: string;
        }>;
        return approvals.find(
          (a) => a.requestingShip === fixtures.thirdPartyShip && a.notificationMessageId,
        );
      }, 30_000, 2000, "pending approval with notificationMessageId");

      // 4. Find notification message and react 👎
      console.log("[TEST] Looking up notification message in owner's DMs...");
      const posts = await fixtures.userState.channelPosts(fixtures.botShip, 10);
      const botPosts = (posts ?? [])
        .filter((p: any) => {
          const authorId = p.authorId ?? p.author;
          return authorId === fixtures.botShip;
        })
        .sort((a: any, b: any) => (b.sentAt ?? 0) - (a.sentAt ?? 0));

      const notifPost = botPosts[0] as { id?: string; sentAt?: number } | undefined;
      expect(notifPost).toBeDefined();
      console.log(`[TEST] Notification post ID: ${notifPost!.id}, sentAt: ${notifPost!.sentAt}`);

      const postId = String(notifPost!.id);
      const writId = postId.includes("/") ? postId : `${fixtures.botShip}/${postId}`;
      console.log(`[TEST] Owner reacting 👎 to message ${writId}...`);

      await fixtures.userState.poke({
        app: "chat",
        mark: "chat-dm-action-1",
        json: {
          ship: fixtures.botShip,
          diff: {
            id: writId,
            delta: {
              "add-react": {
                react: "👎",
                author: fixtures.userShip,
              },
            },
          },
        },
      });

      // 5. Wait for approval to be processed (removed from pending)
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("[TEST] Waiting for denial to be processed...");
      await waitFor(async () => {
        const settings = await fixtures.botState.scry<{
          all?: Record<string, Record<string, { pendingApprovals?: string }>>;
        }>("settings", "/all");
        const raw = settings?.all?.moltbot?.tlon?.pendingApprovals;
        if (!raw) return true;
        const approvals = JSON.parse(raw) as Array<{ requestingShip: string }>;
        return approvals.find((a) => a.requestingShip === fixtures.thirdPartyShip) ? undefined : true;
      }, 40_000, 2000, "deny approval to be processed");

      // 6. Verify ship was not allowlisted
      const updatedList = await getDmAllowlist();
      console.log(`[TEST] DM allowlist after deny: ${JSON.stringify(updatedList)}`);
      expect(updatedList).not.toContain(fixtures.thirdPartyShip);

      // 7. Verify ship was not blocked
      const blockedList = await fixtures.botState.scry<string[]>("chat", "/blocked");
      console.log(`[TEST] Blocked ships after deny: ${JSON.stringify(blockedList)}`);
      expect(Array.isArray(blockedList) ? blockedList : []).not.toContain(fixtures.thirdPartyShip);

      // 8. Original DM should not be replayed
      try {
        await dmPromise;
      } catch {
        // Timeout is expected: deny should remove pending approval without sending a response
      }

      // Clean up: restore allowlist baseline for later tests
      const cleanList = await getDmAllowlist();
      if (!cleanList.includes(fixtures.thirdPartyShip)) {
        await seedDmAllowlist([...cleanList, fixtures.thirdPartyShip]);
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }, 120_000);

    test("removing ship from allowlist triggers approval instead of response", async () => {
      requireThirdParty(fixtures);

      // 1. Ensure third party IS on the allowlist
      const currentList = await getDmAllowlist();
      if (!currentList.includes(fixtures.thirdPartyShip)) {
        await seedDmAllowlist([...currentList, fixtures.thirdPartyShip]);
        console.log(`\n[TEST] Added ${fixtures.thirdPartyShip} to DM allowlist`);
      }

      // 2. Remove third party from allowlist via settings poke
      const listBefore = await getDmAllowlist();
      await seedDmAllowlist(listBefore.filter((s) => s !== fixtures.thirdPartyShip));
      console.log(`[TEST] Removed ${fixtures.thirdPartyShip} from DM allowlist`);

      // 3. Third party sends DM — should trigger approval, not a bot response
      console.log(`[TEST] ${fixtures.thirdPartyShip} sending DM (should trigger approval)...`);
      const dmPromise = fixtures.thirdPartyClient.prompt(
        "Hello after allowlist removal test.",
        { timeoutMs: 30_000 },
      );

      // 4. Wait for a pending approval to appear for this ship
      const approval = await waitFor(async () => {
        const settings = await fixtures.botState.scry<{
          all?: Record<string, Record<string, { pendingApprovals?: string }>>;
        }>("settings", "/all");
        const raw = settings?.all?.moltbot?.tlon?.pendingApprovals;
        if (!raw) return undefined;
        const approvals = JSON.parse(raw) as Array<{
          id: string;
          requestingShip: string;
        }>;
        return approvals.find((a) => a.requestingShip === fixtures.thirdPartyShip);
      }, 30_000, 2000, "pending approval after allowlist removal");

      expect(approval).toBeDefined();
      console.log(`[TEST] Approval created: #${approval!.id} — allowlist removal propagated correctly`);

      // Clean up: re-add to allowlist and clear pending approvals
      const afterList = await getDmAllowlist();
      if (!afterList.includes(fixtures.thirdPartyShip)) {
        await seedDmAllowlist([...afterList, fixtures.thirdPartyShip]);
      }
      // Clear the pending approval so it doesn't interfere with later tests
      await fixtures.botState.poke({
        app: "settings",
        mark: "settings-event",
        json: {
          "put-entry": {
            desk: "moltbot",
            "bucket-key": "tlon",
            "entry-key": "pendingApprovals",
            value: "[]",
          },
        },
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try { await dmPromise; } catch { /* timeout OK */ }
    }, 90_000);

    test("block reaction removes ship from allowlist", async () => {
      requireThirdParty(fixtures);

      // 1. Ensure third party is on the allowlist but not blocked
      const currentList = await getDmAllowlist();
      if (!currentList.includes(fixtures.thirdPartyShip)) {
        await seedDmAllowlist([...currentList, fixtures.thirdPartyShip]);
        console.log(`\n[TEST] Added ${fixtures.thirdPartyShip} to DM allowlist`);
      }

      // 2. Remove from allowlist to trigger approval flow
      const listBefore = await getDmAllowlist();
      await seedDmAllowlist(listBefore.filter((s) => s !== fixtures.thirdPartyShip));
      console.log(`[TEST] Removed ${fixtures.thirdPartyShip} from allowlist to trigger approval`);

      // 3. Third party sends DM — triggers approval
      console.log(`[TEST] ${fixtures.thirdPartyShip} sending DM to trigger approval...`);
      const dmPromise = fixtures.thirdPartyClient.prompt(
        "Hello, testing block reaction.",
        { timeoutMs: 90_000 },
      );

      // 4. Wait for pending approval with notificationMessageId
      await waitFor(async () => {
        const settings = await fixtures.botState.scry<{
          all?: Record<string, Record<string, { pendingApprovals?: string }>>;
        }>("settings", "/all");
        const raw = settings?.all?.moltbot?.tlon?.pendingApprovals;
        if (!raw) return undefined;
        const approvals = JSON.parse(raw) as Array<{
          id: string;
          requestingShip: string;
          notificationMessageId?: string;
        }>;
        return approvals.find(
          (a) => a.requestingShip === fixtures.thirdPartyShip && a.notificationMessageId,
        );
      }, 30_000, 2000, "pending approval with notificationMessageId");

      // 5. Find notification message and react 🛑 (block)
      const posts = await fixtures.userState.channelPosts(fixtures.botShip, 10);
      const botPosts = (posts ?? [])
        .filter((p: any) => {
          const authorId = p.authorId ?? p.author;
          return authorId === fixtures.botShip;
        })
        .sort((a: any, b: any) => (b.sentAt ?? 0) - (a.sentAt ?? 0));

      const notifPost = botPosts[0] as { id?: string } | undefined;
      expect(notifPost).toBeDefined();

      const postId = String(notifPost!.id);
      const writId = postId.includes("/") ? postId : `${fixtures.botShip}/${postId}`;
      console.log(`[TEST] Owner reacting 🛑 to message ${writId}...`);

      await fixtures.userState.poke({
        app: "chat",
        mark: "chat-dm-action-1",
        json: {
          ship: fixtures.botShip,
          diff: {
            id: writId,
            delta: {
              "add-react": {
                react: "🛑",
                author: fixtures.userShip,
              },
            },
          },
        },
      });

      // 6. Wait for approval to be processed
      // Give ames time to relay the reaction from ~ten → ~zod
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await waitFor(async () => {
        const settings = await fixtures.botState.scry<{
          all?: Record<string, Record<string, { pendingApprovals?: string }>>;
        }>("settings", "/all");
        const raw = settings?.all?.moltbot?.tlon?.pendingApprovals;
        if (!raw) return true;
        const approvals = JSON.parse(raw) as Array<{ requestingShip: string }>;
        return approvals.find((a) => a.requestingShip === fixtures.thirdPartyShip) ? undefined : true;
      }, 40_000, 2000, "block approval to be processed");

      // 7. Verify ship was removed from allowlist
      const updatedList = await getDmAllowlist();
      console.log(`[TEST] DM allowlist after block: ${JSON.stringify(updatedList)}`);
      expect(updatedList).not.toContain(fixtures.thirdPartyShip);

      // 8. Verify ship is blocked
      const blocked = await waitFor(async () => {
        try {
          const list = await fixtures.botState.scry<string[]>("chat", "/blocked");
          if (Array.isArray(list) && list.includes(fixtures.thirdPartyShip!)) return list;
        } catch { /* scry may fail transiently */ }
        return undefined;
      }, 30_000, 2000, "ship to appear in blocked list");
      console.log(`[TEST] Blocked ships: ${JSON.stringify(blocked)}`);
      expect(blocked).toContain(fixtures.thirdPartyShip);

      // Clean up: unblock the ship and re-add to allowlist for subsequent tests
      await fixtures.botState.poke({
        app: "chat",
        mark: "chat-unblock-ship",
        json: { ship: fixtures.thirdPartyShip },
      });
      const cleanList = await getDmAllowlist();
      if (!cleanList.includes(fixtures.thirdPartyShip)) {
        await seedDmAllowlist([...cleanList, fixtures.thirdPartyShip]);
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));

      try { await dmPromise; } catch { /* timeout OK */ }
    }, 120_000);
  });
});
