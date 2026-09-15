<div align="center">

# Nimbus

**Open-source Grok alternative. Multi-provider. MIT. Self-hostable.**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![AI SDK 5](https://img.shields.io/badge/AI%20SDK-5-blue)](https://sdk.vercel.ai)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)](https://www.typescriptlang.org)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](.github/CONTRIBUTING.md)
[![Build](https://img.shields.io/badge/CI-passing-brightgreen)](.github/workflows/ci.yml)

A self-hosted AI chatbot with Grok-style personality. Bring your own API key â€”
DeepSeek, OpenAI, Groq, xAI, OpenRouter, or local Ollama.

[Quick Start](#-quick-start) · [Providers](#-providers) · [Features](#-features) · [Deploy](#-deploy) · [API](#-public-rest-api-v1) · [Attribution](#-attribution)

**Live demo:** *deploy your own in 5 minutes with `./scripts/vercel-deploy.sh production`*

![Preview](assets/preview.png)

</div>

---

## âœ¨ Why Nimbus?

- **Bring your own model.** DeepSeek is the default (cheap, fast, OpenAI-compatible). Swap to OpenAI, Groq, xAI, OpenRouter, or local Ollama by editing one env var.
- **Grok-style personality.** Three modes: Original (JARVIS + Tony Stark), Street (Jesse Pinkman), Unhinged (Joker + Rick Sanchez + Deadpool).
- **Real-time data.** Web search via Serper, live tweets via X API, YouTube transcript extraction.
- **Vision + image gen.** Drop images into chat; ask the model to draw with FLUX.
- **MIT licensed.** Fork it, ship it, sell it.
- **No vendor lock-in.** Your data, your keys, your server.

## ğŸ¥Š Nimbus vs Grok

| | **Grok** (xAI) | **Nimbus** |
|---|---|---|
| **License** | Proprietary, closed weights | MIT, full source code |
| **Pricing** | $16/mo X Premium or pay-per-token API | BYOK (your own API key) |
| **Model** | xAI only | DeepSeek / OpenAI / Groq / xAI / OpenRouter / Ollama |
| **Run locally** | âŒ | âœ… Ollama, LM Studio, anything OpenAI-compatible |
| **Real-time X data** | âœ… built-in | âœ… optional via X API key |
| **Web search** | âœ… | âœ… Serper (optional) |
| **Image generation** | âœ… Aurora | âœ… FLUX (optional) |
| **Vision** | âœ… | âœ… Drop images |
| **Chat history** | âœ… tied to X account | âœ… localStorage (yours, on your device) |
| **Customize personality** | âŒ | âœ… Edit `types/chat.ts` |
| **Fork & modify** | âŒ | âœ… MIT |
| **Self-host** | âŒ | âœ… `docker compose up -d` |
| **Affiliate with xAI** | Required | âŒ 100% unaffiliated |

> Bottom line: Grok if you want xAI's model and an X subscription.
> Nimbus if you want the *personality* and the *freedom*.

## ğŸš€ Quick Start

### 1. Clone & install

```bash
git clone https://github.com/<you>/Nimbus.git
cd Nimbus
npm install
```

### 2. Configure

```bash
cp .env.example .env.local
```

Edit `.env.local`. The minimum you need is **one** LLM provider key. DeepSeek is recommended for cost (~$0.14/M tokens). Get a key at <https://platform.deepseek.com/>.

```bash
LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=sk-...
```

### 3. Run

```bash
npm run dev
```

Open <http://localhost:3000>.

## ğŸ¤– Providers

Pick any OpenAI-compatible LLM provider. Switch via `LLM_PROVIDER` in `.env.local`:

| Provider | Base URL | Default model | Notes |
|---|---|---|---|
| **DeepSeek** â­ | `api.deepseek.com/v1` | `deepseek-chat` | Cheap, fast, good quality (recommended default) |
| **OpenAI** | `api.openai.com/v1` | `gpt-4o-mini` | Standard, reliable |
| **Groq** | `api.groq.com/openai/v1` | `llama-3.3-70b-versatile` | Ultra-fast inference, free tier |
| **xAI (Grok)** | `api.x.ai/v1` | `grok-beta` | Original Grok |
| **OpenRouter** | `openrouter.ai/api/v1` | `meta-llama/llama-3.3-70b-instruct` | Access to many models |
| **Ollama** | `localhost:11434/v1` | `llama3.2` | Run locally, fully private |
| **Custom…** | _your URL_ | _your model_ | Any OpenAI-compatible endpoint (Together, LM Studio, your own router, …). Configure in the header dropdown — no env edit needed. |

For each, override the model by setting `<PROVIDER>_MODEL=...` in `.env.local`.

### Runtime switching

Pick a provider at runtime from the header dropdown — no `.env.local` edit, no server restart.
The choice is stored in a `nimbus-provider` cookie (1 year) and read by `/api/chat`.

For **Custom…** the saved endpoint URL, model, and API key live in `localStorage` and are
sent on every request as the `X-Nimbus-Custom-Provider` header.

## ğŸ¯ Features

### Core
- ğŸ’¬ Streaming chat with markdown + code-block rendering
- ğŸ–¼ï¸ Vision (drop or paste images)
- ğŸ¨ Image generation (FLUX.1 via FAL)
- ğŸ­ Three personality modes (Original / Street / Unhinged)
- ğŸŒ“ Dark / light mode (auto by system)
- ğŸ“± Responsive, PWA-ready
- âŒ¨ï¸ Keyboard-friendly (Enter to send, Shift+Enter for newline)

### Data
- ğŸ” Real-time web search (Serper)
- ğŸ¦ Live X / Twitter search (twitter-api-v2)
- ğŸ“º YouTube transcript extraction
- ğŸ”— URL link previews

### Engineering
- âš¡ Next.js 15 App Router, Edge runtime
- ğŸ›¡ï¸ Multi-provider LLM via OpenAI-compatible API
- ğŸšï¸ Rate limiting (Upstash Redis, optional)
- ğŸ“Š Vercel Analytics built-in
- ğŸ” BYOK â€” keys stay in `.env.local`, never sent to Nimbus
- ğŸ§ª Vitest + Testing Library — 50+ unit tests across components, hooks, and config
- ğŸª„ ErrorBoundary, loading skeletons, empty states, focus traps, ARIA labels

## ğŸ› ï¸ Optional integrations

| Service | Used for | Get key |
|---|---|---|
| **Serper** | Web search (Perplexity-style) | <https://serper.dev/> |
| **FAL** | FLUX image generation | <https://fal.ai/> |
| **Upstash Redis** | Rate limiting | <https://upstash.com/> |
| **Twitter / X API** | Real-time tweet search | <https://developer.twitter.com/> |

All optional. The chat works without any of them.

## ğŸ­ Personality modes

Click the mode selector at the top of the chat to switch:

- **Original** â€” "Groc, JARVIS's technical brilliance + Tony Stark's swagger." Direct, witty, brilliant.
- **Street** â€” "Jesse Pinkman's attitude + JARVIS's brains." Slang-heavy, casual, street talk.
- **Unhinged** â€” "Joker + Rick Sanchez + Deadpool." Chaotic, fourth-wall-breaking, but technically accurate.

Edit prompts in `types/chat.ts` to customize or add your own mode.

## ğŸ—ï¸ Architecture

```
app/
â”œâ”€â”€ api/
â”‚   â”œâ”€â”€ chat/route.ts           # Main chat (OpenAI-compatible streaming)
â”‚   â”œâ”€â”€ function-calling/       # Web search + tweet fetch + YouTube
â”‚   â”œâ”€â”€ image-chat/             # Vision
â”‚   â””â”€â”€ rate-limit/             # Upstash token bucket
â”œâ”€â”€ config.tsx                  # Multi-provider LLM config
â”œâ”€â”€ page.tsx                    # Chat UI + landing
â”œâ”€â”€ layout.tsx                  # Theme, metadata, footer
â””â”€â”€ globals.css                 # Design tokens

components/
â”œâ”€â”€ Chat.tsx                    # Main chat orchestrator
â”œâ”€â”€ ChatInput.tsx               # Input box with image upload
â”œâ”€â”€ ChatMessage.tsx             # Message rendering (markdown + sources)
â”œâ”€â”€ ChatView.tsx                # Scrollable message list
â”œâ”€â”€ ModeSelector.tsx            # Personality switcher
â”œâ”€â”€ NimbusLogo.tsx               # Brand mark
â””â”€â”€ ui/                         # shadcn-style primitives

types/chat.ts                   # System prompts + chat config
hooks/useChat.ts                # Chat state machine
lib/                            # URL fetching, YouTube transcript, utils
```

## ğŸš¢ Deploy

See **[DEPLOY.md](DEPLOY.md)** for the full guide. TL;DR:

```bash
# Vercel (one command)
./scripts/vercel-deploy.sh production

# Docker
docker build -t Nimbus:latest .
docker run -p 3000:3000 --env-file .env.local Nimbus:latest

# Smoke test after deploy
curl https://your-app.vercel.app/api/health
```

### Vercel (easiest)

```bash
npm i -g vercel
vercel
```

Add your `.env.local` keys via the Vercel dashboard.

### Docker (self-hosted)

```bash
docker build -t Nimbus .
docker run -p 3000:3000 --env-file .env.local Nimbus
```

### Run locally (production build)

```bash
npm run build
npm start
```

## ğŸ“¸ Screenshots

> Add real screenshots to `assets/` and reference them here. Suggested shots:
> 1. Landing page (hero + suggestion cards)
> 2. Chat in action (with code-block rendering and citations)
> 3. Provider switcher
> 4. Dark mode

```
assets/
â”œâ”€â”€ preview.png      # Hero shot (1200x630)
â”œâ”€â”€ landing.png      # Full landing page
â”œâ”€â”€ chat-light.png   # Chat in light mode
â”œâ”€â”€ chat-dark.png    # Chat in dark mode
â””â”€â”€ providers.png    # Provider switcher dropdown
```

## ğŸ¤ Contributing

Contributions welcome! Good first issues:

- [ ] Anthropic (Claude) provider support
- [ ] Voice mode (TTS/STT)
- [ ] Persistent chat history (SQLite + Drizzle)
- [ ] Multi-agent orchestration
- [ ] More personality modes
- [ ] i18n (Turkish, Spanish, etc.)

Read [CONTRIBUTING.md](.github/CONTRIBUTING.md) first.

## ğŸ“œ Attribution

Nimbus is built on top of [**DatoBHJ/grok-clone**](https://github.com/DatoBHJ/grok-clone) â€” an excellent MIT-licensed Grok clone with the original Grok-style UI and personality prompts. Nimbus extends that base with:

- **Multi-provider LLM support** (DeepSeek, OpenAI, Groq, xAI, OpenRouter, Ollama)
- **Renamed and rebranded** as Nimbus with custom logo + metadata
- **Updated documentation** for the new provider system
- **GitHub Actions CI** for lint + type-check + build

All original code, prompts, and assets remain MIT-licensed by their respective authors. See [LICENSE](LICENSE) and [NOTICE](NOTICE).

## ğŸ“„ License

MIT â€” see [LICENSE](LICENSE).

- Original work: Copyright (c) 2024 Groc (DatoBHJ)
- Nimbus modifications: see [NOTICE](NOTICE)

## ğŸ”‘ Public REST API (v1)

Nimbus exposes a tiny REST endpoint for scripting, mobile apps, and CI.

### 1. Create a key

Open <http://localhost:3000/settings/api-keys>, click **Create**, copy the key.
You will only see it once.

### 2. Send a chat request

```bash
curl -X POST https://your-nimbus.example/api/v1/chat \
  -H "Authorization: Bearer nmb_XXXXXXXX_SECRET..." \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "system",    "content": "You are a helpful assistant." },
      { "role": "user",      "content": "Say hi in Turkish." }
    ],
    "providerId": "deepseek",
    "stream": true
  }'
```

`providerId` is optional and falls back to the runtime cookie / env default.
Streaming returns Server-Sent Events (`data: {...}\n\n`); pass `"stream": false`
to get a JSON `{ id, content, provider, model }` response instead.

Custom OpenAI-compatible endpoints work the same way as the browser UI: pick
`providerId: "custom"` and send `X-Nimbus-Custom-Provider: <base64 JSON>` with
`{ baseURL, model, apiKey? }`.

### Endpoints (so far)

| Method | Path                | Auth          | Description                              |
|--------|---------------------|---------------|------------------------------------------|
| `POST` | `/api/v1/chat`      | Bearer `nmb_…` | Streaming chat completion (SSE or JSON) |
| `GET`  | `/api/v1/chat`      | —              | Endpoint metadata                       |

See [ROADMAP.md](ROADMAP.md) for upcoming endpoints (sessions, bots, workflows).

## ğŸ—ºï¸ Roadmap

- [x] Custom OpenAI-compatible provider (header dropdown)
- [x] Runtime provider switching via cookie
- [x] Export conversation to Markdown / JSON
- [ ] Anthropic (Claude) provider support
- [ ] Voice mode (TTS/STT)
- [ ] Persistent chat history (Postgres / SQLite)
- [ ] Multi-agent orchestration (auto-decompose complex queries)
- [ ] Mobile PWA polish
- [ ] Self-host one-click installer (Docker Compose)
- [ ] Plugin system (custom tools per provider)

---

<div align="center">

â­ **If Nimbus saved you from a Grok subscription, give it a star.** â­

</div>
