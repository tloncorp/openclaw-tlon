---
name: tlon
description: Interact with Tlon/Urbit using the @tloncorp/api. Use for contacts, channels, message history, posts, groups (create/invite/kick/ban/roles), DMs, activity, and settings.
metadata:
  {
    "openclaw":
      {
        "emoji": "⛵",
        "requires": { "bins": ["node"], "env": ["TLON_URL", "TLON_SHIP", "TLON_CODE"] },
        "primaryEnv": "TLON_CODE",
      },
  }
---

# Tlon Skill

CLI for interacting with Tlon/Urbit beyond basic messaging. Built on [@tloncorp/api](https://github.com/tloncorp/api-beta).

**Note:** Basic send/receive is handled by the Tlon channel plugin automatically. Use this skill for additional operations like viewing history, managing groups, adding reactions, and posting to notebooks.

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

# List groups
{baseDir}/scripts/tlon channels groups

# List DM conversations
{baseDir}/scripts/tlon channels dms

# Get channel details
{baseDir}/scripts/tlon channels info --channel chat/~host/channel-name

# Search messages in a channel
{baseDir}/scripts/tlon channels search --channel chat/~host/channel --query "search term"
```

### Message History

```bash
# Channel history (most recent first)
{baseDir}/scripts/tlon history --target chat/~host/channel --limit 20

# DM history
{baseDir}/scripts/tlon history --target ~sampel-palnet --limit 10
```

### Groups

Full group management capabilities.

```bash
# List your groups
{baseDir}/scripts/tlon groups list

# Get group details
{baseDir}/scripts/tlon groups info --group ~host/slug

# Create a new group
{baseDir}/scripts/tlon groups create --title "My Group" --description "A cool group"

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

### Posts

```bash
# Send a message to a channel
{baseDir}/scripts/tlon posts send --channel chat/~host/channel --content "Hello world!"

# Reply to a post
{baseDir}/scripts/tlon posts reply --channel chat/~host/channel --post-id "170.141..." --content "My reply"

# Edit a post
{baseDir}/scripts/tlon posts edit --channel chat/~host/channel --post-id "170.141..." --content "Updated text"

# Delete a post
{baseDir}/scripts/tlon posts delete --channel chat/~host/channel --post-id "170.141..."

# Add reaction
{baseDir}/scripts/tlon posts react --channel chat/~host/channel --post-id "170.141..." --emoji "👍"

# Remove reaction
{baseDir}/scripts/tlon posts react --channel chat/~host/channel --post-id "170.141..." --remove
```

### DM Management

```bash
# Accept DM invite
{baseDir}/scripts/tlon dm accept --ship ~sampel-palnet

# Decline DM invite
{baseDir}/scripts/tlon dm decline --ship ~sampel-palnet

# Create group DM
{baseDir}/scripts/tlon dm create --ships ~ship1 ~ship2 ~ship3
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

### Settings

```bash
# Get all settings
{baseDir}/scripts/tlon settings get

# Set a value
{baseDir}/scripts/tlon settings set --key showModelSig --value true
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

## ID Formats

- **Ship:** `~sampel-palnet` (with tilde)
- **Group ID:** `~host-ship/group-slug` (e.g., `~nocsyx-lassul/bongtable`)
- **Channel ID:** `chat/~host/channel-name`, `diary/~host/name`, `heap/~host/name`
- **Post ID:** `170.141.184.507...` (@ud format with dots)

## Troubleshooting

**"Missing environment variables"** - Ensure `TLON_URL`, `TLON_SHIP`, and `TLON_CODE` are set.

**"Login failed"** - Check your access code. Get a new one from your ship's web interface.

**"Could not resolve"** - The requested resource doesn't exist (e.g., wrong channel path).
