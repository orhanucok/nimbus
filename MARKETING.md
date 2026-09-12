# Fisna — Marketing & Launch Kit

> Use this when posting on HackerNews, ProductHunt, Reddit, X, Dev.to, or your blog.
> Pick the channel, paste the content, tweak the hashtags, ship.

---

## 🎯 Positioning (one-liner)

> **Fisna is the open-source Grok alternative.** Multi-provider. MIT licensed. BYOK (Bring Your Own Key). 100% unaffiliated with xAI.

## 🏷️ Taglines (pick one)

- *"Grok, but yours. Open source, multi-provider, MIT."*
- *"Open-source Grok. Bring your own model. Pay your own bill."*
- *"The Grok alternative that doesn't need an X Premium subscription."*
- *"Grok-style personality without Grok's lock-in."*
- *"Fisna — like Grok, but open source and bring-your-own-key."*

## 🔑 Key differentiators (use 3-5 in any post)

1. **Bring your own model** — DeepSeek, OpenAI, Groq, xAI, OpenRouter, or local Ollama. Switch with one env var.
2. **Multi-provider** — Not locked to one vendor. Cheapest today wins.
3. **MIT licensed** — Fork it, ship it, sell it. No strings.
4. **Grok-style UX** — Three personality modes: Original (JARVIS), Street (Pinkman), Unhinged (Joker + Rick).
5. **Real-time data** — Web search (Serper), live X/Twitter, YouTube transcripts.
6. **Vision + image gen** — Drop images, ask the model to draw with FLUX.
7. **100% unaffiliated with xAI** — Fan project, no legal threat.

---

## 📣 Show HN (HackerNews)

**Title:**
> Show HN: Fisna – Open-source Grok alternative, multi-provider, MIT

**Body:**

```
Hey HN,

I built Fisna because I wanted Grok's personality without the X Premium
paywall and the vendor lock-in. It's a Next.js 15 + TypeScript app that
plugs into any OpenAI-compatible LLM (DeepSeek, OpenAI, Groq, xAI,
OpenRouter, or local Ollama) and ships with the same Grok-style chat UI
and three personality modes (Original / Street / Unhinged).

Highlights:
- One env var to switch providers (LLM_PROVIDER=deepseek|openai|...)
- DeepSeek works out of the box at ~$0.14/M tokens (cheaper than Grok)
- Local Ollama mode for fully private, fully free
- Vision (drop images), image gen (FLUX via FAL)
- Web search (Serper), live X/Twitter, YouTube transcripts
- Chat history in localStorage, sidebar with new chat/delete
- Dark / light mode, mobile drawer, Framer Motion animations
- Error boundaries + 404 page
- GitHub Actions CI (lint, type-check, build)
- Docker support (multi-stage Dockerfile + compose)
- MIT licensed. 100% unaffiliated with xAI.

It's based on DatoBHJ/grok-clone (also MIT) — I added multi-provider
support, a custom logo, polished the UI/UX, and added the production
bits (CI, Docker, error pages, README).

Try it:
  git clone https://github.com/<you>/fisna
  cd fisna && npm install
  cp .env.example .env.local  # add DEEPSEEK_API_KEY
  npm run dev  # http://localhost:3000

Repo: https://github.com/<you>/fisna

Would love feedback on the multi-provider setup and Grok personality
prompts. What's the best way to make a personality system prompt
feel like *Grok* without literally copying xAI's?
```

---

## 🐦 Twitter / X Thread (8 tweets)

**Tweet 1 (hook):**
> I built an open-source Grok alternative. 🚀
>
> Multi-provider LLM, MIT licensed, BYOK.
> 100% unaffiliated with xAI.
>
> 1/8

**Tweet 2 (problem):**
> Grok is fun. But it costs $16/mo for X Premium, locks you to xAI, and
> you can't fork it.
>
> What if you could have the same personality, run on any LLM, and own
> the code?
>
> 2/8

**Tweet 3 (solution):**
> Meet **Fisna** 🐟
>
> Open-source, MIT, multi-provider.
> Switch between DeepSeek, OpenAI, Groq, xAI, OpenRouter, or local Ollama
> with one env var.
>
> 3/8

**Tweet 4 (features):**
> What you get:
> • Grok-style chat UI + 3 personality modes
> • Vision + image gen (FLUX)
> • Web search, live X/Twitter, YouTube transcripts
> • Chat history sidebar
> • Dark/light mode, mobile-friendly
>
> 4/8

**Tweet 5 (cost):**
> Cost reality:
> • Grok: $16/mo subscription (X Premium)
> • Fisna + DeepSeek: ~$0.14/M tokens (often <$1/mo for casual use)
> • Fisna + Ollama: $0 (run on your own GPU)
>
> 5/8

**Tweet 6 (technical):**
> Built with:
> • Next.js 15 + TypeScript strict
> • AI SDK 5 (OpenAI-compatible)
> • Tailwind + shadcn-style components
> • Framer Motion, next-themes
> • GitHub Actions CI, Docker
>
> 6/8

**Tweet 7 (social proof + CTA):**
> Star the repo if you want to see:
> ☐ Voice mode
> ☐ Persistent chat history (SQLite)
> ☐ Plugin system
> ☐ Anthropic (Claude) support
>
> github.com/<you>/fisna
>
> 7/8

**Tweet 8 (close):**
> MIT licensed. 100% unaffiliated with xAI. Just a fan project that
> got a little out of hand.
>
> Try it: `npx create-fisna-app` (soon™) or just `git clone` and go.
>
> 8/8

