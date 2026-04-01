import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PLUGIN_COMMIT } from "./src/version.generated.js";

// Get package version at runtime
const require = createRequire(import.meta.url);
const { version: PLUGIN_VERSION } = require("./package.json") as { version: string };
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";
import { tlonPlugin } from "./src/channel.js";
import { resolveBridgeForCommand } from "./src/monitor/command-auth.js";
import { setTlonRuntime } from "./src/runtime.js";
import { getSessionRole } from "./src/session-roles.js";
import { recordToolCall } from "./src/telemetry.js";
import { checkBlockedSendOperation } from "./src/tlon-tool-guard.js";
import { resolveTlonAccount } from "./src/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Whitelist of allowed tlon subcommands
const ALLOWED_TLON_COMMANDS = new Set([
  "activity",
  "channels",
  "contacts",
  "dms",
  "expose",
  "groups",
  "hooks",
  "messages",
  "notebook",
  "posts",
  "settings",
  "upload",
  "help",
  "version",
  "upload",
]);

/** Credential flags that the tlon skill binary accepts before the subcommand. */
const CREDENTIAL_FLAGS_WITH_VALUE = new Set([
  "--config",
  "--url",
  "--ship",
  "--code",
  "--cookie",
]);

/**
 * Find the first positional argument (subcommand) by skipping credential flags
 * and their values. Returns the index into `args`, or -1 if none found.
 */
function findSubcommandIndex(args: string[]): number {
  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    // --flag=value form: skip one token
    if (arg.startsWith("--") && arg.includes("=")) {
      const flag = arg.slice(0, arg.indexOf("="));
      if (CREDENTIAL_FLAGS_WITH_VALUE.has(flag)) {
        i += 1;
        continue;
      }
    }
    // --flag value form: skip two tokens
    if (CREDENTIAL_FLAGS_WITH_VALUE.has(arg)) {
      i += 2;
      continue;
    }
    // Not a credential flag — this is the subcommand
    return i;
  }
  return -1;
}

/**
 * Find the tlon binary from the skill package
 */
function findTlonBinary(): string {
  // Check in node_modules/.bin
  const skillBin = join(__dirname, "node_modules", ".bin", "tlon");
  console.log(
    `[tlon] Checking for binary at: ${skillBin}, exists: ${existsSync(skillBin)}`,
  );
  if (existsSync(skillBin)) return skillBin;

  // Check for platform-specific binary directly
  const platform = process.platform;
  const arch = process.arch;
  const platformPkg = `@tloncorp/tlon-skill-${platform}-${arch}`;
  const platformBin = join(__dirname, "node_modules", platformPkg, "tlon");
  console.log(
    `[tlon] Checking for platform binary at: ${platformBin}, exists: ${existsSync(platformBin)}`,
  );
  if (existsSync(platformBin)) return platformBin;

  // Fallback to PATH
  console.log(`[tlon] Falling back to PATH lookup for 'tlon'`);
  return "tlon";
}

/**
 * Shell-like argument splitter that respects quotes
 */
function shellSplit(str: string): string[] {
  const args: string[] = [];
  let cur = "";
  let inDouble = false;
  let inSingle = false;
  let escape = false;

  for (const ch of str) {
    if (escape) {
      cur += ch;
      escape = false;
      continue;
    }
    if (ch === "\\" && !inSingle) {
      escape = true;
      continue;
    }
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      continue;
    }
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      continue;
    }
    if (/\s/.test(ch) && !inDouble && !inSingle) {
      if (cur) {
        args.push(cur);
        cur = "";
      }
      continue;
    }
    cur += ch;
  }
  if (cur) args.push(cur);
  return args;
}

/**
 * Run the tlon command and return the result
 */
