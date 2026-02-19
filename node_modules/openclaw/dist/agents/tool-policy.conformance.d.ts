/**
 * Conformance snapshot for tool policy.
 *
 * Security note:
 * - This is static, build-time information (no runtime I/O, no network exposure).
 * - Intended for CI/tools to detect drift between the implementation policy and
 *   the formal models/extractors.
 */
export declare const TOOL_POLICY_CONFORMANCE: {
    readonly toolGroups: Record<string, string[]>;
};
