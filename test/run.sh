#!/bin/bash
set -e

cd "$(dirname "$0")/.."

# Load .env file - use eval to handle ~ in values
if [ -f .env ]; then
  set -a
  eval "$(grep -v '^#' .env | grep -v '^$' | sed 's/~/\\~/g')"
  set +a
fi

GATEWAY_URL="${TEST_GATEWAY_URL:-http://localhost:18789}"
MAX_WAIT=60

echo "Waiting for gateway at $GATEWAY_URL..."

for i in $(seq 1 $MAX_WAIT); do
  # Check if gateway is responding (control UI serves HTML)
  if curl -s "$GATEWAY_URL/" | grep -q "openclaw" 2>/dev/null; then
    echo "Gateway ready!"
    break
  fi
  if [ $i -eq $MAX_WAIT ]; then
    echo "Timeout waiting for gateway after ${MAX_WAIT}s"
    echo "Is the dev container running? Try: pnpm dev"
    exit 1
  fi
  sleep 1
done

# Debug: show loaded env vars
echo "Env vars loaded:"
echo "  TLON_URL=$TLON_URL"
echo "  TLON_SHIP=$TLON_SHIP"
echo "  TEST_USER_SHIP=$TEST_USER_SHIP"

# Run the tests
exec pnpm vitest run test/cases/ "$@"
