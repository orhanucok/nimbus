# Fisna — multi-stage Dockerfile
# Build:  docker build -t fisna:latest .
# Run:    docker run -p 3000:3000 --env-file .env.local fisna:latest

# ---------- deps ----------
FROM node:22-alpine AS deps
RUN corepack enable
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci --no-audit --no-fund

# ---------- builder ----------
FROM node:22-alpine AS builder
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- runner ----------
FROM node:22-alpine AS runner
RUN corepack enable
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Static assets and build output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000

CMD ["npm", "start"]
