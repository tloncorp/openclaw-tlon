# Integration Tests

Integration tests for the Tlon plugin. These tests prompt the bot via DM and verify ship state changes directly.

## Running Tests

### Self-contained (recommended)

Starts ephemeral fakezod ships (~zod, ~ten, ~mug), runs tests, then cleans up:

```bash
pnpm test:integration
```

Run a specific test file:

```bash
pnpm test:integration test/cases/07-security.test.ts
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

# Run a specific test file
pnpm test:integration:dev test/cases/07-security.test.ts

# Watch mode
pnpm test:integration:watch
```

Requires `.env` configured with ship credentials (see below).

## Test Environment

### Ships

| Ship | Role | Port | Description |
|------|------|------|-------------|
| ~zod | Bot | 8080 | The bot ship running OpenClaw + Tlon plugin |
| ~ten | Owner | 8081 | Configured as `ownerShip`, on the DM allowlist |
| ~mug | Third party | 8082 | Non-owner, not on allowlist (goes through approval flow) |

### Environment Variables

For `test:integration:dev`, tests use the root `.env` file:

```bash
# Bot ship (receives DMs, used for state checks)
TLON_URL=http://host.docker.internal:8080
TLON_SHIP=~bot-moon
TLON_CODE=lidlut-tabwed-pillex-ridrup

# Test user / owner (sends DMs to bot)
TEST_USER_URL=https://your-planet.tlon.network
TEST_USER_SHIP=~your-planet
TEST_USER_CODE=your-access-code

# Third-party ship (optional, enables security tests)
TEST_THIRD_PARTY_URL=http://localhost:8082
TEST_THIRD_PARTY_SHIP=~mug
TEST_THIRD_PARTY_CODE=ravsut-bolryd-hapsum-pastul
```

For `test:integration` (ephemeral mode), ship credentials are hardcoded — only `OPENROUTER_API_KEY` is needed from `.env`.

## Testing Principles

- Assert from the **bot ship's perspective** (`fixtures.botState`), not the test user's private state
- Include both **read** and **mutation** scenarios
- Use **unique tokens** (e.g., `Date.now().toString(36)`) to make values verifiable
- Poll with **`waitFor`** — state changes are async
- Seed fixtures on the bot ship when needed, rather than depending on pre-existing data

## Test Structure

```
test/
  lib/
    state.ts      # Ship state client using @tloncorp/api
    client.ts     # Test client (direct + tlon modes)
    config.ts     # Environment config
    fixtures.ts   # Shared test fixtures (groups, DM channels, 3rd party approval)
    index.ts      # Re-exports
  cases/
    01-connectivity.test.ts   # Basic connection checks
    02-contacts.test.ts       # Contact/profile tests
    03-messages.test.ts       # DM tests
    04-groups.test.ts         # Group tests
    05-channels.test.ts       # Channel tests
    06-heartbeat.test.ts      # Heartbeat/cron tests
    07-security.test.ts       # Security tests (tool access, blocking)
    99-commands.test.ts       # Admin command tests
```

Tests are numbered for execution order.

## Writing Tests

```typescript
import { describe, test, expect, beforeAll } from "vitest";
import { getFixtures, waitFor, type TestFixtures } from "../lib/index.js";

describe("my feature", () => {
  let fixtures: TestFixtures;

  beforeAll(async () => {
    fixtures = await getFixtures();
  });

  test("mutates state correctly", async () => {
    const token = `test-${Date.now().toString(36)}`;

    const response = await fixtures.client.prompt(
      `Update your profile status to exactly "${token}" and confirm.`
    );
    expect(response.success).toBe(true);

    const updated = await waitFor(async () => {
      const profile = await fixtures.botState.scry("contacts", "/v1/self");
      return profile?.status === token ? true : undefined;
    }, 30_000);

    expect(updated).toBe(true);
  });
});
```

### Tests requiring the third-party ship

```typescript
import { requireThirdParty } from "../lib/index.js";

test("non-owner is restricted", async () => {
  requireThirdParty(fixtures);

  const response = await fixtures.thirdPartyClient.prompt("do something restricted");
  // ...
});
```

`requireThirdParty` throws a descriptive error if `TEST_THIRD_PARTY_*` env vars are not set.

## State Client Methods

- `fixtures.botState.groups()` — All groups bot is in
- `fixtures.botState.group(flag)` — Specific group details
- `fixtures.botState.contacts()` — All contacts
- `fixtures.botState.settings()` — Bot settings
- `fixtures.botState.channelPosts(id, count?)` — Messages in a channel
- `fixtures.botState.activity()` — Activity feed
- `fixtures.botState.scry(app, path)` — Raw scry
- `fixtures.botState.poke({ app, mark, json })` — Raw poke
