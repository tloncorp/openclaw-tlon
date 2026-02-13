import { describe, test, expect, beforeAll } from "vitest";
import { createTestClient, createStateClient, getTestConfig, type TestClient, type StateClient } from "../lib/index.js";

type FixtureGroup = {
  id: string;
  title: string;
  channelId: string;
};

describe("groups", () => {
  let client: TestClient;
  let botState: StateClient;
  let fixture: FixtureGroup;

  beforeAll(async () => {
    const config = getTestConfig();
    client = createTestClient(config);
    botState = createStateClient(config.bot);

    // Wait for any pending messages from previous tests to settle
    await new Promise((resolve) => setTimeout(resolve, 5000));

    fixture = await ensureFixtureGroup(client, botState);
  });

  test("reads a bot-owned group", async () => {
    const response = await client.prompt(
      `Tell me about your group ${fixture.id}. Include both the group id and title.`
    );

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }
    expect(response.text).toBeDefined();

    const text = response.text?.toLowerCase() ?? "";
    expect(text).toContain(fixture.id.toLowerCase());
    expect(text).toContain(fixture.title.toLowerCase());
  });

  test("creates a new group on the bot ship", async () => {
    const uniqueTitle = `OpenClaw IT Group ${Date.now().toString(36)}`;
    const response = await client.prompt(
      `Create a new private group on your own ship with title "${uniqueTitle}". Reply with only the new group id.`
    );

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    const created = await waitFor(async () => {
      const groups = await botState.groups();
      return (groups ?? []).find((group) => {
        const g = group as { title?: string | null };
        return (g.title ?? "").trim() === uniqueTitle;
      });
    }, 30_000);

    expect(created).toBeTruthy();
  });

  test("adds a channel to an existing bot-owned group", async () => {
    const channelName = `it-${Date.now().toString(36)}`;
    const channelTitle = `IT ${channelName}`;
    const prompt = `In group ${fixture.id}, add a new chat channel named "${channelName}" with title "${channelTitle}".`;
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);
    
    const response = await client.prompt(prompt);
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 500)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    const expectedChannelId = `chat/${fixture.id}/${channelName}`;
    const channelExists = await waitFor(async () => {
      const group = await botState.group(fixture.id);
      const channels = ((group as { channels?: unknown[] } | null)?.channels ?? []) as Array<{
        id?: string | null;
        title?: string | null;
      }>;
      return channels.some((channel) => channel.id === expectedChannelId || channel.title === channelTitle);
    }, 30_000);

    expect(channelExists).toBe(true);
  });
});

async function ensureFixtureGroup(client: TestClient, botState: StateClient): Promise<FixtureGroup> {
  const existing = await botState.groups();
  const firstExisting = pickAnyGroup(existing);
  const existingFixture = (existing ?? []).find((group) => {
    const g = group as { id?: string | null; title?: string | null };
    return (g.title ?? "").startsWith("OpenClaw Fixture Group");
  }) as { id?: string | null; title?: string | null; channels?: unknown[] } | undefined;

  if (existingFixture?.id) {
    const channels = (existingFixture.channels ?? []) as Array<{ id?: string | null }>;
    const firstChannel = channels.find((c) => c.id)?.id;
    return {
      id: existingFixture.id,
      title: existingFixture.title ?? "OpenClaw Fixture Group",
      channelId: firstChannel ?? `chat/${existingFixture.id}/general`,
    };
  }

  const suffix = Date.now().toString(36);
  const groupTitle = `OpenClaw Fixture Group ${suffix}`;
  const createResponse = await client.prompt(
    `Create a private group on your own ship with title "${groupTitle}". Reply with only the new group id.`
  );
  if (!createResponse.success) {
    if (firstExisting) {
      return firstExisting;
    }
    throw new Error(`Failed to create fixture group: ${createResponse.error ?? "unknown error"}`);
  }

  const created = await waitFor(async () => {
    const groups = await botState.groups();
    return (groups ?? []).find((group) => {
      const g = group as { id?: string | null; title?: string | null; channels?: unknown[] };
      return (g.title ?? "").trim() === groupTitle;
    }) as { id?: string | null; title?: string | null; channels?: unknown[] } | undefined;
  }, 45_000);

  const createdId = created?.id;
  if (!createdId) {
    if (firstExisting) {
      return firstExisting;
    }
    throw new Error("Fixture group was created but no group id was returned by state");
  }
  const channels = (created?.channels ?? []) as Array<{ id?: string | null }>;
  const firstChannel = channels.find((c) => c.id)?.id ?? `chat/${createdId}/general`;
  return { id: createdId, title: groupTitle, channelId: firstChannel };
}

function pickAnyGroup(groups: unknown[] | undefined): FixtureGroup | null {
  for (const group of groups ?? []) {
    const g = group as { id?: string | null; title?: string | null; channels?: unknown[] };
    if (!g.id) {
      continue;
    }
    const channels = (g.channels ?? []) as Array<{ id?: string | null }>;
    const channelId = channels.find((c) => c.id)?.id ?? `chat/${g.id}/general`;
    return {
      id: g.id,
      title: g.title ?? g.id,
      channelId,
    };
  }
  return null;
}

async function waitFor<T>(fn: () => Promise<T>, timeoutMs: number, intervalMs = 1500): Promise<T> {
  const started = Date.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const result = await fn();
    if (result) {
      return result;
    }
    if (Date.now() - started >= timeoutMs) {
      throw new Error(`Timed out after ${timeoutMs}ms`);
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}
