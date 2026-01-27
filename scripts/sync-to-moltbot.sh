#!/bin/bash
# Sync this plugin to a moltbot fork for creating PRs
#
# Usage: ./scripts/sync-to-moltbot.sh [moltbot-path] [branch-name]
#
# Example:
#   ./scripts/sync-to-moltbot.sh ~/Projects/moltbot-fork tlon-feature-xyz

set -e

MOLTBOT_PATH="${1:-$HOME/Projects/clawdbot}"
BRANCH_NAME="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="$(dirname "$SCRIPT_DIR")"

if [ ! -d "$MOLTBOT_PATH" ]; then
    echo "Error: Moltbot path not found: $MOLTBOT_PATH"
    echo "Usage: $0 [moltbot-path] [branch-name]"
    exit 1
fi

TARGET_DIR="$MOLTBOT_PATH/extensions/tlon"

# Create branch if specified
if [ -n "$BRANCH_NAME" ]; then
    echo "Creating branch: $BRANCH_NAME"
    cd "$MOLTBOT_PATH"
    git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"
    cd -
fi

echo "Syncing plugin to: $TARGET_DIR"

# Sync files (excluding git, node_modules, scripts)
rsync -av --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='scripts' \
    --exclude='.gitignore' \
    "$PLUGIN_DIR/" "$TARGET_DIR/"

echo ""
echo "✅ Sync complete!"
echo ""
echo "Next steps:"
echo "  cd $MOLTBOT_PATH"
echo "  git add extensions/tlon"
echo "  git commit -m 'tlon: your changes here'"
echo "  git push origin $BRANCH_NAME"
echo "  # Then create PR on GitHub"
