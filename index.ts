import type { PluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";
import { tlonPlugin } from "./src/channel.js";
import { setTlonRuntime } from "./src/runtime.js";

const plugin = {
  id: "tlon",
  name: "Tlon",
  description: "Tlon/Urbit channel plugin for messaging",
  configSchema: emptyPluginConfigSchema(),
  register(api: PluginApi) {
    setTlonRuntime(api.runtime);

    // Register messaging channel
    api.registerChannel({ plugin: tlonPlugin });
  },
};

export default plugin;
