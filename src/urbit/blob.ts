import {
  appendToPostBlob,
  validateA2UIBlobEntry,
  type A2UIComponent,
  type PostBlobDataEntryA2UI,
} from "@tloncorp/api";

export const TLON_A2UI_CATALOG_ID = "tlon.a2ui.basic.v1";
export type TlonA2UIBlob = PostBlobDataEntryA2UI;

export function makeA2UIBlob(
  surfaceId: string,
  root: string,
  components: A2UIComponent[],
): TlonA2UIBlob {
  const blob: TlonA2UIBlob = {
    type: "a2ui",
    version: 1,
    messages: [
      {
        version: "v0.9",
        createSurface: { surfaceId, catalogId: TLON_A2UI_CATALOG_ID },
      },
      {
        version: "v0.9",
        updateComponents: { surfaceId, root, components },
      },
    ],
  };
  if (!validateA2UIBlobEntry(blob)) {
    throw new Error("invalid a2ui blob");
  }
  return blob;
}

export function serializeBlobField(entry: TlonA2UIBlob): string {
  return appendToPostBlob(undefined, entry);
}
