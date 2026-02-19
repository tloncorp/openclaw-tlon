type Align = "left" | "right" | "center";
export type TableColumn = {
    key: string;
    header: string;
    align?: Align;
    minWidth?: number;
    maxWidth?: number;
    flex?: boolean;
};
export type RenderTableOptions = {
    columns: TableColumn[];
    rows: Array<Record<string, string>>;
    width?: number;
    padding?: number;
    border?: "unicode" | "ascii" | "none";
};
export declare function renderTable(opts: RenderTableOptions): string;
export {};
