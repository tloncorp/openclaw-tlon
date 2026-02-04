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

## Installation

This plugin is included with OpenClaw. Enable it in your config:

```yaml
channels:
  tlon:
    enabled: true
    ship: "~your-ship"
    url: "https://your-ship.tlon.network"
    code: "your-access-code"
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

Reply "approve" or "deny" (ID: dm-1234567890-abc)
```

Simply reply with `approve` or `deny`. On approval:
- For DMs: The ship is added to `dmAllowlist` and the original message is processed
- For channel mentions: The ship is added to that channel's allowlist and the original message is processed
- For group invites: The bot joins the group (each invite requires separate approval)

You can also specify an ID to handle multiple pending requests: `approve dm-1234567890-abc`

### Notes

- The owner ship is always allowed to DM the bot (can't lock yourself out)
- Pending approvals persist across restarts via settings-store
- Denials are silent (the requester receives no notification)

## Documentation

Full documentation: https://docs.openclaw.ai/channels/tlon

## Companion Skill

For group administration, message history, and other API operations, see the [Tlon Skill](https://github.com/tloncorp/tlon-skill).

## Development

### Prerequisites

- Docker
- [GitHub CLI](https://cli.github.com/) (`gh`) authenticated with access to tloncorp repos
- A local Urbit ship running (e.g., on `http://localhost:8080`)
- Anthropic API key

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

# 4. Start the dev environment
docker compose -f dev/docker-compose.yml up --build

# 5. Access OpenClaw at http://localhost:18789
```

### Directory Structure

After setup, you'll have three sibling directories:

```
parent/
├── api-beta/           # @tloncorp/api - shared API library
├── tlon-skill/         # AgentSkills skill with tlon-run CLI
└── openclaw-tlon/      # This repo - OpenClaw plugin
```

All three are mounted into the Docker container and linked via npm link.

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
