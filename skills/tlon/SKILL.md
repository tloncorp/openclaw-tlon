---
name: tlon
description: Interact with Tlon/Urbit using CLI scripts. Use for contacts, channels, message history, reactions, posts, notebooks, activity, group management (invite/kick/ban/roles), and bot settings.
metadata:
  {
    "openclaw":
      {
        "emoji": "⛵",
        "requires": { "bins": ["python3"], "env": ["TLON_URL", "TLON_SHIP", "TLON_CODE"] },
        "primaryEnv": "TLON_CODE",
      },
  }
---

# Tlon Skill

CLI scripts for interacting with Tlon/Urbit beyond basic messaging.

**Note:** Basic send/receive is handled by the Tlon channel plugin automatically. Use this skill for additional operations like viewing history, managing contacts, adding reactions, and posting to notebooks.

## Configuration

Set environment variables:

```bash
export TLON_URL="https://your-ship.tlon.network"
export TLON_SHIP="~your-ship"
export TLON_CODE="your-access-code"
```

Or configure in `~/.openclaw/openclaw.json`:

```json5
{
  skills: {
    tlon: {
      env: {
        TLON_URL: "https://your-ship.tlon.network",
        TLON_SHIP: "~your-ship",
        TLON_CODE: "your-access-code",
      },
    },
  },
}
```

## Commands

### Contacts

```bash
# Get your own profile
{baseDir}/scripts/tlon contacts self

# Get another ship's profile
{baseDir}/scripts/tlon contacts get --ship ~sampel-palnet

# List all contacts
{baseDir}/scripts/tlon contacts list

# Update your profile
{baseDir}/scripts/tlon contacts update --nickname "New Name" --bio "My bio" --status "Available"
```

### Channels

```bash
# List all channels
{baseDir}/scripts/tlon channels list

# List groups only
{baseDir}/scripts/tlon channels groups

# List DM conversations
{baseDir}/scripts/tlon channels dms

# Get channel details
{baseDir}/scripts/tlon channels info --channel chat/~host/channel-name
```

### Message History

```bash
# Channel history (most recent first)
{baseDir}/scripts/tlon history --target chat/~host/channel --limit 20

# DM history
{baseDir}/scripts/tlon history --target ~sampel-palnet --limit 10
```

### Reactions

```bash
# Add reaction
{baseDir}/scripts/tlon react add --channel chat/~host/name --post-id "170.141..." --emoji "👍"

# Remove reaction
{baseDir}/scripts/tlon react remove --channel chat/~host/name --post-id "170.141..."

# React to DM message
{baseDir}/scripts/tlon react add --channel dm/~sampel --post-id "170.141..." --emoji "❤️"
```

### Post Management

```bash
# Edit a post
{baseDir}/scripts/tlon post edit --channel chat/~host/name --post-id "170.141..." --content "Updated text"

# Delete a post
{baseDir}/scripts/tlon post delete --channel chat/~host/name --post-id "170.141..."

# Edit diary post with title
{baseDir}/scripts/tlon post edit --channel diary/~host/name --post-id "170.141..." --title "New Title" --content "Updated content"
```

### DM Management

```bash
# Accept DM invite
{baseDir}/scripts/tlon dm accept --ship ~sampel-palnet

# Decline DM invite
{baseDir}/scripts/tlon dm decline --ship ~sampel-palnet

# Send to club (group DM)
{baseDir}/scripts/tlon dm send --club-id "0v..." --message "Hello everyone"

# Reply in club
{baseDir}/scripts/tlon dm reply --club-id "0v..." --post-id "~zod/170.141..." --message "My reply"
```

**Note:** For 1:1 DMs, use the regular messaging channel, not this skill.

### Notebook Posts

```bash
# Create a notebook/diary post
{baseDir}/scripts/tlon notebook add --channel diary/~host/journal --title "My Post Title" --content "Markdown content here..."

# With cover image
{baseDir}/scripts/tlon notebook add --channel diary/~host/journal --title "My Post" --content "Content..." --image "https://example.com/cover.jpg"
```

### Activity

