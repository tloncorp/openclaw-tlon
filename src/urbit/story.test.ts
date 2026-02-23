import { describe, expect, it } from "vitest";

import { markdownToStory } from "./story.js";

describe("markdownToStory URL linkification", () => {
  it("linkifies a bare URL in plain text", () => {
    const story = markdownToStory("https://example.com/path");

    expect(story).toEqual([
      {
        inline: [
          {
            link: {
              href: "https://example.com/path",
              content: "https://example.com/path",
            },
          },
        ],
      },
    ]);
  });

  it("linkifies a bare URL when preceded by list punctuation", () => {
    const story = markdownToStory("- https://example.com/path");

    expect(story).toEqual([
      {
        inline: [
          "- ",
          {
            link: {
              href: "https://example.com/path",
              content: "https://example.com/path",
            },
          },
        ],
      },
    ]);
  });
});
