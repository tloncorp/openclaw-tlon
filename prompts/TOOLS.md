<!-- idempotency-marker:tlon-tools:v1 -->
## tlon-run

All Tlon/Urbit operations go through `tlon-run`. No bash/npm/npx.

| Command | Description |
| --- | --- |
| `tlon-run activity {mentions\|replies\|all\|unreads}` | Notifications (limit ≤25) |
| `tlon-run channels {dms\|group-dms\|groups\|all\|info\|update\|delete}` | List/manage channels |
| `tlon-run contacts {list\|self\|get\|sync\|add\|remove\|update-profile}` | Contacts & profiles |
| `tlon-run groups {list\|info\|create\|join\|leave\|delete\|update\|...}` | Group admin |
| `tlon-run groups {invite\|kick\|ban\|unban\|accept-join\|reject-join}` | Member management |
| `tlon-run groups {add-role\|delete-role\|update-role\|assign-role\|remove-role}` | Roles |
| `tlon-run groups {add-channel\|set-privacy}` | Group settings |
| `tlon-run messages {dm\|channel\|history\|search} [--limit N]` | Read history (limit ≤50) |
| `tlon-run dms {react\|unreact\|delete\|accept\|decline}` | DM operations |
| `tlon-run posts {reply\|react\|unreact\|delete}` | Channel posts |
| `tlon-run notebook <nest> "Title" [--content file\|--stdin\|--image url]` | Diary/notebook post |
| `tlon-run settings get` | Show all settings |
| `tlon-run settings {set\|delete} <key> [value]` | Modify settings |
| `tlon-run settings {allow-dm\|remove-dm} <ship>` | DM allowlist |
| `tlon-run settings {allow-channel\|remove-channel} <nest>` | Channel watch list |
| `tlon-run settings {open-channel\|restrict-channel} <nest>` | Per-channel access |
| `tlon-run settings {authorize-ship\|deauthorize-ship} <ship>` | Global ship allowlist |
| `tlon-run click <operation>` | Low-level ship ops (OTA, desks, etc.) |

### Workspace Files (Self-Editing)

Read and edit persistent files that survive restarts:

```
tlon-run soul read              # Read SOUL.md
tlon-run soul replace "text"    # Replace entire file
tlon-run soul append "note"     # Append to file
cat file.md | tlon-run soul replace -   # Multiline via stdin
```

Available files: `soul`, `memory`, `user`, `tools`, `agents`, `bootstrap`, `heartbeat`, `identity`.

**UNAVAILABLE COMMANDS:** `tlon-run dm send`, `tlon-run dm reply`, `tlon-run posts send` - use the plugin's built-in messaging for sending messages.
<!-- /idempotency-marker -->
