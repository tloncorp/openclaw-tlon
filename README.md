# OpenClaw Tlon Plugin

Tlon/Urbit channel plugin for [OpenClaw](https://github.com/openclaw/openclaw). Enables your AI agent to communicate via Tlon DMs and group channels.

## Features

- **DMs**: Receive and respond to direct messages
- **Group Channels**: Participate in group chats (mention-triggered or open mode)
- **Thread Replies**: Support for threaded conversations
- **Rich Content**: Images, links, and formatted text
- **Ship Authorization**: Allowlist ships for DM access
- **Approval System**: Approve/deny new DMs, channel mentions, and group invites via DM
- **Settings Store**: Hot-reload config via Urbit settings-store
- **SSE Ack**: Proper event acknowledgment for reliable message delivery
- **Cite Resolution**: Parse and fetch quoted message content
- **Stream Mode**: Optional partial reply streaming with in-place edits (group channels only)

## Installation

This plugin is included with OpenClaw. Enable it in your config:

```yaml
channels:
  tlon:
    enabled: true
    ship: "~your-ship"
    url: "https://your-ship.tlon.network"
    code: "your-access-code"
    ownerShip: "~your-owner-ship"  # Receives approval requests
    dmAllowlist:
      - "~trusted-ship"
    streamMode: "off"  # "off" or "partial" (group channels only)
```

## Approval System

The approval system lets you control who can interact with your bot. When enabled, you'll receive DM notifications for:

- **DM requests** from ships not on your `dmAllowlist`
- **Channel mentions** from ships not authorized for that channel
- **Group invites** from ships not on your `groupInviteAllowlist`

### Setup

Add `ownerShip` to your config (the ship that will receive approval requests):

```yaml
channels:
  tlon:
    ownerShip: "~your-ship"
```

Or set the `TLON_OWNER_SHIP` environment variable.

### Usage

When someone not on the allowlist tries to interact, you'll receive a DM like:

```
New DM request from ~sampel-palnet:
"Hello, I'd like to chat with your bot..."

Reply "approve", "deny", or "block" (ID: dm-1234567890-abc)
```

Reply with `approve`, `deny`, or `block`:
- **approve**: Allow the interaction. For DMs, adds to `dmAllowlist`. For channels, adds to that channel's allowlist. The original message is then processed.
- **deny**: Reject this request. The ship can try again later.
- **block**: Permanently block the ship using Tlon's native blocking. All future messages are silently ignored.

For group invites, `approve` joins the group (each invite requires separate approval).

You can also specify an ID to handle multiple pending requests: `approve dm-1234567890-abc`

### Notes

- The owner ship is always allowed to DM the bot (can't lock yourself out)
- Pending approvals persist across restarts via settings-store
- Denials are silent (the requester receives no notification)

### Admin Commands

The owner can also send these commands via DM to manage the bot:

| Command | Description |
|---------|-------------|
| `blocked` | List all currently blocked ships |
| `pending` | List all pending approval requests |
| `unblock ~ship` | Unblock a previously blocked ship |

These commands are handled directly and don't go to the LLM.

## Stream Mode

Stream mode enables partial reply streaming for group channels. When enabled, the bot sends an initial message as soon as content starts generating, then edits it in place as more content arrives.

```yaml
channels:
  tlon:
    streamMode: "partial"  # Enable streaming
```

**Options:**
- `off` (default): Wait for complete response before sending
- `partial`: Send initial message early, edit as content grows

**Limitations:**
- Only works in group channels (DMs don't support message editing)
- Tlon caps messages at ~4096 characters
- May look "janky" as the message updates in place

## Documentation

Full documentation: https://docs.openclaw.ai/channels/tlon

## Companion Skill

The plugin bundles [@tloncorp/tlon-skill](https://www.npmjs.com/package/@tloncorp/tlon-skill) for group administration, message history, and other API operations. It's automatically installed as an npm dependency.

For standalone usage or development, see the [tlon-skill repo](https://github.com/tloncorp/tlon-skill).

## Development

### Prerequisites

- Docker
- [GitHub CLI](https://cli.github.com/) (`gh`) authenticated with access to tloncorp repos
- A local Urbit ship running (e.g., on `http://localhost:8080`)
- Anthropic API key (or OpenRouter API key for alternative models)

### Quick Start

```bash
# 1. Clone this repo
gh repo clone tloncorp/openclaw-tlon
cd openclaw-tlon

# 2. Run setup (clones api-beta and tlon-skill as siblings, creates .env)
./dev/setup.sh

# 3. Edit .env with your credentials
#    - ANTHROPIC_API_KEY: Your Anthropic API key
#    - TLON_URL: Use http://host.docker.internal:<port> (not localhost!)
#    - TLON_SHIP: Your ship name (e.g., ~zod)
#    - TLON_CODE: Your ship's access code
#    - TLON_DM_ALLOWLIST: Your ship (to allow DMs to the bot)
#    - TLON_OWNER_SHIP: Your ship (to receive approval requests)
#
# Optional: Use OpenRouter for alternative models
#    - MODEL: e.g., openrouter/anthropic/claude-sonnet-4-5
#    - OPENROUTER_API_KEY: Your OpenRouter API key

# 4. Start the dev environment
docker compose -f dev/docker-compose.yml up --build

# 5. Access OpenClaw at http://localhost:18789
```

### Directory Structure

After setup, you'll have two sibling directories:

```
parent/
├── api-beta/           # @tloncorp/api - shared API library
└── openclaw-tlon/      # This repo - OpenClaw plugin
```

The tlon-skill is installed via npm (`@tloncorp/tlon-skill`) and doesn't need to be cloned separately for normal development.

### Making Changes

1. Edit code in any of the three repos
2. Restart the container to rebuild: `docker compose -f dev/docker-compose.yml up --build`
3. For faster iteration, you can also run OpenClaw directly on your host with npm link

### Legacy Workflow

For syncing to an OpenClaw fork (for upstream PRs):

```bash
# Sync to your openclaw fork
./scripts/sync-to-openclaw.sh ~/Projects/openclaw-fork my-feature-branch

# Then in your openclaw fork:
cd ~/Projects/openclaw-fork
git add extensions/tlon
git commit -m "tlon: description of changes"
git push origin my-feature-branch
```

## License

MIT
