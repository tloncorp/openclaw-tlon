# OpenClaw Tlon Plugin

Tlon/Urbit channel plugin for [OpenClaw](https://github.com/openclaw/openclaw). Enables your AI agent to communicate via Tlon DMs and group channels.

## Features

- **DMs**: Receive and respond to direct messages
- **Group Channels**: Participate in group chats (mention-triggered or open mode)
- **Thread Replies**: Support for threaded conversations
- **Rich Content**: Images, links, and formatted text
- **Ship Authorization**: Allowlist ships for DM access
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

## Documentation

Full documentation: https://docs.openclaw.ai/channels/tlon

## Bundled Skill

This plugin includes a bundled skill (`skills/tlon/`) for additional operations beyond basic messaging:

- **Contacts**: View and update profiles
- **Channels**: List channels, groups, and DMs
- **History**: Fetch message history
- **Reactions**: Add/remove emoji reactions
- **Posts**: Edit and delete posts
- **Notebooks**: Create diary/notebook posts
- **Activity**: Check unreads and mentions

The skill uses a Python CLI script that agents execute via bash. See `skills/tlon/SKILL.md` for full documentation.

## Development

This repo contains the standalone plugin source. Changes here can be synced to an OpenClaw fork for PRs.

### Workflow

1. **Develop here** - Make changes in this repo
2. **Test locally** - Copy to your OpenClaw's `extensions/tlon/`
3. **Create PR** - Use the sync script to update an OpenClaw fork:

```bash
# Sync to your openclaw fork
./scripts/sync-to-openclaw.sh ~/Projects/openclaw-fork my-feature-branch

# Then in your openclaw fork:
cd ~/Projects/openclaw-fork
git add extensions/tlon
git commit -m "tlon: description of changes"
git push origin my-feature-branch
# Create PR on GitHub
```

### Local Testing

```bash
# Install dependencies
npm install

# Copy to local OpenClaw
cp -r . ~/.openclaw/extensions/tlon/

# Restart OpenClaw gateway
openclaw gateway restart
```

## License

MIT
