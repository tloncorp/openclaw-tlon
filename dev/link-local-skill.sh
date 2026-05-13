#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TLON_SKILL_DIR="${TLON_SKILL_DIR:-$ROOT_DIR/../tlon-skill}"

if [ ! -f "$TLON_SKILL_DIR/package.json" ]; then
  echo "ERROR: local @tloncorp/tlon-skill package not found at $TLON_SKILL_DIR"
  echo "Clone it (gh repo clone tloncorp/tlon-skill) or set TLON_SKILL_DIR."
  exit 1
fi

echo "==> Registering local @tloncorp/tlon-skill from $TLON_SKILL_DIR"
cd "$TLON_SKILL_DIR"
npm link --ignore-scripts

echo "==> Linking local @tloncorp/tlon-skill into openclaw-tlon"
cd "$ROOT_DIR"
npm link --ignore-scripts @tloncorp/tlon-skill

echo "==> Local @tloncorp/tlon-skill linked into openclaw-tlon"
echo "==> Note: container override is handled separately by dev/build-local-skill-override.sh"
