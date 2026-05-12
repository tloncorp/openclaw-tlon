#!/bin/bash
set -euo pipefail

PLUGIN_DIR="${PLUGIN_DIR:-/workspace/openclaw-tlon}"
TLON_APPS_DIR="${TLON_APPS_DIR:-/workspace/tlon-apps}"
LOCAL_API_DIR="$TLON_APPS_DIR/packages/api"
LOCAL_DIST_DIR="$LOCAL_API_DIR/dist"
INSTALLED_API_DIR="$PLUGIN_DIR/node_modules/@tloncorp/api"

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

if [ ! -f "$INSTALLED_API_DIR/package.json" ]; then
  echo "==> Installed @tloncorp/api package not found at $INSTALLED_API_DIR; using published @tloncorp/api"
  exit 0
fi

echo "==> Overlaying local @tloncorp/api dist from $LOCAL_API_DIR..."
mkdir -p "$INSTALLED_API_DIR/dist"
cp -R "$LOCAL_DIST_DIR"/. "$INSTALLED_API_DIR/dist/"

echo "==> Verifying local @tloncorp/api override exports..."
node --input-type=module -e '
  const mod = await import("@tloncorp/api");
  const required = [
    "configureClient",
    "scry",
    "sendPost",
    "sendReply",
    "addReaction",
    "removeReaction",
    "deletePost",
    "uploadFile",
    "configureGatewayStatus",
    "gatewayStart",
    "gatewayHeartbeat",
    "gatewayStop",
  ];
  const missing = required.filter((name) => typeof mod[name] !== "function");
  if (missing.length > 0) {
    throw new Error(`local @tloncorp/api override is missing exports: ${missing.join(", ")}`);
  }
  console.log(`==> Local @tloncorp/api override verified: ${required.join(", ")}`);
'

echo "==> Local tlon-apps API override installed into $PLUGIN_DIR"
