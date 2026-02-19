let pamAuth;
let pamError = null;
async function loadPam() {
    if (pamAuth !== undefined)
        return;
    try {
        // Vite/Vitest: avoid static analysis/bundling for optional native deps.
        const pkgName = "authenticate-pam";
        const mod = (await import(pkgName));
        const candidate = typeof mod === "function"
            ? mod
            : typeof mod.authenticate ===
                "function"
                ? mod.authenticate
                : typeof mod.default === "function"
                    ? mod.default
                    : null;
        if (!candidate) {
            throw new Error("authenticate-pam did not export an authenticate function");
        }
        pamAuth = candidate;
    }
    catch (err) {
        pamAuth = null;
        pamError = err instanceof Error ? err.message : String(err);
    }
}
export async function getPamAvailability() {
    await loadPam();
    return pamAuth
        ? { available: true }
        : { available: false, error: pamError ?? undefined };
}
export async function verifyPamCredentials(username, password) {
    await loadPam();
    const auth = pamAuth;
    if (!auth)
        return false;
    return await new Promise((resolve) => {
        auth(username, password, (err) => resolve(!err));
    });
}
