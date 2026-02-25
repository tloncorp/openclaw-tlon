# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OpenClaw Tlon Plugin - Enables AI agents to communicate via Tlon DMs and group channels on Urbit. This is a channel plugin for the [OpenClaw](https://github.com/openclaw/openclaw) AI agent framework.

## Commands

```bash
# Development
pnpm dev                    # Run dev environment (uses Docker)
docker compose -f dev/docker-compose.yml up --build  # Full dev with hot-reload

# Testing
pnpm test                   # Run unit tests (src/)
pnpm test:watch             # Watch mode
pnpm test:security          # Security tests only (src/security.test.ts)
pnpm test:integration       # Run integration tests (starts ephemeral fakezod ships)
pnpm test:integration:dev   # Run integration tests against running dev environment
pnpm test:integration:watch # Watch mode for dev environment

# Linting & Formatting
pnpm lint                   # Type-aware lint with oxlint
pnpm lint:fix               # Auto-fix lint issues
pnpm format                 # Check formatting with oxfmt
pnpm format:fix             # Auto-fix formatting
```

## Architecture

```
index.ts                    # Plugin entry - registers tlonPlugin with OpenClaw
src/
├── channel.ts              # Main ChannelPlugin implementation (outbound messaging, setup, status)
├── types.ts                # TlonResolvedAccount type and resolveTlonAccount()
├── config-schema.ts        # Zod schema for channel config validation
├── settings.ts             # Hot-reload config via Urbit settings-store (poke/scry)
├── targets.ts              # Target parsing (DM ship or channel nest)
├── onboarding.ts           # Interactive setup flow
├── monitor/
│   ├── index.ts            # Main SSE event loop - handles inbound messages
│   ├── approval.ts         # DM/channel/group approval workflow
│   ├── discovery.ts        # Auto-discover channels in joined groups
│   ├── history.ts          # Message history and caching
│   └── utils.ts            # Bot mention detection, DM allowlist checks
└── urbit/
    ├── sse-client.ts       # SSE subscription client for Urbit
    ├── auth.ts             # +code authentication
    ├── send.ts             # Send DMs and group messages
    └── story.ts            # Build Urbit story format (content blocks)
```

### Key Patterns

- **Plugin SDK**: Implements `ChannelPlugin` interface from `openclaw/plugin-sdk`
- **Dual message paths**: Monitor uses SSE for inbound; outbound uses HTTP-only pokes to avoid SSE conflicts
- **Settings hot-reload**: Config can be updated via Urbit's settings-store without restart
- **Authorization cascade**: Settings store overrides file config; default to "restricted" mode

### Security Model

See [SECURITY.md](SECURITY.md) for invariants. Key principles:
- **DMs**: Deny by default - only `dmAllowlist` ships can message
- **Channels**: "restricted" mode by default - only `allowedShips` trigger responses
- **Group invites**: Require `groupInviteAllowlist` validation when auto-accepting

## Dependencies

- `@tloncorp/api` - Shared Urbit API library (from github:tloncorp/api-beta)
- `@tloncorp/tlon-skill` - CLI skill for Tlon operations (bundled automatically)
- `@urbit/http-api` / `@urbit/aura` - Urbit primitives

## Dev Environment Setup

1. Clone repo and run `./dev/setup.sh` (clones api-beta, creates .env)
2. Configure `.env` with ship credentials (TLON_URL uses `host.docker.internal` for Docker)
3. Run `docker compose -f dev/docker-compose.yml up --build`

## CI

Tests run on PRs to master. Note: `config-schema.test.ts` is excluded in CI (requires OpenClaw runtime).
