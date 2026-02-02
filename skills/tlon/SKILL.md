---
name: tlon
description: Interact with Tlon/Urbit beyond basic messaging. Use for contacts, channels, message history, reactions, notebook posts, and activity.
metadata:
  openclaw:
    emoji: "⛵"
    requires:
      plugins: ["tlon"]
---

# Tlon Tools

This skill provides tools for interacting with Tlon/Urbit beyond basic chat messaging.

**Note:** Basic send/receive is handled by the Tlon channel plugin automatically. Use these tools for additional operations.

## Tools Available

Enable tools via config: `tools.allow: ["tlon"]`

### tlon_contacts
Manage contacts and profiles.

```
tlon_contacts({ action: "self" })                    # Get own profile
tlon_contacts({ action: "get", ship: "~sampel" })    # Get another ship's profile
tlon_contacts({ action: "list" })                    # List all contacts
tlon_contacts({ action: "update", profile: { nickname: "newname" } })  # Update own profile
```

### tlon_channels
Discover channels and groups.

```
tlon_channels({ action: "list" })                    # List all channels
tlon_channels({ action: "groups" })                  # List groups only
tlon_channels({ action: "dms" })                     # List DM conversations
tlon_channels({ action: "info", channel: "chat/~host/name" })  # Get channel details
```

### tlon_history
Fetch message history from channels or DMs.

```
tlon_history({ target: "chat/~host/channel", limit: 20 })  # Channel history
tlon_history({ target: "~ship", limit: 10 })               # DM history
```

### tlon_react
Add or remove emoji reactions.

```
tlon_react({ action: "add", channel: "chat/~host/name", postId: "170.141...", emoji: "👍" })
tlon_react({ action: "remove", channel: "chat/~host/name", postId: "170.141..." })
```

### tlon_post
Edit or delete posts.

```
tlon_post({ action: "edit", channel: "chat/~host/name", postId: "170.141...", content: "new text" })
tlon_post({ action: "delete", channel: "chat/~host/name", postId: "170.141..." })
```

### tlon_dm
Manage DMs - accept/decline invites, send to clubs (group DMs).

```
tlon_dm({ action: "accept", ship: "~sampel" })       # Accept DM invite
tlon_dm({ action: "decline", ship: "~sampel" })      # Decline DM invite
tlon_dm({ action: "send", clubId: "0v...", message: "hello" })  # Send to club
tlon_dm({ action: "reply", clubId: "0v...", postId: "...", message: "reply" })
```

**Note:** 1:1 DM send uses the regular message tool, not tlon_dm.

### tlon_notebook
Create posts in notebook/diary channels.

```
tlon_notebook({
  channel: "diary/~host/name",
  title: "My Post Title",
  content: "Markdown content here...",
  image: "https://example.com/cover.jpg"  # optional
})
```

### tlon_activity
Check activity and notifications.

```
tlon_activity({ action: "unread" })           # Get unread counts
tlon_activity({ action: "mentions", limit: 20 })  # Recent mentions
tlon_activity({ action: "all", limit: 50 })   # All activity
```

## Common Patterns

### React to the last message in a channel
1. Use `tlon_history` to get recent messages
2. Extract the post ID from the first result
3. Use `tlon_react` with that ID

### Post to a notebook
Use `tlon_notebook` with the diary channel path. Content supports full markdown.

### Check for mentions
Use `tlon_activity({ action: "mentions" })` to see recent mentions across all channels.

## ID Formats

- **Ship:** `~sampel-palnet` (with tilde)
- **Channel nest:** `chat/~host/channel-name`, `diary/~host/name`, `heap/~host/name`
- **Post ID:** `170.141.184.507...` (@ud format with dots)
- **Club ID:** `0v...` (for group DMs)

## Troubleshooting

If tools return "Tlon not configured", ensure `channels.tlon` has `url`, `ship`, and `code` set in your OpenClaw config.
