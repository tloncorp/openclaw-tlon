import { describe, test, expect, beforeAll } from "vitest";
import { getTextContent } from "@tloncorp/api";
import { createTestClient, createStateClient, getTestConfig, type TestClient, type StateClient } from "../lib/index.js";

type FixtureGroup = {
  id: string;
  title: string;
  channelId: string;
};

describe("messages", () => {
  let client: TestClient;
  let botState: StateClient;
  let botShip: string;
  let fixture: FixtureGroup;

  beforeAll(async () => {
    const config = getTestConfig();
    client = createTestClient(config);
    botState = createStateClient(config.bot);
    botShip = config.bot.shipName.startsWith("~") ? config.bot.shipName : `~${config.bot.shipName}`;
    fixture = await ensureFixtureGroup(client, botState);
  });

  test("reads bot-owned channel history", async () => {
    const response = await client.prompt(
      `Show me recent messages from your own channel ${fixture.channelId}.`
    );

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }
    expect(response.text).toBeDefined();

    const posts = await botState.channelPosts(fixture.channelId, 5);
    const postTexts = (posts ?? [])
      .map((post) => {
        const p = post as { textContent?: string | null; content?: unknown };
        return p.textContent ?? getTextContent(p.content);
      })
      .map((text) => (text ?? "").trim())
      .filter((text) => text.length > 0);

    if (postTexts.length > 0) {
      // Expect the model to surface at least one snippet from channel history.
      const sample = postTexts[0].slice(0, 24).toLowerCase();
      if (sample.length > 6) {
        expect(response.text?.toLowerCase()).toContain(sample);
      }
    }
  });

  test("posts a message into a bot-owned channel", async () => {
    const token = `it-post-${Date.now().toString(36)}`;
    const response = await client.prompt(
      `Post this exact text into your channel ${fixture.channelId}: "${token}"`
    );

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    const created = await waitFor(async () => {
      const posts = await botState.channelPosts(fixture.channelId, 30);
      return (posts ?? []).some((post) => {
        const p = post as { authorId?: string; textContent?: string | null; content?: unknown };
        const text = (p.textContent ?? getTextContent(p.content) ?? "").toLowerCase();
        return p.authorId === botShip && text.includes(token.toLowerCase());
      });
    }, 30_000);

    expect(created).toBe(true);
  });

  test("responds to a simple DM prompt", async () => {
    const response = await client.prompt("Reply with one short sentence confirming you are online.");

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }
    expect(response.text).toBeDefined();
    expect((response.text ?? "").trim().length).toBeGreaterThan(0);
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

async function waitFor(fn: () => Promise<boolean>, timeoutMs: number, intervalMs = 1500): Promise<boolean> {
  const started = Date.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const result = await fn();
    if (result) {
      return true;
    }
    if (Date.now() - started >= timeoutMs) {
      throw new Error(`Timed out after ${timeoutMs}ms`);
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}
