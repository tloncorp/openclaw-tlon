#!/bin/bash
set -euo pipefail

PLUGIN_DIR="${PLUGIN_DIR:-/workspace/openclaw-tlon}"
TLON_APPS_DIR="${TLON_APPS_DIR:-/workspace/tlon-apps}"
LOCAL_API_DIR="$TLON_APPS_DIR/packages/api"
LOCAL_DIST_DIR="$LOCAL_API_DIR/dist"

if [ ! -f "$LOCAL_API_DIR/package.json" ]; then
  echo "==> No local tlon-apps API checkout found at $LOCAL_API_DIR; using published @tloncorp/api"
  exit 0
fi

if [ ! -f "$LOCAL_DIST_DIR/index.js" ]; then
  echo "==> No local tlon-apps API build found at $LOCAL_DIST_DIR"
  echo "==> Using published @tloncorp/api. Build it locally with:"
  echo "==>   pnpm --dir $TLON_APPS_DIR --filter @tloncorp/api build"
  exit 0
fi

echo "==> Linking local @tloncorp/api from $LOCAL_API_DIR..."
cd "$LOCAL_API_DIR"
npm link --ignore-scripts 2>/dev/null || true

cd "$PLUGIN_DIR"
npm link --ignore-scripts @tloncorp/api 2>/dev/null || true

echo "==> Local tlon-apps API override linked into $PLUGIN_DIR"
