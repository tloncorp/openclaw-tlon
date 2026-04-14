#!/bin/bash
# Run integration tests with ephemeral fakezod ships
#
# Works in both CI and local environments:
#   - With ../tlonbot mounted: uses volume mount for prompts and plugins
#   - Without ../tlonbot: uses TLONBOT_TOKEN to fetch prompts and image-search plugin from GitHub
#
# Prerequisites:
#   - OPENROUTER_API_KEY (in .env locally, or CI secret)
#   - BRAVE_API_KEY + TEST_STORAGE_* for image search / media tests
#   - TLONBOT_TOKEN when ../tlonbot is not mounted (always needed in CI)
#   - Local only: ../tlonbot repo cloned (removes TLONBOT_TOKEN requirement)
#
# Usage:
#   pnpm test:integration
#   TEN_PORT=9081 pnpm test:integration    # use different port for ~ten

set -euo pipefail

cd "$(dirname "$0")/.."

# Load .env file if present (for OPENROUTER_API_KEY, TLONBOT_TOKEN, etc.)
# Test-specific variables (TLON_SHIP, TLON_CODE, etc.) are overridden below
if [ -f .env ]; then
  set -a
  eval "$(grep -v '^#' .env | grep -v '^$' | sed 's/~/\\~/g')"
  set +a
fi

# Fakezod credentials - these are the standard deterministic codes for ephemeral Urbit ships
# ~zod is the bot ship, ~ten is the test user that sends DMs
# Host ports can be overridden via env vars (container-internal ports stay fixed)
ZOD_PORT="${ZOD_PORT:-8080}"
TEN_PORT="${TEN_PORT:-8081}"
MUG_PORT="${MUG_PORT:-8082}"

ZOD_URL="http://localhost:$ZOD_PORT"
ZOD_CODE="lidlut-tabwed-pillex-ridrup"
TEN_URL="http://localhost:$TEN_PORT"
TEN_CODE="lapseg-nolmel-riswen-hopryc"
MUG_URL="http://localhost:$MUG_PORT"
MUG_CODE="ravsut-bolryd-hapsum-pastul"

# Gateway port can be overridden via env var (matches docker-compose.test.yml)
GATEWAY_PORT="${OPENCLAW_GATEWAY_PORT:-18789}"

# Check for port conflicts before starting
for port in $ZOD_PORT $TEN_PORT $MUG_PORT $GATEWAY_PORT; do
  if lsof -Pi ":$port" -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Error: Port $port is already in use"
    if [ "$port" = "$GATEWAY_PORT" ]; then
      echo "  Hint: You may have another OpenClaw gateway running."
      echo "  Either stop it, or use a different port:"
      echo "    OPENCLAW_GATEWAY_PORT=18790 pnpm test:integration"
    fi
    exit 1
  fi
done

# Export port vars for docker-compose interpolation
export ZOD_PORT TEN_PORT MUG_PORT

# Use test compose file, add local override if tlonbot repo exists
COMPOSE_FILES="-f dev/docker-compose.test.yml"
if [ -f "dev/docker-compose.local.yml" ] && [ -d "../tlonbot" ]; then
  COMPOSE_FILES="$COMPOSE_FILES -f dev/docker-compose.local.yml"
  export TEST_TLONBOT_MOUNTED=1
  echo "==> Using local tlonbot volume mount"
fi

# Cleanup function - called on exit (normal, error, or signal-initiated)
cleanup() {
  echo ""
  echo "==> Cleaning up containers..."
  docker compose $COMPOSE_FILES down -v 2>/dev/null || true
}

# Cleanup runs on every exit (normal, error, or signal-initiated)
trap cleanup EXIT

# On interrupt/termination: exit immediately. The EXIT trap handles cleanup.
trap 'echo ""; echo "==> Interrupted."; exit 130' INT
trap 'echo ""; echo "==> Terminated."; exit 143' TERM

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

echo "==> Waiting for ~mug (port 8082)..."
for i in $(seq 1 60); do
  if check_urbit_ready "$MUG_URL" "$MUG_CODE"; then
    echo "~mug ready"
    break
  fi
  if [ $i -eq 60 ]; then
    echo "Timeout waiting for ~mug"
    docker compose $COMPOSE_FILES logs ships
    exit 1
  fi
  sleep 3
done

echo "==> Starting OpenClaw gateway..."
docker compose $COMPOSE_FILES up -d openclaw

# Debug: Dump container logs to see config/prompts
echo "==> Container startup logs:"
docker compose $COMPOSE_FILES logs openclaw

# Gateway timeout needs to account for pnpm install inside container (can take 60+ seconds on slow machines)
GATEWAY_TIMEOUT=180
echo "==> Waiting for gateway (port $GATEWAY_PORT)..."
for i in $(seq 1 $GATEWAY_TIMEOUT); do
  if curl -s "http://localhost:$GATEWAY_PORT/" | grep -qi openclaw; then
    echo "Gateway ready"
    break
  fi
  if [ $i -eq $GATEWAY_TIMEOUT ]; then
    echo "Timeout waiting for gateway after $((GATEWAY_TIMEOUT * 2))s"
    docker compose $COMPOSE_FILES logs openclaw | tail -100
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
export TEST_THIRD_PARTY_URL="$MUG_URL"
export TEST_THIRD_PARTY_SHIP="~mug"
export TEST_THIRD_PARTY_CODE="$MUG_CODE"
export TEST_MODE="tlon"
export TEST_GATEWAY_URL="http://localhost:$GATEWAY_PORT"
export TEST_COMPOSE_FILE="dev/docker-compose.test.yml"

# Debug: show env vars
echo "Env vars:"
echo "  TLON_URL=$TLON_URL"
echo "  TLON_SHIP=$TLON_SHIP"
echo "  TEST_USER_SHIP=$TEST_USER_SHIP"
echo ""

# Run test cases sequentially to avoid overlapping DM prompts
# Strip leading "--" that pnpm passes through
if [ "${1:-}" = "--" ]; then shift; fi
TEST_EXIT=0
if [ $# -gt 0 ]; then
  # Specific test files passed as arguments
  for test_file in "$@"; do
    echo "Running $test_file..."
    pnpm vitest run "$test_file" || TEST_EXIT=$?
    # Exit code >= 128 means child was killed by a signal — stop the suite
    if [ "$TEST_EXIT" -ge 128 ]; then
      echo "==> Test runner killed by signal (exit $TEST_EXIT), stopping suite."
      break
    fi
  done
else
  # Default: run all test cases
  for test_file in test/cases/*.test.ts; do
    echo "Running $test_file..."
    pnpm vitest run "$test_file" || TEST_EXIT=$?
    if [ "$TEST_EXIT" -ge 128 ]; then
      echo "==> Test runner killed by signal (exit $TEST_EXIT), stopping suite."
      break
    fi
  done
fi

# Always dump bot container logs for debugging
echo ""
echo "==> OpenClaw container logs (last 200 lines):"
docker compose $COMPOSE_FILES logs --tail=200 openclaw 2>/dev/null || true

exit $TEST_EXIT
