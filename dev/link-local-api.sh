#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TLON_APPS_DIR="${TLON_APPS_DIR:-$ROOT_DIR/../tlon-apps}"
LOCAL_API_DIR="$TLON_APPS_DIR/packages/api"

if [ ! -f "$LOCAL_API_DIR/package.json" ]; then
  echo "ERROR: local @tloncorp/api package not found at $LOCAL_API_DIR"
  echo "Run ./dev/setup.sh first or set TLON_APPS_DIR."
  exit 1
fi

if [ ! -f "$LOCAL_API_DIR/dist/index.js" ] || [ ! -f "$LOCAL_API_DIR/dist/index.d.ts" ]; then
  echo "ERROR: local @tloncorp/api build output not found in $LOCAL_API_DIR/dist"
  echo "Build it first with:"
  echo "  pnpm --dir $TLON_APPS_DIR --filter @tloncorp/api build"
  exit 1
fi

echo "==> Registering local @tloncorp/api from $LOCAL_API_DIR"
cd "$LOCAL_API_DIR"
npm link --ignore-scripts

echo "==> Linking local @tloncorp/api into openclaw-tlon"
cd "$ROOT_DIR"
npm link --ignore-scripts @tloncorp/api

echo "==> Local @tloncorp/api linked into openclaw-tlon"
echo "==> Rebuild $LOCAL_API_DIR after API changes to refresh editor types and runtime output"
