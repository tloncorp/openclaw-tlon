Worklog - 2026-02-11

Summary
- Switched @tloncorp/api dependency to local ../api-beta for richer API usage in tests.
- Refactored test state client to use @tloncorp/api high-level calls with a serialized queue.
- Updated integration tests (groups/contacts/messages) to assert against API state and posts.
- Added configurable gateway host port via OPENCLAW_GATEWAY_PORT in docker-compose + test runner.
- Attempted pnpm install (failed earlier due to network), user later ran install.
- Integration tests failed twice waiting for gateway at http://localhost:18789; suspected port collision.
- Documented gateway port override in test/README.

Files Touched
- package.json
- test/lib/state.ts
- test/cases/groups.test.ts
- test/cases/contacts.test.ts
- test/cases/messages.test.ts
- dev/docker-compose.yml
- test/run.sh
- test/README.md
- pnpm-lock.yaml (install)
- package-lock.json (install)

Update - 2026-02-11 (later)

Summary
- Investigated recurring gateway log error: `ENOENT /root/.openclaw/openclaw.json` from periodic health refresh.
- Verified runtime state: config file exists in container and gateway remains operational.
- Added startup guard in `dev/entrypoint.sh` to create `/root/.openclaw/openclaw.json` from `dev/openclaw.dev.json` when missing.
- Rebuilt/restarted `dev-openclaw-1` and monitored logs for >1 health interval; ENOENT did not recur.

Files Touched
- dev/entrypoint.sh
- WORKLOG.md

Update - 2026-02-11 (port mismatch follow-up)

Summary
- Reproduced `test/run.sh` timeout waiting for `http://localhost:18790`.
- Found mismatch source: tests load root `.env` (`OPENCLAW_GATEWAY_PORT=18790`), but compose defaults to `18789` unless root `.env` is passed for interpolation.
- Updated compose invocations to pass root env file explicitly (`--env-file .env` / `--env-file ../.env`).
- Updated `dev/run.sh` browser URL to derive the actual published host port via `docker compose port`.

Files Touched
- package.json
- dev/run.sh
- README.md
- test/README.md
- WORKLOG.md

Update - 2026-02-11 (integration run from container)

Summary
- Confirmed integration tests can run in this environment by executing Vitest inside `dev-openclaw-1`.
- Fixed test URL normalization to support both host and Docker test runs:
  - outside Docker: `host.docker.internal -> localhost`
  - inside Docker: `localhost/127.0.0.1 -> host.docker.internal`
- Post-fix result: hard `ECONNREFUSED 127.0.0.1:80` failures cleared; remaining failures are functional/auth/data (`Unexpected token '<'` from API JSON parse + `response.success === false` in messages tests).

Files Touched
- test/lib/config.ts
- WORKLOG.md

Update - 2026-02-11 (DM ship routing)

Summary
- Investigated report that bot replies to itself instead of the user moon in DMs.
- Found DM handler was routing replies off `essay.author` only and ignoring `event.whom` (DM partner).
- Updated DM event handling to:
  - parse/validate DM partner ship from `event.whom`
  - prefer partner ship for reply routing
  - keep self-message guard (`authorShip === botShipName`)
  - log author/partner mismatch for diagnostics
- Added explicit DM reply routing log: `Sending DM reply from <bot> to <sender>`.
- Ran unit test suite (`pnpm vitest run src/`): 49/49 passing.

Files Touched
- src/monitor/index.ts
- WORKLOG.md

Update - 2026-02-11 (prompt client debug)

Summary
- Debugged `test/lib/client.ts` prompt behavior for rapid-fire test sends.
- Replaced activity-feed based response detection (timestamp parsing) with direct DM channel post polling.
- Added pre-send baseline snapshot (`baselineBotSentAt`) so prompt waits for a genuinely new bot DM.
- Added retry/reconnect loop for DM send (`3` attempts) to avoid immediate failures on transient channel errors.
- Added explicit debug logs for baseline/poll/send failures.
- Updated `messages` tests to throw with `response.error` so prompt failures are visible in test output.
- In this sandbox/container, prompt failures are now clearly surfaced as send failures (`Failed to PUT channel` / `fetch failed`) rather than silent fast false returns.

Files Touched
- test/lib/client.ts
- test/cases/messages.test.ts
- WORKLOG.md

Update - 2026-02-11 (bot-centric integration tests)

Summary
- Reworked integration tests to avoid test-user-state assumptions and validate from bot-ship perspective.
- Added deterministic bot fixture setup support in state client:
  - `state.createGroup(...)` wrapper using `@tloncorp/api.createGroup`.
