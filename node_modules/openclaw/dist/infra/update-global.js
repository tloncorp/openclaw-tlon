import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
const PRIMARY_PACKAGE_NAME = "openclaw";
const ALL_PACKAGE_NAMES = [PRIMARY_PACKAGE_NAME];
async function pathExists(targetPath) {
    try {
        await fs.access(targetPath);
        return true;
    }
    catch {
        return false;
    }
}
async function tryRealpath(targetPath) {
    try {
        return await fs.realpath(targetPath);
    }
    catch {
        return path.resolve(targetPath);
    }
}
function resolveBunGlobalRoot() {
    const bunInstall = process.env.BUN_INSTALL?.trim() || path.join(os.homedir(), ".bun");
    return path.join(bunInstall, "install", "global", "node_modules");
}
export async function resolveGlobalRoot(manager, runCommand, timeoutMs) {
    if (manager === "bun") {
        return resolveBunGlobalRoot();
    }
    const argv = manager === "pnpm" ? ["pnpm", "root", "-g"] : ["npm", "root", "-g"];
    const res = await runCommand(argv, { timeoutMs }).catch(() => null);
    if (!res || res.code !== 0) {
        return null;
    }
    const root = res.stdout.trim();
    return root || null;
}
export async function resolveGlobalPackageRoot(manager, runCommand, timeoutMs) {
    const root = await resolveGlobalRoot(manager, runCommand, timeoutMs);
    if (!root) {
        return null;
    }
    return path.join(root, PRIMARY_PACKAGE_NAME);
}
export async function detectGlobalInstallManagerForRoot(runCommand, pkgRoot, timeoutMs) {
    const pkgReal = await tryRealpath(pkgRoot);
    const candidates = [
        { manager: "npm", argv: ["npm", "root", "-g"] },
        { manager: "pnpm", argv: ["pnpm", "root", "-g"] },
    ];
    for (const { manager, argv } of candidates) {
        const res = await runCommand(argv, { timeoutMs }).catch(() => null);
        if (!res || res.code !== 0) {
            continue;
        }
        const globalRoot = res.stdout.trim();
        if (!globalRoot) {
            continue;
        }
        const globalReal = await tryRealpath(globalRoot);
        for (const name of ALL_PACKAGE_NAMES) {
            const expected = path.join(globalReal, name);
            if (path.resolve(expected) === path.resolve(pkgReal)) {
                return manager;
            }
        }
    }
    const bunGlobalRoot = resolveBunGlobalRoot();
    const bunGlobalReal = await tryRealpath(bunGlobalRoot);
    for (const name of ALL_PACKAGE_NAMES) {
        const bunExpected = path.join(bunGlobalReal, name);
        if (path.resolve(bunExpected) === path.resolve(pkgReal)) {
            return "bun";
        }
    }
    return null;
}
export async function detectGlobalInstallManagerByPresence(runCommand, timeoutMs) {
    for (const manager of ["npm", "pnpm"]) {
        const root = await resolveGlobalRoot(manager, runCommand, timeoutMs);
        if (!root) {
            continue;
        }
        for (const name of ALL_PACKAGE_NAMES) {
            if (await pathExists(path.join(root, name))) {
                return manager;
            }
        }
    }
    const bunRoot = resolveBunGlobalRoot();
    for (const name of ALL_PACKAGE_NAMES) {
        if (await pathExists(path.join(bunRoot, name))) {
            return "bun";
        }
    }
    return null;
}
export function globalInstallArgs(manager, spec) {
    if (manager === "pnpm") {
        return ["pnpm", "add", "-g", spec];
    }
    if (manager === "bun") {
        return ["bun", "add", "-g", spec];
    }
    return ["npm", "i", "-g", spec];
}
