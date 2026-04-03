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
npm link --ignore-scripts

cd "$PLUGIN_DIR"
npm link --ignore-scripts @tloncorp/api

echo "==> Verifying linked @tloncorp/api exports..."
node --input-type=module -e '
  const mod = await import("@tloncorp/api");
  const required = [
    "configureGatewayStatus",
    "gatewayStart",
    "gatewayHeartbeat",
    "gatewayStop",
  ];
  const missing = required.filter((name) => typeof mod[name] !== "function");
  if (missing.length > 0) {
    throw new Error(`linked @tloncorp/api is missing exports: ${missing.join(", ")}`);
  }
  console.log(`==> Linked @tloncorp/api verified: ${required.join(", ")}`);
'

echo "==> Local tlon-apps API override linked into $PLUGIN_DIR"
