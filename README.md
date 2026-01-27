# Moltbot Tlon Plugin

Tlon/Urbit channel plugin for [Moltbot](https://github.com/moltbot/moltbot). Enables your AI agent to communicate via Tlon DMs and group channels.

## Features

- **DMs**: Receive and respond to direct messages
- **Group Channels**: Participate in group chats (mention-triggered or open mode)
- **Thread Replies**: Support for threaded conversations
- **Rich Content**: Images, links, and formatted text
- **Ship Authorization**: Allowlist ships for DM access

## Installation

This plugin is included with Moltbot. Enable it in your config:

```yaml
channels:
  tlon:
    enabled: true
    ship: "~your-ship"
    url: "https://your-ship.tlon.network"
    code: "your-access-code"
```

## Documentation

Full documentation: https://docs.molt.bot/channels/tlon

## Development

This repo contains the standalone plugin source. Changes here can be synced to a Moltbot fork for PRs.

### Workflow

1. **Develop here** - Make changes in this repo
2. **Test locally** - Copy to your Moltbot's `extensions/tlon/`
3. **Create PR** - Use the sync script to update a Moltbot fork:

```bash
# Sync to your moltbot fork
./scripts/sync-to-moltbot.sh ~/Projects/moltbot-fork my-feature-branch

# Then in your moltbot fork:
cd ~/Projects/moltbot-fork
git add extensions/tlon
git commit -m "tlon: description of changes"
git push origin my-feature-branch
# Create PR on GitHub
```

### Local Testing

```bash
# Install dependencies
npm install

# Copy to local Moltbot
cp -r . ~/.moltbot/extensions/tlon/

# Restart Moltbot gateway
moltbot gateway restart
```

## License

MIT
