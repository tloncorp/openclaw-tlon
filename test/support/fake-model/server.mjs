import http from "node:http";
import { extractLatestScriptKey, resolveScriptedResponse } from "./scripts.mjs";

const port = Number(process.env.PORT ?? 4000);

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/health") {
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === "GET" && req.url === "/v1/models") {
      sendJson(res, 200, {
        object: "list",
        data: [{ id: "tlon-test-scripted", object: "model", owned_by: "tlon-tests" }],
      });
      return;
    }

    if (req.method === "POST" && req.url === "/v1/chat/completions") {
      const body = await readJson(req);
      const messages = Array.isArray(body.messages) ? body.messages : [];
      const key = extractLatestScriptKey(messages);
      const scripted = resolveScriptedResponse({ key, messages });
      const payload = completionPayload({ model: body.model, scripted });

      if (body.stream === true) {
        sendSseCompletion(res, payload);
      } else {
        sendJson(res, 200, payload);
      }
      return;
    }

    sendJson(res, 404, { error: { message: `Unhandled fake model route: ${req.method} ${req.url}` } });
  } catch (error) {
    sendJson(res, 500, { error: { message: error instanceof Error ? error.message : String(error) } });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`[fake-model] listening on :${port}`);
});

function completionPayload({ model, scripted }) {
  return {
    id: `chatcmpl-fake-${Date.now()}`,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: model ?? "tlon-test-scripted",
    choices: [
      {
        index: 0,
        message: scripted.message,
        finish_reason: scripted.finish_reason,
      },
    ],
    usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
  };
}

function sendSseCompletion(res, payload) {
  res.writeHead(200, {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache",
    connection: "keep-alive",
  });

  const choice = payload.choices[0];
  const base = {
    id: payload.id,
    object: "chat.completion.chunk",
    created: payload.created,
    model: payload.model,
  };

  if (choice.message.tool_calls?.length) {
    res.write(`data: ${JSON.stringify({
      ...base,
      choices: [{ index: 0, delta: { role: "assistant", tool_calls: choice.message.tool_calls }, finish_reason: null }],
    })}\n\n`);
  } else {
    res.write(`data: ${JSON.stringify({
      ...base,
      choices: [{ index: 0, delta: { role: "assistant", content: choice.message.content ?? "" }, finish_reason: null }],
    })}\n\n`);
  }

  res.write(`data: ${JSON.stringify({
    ...base,
    choices: [{ index: 0, delta: {}, finish_reason: choice.finish_reason }],
  })}\n\n`);
  res.write("data: [DONE]\n\n");
  res.end();
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(payload));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}
