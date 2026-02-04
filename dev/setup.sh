#!/bin/bash
# Run this on your host machine before docker compose up
set -e
cd "$(dirname "$0")/.."

clone_if_missing() {
  local dir=$1
  local repo=$2
  if [ ! -d "$dir" ]; then
    echo "==> Cloning $repo..."
    gh repo clone "tloncorp/$repo" "$dir"
  else
    echo "==> $repo already exists"
  fi
}

# Clone sibling repos (requires gh CLI authenticated)
clone_if_missing ../api-beta api-beta
clone_if_missing ../tlon-skill tlon-skill

# Create .env if missing
if [ ! -f .env ]; then
  cp .env.example .env
  echo "==> Created .env from template - please fill in values"
fi

echo "==> Setup complete. Run: docker compose -f dev/docker-compose.yml up --build"
