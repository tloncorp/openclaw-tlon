import {
  appendToPostBlob,
  TLON_A2UI_ACTION_SEND_MESSAGE,
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

export function buildWeatherA2UIBlob(params: {
  surfaceId?: string;
  location: string;
  temperature: string;
  summary: string;
  details?: string;
  refreshPrompt?: string;
}): TlonA2UIBlob {
  const surfaceId = params.surfaceId ?? "weather";
  const components: A2UIComponent[] = [
    { id: "root", component: "Card", child: "body" },
    {
      id: "body",
      component: "Column",
      children: ["title", "summary", "details", "refreshButton"],
    },
    { id: "title", component: "Text", variant: "h3", text: params.location },
    {
      id: "summary",
      component: "Text",
      text: `${params.temperature} · ${params.summary}`,
    },
    { id: "details", component: "Text", text: params.details ?? "" },
    {
      id: "refreshButton",
      component: "Button",
      child: "refreshLabel",
      action: {
        event: {
          name: TLON_A2UI_ACTION_SEND_MESSAGE,
          context: { text: params.refreshPrompt ?? "refresh weather" },
        },
      },
    },
    { id: "refreshLabel", component: "Text", text: "Refresh" },
  ];
  return makeA2UIBlob(surfaceId, "root", components);
}
