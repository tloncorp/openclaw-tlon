#!/bin/bash
set -e

# Ensure HOME is set correctly
export HOME=/root
echo "==> HOME=$HOME"
echo "==> User: $(whoami)"
echo "==> Working directory: $(pwd)"

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
    "defaults": {
      "workspace": "/root/.openclaw/workspace",
      "model": {
        "primary": "${OPENCLAW_MODEL:-openrouter/minimax/minimax-m2.1}"
      }
    },
    "list": [
      {
        "id": "test",
        "identity": {
          "name": "Test Bot",
          "emoji": "🧪"
        }
      }
    ]
  },
  "gateway": {
    "port": 18789,
    "mode": "local",
    "auth": {
      "token": "ci-test-token"
    }
  },
  "plugins": {
    "load": {
      "paths": ["/workspace/openclaw-tlon"]
    },
    "entries": {
      "tlon": {
        "enabled": true
      }
    }
  },
  "channels": {
    "tlon": {
      "enabled": true,
      "url": "${TLON_URL}",
      "ship": "${TLON_SHIP}",
      "code": "${TLON_CODE}",
      "dmAllowlist": ["${TLON_DM_ALLOWLIST}"]
    }
  }
}
EOF

# Create minimal workspace with test prompts
WORKSPACE_DIR=/root/.openclaw/workspace
mkdir -p "$WORKSPACE_DIR"

# Create sessions directory for agent "test"
SESSIONS_DIR=/root/.openclaw/agents/test/sessions
mkdir -p "$SESSIONS_DIR"
echo "==> Sessions directory: $SESSIONS_DIR"

# Debug: show directory structure
echo "==> Directory structure:"
ls -la /root/.openclaw/
ls -la /root/.openclaw/agents/ 2>/dev/null || true
ls -la /root/.openclaw/agents/test/ 2>/dev/null || true

cat > "$WORKSPACE_DIR/SOUL.md" << EOF
You are a test bot running integration tests.
Reply helpfully to any message.
When asked to create groups or manage channels, do so.
EOF

echo "==> Starting OpenClaw gateway..."
exec openclaw gateway --port 18789 --bind lan --verbose
