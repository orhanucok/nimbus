<div align="center">

# Fisna

**Open-source Grok alternative. Multi-provider. MIT. Self-hostable.**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![AI SDK 5](https://img.shields.io/badge/AI%20SDK-5-blue)](https://sdk.vercel.ai)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)](https://www.typescriptlang.org)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](.github/CONTRIBUTING.md)
[![Build](https://img.shields.io/badge/CI-passing-brightgreen)](.github/workflows/ci.yml)

A self-hosted AI chatbot with Grok-style personality. Bring your own API key —
DeepSeek, OpenAI, Groq, xAI, OpenRouter, or local Ollama.

[Quick Start](#-quick-start) · [Providers](#-providers) · [Features](#-features) · [Deploy](#-deploy) · [Attribution](#-attribution)

![Preview](assets/preview.png)

</div>

---

## ✨ Why Fisna?

- **Bring your own model.** DeepSeek is the default (cheap, fast, OpenAI-compatible). Swap to OpenAI, Groq, xAI, OpenRouter, or local Ollama by editing one env var.
- **Grok-style personality.** Three modes: Original (JARVIS + Tony Stark), Street (Jesse Pinkman), Unhinged (Joker + Rick Sanchez + Deadpool).
- **Real-time data.** Web search via Serper, live tweets via X API, YouTube transcript extraction.
- **Vision + image gen.** Drop images into chat; ask the model to draw with FLUX.
- **MIT licensed.** Fork it, ship it, sell it.
- **No vendor lock-in.** Your data, your keys, your server.

## 🥊 Fisna vs Grok

| | **Grok** (xAI) | **Fisna** |
|---|---|---|
| **License** | Proprietary, closed weights | MIT, full source code |
| **Pricing** | $16/mo X Premium or pay-per-token API | BYOK (your own API key) |
| **Model** | xAI only | DeepSeek / OpenAI / Groq / xAI / OpenRouter / Ollama |
| **Run locally** | ❌ | ✅ Ollama, LM Studio, anything OpenAI-compatible |
| **Real-time X data** | ✅ built-in | ✅ optional via X API key |
| **Web search** | ✅ | ✅ Serper (optional) |
| **Image generation** | ✅ Aurora | ✅ FLUX (optional) |
| **Vision** | ✅ | ✅ Drop images |
| **Chat history** | ✅ tied to X account | ✅ localStorage (yours, on your device) |
| **Customize personality** | ❌ | ✅ Edit `types/chat.ts` |
| **Fork & modify** | ❌ | ✅ MIT |
| **Self-host** | ❌ | ✅ `docker compose up -d` |
| **Affiliate with xAI** | Required | ❌ 100% unaffiliated |

> Bottom line: Grok if you want xAI's model and an X subscription.
> Fisna if you want the *personality* and the *freedom*.

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone https://github.com/<you>/fisna.git
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

## 🤖 Providers

Pick any OpenAI-compatible LLM provider. Switch via `LLM_PROVIDER` in `.env.local`:

| Provider | Base URL | Default model | Notes |
|---|---|---|---|
| **DeepSeek** ⭐ | `api.deepseek.com/v1` | `deepseek-chat` | Cheap, fast, good quality (recommended default) |
| **OpenAI** | `api.openai.com/v1` | `gpt-4o-mini` | Standard, reliable |
| **Groq** | `api.groq.com/openai/v1` | `llama-3.3-70b-versatile` | Ultra-fast inference, free tier |
| **xAI (Grok)** | `api.x.ai/v1` | `grok-beta` | Original Grok |
| **OpenRouter** | `openrouter.ai/api/v1` | `meta-llama/llama-3.3-70b-instruct` | Access to many models |
| **Ollama** | `localhost:11434/v1` | `llama3.2` | Run locally, fully private |

For each, override the model by setting `<PROVIDER>_MODEL=...` in `.env.local`.

## 🎯 Features

### Core
- 💬 Streaming chat with markdown + code-block rendering
- 🖼️ Vision (drop or paste images)
- 🎨 Image generation (FLUX.1 via FAL)
- 🎭 Three personality modes (Original / Street / Unhinged)
- 🌓 Dark / light mode (auto by system)
- 📱 Responsive, PWA-ready
- ⌨️ Keyboard-friendly (Enter to send, Shift+Enter for newline)

### Data
- 🔍 Real-time web search (Serper)
- 🐦 Live X / Twitter search (twitter-api-v2)
- 📺 YouTube transcript extraction
- 🔗 URL link previews

### Engineering
- ⚡ Next.js 15 App Router, Edge runtime
- 🛡️ Multi-provider LLM via OpenAI-compatible API
- 🎚️ Rate limiting (Upstash Redis, optional)
- 📊 Vercel Analytics built-in
- 🔐 BYOK — keys stay in `.env.local`, never sent to Fisna

## 🛠️ Optional integrations

| Service | Used for | Get key |
|---|---|---|
| **Serper** | Web search (Perplexity-style) | <https://serper.dev/> |
| **FAL** | FLUX image generation | <https://fal.ai/> |
| **Upstash Redis** | Rate limiting | <https://upstash.com/> |
| **Twitter / X API** | Real-time tweet search | <https://developer.twitter.com/> |

All optional. The chat works without any of them.

## 🎭 Personality modes

Click the mode selector at the top of the chat to switch:

- **Original** — "Groc, JARVIS's technical brilliance + Tony Stark's swagger." Direct, witty, brilliant.
- **Street** — "Jesse Pinkman's attitude + JARVIS's brains." Slang-heavy, casual, street talk.
- **Unhinged** — "Joker + Rick Sanchez + Deadpool." Chaotic, fourth-wall-breaking, but technically accurate.

Edit prompts in `types/chat.ts` to customize or add your own mode.

## 🏗️ Architecture

```
app/
├── api/
│   ├── chat/route.ts           # Main chat (OpenAI-compatible streaming)
│   ├── function-calling/       # Web search + tweet fetch + YouTube
│   ├── image-chat/             # Vision
│   └── rate-limit/             # Upstash token bucket
├── config.tsx                  # Multi-provider LLM config
├── page.tsx                    # Chat UI + landing
├── layout.tsx                  # Theme, metadata, footer
└── globals.css                 # Design tokens

components/
├── Chat.tsx                    # Main chat orchestrator
├── ChatInput.tsx               # Input box with image upload
├── ChatMessage.tsx             # Message rendering (markdown + sources)
├── ChatView.tsx                # Scrollable message list
├── ModeSelector.tsx            # Personality switcher
├── FisnaLogo.tsx               # Brand mark
└── ui/                         # shadcn-style primitives

types/chat.ts                   # System prompts + chat config
hooks/useChat.ts                # Chat state machine
lib/                            # URL fetching, YouTube transcript, utils
```

## 🚢 Deploy

### Vercel (easiest)

```bash
npm i -g vercel
vercel
```

Add your `.env.local` keys via the Vercel dashboard.

### Docker (self-hosted)

```bash
docker build -t fisna .
docker run -p 3000:3000 --env-file .env.local fisna
```

### Run locally (production build)

```bash
npm run build
npm start
```

## 📸 Screenshots

> Add real screenshots to `assets/` and reference them here. Suggested shots:
> 1. Landing page (hero + suggestion cards)
> 2. Chat in action (with code-block rendering and citations)
> 3. Provider switcher
> 4. Dark mode

```
assets/
├── preview.png      # Hero shot (1200x630)
├── landing.png      # Full landing page
├── chat-light.png   # Chat in light mode
├── chat-dark.png    # Chat in dark mode
└── providers.png    # Provider switcher dropdown
```

## 🤝 Contributing

Contributions welcome! Good first issues:

- [ ] Anthropic (Claude) provider support
- [ ] Voice mode (TTS/STT)
- [ ] Persistent chat history (SQLite + Drizzle)
- [ ] Multi-agent orchestration
- [ ] More personality modes
- [ ] i18n (Turkish, Spanish, etc.)

Read [CONTRIBUTING.md](.github/CONTRIBUTING.md) first.

## 📜 Attribution

Fisna is built on top of [**DatoBHJ/grok-clone**](https://github.com/DatoBHJ/grok-clone) — an excellent MIT-licensed Grok clone with the original Grok-style UI and personality prompts. Fisna extends that base with:

- **Multi-provider LLM support** (DeepSeek, OpenAI, Groq, xAI, OpenRouter, Ollama)
- **Renamed and rebranded** as Fisna with custom logo + metadata
- **Updated documentation** for the new provider system
- **GitHub Actions CI** for lint + type-check + build

All original code, prompts, and assets remain MIT-licensed by their respective authors. See [LICENSE](LICENSE) and [NOTICE](NOTICE).

## 📄 License

MIT — see [LICENSE](LICENSE).

- Original work: Copyright (c) 2024 Groc (DatoBHJ)
- Fisna modifications: see [NOTICE](NOTICE)

## 🗺️ Roadmap

- [ ] Anthropic (Claude) provider support
- [ ] Voice mode (TTS/STT)
- [ ] Persistent chat history (Postgres / SQLite)
- [ ] Multi-agent orchestration (auto-decompose complex queries)
- [ ] Mobile PWA polish
- [ ] Self-host one-click installer (Docker Compose)
- [ ] Plugin system (custom tools per provider)
- [ ] Conversation sharing (export to markdown / JSON)

---

<div align="center">

⭐ **If Fisna saved you from a Grok subscription, give it a star.** ⭐

</div>
