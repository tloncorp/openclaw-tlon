/**
 * Session memory hook handler
 *
 * Saves session context to memory when /new command is triggered
 * Creates a new dated memory file with LLM-generated slug
 */
import type { HookHandler } from "../../hooks.js";
/**
 * Save session context to memory when /new command is triggered
 */
declare const saveSessionToMemory: HookHandler;
export default saveSessionToMemory;
