const TLON_TEST_KEY_RE = /\[tlon-test:([a-zA-Z0-9_.:-]+)\]/g;
const REF_TAG_RE = /\[ref-[a-zA-Z0-9_-]+\]/g;

export function extractLatestScriptKey(messages) {
  const text = messages
    .map((message) => extractText(message?.content))
    .filter(Boolean)
    .join("\n");
  let latest = null;
  for (const match of text.matchAll(TLON_TEST_KEY_RE)) {
    latest = match[1];
  }
  return latest;
}

export function resolveScriptedResponse({ key, messages }) {
  const script = scripts[key];
  if (!script) {
    return textResponse(`No fake-model script registered for tlon-test:${key ?? "<missing>"}`);
  }
  return script({ messages });
}

const scripts = {
  "simple-online": ({ messages }) => textResponse("Fake model online.", { messages }),
  "post-channel-basic": ({ messages }) => {
    const toolResultSeen = messages.some((message) => message?.role === "tool");
    if (toolResultSeen) {
      return textResponse("Done", { messages });
    }

    const latestUserText = latestUserMessageText(messages);
    const target = latestUserText.match(/\b(chat\/~[\w-]+\/[\w-]+)\b/)?.[1];
    const quoted = [...latestUserText.matchAll(/["“]([^"”]+)["”]/g)].at(-1)?.[1];

    if (!target || !quoted) {
      return textResponse("Missing target or quoted message for post-channel-basic script.", { messages });
    }

    return toolCallResponse({
      id: "call_post_channel_basic",
      name: "message",
      arguments: {
        action: "send",
        target,
        message: quoted,
      },
    });
  },
};

function latestUserMessageText(messages) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i]?.role === "user") {
      return extractText(messages[i].content);
    }
  }
  return "";
}

function extractText(content) {
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        if (part && typeof part === "object") {
          if (typeof part.text === "string") {
            return part.text;
          }
          if (typeof part.content === "string") {
            return part.content;
          }
        }
        return "";
      })
      .join("\n");
  }
  if (content && typeof content === "object" && typeof content.text === "string") {
    return content.text;
  }
  return "";
}

function textResponse(content, { messages } = {}) {
  const refTag = latestRefTag(messages ?? []);
  return {
    message: { role: "assistant", content: refTag ? `${content} ${refTag}` : content },
    finish_reason: "stop",
  };
}

function latestRefTag(messages) {
  const text = messages
    .map((message) => extractText(message?.content))
    .filter(Boolean)
    .join("\n");
  let latest = null;
  for (const match of text.matchAll(REF_TAG_RE)) {
    latest = match[0];
  }
  return latest;
}

function toolCallResponse(toolCall) {
  return {
    message: {
      role: "assistant",
      content: null,
      tool_calls: [
        {
          id: toolCall.id,
          type: "function",
          function: {
            name: toolCall.name,
            arguments: JSON.stringify(toolCall.arguments),
          },
        },
      ],
    },
    finish_reason: "tool_calls",
  };
}
