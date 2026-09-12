# SmartCycle Assistant — server stub (scaffolding only)

This is an isolated Node/Express package for a **future** live chatbot backend. It is
**not wired into the client build** — the redesign's live demo mode (`src/components/chatbot/**`)
runs entirely offline in the browser and never calls this server. Nothing under `src/` imports
anything from this directory, and Vite has no path into it: it has its own `package.json` and
`tsconfig.json`, and its own `node_modules` resolution, so it cannot be bundled into the client by
accident.

## What's here

`POST /api/chat` currently returns an obviously-stubbed JSON response (see the `// TODO: wire real
LLM call` comment in `src/index.ts`). It does not call any model.

## Warnings — read before touching this

- **Never call this server with a client-embedded API key.** If/when this is wired to a real LLM
  provider, that provider's credential must live only in this server's own `.env` (via
  `process.env`), read server-side, and must never be sent to or bundled into the browser client.
- **This is scaffolding only.** It is not deployed, not load-tested, not authenticated, and not
  part of the default `npm run build` / `npm run dev` flow for the main site. Treat anything it
  returns as a placeholder.
- **Never commit a real `.env` file.** Copy `.env.example` to `.env` locally and fill in real
  values only there; `.env` is gitignored.

## Local usage

```bash
cd server
npm install
cp .env.example .env   # fill in real values only if/when you actually wire a provider
npm run build
npm start
# POST http://localhost:8787/api/chat  { "message": "..." }
```
