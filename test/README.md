# Integration Tests

Integration tests for the Tlon plugin. These tests prompt the bot and verify ship state changes.

## Testing Principles

- Assert from the **bot ship's perspective** (`config.bot` / `client.state`), not the test user's private state.
- Include both **read** and **mutation** scenarios (for example: read group info, then create group/channel and verify).
- Seed deterministic fixtures on the bot ship when needed (group/channel/profile fields), rather than depending on pre-existing test user data.
- Avoid prompts that require visibility into the test user ship's private data.

## Setup

Tests use the root `.env` file - the same one used by `docker-compose`. Just make sure your `.env` is configured for the dev environment.

## Environment Variables

Tests reuse the standard env vars from `.env`:

```bash
# Bot ship (receives DMs, used for state checks)
TLON_URL=http://host.docker.internal:8080   # Ship URL (auto-converted for tests)
TLON_SHIP=~bot-moon                         # Bot ship name
TLON_CODE=lidlut-tabwed-pillex-ridrup       # Bot access code
```

### Tlon Mode (full stack testing)

For tlon mode, you need a **test user** to send DMs to the bot:

```bash
TEST_USER_URL=https://your-planet.tlon.network  # Test user's ship URL (if different from bot)
TEST_USER_SHIP=~your-planet                     # Your ship (sends DMs to bot)
TEST_USER_CODE=your-access-code                 # Your ship's access code
```

The test user must be on the bot's DM allowlist (`TLON_DM_ALLOWLIST`).

If `TEST_USER_*` vars are not set, tests fall back to bot credentials (useful for state-only tests).

### Test-specific options

```bash
TEST_MODE=tlon                      # "tlon" (default) or "direct"
OPENCLAW_GATEWAY_PORT=18789               # Host port mapped to container 18789
TEST_GATEWAY_URL=http://localhost:18789   # Optional override (default derives from OPENCLAW_GATEWAY_PORT)
OPENCLAW_GATEWAY_TOKEN=...          # If gateway auth is enabled
```

## Running Tests

```bash
# Start the dev container first
pnpm dev

# In another terminal, run integration tests (waits for gateway)
pnpm test:integration

# Watch mode
pnpm test:integration:watch

# Run all tests (unit + integration)
pnpm test:all

# CI mode: starts container, runs tests, stops container
pnpm test:ci
```

The test runner automatically waits up to 60s for the gateway to be ready.

**Note:** Tests run from your host machine and hit:
- The dockerized OpenClaw gateway at `localhost:${OPENCLAW_GATEWAY_PORT:-18789}` (direct mode)
- Your local Urbit ship for state verification (URL from `.env`, converted from `host.docker.internal` to `localhost`)

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
