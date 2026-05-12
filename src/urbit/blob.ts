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

type WeatherForecastDay = {
  label: string;
  icon: string;
  temp: string;
};

export function buildWeatherA2UIBlob(params: {
  surfaceId?: string;
  location: string;
  temperature: string;
  lowTemperature?: string;
  summary: string;
  details?: string;
  forecast?: [WeatherForecastDay, WeatherForecastDay, WeatherForecastDay];
}): TlonA2UIBlob {
  const surfaceId = params.surfaceId ?? "weather";
  const forecast = params.forecast ?? [
    { label: "Today", icon: "🌧️", temp: params.temperature },
    { label: "Wed", icon: "☁️", temp: params.temperature },
    { label: "Thu", icon: "🌧️", temp: params.temperature },
  ];
  const [today, tomorrow, next] = forecast;
  const components: A2UIComponent[] = [
    { id: "root", component: "Card", child: "main-column" },
    {
      id: "main-column",
      component: "Column",
      align: "center",
      children: [
        "temp-row",
        "tempDivider",
        "location",
        "description",
        "forecastDivider",
        "forecast-row",
      ],
    },
    {
      id: "temp-row",
      component: "Row",
      align: "center",
      justify: "center",
      children: ["temp-high-column", "temp-low-column"],
    },
    {
      id: "temp-high-column",
      component: "Column",
      align: "center",
      children: ["temp-high-label", "temp-high"],
    },
    {
      id: "temp-high-label",
      component: "Text",
      variant: "caption",
      text: "High",
    },
    {
      id: "temp-high",
      component: "Text",
      variant: "h1",
      text: params.temperature,
    },
    {
      id: "temp-low-column",
      component: "Column",
      align: "center",
      children: ["temp-low-label", "temp-low"],
    },
    {
      id: "temp-low-label",
      component: "Text",
      variant: "caption",
      text: "Low",
    },
    {
      id: "temp-low",
      component: "Text",
      variant: "h1",
      text: params.lowTemperature ?? params.temperature,
    },
    { id: "tempDivider", component: "Divider" },
    { id: "location", component: "Text", variant: "h3", text: params.location },
    {
      id: "description",
      component: "Text",
      variant: "caption",
      text: params.details ? `${params.summary} · ${params.details}` : params.summary,
    },
    { id: "forecastDivider", component: "Divider" },
    {
      id: "forecast-row",
      component: "Row",
      align: "center",
      justify: "spaceAround",
      children: ["today", "tomorrow", "next"],
    },
    {
      id: "today",
      component: "Column",
      align: "center",
      weight: 1,
      children: ["todayLabel", "todayIcon", "todayTemp"],
    },
    { id: "todayLabel", component: "Text", variant: "caption", text: today.label },
    { id: "todayIcon", component: "Text", variant: "h2", text: today.icon },
    { id: "todayTemp", component: "Text", variant: "caption", text: today.temp },
    {
      id: "tomorrow",
      component: "Column",
      align: "center",
      weight: 1,
      children: ["tomorrowLabel", "tomorrowIcon", "tomorrowTemp"],
    },
    {
      id: "tomorrowLabel",
      component: "Text",
      variant: "caption",
      text: tomorrow.label,
    },
    { id: "tomorrowIcon", component: "Text", variant: "h2", text: tomorrow.icon },
    {
      id: "tomorrowTemp",
      component: "Text",
      variant: "caption",
      text: tomorrow.temp,
    },
    {
      id: "next",
      component: "Column",
      align: "center",
      weight: 1,
      children: ["nextLabel", "nextIcon", "nextTemp"],
    },
    { id: "nextLabel", component: "Text", variant: "caption", text: next.label },
    { id: "nextIcon", component: "Text", variant: "h2", text: next.icon },
    { id: "nextTemp", component: "Text", variant: "caption", text: next.temp },
  ];
  return makeA2UIBlob(surfaceId, "root", components);
}
