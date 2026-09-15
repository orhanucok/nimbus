# Deploying Nimbus

Nimbus ships three deployment paths. Pick the one that matches your team.

| Path | Best for | Cost | Time-to-live |
|---|---|---|---|
| **[Vercel](#vercel-easiest)** | Solo devs, demos, public launch | Free tier covers most use; Pro starts $20/mo | ~5 min |
| **[Docker](#docker-self-hosted)** | Self-hosted, your own server or VPS | Server cost only | ~10 min |
| **[Static export](#static-export-no-backend)** | Marketing landing, no chat features | Free (any static host) | ~5 min |

> All three require **at least one** LLM provider API key (DeepSeek is cheapest).

---

## 1. Vercel (easiest)

```bash
# One-time
npm i -g vercel
vercel login

# From the repo root
./scripts/vercel-deploy.sh production
```

Or skip the script:

```bash
vercel        # first run: prompts for project name + region
vercel --prod # promote to production
```

### Environment variables

Set these via `vercel env add KEY=value` (or the Vercel dashboard).

| Key | Required | Notes |
|---|---|---|
| `LLM_PROVIDER` | yes | One of `deepseek`, `openai`, `groq`, `xai`, `openrouter`, `ollama`. Default: `deepseek` |
| `DEEPSEEK_API_KEY` | if `deepseek` | https://platform.deepseek.com/ |
| `OPENAI_API_KEY` | if `openai` | |
| `GROQ_API_KEY` | if `groq` | |
| `XAI_API_KEY` | if `xai` | |
| `OPENROUTER_API_KEY` | if `openrouter` | |
| `OLLAMA_BASE_URL` | if `ollama` | e.g. `http://localhost:11434/v1` |
| `SERPER_API_KEY` | no | Enables web search in chat |
| `FAL_KEY` | no | Enables FLUX image generation |
| `TWITTER_BEARER_TOKEN` | no | Enables live tweet search |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | no | Enables rate limiting |
| `USE_RATE_LIMITING` | no | Set `false` to disable rate limiting entirely |

### Smoke test

```bash
curl https://your-app.vercel.app/api/health
# → { ok: true, service: "Nimbus", version: "...", ... }
```

### Continuous deploy

Vercel auto-deploys on every push to `main`. PRs get a preview URL
(`autoAlias: true` in `vercel.json`).

---

## 2. Docker (self-hosted)

```bash
docker build -t nimbus:latest .
docker run -d \
  --name nimbus \
  -p 3000:3000 \
  --restart unless-stopped \
  --env-file .env.local \
  nimbus:latest
```

Then visit `http://localhost:3000`.

### docker-compose

```yaml
version: '3.8'
services:
  nimbus:
    image: nimbus:latest
    build: .
    ports:
      - "3000:3000"
    env_file: .env.local
    restart: unless-stopped
```

### Healthcheck

The container exposes `GET /api/health`. Add this to the compose file:

```yaml
healthcheck:
  test: ["CMD", "wget", "-qO-", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 5s
  retries: 3
```

---

## 3. Static export (no backend)

If you only need the landing page + marketing pages (no chat, no API),
build a static export:

```bash
# In next.config.js set:  output: 'export'
# Then:
npm run build
# Outputs to ./out/
```

Upload `out/` to any static host (GitHub Pages, Cloudflare Pages, Netlify,
or `npx serve out` for a quick local preview).

> ⚠️ **Limitations:**
> - No `/api/*` routes — chat will be disabled
> - Service worker still works (offline shell + asset cache)
> - Provider switcher in the UI falls back to env defaults
> - Bot / workflow libraries still work (they live in localStorage)

---

## Post-deploy checklist

- [ ] `/api/health` returns `ok: true`
- [ ] `/` loads with the gradient hero
- [ ] `/pricing`, `/features`, `/changelog` return 200
- [ ] `/bots` lists 8 built-in seed bots
- [ ] `/build` lists 5 starter workflows
- [ ] Provider switcher round-trips through DeepSeek → Ollama → DeepSeek
- [ ] Custom provider dialog saves + restores a config
- [ ] `POST /api/v1/chat` with a Bearer key returns 200 (or a streaming response)

If any item fails, open an issue with the URL + the failing endpoint.
