#!/bin/bash
set -e

# Validate plugin repo is mounted
if [ ! -f "/workspace/openclaw-tlon/package.json" ]; then
  echo "ERROR: /workspace/openclaw-tlon not found. Run ./dev/setup.sh first."
  exit 1
fi

echo "==> Installing plugin dependencies..."

# Install openclaw-tlon plugin dependencies (includes @tloncorp/tlon-skill from npm)
cd /workspace/openclaw-tlon
npm install

# Link api-beta if mounted (for local development)
if [ -f "/workspace/api-beta/package.json" ]; then
  cd /workspace/api-beta
  
  # Only install/build if not already done
  if [ ! -d "node_modules" ]; then
    echo "==> Installing api-beta dependencies..."
    npm install
  fi
  
  if [ ! -d "dist" ]; then
    echo "==> Building api-beta..."
    npm run build
  fi
  
  # Always ensure link is set up
  npm link 2>/dev/null || true
  cd /workspace/openclaw-tlon
  npm link @tloncorp/api 2>/dev/null || true
fi

# Remove bundled tlon plugin to avoid duplicate ID conflict
rm -rf "$(npm root -g)/openclaw/extensions/tlon"

# Plugin is loaded from /workspace/openclaw-tlon via plugins.load.paths in config
# Skill is loaded from node_modules/@tloncorp/tlon-skill (via plugin's skills path)

# Upsert a marked block into a file (preserves content outside the markers)
# Usage: upsert_block <file> <content>
# Content must include <!-- idempotency-marker:...:v1 --> and <!-- /idempotency-marker --> markers
upsert_block() {
  local file="$1"
  local content="$2"

  # Extract marker from content (first line)
  local marker
  marker=$(echo "$content" | head -1)

  # Create file if it doesn't exist
  [ -f "$file" ] || touch "$file"

  # Read existing content
  local existing
  existing=$(cat "$file")

  # Remove existing block if present (marker through end marker)
  # Use perl for reliable multiline regex
  existing=$(echo "$existing" | perl -0777 -pe "s/\n?${marker}.*?<!-- \/idempotency-marker -->\n?//s")

  # Append new block
  echo "${existing}

${content}" > "$file"
}

# Install prompts into workspace (upsert pattern preserves existing content)
echo "==> Installing prompts..."
WORKSPACE_DIR=/root/.openclaw/workspace
mkdir -p "$WORKSPACE_DIR"

# SOUL.md needs variable substitution
upsert_block "$WORKSPACE_DIR/SOUL.md" "$(envsubst < /workspace/openclaw-tlon/prompts/SOUL.md)"
# USER.md and TOOLS.md are static
upsert_block "$WORKSPACE_DIR/USER.md" "$(cat /workspace/openclaw-tlon/prompts/USER.md)"
upsert_block "$WORKSPACE_DIR/TOOLS.md" "$(cat /workspace/openclaw-tlon/prompts/TOOLS.md)"

# Generate gateway token if not set
if [ -z "$OPENCLAW_GATEWAY_TOKEN" ]; then
  export OPENCLAW_GATEWAY_TOKEN=$(cat /proc/sys/kernel/random/uuid)
  echo "==> Generated gateway token: $OPENCLAW_GATEWAY_TOKEN"
fi

echo "==> Starting OpenClaw gateway..."
echo "==> Access at: http://localhost:18789/?token=$OPENCLAW_GATEWAY_TOKEN"
exec openclaw gateway --port 18789 --bind lan --token "$OPENCLAW_GATEWAY_TOKEN"