---

## 🚀 ProductHunt

**Tagline (60 chars):**
> Open-source Grok alternative. Multi-provider. MIT.

**Description:**
> Fisna is a self-hosted, multi-provider AI chatbot with Grok-style
> personality. Bring your own API key — DeepSeek, OpenAI, Groq, xAI,
> OpenRouter, or local Ollama. No X Premium subscription, no vendor
> lock-in, MIT licensed.
>
> Features: Grok-style chat UI with three personality modes
> (Original/Street/Unhinged), vision, image generation (FLUX), web
> search, live X/Twitter, YouTube transcripts, chat history sidebar,
> dark/light mode, mobile drawer, error boundaries, GitHub Actions CI,
> Docker support.

**Topics:** `Open Source`, `Artificial Intelligence`, `Developer Tools`,
`Chat`, `Productivity`

**First Comment (Hunt message):**
> Hey ProductHunters 👋
>
> Fisna is the open-source Grok alternative I wanted for myself — same
> personality, multi-provider, MIT, BYOK. Built with Next.js 15, AI SDK 5,
> Tailwind, Framer Motion. Comes with Docker, CI, and a chat history
> sidebar.
>
> It's a fan project, 100% unaffiliated with xAI. If you've been eyeing
> Grok but don't want the X Premium paywall or the lock-in, give it a
> spin: `git clone`, `npm install`, add an API key, `npm run dev`.
>
> Roadmap includes voice mode, persistent history, and a plugin system.
> Roadmap shaped by your upvotes and feedback, so let me know what
> matters most. 🐟

---

## 📝 Reddit

### r/LocalLLaMA

**Title:** Fisna – Open-source Grok alternative, now supports local Ollama out of the box

**Body:**
```
Fisna (https://github.com/<you>/fisna) is a Next.js + TypeScript chat
app I built to scratch my own itch: Grok's personality without Grok's
lock-in.

It supports any OpenAI-compatible LLM, including local Ollama. One env
var to switch (LLM_PROVIDER=ollama). Vision, image gen, web search, X
search all work over the same interface.

MIT licensed. Run it on your own box, no telemetry.
```

### r/ChatGPT / r/singularity

**Title:** I made an open-source Grok alternative (multi-provider, MIT, BYOK)

**Body:**
```
Tired of X Premium? Tired of being locked to one model? Built a thing.

Fisna: https://github.com/<you>/fisna

- Multi-provider: DeepSeek, OpenAI, Groq, xAI, OpenRouter, Ollama
- Three Grok-style personality modes (Original / Street / Unhinged)
- Vision, image gen, web search, X search, YouTube transcripts
- Chat history, dark mode, mobile drawer
- MIT licensed. 100% unaffiliated with xAI.

Works locally with Ollama (zero cost, full privacy) or with DeepSeek
(~$0.14/M tokens, often <$1/month for normal use).
```

---

## 📰 Dev.to / Hashnode blog post outline

**Title:** *I built an open-source Grok alternative — here's what I learned about multi-provider LLM UX*

**Sections:**
1. Why Grok, but open source? (the itch)
2. Architecture: OpenAI-compatible as the universal contract
3. Multi-provider switching with one env var (DeepSeek default)
4. Grok-style personality without legal risk
5. The cost math: Fisna + DeepSeek vs. X Premium
6. UI/UX choices that matter (sidebar, provider switcher, dark mode)
7. What's next (roadmap: voice, persistent history, plugins)
8. Try it: link to repo + 5-line quickstart

---

## 📊 Twitter single-tweet versions (use for "ship" posts)

> Shipped Fisna v0.6.0 today — open-source Grok alternative.
> • Multi-provider LLM (6 providers, switch with one env var)
> • MIT licensed, BYOK, 100% unaffiliated with xAI
> • Docker + GitHub Actions CI
> 
> github.com/<you>/fisna

> TIL: DeepSeek chat costs ~$0.14/M tokens.
> That's why Fisna defaults to it.
> 
> Run Grok-style chat, no X Premium, no lock-in.
> github.com/<you>/fisna

---

## 🎬 Demo GIF script (for README hero)

1. Land on homepage → Fisna logo + tagline fades in (Framer Motion)
2. Click suggestion card "Tell me today's headlines"
3. Chat opens, streaming response from DeepSeek
4. Click header provider dropdown → switch to OpenAI (or Ollama)
5. Type a message → streaming response from new provider
6. Click hamburger → sidebar opens, show saved chats
7. Click an old chat → history reloads
8. End with the Fisna logo + GitHub star CTA

Record with ScreenToGif / Kap, keep under 15s.

---

## 🏷️ Hashtag bank

- `#OpenSource` `#AI` `#LLM` `#Grok` `#Chatbot`
- `#NextJS` `#TypeScript` `#TailwindCSS` `#DeepSeek` `#OpenAI`
- `#BuildInPublic` `#IndieHacker` `#BYOK` `#MIT`

---

## 📣 Where to post (priority order)

1. **HackerNews (Show HN)** — best ROI for technical projects
2. **Twitter / X thread** — viral potential
3. **Reddit r/LocalLLaMA** — exact audience
4. **ProductHunt** — discoverability + lifetime backlink
5. **Dev.to / Hashnode** — long-form SEO
6. **Hackernews "Launch HN"** — after 6+ months traction

Tip: post the HN link to Twitter after it goes live — the HN traffic
trickles into stars and contributors.
