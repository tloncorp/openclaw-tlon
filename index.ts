import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { OpenClawPluginApi } from "./src/openclaw-sdk.js";
import { PLUGIN_COMMIT } from "./src/version.generated.js";

import { emptyPluginConfigSchema } from "./src/openclaw-sdk.js";
import { tlonPlugin } from "./src/channel.js";
import { resolveBridgeForCommand } from "./src/monitor/command-auth.js";
import { setTlonRuntime } from "./src/runtime.js";
import { resolveTlonAccount } from "./src/types.js";
import { getSessionRole } from "./src/session-roles.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function readPluginVersion(): string {
  const packageJsonPath = [join(__dirname, "package.json"), join(__dirname, "..", "package.json")]
    .find(existsSync);
  if (!packageJsonPath) {
    throw new Error("Could not find plugin package.json");
  }

  const { version } = JSON.parse(readFileSync(packageJsonPath, "utf-8")) as { version?: string };
  if (!version) {
    throw new Error(`Missing version in ${packageJsonPath}`);
  }

  return version;
}

const PLUGIN_VERSION = readPluginVersion();

// Whitelist of allowed tlon subcommands
const ALLOWED_TLON_COMMANDS = new Set([
  "activity",
  "channels",
  "contacts",
  "groups",
  "messages",
  "dms",
  "posts",
  "notebook",
  "settings",
  "help",
  "version",
]);

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
        "Tlon/Urbit API operations: activity, channels, contacts, groups, messages, dms, posts, notebook, settings. " +
        "Examples: 'activity mentions --limit 10', 'channels groups', 'contacts self', 'groups list'",
      parameters: {
        type: "object",
        properties: {
          command: {
            type: "string",
            description:
              "The tlon command and arguments. " +
              "Examples: 'activity mentions --limit 10', 'contacts get ~sampel-palnet', 'groups list'",
          },
        },
        required: ["command"],
      },
      async execute(_id: string, params: { command: string }) {
        try {
          const args = shellSplit(params.command);

          // Validate first argument is a whitelisted tlon subcommand
          const subcommand = args[0];
          if (!ALLOWED_TLON_COMMANDS.has(subcommand)) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: `Error: Unknown tlon subcommand '${subcommand}'. Allowed: ${[...ALLOWED_TLON_COMMANDS].join(", ")}`,
                },
              ],
              details: { error: true },
            };
          }

          const output = await runTlonCommand(tlonBinary, args, credentials);
          return {
            content: [{ type: "text" as const, text: output }],
            details: undefined,
          };
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : String(error);
          return {
            content: [{ type: "text" as const, text: `Error: ${message}` }],
            details: { error: true },
          };
        }
      },
    });

    // Tool access control: block sensitive tools for non-owners
    const ownerOnlyTools = new Set([
      "tlon",
      "tlon_run",
      "tlon-run",
      "cron",
      "read",
    ]);

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
