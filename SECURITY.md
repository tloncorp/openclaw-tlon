# Security Model — OpenClaw Tlon Plugin

This document defines the security invariants that the plugin MUST enforce. All tests should verify behavior against these requirements.

---

## 1. DM Authorization

**Principle:** Deny by default. Only explicitly allowed ships can DM the bot.

| Scenario                       | Expected Behavior |
| ------------------------------ | ----------------- |
| `dmAllowlist` is empty         | ❌ Reject all DMs |
| `dmAllowlist` is undefined     | ❌ Reject all DMs |
| Sender is on `dmAllowlist`     | ✅ Allow DM       |
| Sender is NOT on `dmAllowlist` | ❌ Reject DM      |

**Ship Normalization:**

- Ships with/without `~` prefix are equivalent (`zod` = `~zod`)
- Comparison uses normalized form
- No partial matching (`~zod` does NOT match `~zod-extra`)

**Settings Priority:**

1. Settings store (`dmAllowlist`) — if set, overrides file config
2. File config (`channels.tlon.dmAllowlist`)

---

## 2. Channel Authorization

**Principle:** Restricted by default. Channels are either "restricted" (allowlist) or "open" (anyone).

| Mode                   | Behavior                                           |
| ---------------------- | -------------------------------------------------- |
| `restricted` (default) | Only ships in `allowedShips` can trigger responses |
| `open`                 | Any ship can trigger responses                     |

**Resolution Order:**

1. Per-channel rule from settings store
2. Per-channel rule from file config
3. Default: `restricted` mode with `defaultAuthorizedShips`

**Critical Invariant:**

```
If no mode is specified, default to "restricted" — NEVER "open"
```

---

## 3. Group Invite Authorization

**Principle:** When auto-accepting invites, validate the inviter.

| Scenario                                                      | Expected Behavior                |
| ------------------------------------------------------------- | -------------------------------- |
| `autoAcceptGroupInvites` = false                              | ❌ Don't auto-accept any invites |
| `autoAcceptGroupInvites` = true, `groupInviteAllowlist` empty | ❌ Reject all (fail-safe)        |
| `autoAcceptGroupInvites` = true, inviter ON allowlist         | ✅ Accept invite                 |
| `autoAcceptGroupInvites` = true, inviter NOT on allowlist     | ❌ Reject invite                 |

**Critical Invariant:**

```
If groupInviteAllowlist is empty/undefined, fail-safe to DENY — NEVER accept
```

**Why This Matters:**
Malicious actors could invite the bot to groups containing:

- Prompt injection in channel names/descriptions
- Spam or phishing content
- Content designed to manipulate agent behavior

---

## 4. Bot Mention Detection

**Principle:** Only respond when explicitly addressed. Avoid false positives.

| Trigger                                | Should Respond? |
| -------------------------------------- | --------------- |
| Direct ship mention (`~bot-ship`)      | ✅ Yes          |
| Nickname mention (`nimbus`)            | ✅ Yes          |
| `@all` mention                         | ✅ Yes          |
| Random message without mention         | ❌ No           |
| Partial ship match (`~bot-ship-extra`) | ❌ No           |
| Substring nickname (`nimbusly`)        | ❌ No           |

**Case Sensitivity:**

- Ship mentions: case-insensitive
- Nickname mentions: case-insensitive
- `@all`: case-insensitive

---

## 5. Credentials & Authentication

**Principle:** Never log or expose credentials.

| Credential          | Storage          | Logging         |
| ------------------- | ---------------- | --------------- |
| Ship code (`+code`) | Config file only | ❌ Never logged |
| Session cookie      | Memory only      | ❌ Never logged |
| Ship name           | Config           | ✅ Safe to log  |
| URL                 | Config           | ✅ Safe to log  |

**Authentication:**

- Code should be URL-encoded before sending
- Session cookies should be stored securely in memory
- Failed auth should not reveal credential details in logs

---

## 6. Input Handling

**Principle:** Treat all external input as untrusted.

| Input Source          | Validation Required                    |
| --------------------- | -------------------------------------- |
| Message content       | Extract text safely, no code execution |
| Channel names         | Validate format before use             |
| Ship names            | Normalize and validate                 |
| Settings store values | Parse and validate against schema      |

**Prohibited Patterns:**

- No `eval()` or `Function()` on message content
- No shell execution with user input
- No template injection

---

## 7. Rate Limiting (Recommended)

**Principle:** Prevent abuse through flooding.

| Action                        | Recommended Limit |
| ----------------------------- | ----------------- |
| Outbound messages per channel | 1 per second      |
| Outbound DMs per ship         | 1 per second      |
| Group joins                   | 1 per 10 seconds  |

_Note: Not currently enforced — future enhancement._

---

## 8. Settings Store Security

**Principle:** Settings from Urbit can be manipulated; validate before use.

| Setting                | Validation                              |
| ---------------------- | --------------------------------------- |
| `dmAllowlist`          | Must be array of strings                |
| `groupInviteAllowlist` | Must be array of strings                |
| `channelRules`         | Must match schema (mode + allowedShips) |
| Boolean settings       | Must be actual booleans                 |

**Hot-Reload Safety:**

- Invalid settings should fall back to file config
- Parse errors should log warning, not crash

---

## Test Requirements

All security tests should:

1. **Test the deny case first** — Verify rejection before acceptance
2. **Test boundary conditions** — Empty arrays, undefined, null
3. **Test normalization** — Ship names with/without `~`, whitespace
4. **Test precedence** — Settings override file config
5. **Document the invariant** — Each test should reference this doc

### Running Security Tests

```bash
npm run test:security
# or
npx vitest run src/security.test.ts
```

---

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT open a public issue**
2. Contact the maintainers directly
3. Allow time for a fix before disclosure

---

## Changelog

| Date       | Change                                   |
| ---------- | ---------------------------------------- |
| 2026-01-30 | Initial security model documented        |
| 2026-01-30 | Added `groupInviteAllowlist` requirement |
