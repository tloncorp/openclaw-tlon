import type { PluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";
import { tlonPlugin } from "./src/channel.js";
import { setTlonRuntime } from "./src/runtime.js";
import { registerTools } from "./src/tools/index.js";

const plugin = {
  id: "tlon",
  name: "Tlon",
  description: "Tlon/Urbit channel plugin with agent tools",
  configSchema: emptyPluginConfigSchema(),
  register(api: PluginApi) {
    setTlonRuntime(api.runtime);

    // Register messaging channel
    api.registerChannel({ plugin: tlonPlugin });

    // Register agent tools (optional, user opts-in via tools.allow: ["tlon"])
    registerTools(api);
  },
};

export default plugin;
