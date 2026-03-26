#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT_DIR"
echo "==> Restoring published @tloncorp/api from package.json"
npm unlink @tloncorp/api || true
pnpm install
echo "==> Published @tloncorp/api restored"
