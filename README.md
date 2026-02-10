# OpenClaw Tlon Plugin

Tlon/Urbit channel plugin for [OpenClaw](https://github.com/openclaw/openclaw). Enables your AI agent to communicate via Tlon DMs and group channels.

## Features

- **DMs**: Receive and respond to direct messages
- **Group Channels**: Participate in group chats (mention-triggered or open mode)
- **Thread Replies**: Support for threaded conversations
- **Rich Content**: Images, links, and formatted text
- **Ship Authorization**: Allowlist ships for DM access
- **Channel Authorization**: Per-channel ship allowlists with open/restricted modes
- **Approval System**: Approve/deny new DMs, channel mentions, and group invites via DM
- **Settings Store**: Hot-reload config via Urbit settings-store (no restart needed)
- **Auto-Discovery**: Automatically monitors all channels in joined groups
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

### Full Configuration Example

```yaml
channels:
  tlon:
    enabled: true
    ship: "~your-ship"
    url: "https://your-ship.tlon.network"
    code: "your-access-code"
    
    # Owner receives approval requests and can manage the bot
    ownerShip: "~your-main-ship"
    
    # Ships allowed to DM the bot directly
    dmAllowlist:
      - "~trusted-friend"
      - "~another-ship"
    
    # Auto-accept settings
    autoAcceptDmInvites: true      # Accept DMs from ships in dmAllowlist
    autoAcceptGroupInvites: false  # Require approval for group invites
    
    # Channel discovery
    autoDiscoverChannels: true     # Monitor all channels in joined groups
    groupChannels:                 # Additional channels to monitor explicitly
      - "chat/~host-ship/channel-name"
    
    # Per-channel authorization
    authorization:
      channelRules:
        "chat/~host/public-channel":
          mode: "open"             # Anyone can interact
        "chat/~host/private-channel":
          mode: "restricted"
          allowedShips:
            - "~specific-ship"
    
    # Ships authorized by default for restricted channels
    defaultAuthorizedShips:
      - "~always-allowed"
    
    # Show model info in responses
    showModelSignature: false
```

## Approval System

The approval system lets you control who can interact with your bot. When `ownerShip` is configured, you'll receive DM notifications for:

- **DM requests** from ships not on your `dmAllowlist`
- **Channel mentions** from ships not authorized for that channel
- **Group invites** (if `autoAcceptGroupInvites` is false)

### Usage

When someone not on the allowlist tries to interact, you'll receive a DM like:

```
New DM request from ~sampel-palnet:
"Hello, I'd like to chat with your bot..."

Reply "approve", "deny", or "block" (ID: dm-1234567890-abc)
```

- **approve**: Allow the interaction and add to allowlist. Original message is processed.
- **deny**: Reject silently. Ship can try again later.
- **block**: Permanently block using Tlon's native blocking.

### Admin Commands

The owner can send these commands via DM:

| Command | Description |
|---------|-------------|
| `blocked` | List all blocked ships |
| `pending` | List pending approval requests |
| `unblock ~ship` | Unblock a ship |

## Bundled Skill

This plugin bundles [@tloncorp/tlon-skill](https://www.npmjs.com/package/@tloncorp/tlon-skill) which provides CLI commands for:

- Contacts and profile management
- Channel listing and history
- Group administration
- Message posting and reactions
- Settings management

The skill is automatically available to your agent. For standalone usage, see the [tlon-skill repo](https://github.com/tloncorp/tlon-skill).

## Documentation

Full documentation: https://docs.openclaw.ai/channels/tlon

## Development

### Prerequisites

- Docker
- [GitHub CLI](https://cli.github.com/) (`gh`) authenticated with tloncorp access
- A local Urbit ship (e.g., on `http://localhost:8080`)
- Anthropic API key (or OpenRouter for alternative models)

### Quick Start

```bash
# 1. Clone this repo
gh repo clone tloncorp/openclaw-tlon
cd openclaw-tlon

# 2. Run setup (clones api-beta, creates .env)
./dev/setup.sh

# 3. Edit .env with your credentials
#    - ANTHROPIC_API_KEY or OPENROUTER_API_KEY
#    - TLON_URL: http://host.docker.internal:<port> (not localhost!)
#    - TLON_SHIP, TLON_CODE
#    - TLON_DM_ALLOWLIST, TLON_OWNER_SHIP

# 4. Start dev environment
docker compose -f dev/docker-compose.yml up --build

# 5. Access OpenClaw at http://localhost:18789
```

### Directory Structure

```
parent/
├── api-beta/           # @tloncorp/api - shared API library (cloned by setup)
└── openclaw-tlon/      # This repo
```

The tlon-skill is installed via npm and doesn't need to be cloned separately.

### Making Changes

1. Edit code in either repo
2. Restart container: `docker compose -f dev/docker-compose.yml up --build`
3. For faster iteration, run OpenClaw directly on host with npm link

## License

MIT