```bash
# Get unread counts
{baseDir}/scripts/tlon activity unread

# Get recent mentions
{baseDir}/scripts/tlon activity mentions --limit 20

# Get all activity
{baseDir}/scripts/tlon activity all --limit 50
```

### Groups

Full group management capabilities.

```bash
# List your groups
{baseDir}/scripts/tlon groups list

# Get group details
{baseDir}/scripts/tlon groups info --group ~host/slug

# Join/leave groups
{baseDir}/scripts/tlon groups join --group ~host/slug
{baseDir}/scripts/tlon groups leave --group ~host/slug

# Delete a group (host only)
{baseDir}/scripts/tlon groups delete --group ~host/slug

# Invite members
{baseDir}/scripts/tlon groups invite --group ~host/slug --ships ~ship1 ~ship2

# Member management
{baseDir}/scripts/tlon groups kick --group ~host/slug --ships ~ship1
{baseDir}/scripts/tlon groups ban --group ~host/slug --ships ~ship1
{baseDir}/scripts/tlon groups unban --group ~host/slug --ships ~ship1

# Privacy settings
{baseDir}/scripts/tlon groups set-privacy --group ~host/slug --privacy public|private|secret

# Join request handling
{baseDir}/scripts/tlon groups accept-join --group ~host/slug --ships ~ship1
{baseDir}/scripts/tlon groups reject-join --group ~host/slug --ships ~ship1

# Role management
{baseDir}/scripts/tlon groups add-role --group ~host/slug --role admin --title "Admin"
{baseDir}/scripts/tlon groups delete-role --group ~host/slug --role admin
{baseDir}/scripts/tlon groups assign-role --group ~host/slug --role admin --ships ~ship1
{baseDir}/scripts/tlon groups remove-role --group ~host/slug --role admin --ships ~ship1
```

Group ID format: `~host-ship/group-slug` (e.g., `~nocsyx-lassul/bongtable`)

### Settings

Manage bot settings stored in Urbit settings-store.

```bash
# Get all settings
{baseDir}/scripts/tlon settings get

# Set a value
{baseDir}/scripts/tlon settings set --key showModelSig --value true

# Delete a setting
{baseDir}/scripts/tlon settings delete --key someKey

# DM allowlist management
{baseDir}/scripts/tlon settings allow-dm --ship ~sampel-palnet
{baseDir}/scripts/tlon settings remove-dm --ship ~sampel-palnet

# Channel watch list
{baseDir}/scripts/tlon settings allow-channel --channel chat/~host/channel
{baseDir}/scripts/tlon settings remove-channel --channel chat/~host/channel

# Channel access rules
{baseDir}/scripts/tlon settings open-channel --channel chat/~host/channel
{baseDir}/scripts/tlon settings restrict-channel --channel chat/~host/channel --ships ~ship1 ~ship2
```

## Output Format

All commands output JSON:

```json
{"success": true, "data": {...}}
```

On error:

```json
{"success": false, "error": "Error message"}
```

## Common Patterns

### React to the last message in a channel

1. Fetch recent history
2. Extract the post ID from the first result
3. Use react command with that ID

```bash
# Get recent messages
{baseDir}/scripts/tlon history --target chat/~host/channel --limit 1

# Then react to the returned post ID
{baseDir}/scripts/tlon react add --channel chat/~host/channel --post-id "<id-from-above>" --emoji "👍"
```

### Check for mentions

```bash
{baseDir}/scripts/tlon activity mentions --limit 10
```

## ID Formats

- **Ship:** `~sampel-palnet` (with tilde)
- **Channel nest:** `chat/~host/channel-name`, `diary/~host/name`, `heap/~host/name`
- **Post ID:** `~author/170.141.184.507...` or just `170.141.184.507...` (@ud format with dots)
- **Club ID:** `0v...` (for group DMs)

## Troubleshooting

**"Missing environment variables"** - Ensure `TLON_URL`, `TLON_SHIP`, and `TLON_CODE` are set.

**"Login failed"** - Check your access code. Get a new one from your ship's web interface.

**"Scry failed: 404"** - The requested resource doesn't exist (e.g., wrong channel path).
