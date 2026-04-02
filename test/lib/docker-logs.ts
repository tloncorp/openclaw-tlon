/**
 * Docker Container Log Capture
 *
 * Captures OpenClaw container logs for asserting tool invocations
 * in integration tests run under docker compose (pnpm test:integration).
 */

import { execFileSync } from "node:child_process";

/**
 * Capture openclaw container logs since a given timestamp.
 *
 * @param composeFile - Path to docker-compose file (from TEST_COMPOSE_FILE)
 * @param sinceIso - ISO 8601 timestamp to filter logs from
 * @returns Raw log text
 * @throws If docker compose command fails (propagates to test as assertion failure)
 */
export function getContainerLogsSince(
  composeFile: string,
  sinceIso: string,
): string {
  const output = execFileSync(
    "docker",
    ["compose", "-f", composeFile, "logs", "--no-color", "--since", sinceIso, "openclaw"],
    { encoding: "utf-8", timeout: 10_000, cwd: process.cwd() },
  );
  return output;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Check whether a specific tool was invoked in the container logs.
 *
 * Matches only the structured OpenClaw tool execution log lines:
 *   "embedded run tool start: runId=... tool=<name> toolCallId=..."
 *   "embedded run tool end: runId=... tool=<name> toolCallId=..."
 *
 * Does NOT match general log lines that happen to mention a tool name
 * (e.g., logged prompt text, diagnostic messages).
 */
export function toolWasInvoked(logs: string, toolName: string): boolean {
  const escaped = escapeRegex(toolName);
  // Match only the structured "embedded run tool start/end" log format.
  // The key distinguisher is "embedded run tool" prefix + " tool=<name>" field.
  return new RegExp(
    `embedded run tool (?:start|end):.*\\btool=${escaped}\\b`,
  ).test(logs);
}
