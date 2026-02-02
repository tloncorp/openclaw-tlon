/**
 * Tlon Plugin Agent Tools
 *
 * Registers tools that the AI agent can call directly for Tlon operations
 * beyond basic messaging (contacts, history, reactions, etc.)
 */

import type { PluginApi } from "openclaw";
import { registerContactsTools } from "./contacts.js";
import { registerChannelsTools } from "./channels.js";
import { registerHistoryTools } from "./history.js";
import { registerPostTools } from "./posts.js";
import { registerDmTools } from "./dms.js";
import { registerNotebookTools } from "./notebook.js";
import { registerActivityTools } from "./activity.js";
import type { TlonConfig } from "./urbit-client.js";

// Config getter that tools use (set during registration)
let getConfig: () => TlonConfig | undefined;

export function getTlonConfig(): TlonConfig | undefined {
  return getConfig?.();
}

export function registerTools(api: PluginApi) {
  // Set up config getter - tools access config through this closure
  getConfig = () => {
    const cfg = (api.config as any)?.channels?.tlon;
    if (cfg?.url && cfg?.ship && cfg?.code) {
      return cfg as TlonConfig;
    }
    return undefined;
  };

  // All tools are optional - users opt-in via tools.allow: ["tlon"]
  const opts = { optional: true };

  registerContactsTools(api, opts);
  registerChannelsTools(api, opts);
  registerHistoryTools(api, opts);
  registerPostTools(api, opts);
  registerDmTools(api, opts);
  registerNotebookTools(api, opts);
  registerActivityTools(api, opts);

  api.logger.info?.("[tlon] Registered 8 agent tools (tlon_*)");
}
