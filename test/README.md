# Integration Tests

Integration tests for the Tlon plugin. These tests prompt the bot and verify ship state changes.

## Testing Principles

- Assert from the **bot ship's perspective** (`config.bot` / `client.state`), not the test user's private state.
- Include both **read** and **mutation** scenarios (for example: read group info, then create group/channel and verify).
- Seed deterministic fixtures on the bot ship when needed (group/channel/profile fields), rather than depending on pre-existing test user data.
- Avoid prompts that require visibility into the test user ship's private data.

## Running Tests

There are two ways to run integration tests:

### Self-contained (recommended)

Starts ephemeral fakezod ships (~zod and ~ten), runs tests, then cleans up:

```bash
pnpm test:integration
```

This is what CI uses. Requires:
- `OPENROUTER_API_KEY` in `.env` (or as environment variable)
- Optional: `../tlonbot` repo cloned for local prompt files (otherwise fetches from GitHub using `TLONBOT_TOKEN`)

### Against dev environment

Run tests against an already-running dev environment:

```bash
# Start dev environment first
pnpm dev

# In another terminal
pnpm test:integration:dev

# Watch mode
pnpm test:integration:watch
```

Requires `.env` configured with ship credentials (see below).

## Environment Variables

For `test:integration:dev`, tests use the root `.env` file:

```bash
# Bot ship (receives DMs, used for state checks)
TLON_URL=http://host.docker.internal:8080   # Ship URL (auto-converted for tests)
TLON_SHIP=~bot-moon                         # Bot ship name
TLON_CODE=lidlut-tabwed-pillex-ridrup       # Bot access code

# Test user (sends DMs to bot)
TEST_USER_URL=https://your-planet.tlon.network
TEST_USER_SHIP=~your-planet
TEST_USER_CODE=your-access-code
```

The test user must be on the bot's DM allowlist (`TLON_DM_ALLOWLIST`).

For `test:integration` (ephemeral mode), ship credentials are hardcoded - only `OPENROUTER_API_KEY` is needed from `.env`.

## Test Structure

```
test/
  lib/
    state.ts      # Ship state client using @tloncorp/api
    client.ts     # Test client (direct + tlon modes)
    config.ts     # Environment config
    index.ts      # Exports
  cases/
    groups.test.ts    # Group management tests
    contacts.test.ts  # Contact tests
    messages.test.ts  # Messaging tests
```

## Writing Tests

```typescript
import { describe, test, expect, beforeAll } from "vitest";
import { createTestClient, getTestConfig, type TestClient } from "../lib/index.js";

describe("my feature", () => {
  let client: TestClient;

  beforeAll(() => {
    client = createTestClient(getTestConfig());
  });

  test("does something", async () => {
    // Send a prompt to the bot
    const response = await client.prompt("Do something");
    expect(response.success).toBe(true);

    // Verify state changed on the bot ship
    const groups = await client.state.groups();
    expect(Object.keys(groups)).toContain("~host/expected-group");
  });
});
```

## State Client Methods

- `state.groups()` - Get all groups
- `state.group(flag)` - Get specific group
- `state.contacts()` - Get all contacts
- `state.settings()` - Get settings
- `state.channelPosts(channelId, count?)` - Get channel messages
- `state.activity()` - Get activity feed
- `state.unreads()` - Get unread counts
