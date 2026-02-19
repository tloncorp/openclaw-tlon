import { type ModelCatalogEntry } from "../agents/model-catalog.js";
export type GatewayModelChoice = ModelCatalogEntry;
export declare function __resetModelCatalogCacheForTest(): void;
export declare function loadGatewayModelCatalog(): Promise<GatewayModelChoice[]>;
