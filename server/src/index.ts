/**
 * Scaffolding-only Express server for a FUTURE live SmartCycle Assistant
 * backend. Not wired into the client — see server/README.md for the full
 * warning. Nothing here calls a real model yet.
 */
import express from "express";
import type { Request, Response } from "express";

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT ?? 8787);

// Reserved for a future live LLM call — read only from process.env, never
// hardcoded and never sent to any client. Currently unused because /api/chat
// below is fully stubbed; this only warns at boot so it's obvious the key
// isn't wired to anything yet.
const LLM_API_KEY = process.env.CHATBOT_LLM_API_KEY;
if (!LLM_API_KEY) {
  console.warn(
    "[smartcycleai-chatbot-server-stub] CHATBOT_LLM_API_KEY is not set. This is expected: " +
      "this stub does not call a real LLM yet. See the TODO in this file.",
  );
}

interface ChatRequestBody {
  message?: unknown;
}

app.post("/api/chat", (req: Request<unknown, unknown, ChatRequestBody>, res: Response) => {
  const message = typeof req.body?.message === "string" ? req.body.message : "";

  // TODO: wire real LLM call. This currently returns a clearly-labeled stub
  // response instead of ever contacting a model provider. When this is
  // implemented, it must read its credential from `LLM_API_KEY` above
  // (process.env only) and must never accept a key from the request body,
  // query string, or any client-supplied header.
  res.json({
    stub: true,
    reply: "This is a stubbed server response — no live LLM is connected yet.",
    receivedMessage: message,
    note: "See // TODO: wire real LLM call in server/src/index.ts",
  });
});

app.get("/healthz", (_req: Request, res: Response) => {
  res.json({ ok: true, stub: true });
});

app.listen(PORT, () => {
  console.log(`[smartcycleai-chatbot-server-stub] listening on http://localhost:${PORT} (stub only, not wired to client)`);
});
