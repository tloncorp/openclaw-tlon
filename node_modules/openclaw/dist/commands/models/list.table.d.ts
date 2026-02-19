import type { RuntimeEnv } from "../../runtime.js";
import type { ModelRow } from "./list.types.js";
export declare function printModelTable(rows: ModelRow[], runtime: RuntimeEnv, opts?: {
    json?: boolean;
    plain?: boolean;
}): void;
