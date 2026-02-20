import { describe, test, expect, beforeAll } from "vitest";
import { getFixtures, waitFor, type TestFixtures } from "../lib/index.js";

describe("channels", () => {
  let fixtures: TestFixtures;

  beforeAll(async () => {
    fixtures = await getFixtures();
  });

  test("lists DM contacts", async () => {
    const prompt = "List your DM contacts. Show me who you can message directly.";
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);

    const response = await fixtures.client.prompt(prompt);
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 500)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    expect(response.text).toBeDefined();
    // The test user should appear in DMs since we're messaging via DM
    expect(response.text?.toLowerCase()).toContain(fixtures.userShip.replace("~", ""));
  });

  test("lists subscribed groups", async () => {
    const prompt = "List all the groups you are subscribed to.";
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);

    const response = await fixtures.client.prompt(prompt);
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 500)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    expect(response.text).toBeDefined();
    // Should mention groups or indicate none exist
    const text = response.text?.toLowerCase() ?? "";
    const hasGroups = text.includes("group") || text.includes("subscrib") || text.includes("member");
    expect(hasGroups).toBe(true);
  });

  test("lists all channels", async () => {
    const prompt = "Show me all your channels - DMs, group DMs, and group channels.";
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);

    const response = await fixtures.client.prompt(prompt);
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 500)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    expect(response.text).toBeDefined();
    // Should list channels or indicate what's available
    const text = response.text?.toLowerCase() ?? "";
    const hasChannelInfo =
      text.includes("dm") ||
      text.includes("channel") ||
      text.includes("chat") ||
      text.includes(fixtures.userShip.replace("~", ""));
    expect(hasChannelInfo).toBe(true);
  });

  test("gets channel info for DM", async () => {
    // Ask about the DM channel with the test user
    const prompt = `Get detailed information about your DM channel with ${fixtures.userShip}.`;
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);

    const response = await fixtures.client.prompt(prompt);
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 500)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    expect(response.text).toBeDefined();
    // Should mention the user ship or DM details
    const text = response.text?.toLowerCase() ?? "";
    const hasDmInfo =
      text.includes(fixtures.userShip.replace("~", "")) ||
      text.includes("dm") ||
      text.includes("direct");
    expect(hasDmInfo).toBe(true);
  });

  test("adds a channel to a group", async () => {
    if (!fixtures.group) {
      console.log("[TEST] Skipping: no fixture group");
      return;
    }

    const channelName = `test-${Date.now().toString(36)}`;
    const prompt = `Add a new chat channel called "${channelName}" to your group ${fixtures.group.id}.`;
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);

    const response = await fixtures.client.prompt(prompt);
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 500)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    expect(response.text).toBeDefined();
    // Should confirm creation or mention the channel
    const text = response.text?.toLowerCase() ?? "";
    const hasConfirmation =
      text.includes("created") ||
      text.includes("added") ||
      text.includes(channelName.toLowerCase());
    expect(hasConfirmation).toBe(true);

    // Verify channel exists
    const channelExists = await waitFor(async () => {
      const group = await fixtures.botState.group(fixtures.group!.id);
      const channels = ((group as { channels?: unknown[] } | null)?.channels ?? []) as Array<{
        id?: string | null;
        title?: string | null;
      }>;
      const found = channels.some(
        (ch) => ch.id?.includes(channelName) || ch.title?.toLowerCase().includes(channelName)
      );
      return found ? true : undefined;
    }, 30_000);

    expect(channelExists).toBe(true);
  });

  test("updates a channel title", async () => {
    if (!fixtures.group) {
      console.log("[TEST] Skipping: no fixture group");
      return;
    }

    const newTitle = `Updated Title ${Date.now().toString(36)}`;
    const prompt = `Update the title of channel ${fixtures.group.chatChannel} to "${newTitle}".`;
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);

    const response = await fixtures.client.prompt(prompt);
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 500)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    expect(response.text).toBeDefined();
    // Should confirm the update
    const text = response.text?.toLowerCase() ?? "";
    const hasConfirmation =
      text.includes("updated") ||
      text.includes("changed") ||
      text.includes("title") ||
      text.includes(newTitle.toLowerCase());
    expect(hasConfirmation).toBe(true);
  });

  test("gets info for a group channel", async () => {
    if (!fixtures.group) {
      console.log("[TEST] Skipping: no fixture group");
      return;
    }

    const prompt = `Get detailed information about channel ${fixtures.group.chatChannel}.`;
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);

    const response = await fixtures.client.prompt(prompt);
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 500)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    expect(response.text).toBeDefined();
    // Should show channel info
    const text = response.text?.toLowerCase() ?? "";
    const hasChannelInfo =
      text.includes("channel") ||
      text.includes("chat") ||
      text.includes(fixtures.group.id.toLowerCase());
    expect(hasChannelInfo).toBe(true);
  });
});