function runTlonCommand(
  binary: string,
  args: string[],
  credentials?: { url: string; ship: string; code: string },
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Build environment with Tlon credentials
    // Pass all credentials - skill checks cache first, falls back to these if miss
    const env = { ...process.env };
    if (credentials) {
      env.URBIT_SHIP = credentials.ship;
      env.URBIT_URL = credentials.url;
      env.URBIT_CODE = credentials.code;
    }

    const child = spawn(binary, args, { env });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("error", (err) => {
      reject(new Error(`Failed to run tlon: ${err.message}`));
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `tlon exited with code ${code}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

const plugin = {
  id: "tlon",
  name: "Tlon",
  description: "Tlon/Urbit channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    setTlonRuntime(api.runtime);
    api.registerChannel({ plugin: tlonPlugin });

    // Register /tlon-version command
    api.registerCommand({
      name: "tlon-version",
      description: "Show Tlon plugin version.",
      handler: async () => {
        return { text: `Tlon plugin v${PLUGIN_VERSION} (${PLUGIN_COMMIT})` };
      },
    });

    // Register the tlon tool
    const tlonBinary = findTlonBinary();
    api.logger.info(`[tlon] Registering tlon tool, binary: ${tlonBinary}`);

    // Capture credentials from config at registration time
    const account = resolveTlonAccount(api.config);
    const credentials =
      account.configured && account.url && account.ship && account.code
        ? { url: account.url, ship: account.ship, code: account.code }
        : undefined;

    if (credentials) {
      api.logger.info(`[tlon] Credentials available for ${account.ship}`);
    } else {
      api.logger.warn(
        `[tlon] No credentials configured - tlon tool will rely on env vars`,
      );
    }

    api.registerTool({
      name: "tlon",
      label: "Tlon CLI",
      description:
        "Tlon/Urbit API for reading data and administration: activity, channels, contacts, groups, messages, posts, settings, upload, expose, hooks. " +
        "DO NOT use this tool to send messages — use the `message` tool instead. " +
        "Examples: 'activity mentions --limit 10', 'channels groups', 'contacts self', 'groups list'",
      parameters: {
        type: "object",
        properties: {
          command: {
            type: "string",
            description:
              "The tlon command and arguments (read/admin operations). " +
              "To send messages, use the `message` tool, not this tool. " +
              "Examples: 'activity mentions --limit 10', 'contacts get ~sampel-palnet', 'groups list', 'messages dm ~ship --limit 20'",
          },
        },
        required: ["command"],
      },
      async execute(_id: string, params: { command: string }) {
        try {
          const args = shellSplit(params.command);

          // Skip credential flags (--config, --url, --ship, --code, --cookie)
          // to find the actual subcommand, matching what the skill binary does.
          const subIdx = findSubcommandIndex(args);
          const subcommand = subIdx >= 0 ? args[subIdx] : undefined;
          if (!subcommand || !ALLOWED_TLON_COMMANDS.has(subcommand)) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: `Error: Unknown tlon subcommand '${subcommand ?? "(none)"}'. Allowed: ${[...ALLOWED_TLON_COMMANDS].join(", ")}`,
                },
              ],
              details: { error: true },
            };
          }

          // Check for blocked send operations (uses args from subcommand onward)
          const blocked = checkBlockedSendOperation(args.slice(subIdx));
          if (blocked) {
            return {
              content: [{ type: "text" as const, text: blocked }],
              details: { blocked: true, reason: "send_operation" },
            };
          }

          const output = await runTlonCommand(tlonBinary, args, credentials);
          return {
            content: [{ type: "text" as const, text: output }],
            details: undefined,
          };
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : String(error);
          return {
            content: [{ type: "text" as const, text: `Error: ${message}` }],
            details: { error: true },
          };
        }
      },
    });

    // Tool access control: block sensitive tools for non-owners
    const ownerOnlyTools = new Set(["tlon", "cron", "read"]);

    api.on("before_tool_call", (event, ctx) => {
      if (!ownerOnlyTools.has(event.toolName)) {
        return;
      }

      const role = getSessionRole(ctx.sessionKey ?? "");

      // Allow owner sessions and internal sessions (heartbeat, cron, etc.).
      // Internal sessions have no role because they're not triggered by DMs.
      // Only block when role is explicitly "user" (non-owner DM).
      if (role === "user") {
        api.logger.warn(
          `[tlon] Blocked ${event.toolName} tool for non-owner. Session: ${ctx.sessionKey}, Role: ${role}`,
        );
        return {
          block: true,
          blockReason: `The ${event.toolName} tool is not available.`,
        };
      }

      api.logger.info(
        `[tlon] Allowed ${event.toolName} tool for ${role ?? "internal"} session. Session: ${ctx.sessionKey}`,
      );
    });

    api.on("after_tool_call", (event, ctx) => {
      recordToolCall({
        sessionKey: ctx.sessionKey,
        toolName: event.toolName,
        durationMs: event.durationMs,
        error: event.error,
      });
    });

    // ── Slash commands for approval & admin ────────────────────────────
    // These bypass the LLM and call the monitor's command bridge directly.
    // Each handler resolves the correct bridge (multi-account safe) and
    // enforces owner-only access (default-deny).

    api.registerCommand({
      name: "allow",
      description: "Allow a pending DM/channel/group request",
      acceptsArgs: true,
      handler: async (ctx) => {
        const result = resolveBridgeForCommand(ctx);
        if ("error" in result) return { text: result.error };
        return { text: await result.bridge.handleAction("approve", ctx.args?.trim() || undefined) };
      },
    });

    api.registerCommand({
      name: "reject",
      description: "Reject a pending DM/channel/group request",
      acceptsArgs: true,
      handler: async (ctx) => {
        const result = resolveBridgeForCommand(ctx);
        if ("error" in result) return { text: result.error };
        return { text: await result.bridge.handleAction("deny", ctx.args?.trim() || undefined) };
      },
    });

    api.registerCommand({
      name: "ban",
      description: "Ban a ship and deny its pending request",
      acceptsArgs: true,
      handler: async (ctx) => {
        const result = resolveBridgeForCommand(ctx);
        if ("error" in result) return { text: result.error };
        return { text: await result.bridge.handleAction("block", ctx.args?.trim() || undefined) };
      },
    });

    api.registerCommand({
      name: "pending",
      description: "List pending approval requests",
      handler: async (ctx) => {
        const result = resolveBridgeForCommand(ctx);
        if ("error" in result) return { text: result.error };
        return { text: await result.bridge.getPendingList() };
      },
    });

    api.registerCommand({
      name: "banned",
      description: "List banned ships",
      handler: async (ctx) => {
        const result = resolveBridgeForCommand(ctx);
        if ("error" in result) return { text: result.error };
        return { text: await result.bridge.getBlockedList() };
      },
    });

    api.registerCommand({
      name: "unban",
      description: "Unban a ship (e.g. /unban ~sampel-palnet)",
      acceptsArgs: true,
      handler: async (ctx) => {
        const result = resolveBridgeForCommand(ctx);
        if ("error" in result) return { text: result.error };
        const ship = ctx.args?.trim();
        if (!ship) {
          return { text: "Usage: /unban ~ship-name" };
        }
        return { text: await result.bridge.handleUnblock(ship) };
      },
    });
  },
};

export default plugin;
