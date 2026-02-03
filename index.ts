import type { MoltbotPluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";
import { tlonPlugin } from "./src/channel.js";
import { setTlonRuntime } from "./src/runtime.js";
import { tlonToolDefinition } from "./src/tool/index.js";

const plugin = {
  id: "tlon",
  name: "Tlon",
  description: "Tlon/Urbit channel plugin with API tools",
  configSchema: emptyPluginConfigSchema(),
  register(api: MoltbotPluginApi) {
    setTlonRuntime(api.runtime);
    api.registerChannel({ plugin: tlonPlugin });
    api.registerTool(tlonToolDefinition);
  },
};

export default plugin;
