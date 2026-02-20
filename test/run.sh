#!/bin/bash
# Run integration tests with ephemeral fakezod ships
#
# Works in both CI and local environments:
#   - CI: Uses TLONBOT_TOKEN to fetch prompts from GitHub
#   - Local: Uses ../tlonbot volume mount for prompts
#
# Prerequisites:
#   - OPENROUTER_API_KEY (in .env locally, or CI secret)
#   - Local only: ../tlonbot repo cloned
#
# Usage:
#   pnpm test:integration

set -euo pipefail

# Fakezod credentials - these are the standard deterministic codes for ephemeral Urbit ships
# ~zod is the bot ship, ~ten is the test user that sends DMs
ZOD_URL="http://localhost:8080"
ZOD_CODE="lidlut-tabwed-pillex-ridrup"
TEN_URL="http://localhost:8081"
TEN_CODE="lapseg-nolmel-riswen-hopryc"
GATEWAY_PORT=18789

cd "$(dirname "$0")/.."

# Load .env file if present (for OPENROUTER_API_KEY, TLONBOT_TOKEN, etc.)
# Test-specific variables (TLON_SHIP, TLON_CODE, etc.) are overridden below
if [ -f .env ]; then
  set -a
  eval "$(grep -v '^#' .env | grep -v '^$' | sed 's/~/\\~/g')"
  set +a
fi

# Check for port conflicts before starting
for port in 8080 8081 $GATEWAY_PORT; do
  if lsof -Pi ":$port" -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Error: Port $port is already in use"
    exit 1
  fi
done

# Use test compose file, add local override if tlonbot repo exists
COMPOSE_FILES="-f dev/docker-compose.test.yml"
if [ -f "dev/docker-compose.local.yml" ] && [ -d "../tlonbot" ]; then
  COMPOSE_FILES="$COMPOSE_FILES -f dev/docker-compose.local.yml"
  echo "==> Using local tlonbot volume mount"
fi

# Cleanup function - called on exit, error, or interrupt
cleanup() {
  echo ""
  echo "==> Cleaning up containers..."
  docker compose $COMPOSE_FILES down -v 2>/dev/null || true
}

# Register cleanup trap
trap cleanup EXIT INT TERM

# Stop any existing containers from previous runs
echo "==> Stopping any existing containers..."
docker compose $COMPOSE_FILES down -v 2>/dev/null || true

echo "==> Starting ships container..."
docker compose $COMPOSE_FILES up -d ships

echo "==> Building openclaw image..."
docker compose $COMPOSE_FILES build openclaw

# Check if Urbit ship is fully ready by attempting login
check_urbit_ready() {
  local url=$1
  local code=$2
  # Try to authenticate - if we get a cookie back, Urbit is ready
  curl -sf -c - -X POST "$url/~/login" -d "password=$code" 2>/dev/null | grep -q "urbauth"
}

echo "==> Waiting for ~zod (port 8080)..."
for i in $(seq 1 60); do
  if check_urbit_ready "$ZOD_URL" "$ZOD_CODE"; then
    echo "~zod ready"
    break
  fi
  if [ $i -eq 60 ]; then
    echo "Timeout waiting for ~zod"
    docker compose $COMPOSE_FILES logs ships
    exit 1
  fi
  sleep 3
done

echo "==> Waiting for ~ten (port 8081)..."
for i in $(seq 1 60); do
  if check_urbit_ready "$TEN_URL" "$TEN_CODE"; then
    echo "~ten ready"
    break
  fi
  if [ $i -eq 60 ]; then
    echo "Timeout waiting for ~ten"
    docker compose $COMPOSE_FILES logs ships
    exit 1
  fi
  sleep 3
done

echo "==> Starting OpenClaw gateway..."
docker compose $COMPOSE_FILES up -d openclaw

echo "==> Waiting for gateway (port $GATEWAY_PORT)..."
for i in $(seq 1 60); do
  if curl -s "http://localhost:$GATEWAY_PORT/" | grep -qi openclaw; then
    echo "Gateway ready"
    break
  fi
  if [ $i -eq 60 ]; then
    echo "Timeout waiting for gateway"
    docker compose $COMPOSE_FILES logs openclaw
    exit 1
  fi
  sleep 2
done

echo ""
echo "==> Waiting for Tlon SSE subscriptions..."
SSE_TIMEOUT=120
for i in $(seq 1 $SSE_TIMEOUT); do
  if docker compose $COMPOSE_FILES logs openclaw 2>/dev/null | grep -q "\[tlon\] Connected! Firehose subscriptions active"; then
    echo "SSE subscriptions ready"
    break
  fi
  if [ $i -eq $SSE_TIMEOUT ]; then
    echo "Timeout waiting for SSE subscriptions after ${SSE_TIMEOUT}s"
    docker compose $COMPOSE_FILES logs openclaw | tail -50
    exit 1
  fi
  sleep 1
done

echo ""
echo "==> Running integration tests..."
echo ""

# Export test environment for vitest
export TLON_URL="$ZOD_URL"
export TLON_SHIP="~zod"
export TLON_CODE="$ZOD_CODE"
export TEST_USER_URL="$TEN_URL"
export TEST_USER_SHIP="~ten"
export TEST_USER_CODE="$TEN_CODE"
export TEST_MODE="tlon"
export TEST_GATEWAY_URL="http://localhost:$GATEWAY_PORT"

# Debug: show env vars
echo "Env vars:"
echo "  TLON_URL=$TLON_URL"
echo "  TLON_SHIP=$TLON_SHIP"
echo "  TEST_USER_SHIP=$TEST_USER_SHIP"
echo ""

# Run test cases sequentially to avoid overlapping DM prompts
for test_file in test/cases/*.test.ts; do
  echo "Running $test_file..."
  pnpm vitest run "$test_file" "$@" || exit $?
done

echo ""
echo "==> Tests complete!"
# cleanup runs automatically via trap
