#!/bin/bash
set -e

# Validate repos are mounted
for repo in api-beta tlon-skill openclaw-tlon; do
  if [ ! -f "/workspace/$repo/package.json" ]; then
    echo "ERROR: /workspace/$repo not found. Run ./dev/setup.sh first."
    exit 1
  fi
done

echo "==> Setting up npm links..."

# Build and link api-beta
cd /workspace/api-beta
npm install
npm run build
npm link

# Build and link tlon-skill (depends on api-beta)
cd /workspace/tlon-skill
npm link @tloncorp/api
npm install
npm run build
npm link

# Install openclaw-tlon plugin dependencies
cd /workspace/openclaw-tlon
npm install
# No build step needed - OpenClaw loads TypeScript directly
# Note: When migrating to @tloncorp/api, add: npm link @tloncorp/api

# Remove bundled tlon plugin to avoid duplicate ID conflict
rm -rf "$(npm root -g)/openclaw/extensions/tlon"

# Plugin is loaded from /workspace/openclaw-tlon via plugins.load.paths in config

# Install skill (symlink so changes persist to host)
mkdir -p /root/.openclaw/skills
ln -sf /workspace/tlon-skill /root/.openclaw/skills/tlon
ln -sf /workspace/tlon-skill/bin/tlon-run /usr/local/bin/tlon-run

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
