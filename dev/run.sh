#!/bin/bash
set -e

cd "$(dirname "$0")"

# Start container in background
docker compose up --build -d

# Wait for gateway to be ready and extract token
echo "Waiting for gateway..."
for i in {1..30}; do
  TOKEN=$(docker logs dev-openclaw-1 2>&1 | grep -o 'token=[^"]*' | head -1 | cut -d= -f2)
  if [ -n "$TOKEN" ]; then
    URL="http://localhost:18789/?token=$TOKEN"
    echo "Opening: $URL"
    open "$URL" 2>/dev/null || xdg-open "$URL" 2>/dev/null || echo "Open manually: $URL"
    break
  fi
  sleep 1
done

# Attach to logs
docker compose logs -f
