import { describe, expect, it } from "vitest";
import { validateA2UIBlobEntry } from "@tloncorp/api";

import {
  buildWeatherA2UIBlob,
  serializeBlobField,
} from "./blob.js";

describe("a2ui blobs", () => {
  it("builds weather blobs in the supported v1 shape", () => {
    const weather = buildWeatherA2UIBlob({
      location: "Brooklyn",
      temperature: "72F",
      summary: "clear",
    });

    expect(validateA2UIBlobEntry(weather)).toBe(true);
    expect(JSON.parse(serializeBlobField(weather))).toEqual([weather]);
  });

  it("rejects unsupported components and actions", () => {
    const weather = buildWeatherA2UIBlob({
      location: "Brooklyn",
      temperature: "72F",
      summary: "clear",
    });

    expect(
      validateA2UIBlobEntry({
        ...weather,
        messages: [
          weather.messages[0],
          {
            version: "v0.9",
            updateComponents: {
              surfaceId: "weather",
              root: "root",
              components: [{ id: "root", component: "Badge", text: "Nope" }],
            },
          },
        ],
      }),
    ).toBe(false);

    expect(
      validateA2UIBlobEntry({
        ...weather,
        messages: [
          weather.messages[0],
          {
            version: "v0.9",
            updateComponents: {
              surfaceId: "weather",
              root: "root",
              components: [
                { id: "root", component: "Button", child: "label" },
                { id: "label", component: "Text", text: "Run" },
              ],
            },
          },
        ],
      }),
    ).toBe(false);
  });
});
