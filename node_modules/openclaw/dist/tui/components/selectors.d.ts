import { type SelectItem, SelectList, type SettingItem, SettingsList } from "@mariozechner/pi-tui";
import { FilterableSelectList, type FilterableSelectItem } from "./filterable-select-list.js";
import { SearchableSelectList } from "./searchable-select-list.js";
export declare function createSelectList(items: SelectItem[], maxVisible?: number): SelectList;
export declare function createSearchableSelectList(items: SelectItem[], maxVisible?: number): SearchableSelectList;
export declare function createFilterableSelectList(items: FilterableSelectItem[], maxVisible?: number): FilterableSelectList;
export declare function createSettingsList(items: SettingItem[], onChange: (id: string, value: string) => void, onCancel: () => void, maxVisible?: number): SettingsList;
