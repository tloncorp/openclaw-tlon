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

echo "==> Installing tlon-skill..."
npm install -g @tloncorp/tlon-skill

# Link tlon-skill into OpenClaw's skills directory so it can find SKILL.md
OPENCLAW_SKILLS="$(npm root -g)/openclaw/skills"
TLON_SKILL_PKG="$(npm root -g)/@tloncorp/tlon-skill"
if [ -d "$OPENCLAW_SKILLS" ] && [ -d "$TLON_SKILL_PKG" ]; then
  echo "==> Linking tlon-skill into OpenClaw skills directory..."
  ln -sf "$TLON_SKILL_PKG" "$OPENCLAW_SKILLS/tlon"
  ls -la "$OPENCLAW_SKILLS/"
fi

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
      "dmAllowlist": ["~ten"]
    }
  }
}
EOF

echo "==> Config written:"
cat "$CONFIG_DIR/openclaw.json"

# Create workspace and copy prompts from tlonbot
WORKSPACE_DIR=/root/.openclaw/workspace
mkdir -p "$WORKSPACE_DIR"

# Fetch tlonbot prompts directly from GitHub
echo "==> Fetching tlonbot prompts..."
TLONBOT_RAW="https://raw.githubusercontent.com/tloncorp/tlonbot/master/prompts"
for f in SOUL.md TOOLS.md BOOTSTRAP.md USER.md; do
  curl -fsSL "$TLONBOT_RAW/$f" -o "$WORKSPACE_DIR/$f" 2>/dev/null && echo "  - $f" || true
done
echo "==> Workspace contents:"
ls -la "$WORKSPACE_DIR/"

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

# Fallback SOUL.md if tlonbot prompts weren't fetched
if [ ! -f "$WORKSPACE_DIR/SOUL.md" ]; then
  cat > "$WORKSPACE_DIR/SOUL.md" << 'EOF'
You are a test bot running integration tests.
Reply helpfully to any message.
When asked to create groups or manage channels, do so.
EOF
fi

echo "==> Starting OpenClaw gateway..."
exec openclaw gateway --port 18789 --bind lan --verbose
