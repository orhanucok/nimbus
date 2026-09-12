# Fisna — Open-source Grok Alternative

> A self-hosted, multi-provider AI chatbot with a Grok-style personality. Bring your own API key — DeepSeek, OpenAI, Groq, xAI, OpenRouter, or local Ollama. Real-time web search, vision, image generation, X/Twitter integration.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![AI SDK](https://img.shields.io/badge/AI%20SDK-5-blue)](https://sdk.vercel.ai)

![Preview](assets/preview.png)

## Why Fisna?

- **Bring your own model.** DeepSeek is the default (cheap, fast, OpenAI-compatible). Swap to OpenAI, Groq, xAI, OpenRouter, or local Ollama by editing one env var.
- **Grok-style personality.** Three modes: Original (JARVIS + Tony Stark), Street (Jesse Pinkman), Unhinged (Joker + Rick Sanchez + Deadpool).
- **Real-time data.** Web search via Serper, live tweets via X API, YouTube transcript extraction.
- **Vision + image gen.** Drop images into chat; ask the model to draw with FLUX.
- **MIT licensed.** Fork it, ship it, sell it.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Edge runtime)
- **LLM**: Vercel AI SDK 5 + OpenAI-compatible providers
- **UI**: React 18, Tailwind, shadcn-style (Radix UI), Lucide icons
- **Web search**: Serper
- **Image generation**: FAL (FLUX.1)
- **Tweets**: twitter-api-v2
- **YouTube**: youtube-transcript
- **Rate limiting**: Upstash Redis (optional)

## Quick Start

### 1. Clone & install

```bash
git clone <your-fork-url> fisna
cd fisna
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

## Providers

Pick any OpenAI-compatible LLM provider. Switch via `LLM_PROVIDER` in `.env.local`:

| Provider | Base URL | Default model | Notes |
|---|---|---|---|
| **DeepSeek** | `api.deepseek.com/v1` | `deepseek-chat` | Cheap, fast, good quality (recommended default) |
| **OpenAI** | `api.openai.com/v1` | `gpt-4o-mini` | Standard, reliable |
| **Groq** | `api.groq.com/openai/v1` | `llama-3.3-70b-versatile` | Ultra-fast inference |
| **xAI (Grok)** | `api.x.ai/v1` | `grok-beta` | Original Grok |
| **OpenRouter** | `openrouter.ai/api/v1` | `meta-llama/llama-3.3-70b-instruct` | Access to many models |
| **Ollama** | `localhost:11434/v1` | `llama3.2` | Run locally, fully private |

For each, you can override the model by setting `<PROVIDER>_MODEL=...` in `.env.local`.

## Optional integrations

| Service | Used for | Get key |
|---|---|---|
| **Serper** | Web search (Perplexity-style) | <https://serper.dev/> |
| **FAL** | FLUX image generation | <https://fal.ai/> |
| **Upstash Redis** | Rate limiting | <https://upstash.com/> |
| **Twitter / X API** | Real-time tweet search | <https://developer.twitter.com/> |

All optional. The chat works without any of them.

## Personality modes

Click the mode selector at the top of the chat to switch:

- **Original** — "Groc, JARVIS's technical brilliance + Tony Stark's swagger." Direct, witty, brilliant.
- **Street** — "Jesse Pinkman's attitude + JARVIS's brains." Slang-heavy, casual, street talk.
- **Unhinged** — "Joker + Rick Sanchez + Deadpool." Chaotic, fourth-wall-breaking, but technically accurate.

Edit prompts in `types/chat.ts` to customize or add your own mode.

## Architecture

```
app/
├── api/
│   ├── chat/route.ts           # Main chat (OpenAI-compatible streaming)
│   ├── function-calling/       # Web search + tweet fetch + YouTube
│   ├── image-chat/             # Vision
│   └── rate-limit/             # Upstash token bucket
├── config.tsx                  # Multi-provider LLM config
├── page.tsx                    # Chat UI
└── layout.tsx

components/
├── Chat.tsx                    # Main chat orchestrator
├── ChatInput.tsx               # Input box with image upload
├── ChatMessage.tsx             # Message rendering (markdown + sources)
├── ChatView.tsx                # Scrollable message list
├── ModeSelector.tsx            # Personality switcher
└── ui/                         # shadcn-style primitives

types/chat.ts                   # System prompts + chat config
hooks/useChat.ts                # Chat state machine
lib/                            # URL fetching, YouTube transcript, utils
```

## Deployment

### Vercel (easiest)

```bash
npm i -g vercel
vercel
```

Add your `.env.local` keys via the Vercel dashboard.

### Docker (self-hosted)

```dockerfile
# See Dockerfile (optional — add if you want)
```

### Run locally (production build)

```bash
npm run build
npm start
```

## Attribution

Fisna is built on top of [**DatoBHJ/grok-clone**](https://github.com/DatoBHJ/grok-clone) — an excellent MIT-licensed Grok clone with the original Grok-style UI and personality prompts. Fisna extends that base with:

- **Multi-provider LLM support** (DeepSeek, OpenAI, Groq, xAI, OpenRouter, Ollama)
- **Renamed and rebranded** as Fisna
- **Updated documentation** for the new provider system

All original code, prompts, and assets remain MIT-licensed by their respective authors. See `LICENSE` and `NOTICE` for details.

## License

MIT — see [LICENSE](LICENSE).

Original work: Copyright (c) 2024 Groc (DatoBHJ)  
Fisna modifications: see [NOTICE](NOTICE)

## Roadmap

- [ ] Add Anthropic (Claude) provider support
- [ ] Voice mode (TTS/STT)
- [ ] Persistent chat history (Postgres / SQLite)
- [ ] Multi-agent orchestration (auto-decompose complex queries)
- [ ] Mobile PWA polish
- [ ] Self-host one-click installer (Docker Compose)
