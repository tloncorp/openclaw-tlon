#!/bin/bash
set -e

echo "==> Installing plugin dependencies..."
cd /workspace/openclaw-tlon
npm install

# Remove bundled tlon plugin to avoid duplicate ID conflict
rm -rf "$(npm root -g)/openclaw/extensions/tlon"

# Create minimal config for CI
CONFIG_DIR=/root/.openclaw
mkdir -p "$CONFIG_DIR"

cat > "$CONFIG_DIR/openclaw.json" << EOF
{
  "agents": {
    "default": {
      "model": "anthropic/claude-sonnet-4-20250514"
    }
  },
  "tlon": {
    "url": "${TLON_URL}",
    "ship": "${TLON_SHIP}",
    "code": "${TLON_CODE}",
    "dmAllowlist": ["~bus"]
  },
  "gateway": {
    "port": 18789
  },
  "plugins": {
    "load": {
      "paths": ["/workspace/openclaw-tlon"]
    }
  }
}
EOF

# Create minimal workspace with test prompts
WORKSPACE_DIR=/root/.openclaw/workspace
mkdir -p "$WORKSPACE_DIR"

cat > "$WORKSPACE_DIR/SOUL.md" << EOF
You are a test bot running integration tests.
Reply helpfully to any message.
When asked to create groups or manage channels, do so.
EOF

echo "==> Starting OpenClaw gateway..."
exec openclaw gateway --port 18789 --bind lan