- Replaced test cases to cover both reads and mutations on bot-owned resources:
  - `groups`: read fixture group, create new group, add channel to existing group.
  - `contacts`: read bot profile, mutate bot status, mutate bot bio.
  - `messages`: read bot-owned channel history, post to bot-owned channel, basic DM response.
- Added polling helpers for eventual consistency checks after mutation prompts.
- Updated integration test docs with explicit bot-centric testing principles.
- Sanity-checked test file loading with `pnpm vitest run test/cases/ -t "__no_match__"` (3 files loaded, 9 skipped, no compile errors).

Files Touched
- test/lib/state.ts
- test/cases/groups.test.ts
- test/cases/contacts.test.ts
- test/cases/messages.test.ts
- test/README.md
- WORKLOG.md

Update - 2026-02-11 (group-create-thread schema mismatch)

Summary
- Reproduced fixture setup failure in groups tests with explicit error:
  - `500 Internal Server Error` from `/spider/groups/group-create-thread/...`
  - parser error indicates invalid key under channels: `channelId`.
- Removed reliance on direct `@tloncorp/api.createGroup` fixture setup in tests.
- Switched fixture creation flow to bot-driven prompt + state polling verification.
- Added fallback to existing bot group if fixture creation prompt fails, so suites can still execute and report per-test failures instead of failing in `beforeAll`.
- Removed stale mention of `state.createGroup(...)` from test docs.

Files Touched
- test/lib/state.ts
- test/cases/groups.test.ts
- test/cases/messages.test.ts
- test/README.md
- WORKLOG.md

Update - 2026-02-11 (expanded no-third-ship coverage)

Summary
- Added `test/cases/group-admin.test.ts` to cover bot+test-user admin paths that do not require a third ship:
  - invite test-user ship to bot-owned group
  - ban/unban test-user ship
  - create role + assign/remove role for bot ship
- Reused bot-owned fixture group setup with prompt-driven creation and fallback to existing groups.
- Updated `test/README.md` test structure section to include the new suite.
- Sanity-checked test file loading with `pnpm vitest run test/cases/ -t "__no_match__"` (4 files loaded, 12 skipped, no compile errors).

Files Touched
- test/cases/group-admin.test.ts
- test/README.md
- WORKLOG.md

Update - 2026-02-11 (handoff)

Summary
- Stabilized DM routing (partner ship extraction from firehose `whom`) to prevent self-DM reply targeting.
- Improved integration prompt flow diagnostics and retry behavior for transient DM send failures.
- Reworked integration tests to be bot-centric with read + mutation coverage and bot-state assertions.
- Removed brittle direct group fixture creation via `group-create-thread` after schema mismatch; switched to prompt-driven fixture setup with fallback to existing bot-owned groups.
- Added `WORKLOG.md` to gitignore so future worklog updates stay local.

Update - 2026-02-11 (stop point)

Current Status
- Integration framework is now bot-centric and avoids test-user private-state assumptions.
- Prompt flow is instrumented and improved (baseline polling + send retry/reconnect + explicit error propagation).
- DM routing fix is in place to prefer DM partner ship from firehose events and avoid self-target routing.
- Added non-third-ship admin coverage suite: `test/cases/group-admin.test.ts`.

What Changed This Session
- Reworked tests to assert bot-owned state + include mutations:
  - `test/cases/groups.test.ts`
  - `test/cases/contacts.test.ts`
  - `test/cases/messages.test.ts`
- Added admin scenario tests (bot + test-user only):
  - `test/cases/group-admin.test.ts`
- Updated docs:
  - `test/README.md`
- Removed brittle direct fixture creation path that relied on `group-create-thread` payload shape mismatch.
  - Fixtures now use prompt-driven creation with state polling and fallback to existing bot groups.

Known Issues / Risks
- Bot may return "success" text without actual state mutation; tests now guard this with state verification loops.
- `group-admin` role test required hardening because bot claimed assignment succeeded while state showed no role/assignment.
  - Added retries + strict state-based pass/fail.
- In constrained/sandbox environments, DM send may intermittently fail (`Failed to PUT channel` / `fetch failed`).

Suggested Next Steps
1. Re-run `pnpm test:integration` on host and capture failures by stage (create role / assign / remove).
2. Tighten prompts further for failing admin operations (more explicit command form and full IDs).
3. Add next no-third-ship coverage suite for post operations (reply/react/unreact/delete) with bot-state assertions.
4. After stability, consider optional direct-mode tests if gateway flow is needed.
