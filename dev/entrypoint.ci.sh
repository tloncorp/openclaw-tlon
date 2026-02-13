#!/bin/bash
set -e

# Ensure HOME is set correctly
export HOME=/root
export OPENCLAW_STATE_DIR=/root/.openclaw
echo "==> HOME=$HOME"
echo "==> OPENCLAW_STATE_DIR=$OPENCLAW_STATE_DIR"
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

# Write config - use EOF (not 'EOFCONFIG') to allow env var expansion for API key
cat > "$CONFIG_DIR/openclaw.json" << EOF
{
  "agents": {
    "defaults": {
      "workspace": "/root/.openclaw/workspace",
      "model": {
        "primary": "openrouter/minimax/minimax-m2.1"
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
      "url": "http://ships:8080",
      "ship": "~zod",
      "code": "lidlut-tabwed-pillex-ridrup",
      "dmAllowlist": ["~ten"]
    }
  }
}
EOF

echo "==> Config written:"
cat "$CONFIG_DIR/openclaw.json"

# Create minimal workspace with test prompts
WORKSPACE_DIR=/root/.openclaw/workspace
mkdir -p "$WORKSPACE_DIR"

# Create sessions directory and sessions.json file for agent "test"
# NOTE: sessions.json goes INSIDE the sessions directory, not outside
SESSIONS_DIR=/root/.openclaw/agents/test/sessions
mkdir -p "$SESSIONS_DIR"
SESSIONS_FILE="$SESSIONS_DIR/sessions.json"
echo "{}" > "$SESSIONS_FILE"
echo "==> Sessions dir: $SESSIONS_DIR"
echo "==> Sessions file: $SESSIONS_FILE"

# Debug: show directory structure
echo "==> Directory structure:"
ls -la /root/.openclaw/
ls -la /root/.openclaw/agents/ 2>/dev/null || true
ls -la /root/.openclaw/agents/test/ 2>/dev/null || true

cat > "$WORKSPACE_DIR/SOUL.md" << 'EOF'
You are a test bot running integration tests.
Reply helpfully to any message.
When asked to create groups or manage channels, do so.
EOF

echo "==> Starting OpenClaw gateway..."
exec openclaw gateway --port 18789 --bind lan --verbose
