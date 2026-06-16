#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT_DIR"
echo "==> Restoring published @tloncorp/tlon-skill from package.json"
npm unlink @tloncorp/tlon-skill || true
pnpm install
echo "==> Published @tloncorp/tlon-skill restored"
