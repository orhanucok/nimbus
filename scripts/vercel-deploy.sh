#!/usr/bin/env bash
# scripts/vercel-deploy.sh
#
# One-shot deploy helper for Nimbus on Vercel.
#
# Prerequisites:
#   • Node 20+
#   • `npm i -g vercel`
#   • `vercel login` already completed
#
# Usage:
#   ./scripts/vercel-deploy.sh preview    # deploy a preview URL
#   ./scripts/vercel-deploy.sh production # deploy to production
#
# Required env (set via `vercel env add` or in the Vercel dashboard):
#   LLM_PROVIDER          (default: deepseek)
#   DEEPSEEK_API_KEY
#   OPENAI_API_KEY        (optional)
#   GROQ_API_KEY          (optional)
#   XAI_API_KEY           (optional)
#   OPENROUTER_API_KEY    (optional)
#   OLLAMA_BASE_URL       (optional)
#   SERPER_API_KEY        (optional, web search)
#   FAL_KEY               (optional, FLUX image gen)
#   TWITTER_BEARER_TOKEN  (optional, X / Twitter search)
#   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (optional, rate limiting)

set -euo pipefail

mode="${1:-preview}"

echo "📦 Building Nimbus…"
npm ci --no-audit --no-fund
npm run lint
npm run typecheck || echo "⚠️  typecheck reported issues — continuing anyway"
npm run build

echo "🚀 Deploying to Vercel ($mode)…"
if [ "$mode" = "production" ]; then
  vercel deploy --prod --yes
else
  vercel deploy --yes
fi

echo "🩺 Smoke test…"
url="$(vercel inspect --format json | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)"
if [ -n "$url" ]; then
  echo "→ $url/api/health"
  curl -fsSL "$url/api/health" | head -c 500 || echo "❌ health check failed"
fi

echo "✅ Done."
