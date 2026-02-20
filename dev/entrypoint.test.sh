#!/bin/bash
set -e

# Ensure HOME is set correctly
export HOME=/root
export OPENCLAW_STATE_DIR=/root/.openclaw
echo "==> HOME=$HOME"
echo "==> OPENCLAW_STATE_DIR=$OPENCLAW_STATE_DIR"
echo "==> User: $(whoami)"
echo "==> Working directory: $(pwd)"

echo "==> Fixing plugin directory ownership..."
chown -R root:root /workspace/openclaw-tlon

echo "==> Installing plugin dependencies..."
cd /workspace/openclaw-tlon
npm install

# tlon-skill comes in as plugin dependency (see package.json)
echo "==> Checking tlon-skill from plugin dependencies..."
ls -la /workspace/openclaw-tlon/node_modules/@tloncorp/tlon-skill/ 2>/dev/null || echo "  (in container node_modules volume)"

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
        "primary": "${MODEL:-openrouter/minimax/minimax-m2.1}"
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
  "tools": {
    "allow": [
      "web_fetch",
      "web_search",
      "read",
      "cron",
      "tlon"
    ],
    "deny": [
      "apply_patch",
      "bash",
      "canvas",
      "edit",
      "exec",
      "gateway",
      "nodes",
      "process",
      "write"
    ]
  },
  "skills": {
    "entries": {
      "tlon": {
        "enabled": true,
        "env": {
          "URBIT_URL": "http://ships:8080",
          "URBIT_SHIP": "~zod",
          "URBIT_CODE": "lidlut-tabwed-pillex-ridrup"
        }
      }
    }
  },
  "channels": {
    "tlon": {
      "enabled": true,
      "url": "http://ships:8080",
      "ship": "~zod",
      "code": "lidlut-tabwed-pillex-ridrup",
      "ownerShip": "~ten",
      "dmAllowlist": ["~ten"],
      "allowPrivateNetwork": true
    }
  }
}
EOF

echo "==> Config written:"
cat "$CONFIG_DIR/openclaw.json"

# Create workspace
WORKSPACE_DIR=/root/.openclaw/workspace
mkdir -p "$WORKSPACE_DIR"

# Load tlonbot prompts - prefer mounted volume, fallback to GitHub fetch
echo "==> Loading tlonbot prompts..."
if [ -d "/workspace/tlonbot/prompts" ]; then
  echo "  (using mounted tlonbot volume)"
  for f in SOUL.md TOOLS.md BOOTSTRAP.md USER.md AGENTS.md; do
    if [ -f "/workspace/tlonbot/prompts/$f" ]; then
      cp "/workspace/tlonbot/prompts/$f" "$WORKSPACE_DIR/$f" && echo "  - $f" || echo "  - $f (failed)"
    fi
  done
elif [ -n "$TLONBOT_TOKEN" ]; then
  echo "  (fetching from GitHub with TLONBOT_TOKEN)"
  TLONBOT_RAW="https://raw.githubusercontent.com/tloncorp/tlonbot/master/prompts"
  for f in SOUL.md TOOLS.md BOOTSTRAP.md USER.md AGENTS.md; do
    curl -fsSL -H "Authorization: token $TLONBOT_TOKEN" "$TLONBOT_RAW/$f" -o "$WORKSPACE_DIR/$f" 2>/dev/null && echo "  - $f" || echo "  - $f (failed)"
  done
else
  echo "  (no tlonbot mount or token, trying public GitHub access)"
  TLONBOT_RAW="https://raw.githubusercontent.com/tloncorp/tlonbot/master/prompts"
  for f in SOUL.md TOOLS.md BOOTSTRAP.md USER.md AGENTS.md; do
    curl -fsSL "$TLONBOT_RAW/$f" -o "$WORKSPACE_DIR/$f" 2>/dev/null && echo "  - $f" || true
  done
fi

# Fallback SOUL.md if prompts weren't loaded
if [ ! -f "$WORKSPACE_DIR/SOUL.md" ]; then
  cat > "$WORKSPACE_DIR/SOUL.md" << 'EOFPROMPT'
You are a test bot running integration tests.
Reply helpfully to any message.
When asked to create groups, manage channels, or update your profile, do so.
Use the tlon skill for Tlon/Urbit operations.
EOFPROMPT
fi

echo "==> Workspace contents:"
ls -la "$WORKSPACE_DIR/"

# Create sessions directory
SESSIONS_DIR=/root/.openclaw/agents/test/sessions
mkdir -p "$SESSIONS_DIR"
echo "{}" > "$SESSIONS_DIR/sessions.json"

echo "==> Directory structure:"
ls -la /root/.openclaw/
ls -la /root/.openclaw/agents/test/ 2>/dev/null || true

echo "==> Starting OpenClaw gateway..."
exec openclaw gateway --port 18789 --bind lan --verbose
