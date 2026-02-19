import { AuthStorage, ModelRegistry } from "@mariozechner/pi-coding-agent";
import path from "node:path";
export { AuthStorage, ModelRegistry } from "@mariozechner/pi-coding-agent";
// Compatibility helpers for pi-coding-agent 0.50+ (discover* helpers removed).
export function discoverAuthStorage(agentDir) {
    return new AuthStorage(path.join(agentDir, "auth.json"));
}
export function discoverModels(authStorage, agentDir) {
    return new ModelRegistry(authStorage, path.join(agentDir, "models.json"));
}
