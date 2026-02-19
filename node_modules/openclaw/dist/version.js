import { createRequire } from "node:module";
function readVersionFromPackageJson() {
    try {
        const require = createRequire(import.meta.url);
        const pkg = require("../package.json");
        return pkg.version ?? null;
    }
    catch {
        return null;
    }
}
// Single source of truth for the current OpenClaw version.
// - Embedded/bundled builds: injected define or env var.
// - Dev/npm builds: package.json.
export const VERSION = (typeof __OPENCLAW_VERSION__ === "string" && __OPENCLAW_VERSION__) ||
    process.env.OPENCLAW_BUNDLED_VERSION ||
    readVersionFromPackageJson() ||
    "0.0.0";
