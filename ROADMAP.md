# Nimbus Roadmap — Grok Bot + Grok Build Alternative

> Son güncelleme: 2026-09-15
> Mevcut sürüm: v1.23.0
> Hedef: Nimbus'u **Grok Bot** (custom AI personas) + **Grok Build** (workflow orchestration)
> alternatifi olarak son ürün seviyesine getirmek, API ile kontrol edilebilir hale getirmek,
> mobile PWA + remote connection sağlamak, pazarlanabilir websitesi kurmak ve deploy etmek.

## Vizyon

Nimbus = **3 ürün tek pakette**:

1. **Nimbus Chat** — Grok-style AI sohbet (mevcut, v1.0–v1.23 tamamlandı)
2. **Nimbus Bot** — Custom AI botlar oluştur, sohbet et, paylaş (Grok Bot alternatifi)
3. **Nimbus Build** — Function-calling zincirleri kur, multi-step iş akışları çalıştır (Grok Build alternatifi)

Hepsi **BYOK** (Bring Your Own Key), **MIT**, **self-hostable**.

## Faz Planı

### Faz A — REST API + Auth (v1.24.0) 🟢
**Hedef:** Nimbus'u programatik olarak kontrol edilebilir hale getir.

- [ ] `POST /api/v1/sessions` — yeni sohbet oturumu
- [ ] `POST /api/v1/sessions/:id/messages` — streaming chat completion (SSE)
- [ ] `GET /api/v1/sessions/:id` — oturum detayı
- [ ] `DELETE /api/v1/sessions/:id` — oturum sil
- [ ] `GET /api/v1/sessions` — kullanıcının oturumları
- [ ] `POST /api/v1/keys` — API key oluştur
- [ ] `GET /api/v1/keys` — kullanıcının key'leri
- [ ] `DELETE /api/v1/keys/:id` — key sil
- [ ] `Authorization: Bearer nmb_…` header auth
- [ ] `/settings/api-keys` UI sayfası (key list + create + revoke + copy)
- [ ] API key sandbox'ı (`/playground` sayfası, browser'dan test)
- [ ] Rate limit per-key (token bucket, env `RATE_LIMIT_PER_KEY`)
- [ ] OpenAPI 3.1 spec dosyası (`/openapi.json`)
- [ ] `curl` example'ları README'de
- [ ] 10+ integration test (Vitest + mocked fetch)

### Faz B — Mobile PWA Polish (v1.25.0) 🟢
**Hedef:** Telefondan kurulabilir ve rahat kullanılabilir PWA.

- [ ] `manifest.json` — proper icons (192/512), theme color, maskable, shortcuts
- [ ] iOS splash screens + apple-touch-icon
- [ ] Service worker (offline shell + runtime cache)
- [ ] Mobile-specific CSS — touch targets ≥44px, safe area insets
- [ ] Bottom-sheet style mobile menu (chat list)
- [ ] Swipe gesture — chat history aç/kapa
- [ ] Pull-to-refresh on landing
- [ ] Haptic feedback (navigator.vibrate) on send
- [ ] Mobile keyboard-aware viewport (visualViewport API)
- [ ] Lighthouse PWA score ≥95

### Faz C — Grok Bot Mode (v1.26.0) 🟢
**Hedef:** Custom AI personas oluştur, sohbet et, library'de tut, paylaş.

- [ ] `BotsContext` + `lib/bots.ts` (localStorage store)
- [ ] `Bot` shape: id, name, avatar (emoji/seed), systemPrompt, temperature, model, createdAt, shareSlug
- [ ] `/bots` — bot library (grid, search, filter)
- [ ] `/bots/new` — bot oluşturma wizard (4 adım: Identity → Persona → Behavior → Test)
- [ ] `/bots/:id` — bot detay + edit + chat launcher
- [ ] `/b/:slug` — public share link (read-only bot info + chat)
- [ ] Seed bots: Jarvis / Pirate / Therapist / Code Reviewer / Tutor / Chef
- [ ] Bot avatar generator (DiceBear API, deterministic from seed)
- [ ] Bot chat mode in main page (header'da bot switcher)
- [ ] `lib/botTemplates.ts` — 8 hazır persona template
- [ ] 8+ unit test

### Faz D — Grok Build Mode (v1.27.0) 🟡
**Hedef:** Function-calling zincirleri kur, multi-step workflow çalıştır.

- [ ] `lib/workflow.ts` — DAG executor (nodes + edges)
- [ ] Node types: PromptNode, ToolNode, BranchNode, HttpNode, CodeNode
- [ ] Built-in tools: web_search (Serper), calculator, datetime, uuid, json_transform
- [ ] `/build` — workflow canvas (drag-drop, basit grid)
- [ ] `/build/:id` — workflow editor + run + history
- [ ] `/build/templates` — 5 starter template
- [ ] Workflow export as JSON
- [ ] Workflow chat: "Run this workflow with input X" → execute → stream result
- [ ] 5+ unit test

### Faz E — Marketing Pages (v1.28.0) 🟡
**Hedef:** Pazarlanabilir landing + feature showcase.

- [ ] `/` — current landing (gözden geçir)
- [ ] `/pricing` — free (BYOK) vs Pro tier (yönetilen altyapı)
- [ ] `/features` — özellik showcase (cards grid, screenshots)
- [ ] `/showcase` — community bot showcase (curated bots)
- [ ] `/docs` — getting started, API reference, self-host guide
- [ ] `/changelog` — public changelog (CHANGELOG.md render)
- [ ] `/blog` — markdown blog (1 post: "Why we built Nimbus")
- [ ] SEO meta (OG images, twitter cards)
- [ ] JSON-LD structured data

### Faz F — Remote Control (v1.29.0) 🟡
**Hedef:** Telefondan Nimbus'u kontrol et, masaüstünden devam et.

- [ ] QR-code pairing flow (mobile scans desktop URL)
- [ ] WebSocket relay channel (encrypted, ephemeral)
- [ ] Mobile companion view: chat list + read messages + send messages
- [ ] Notification: yeni message desktop'a push
- [ ] "Continue on desktop" handoff link
- [ ] Pairing token expiry (5 min) + revoke

### Faz G — Public Deploy (v1.30.0) 🟢
**Hedef:** Public URL'de canlı.

- [ ] `next.config.mjs` — standalone build, output: 'export' (static) veya Vercel serverless
- [ ] Vercel deploy script (`vercel.json`)
- [ ] Custom domain setup (eğer kullanıcı varsa)
- [ ] DNS / SSL auto
- [ ] Deploy URL'ini README + footer'a ekle
- [ ] Smoke test: landing + chat + API key create + bot create hepsi çalışıyor

## Tamamlanan Fazlar

| Faz | Sürüm | Tarih | Özet |
|---|---|---|---|
| - | v1.0–v1.20 | Eyl 2026 | Fisna→Nimbus rebrand, multi-provider, sidebar, settings, export, tests |
| - | v1.21 | Eyl 2026 | Custom provider dialog, lib/customProvider, X-Nimbus-Custom-Provider header |
| - | v1.22 | Eyl 2026 | ChatInput spinner + char counter, Sidebar live search, Chat AnimatePresence |
| - | v1.23 | Eyl 2026 | Toast system, KeyboardHelpOverlay, Settings export/import, robots+sitemap |

## Teknik Borç (TODO)

- [ ] TypeScript strict 14 kod hatası (sandbox'ta `npm install` çalışmıyor — kullanıcı local'de fix edecek)
- [ ] OpenAI/Anthropic native adapter (Anthropic API OpenAI-uyumlu değil)
- [ ] Persistent chat history (PostgreSQL/SQLite) — şu an localStorage
- [ ] Multi-agent orchestration runtime (şu an sadece workflow editor)

## Başarı Kriterleri (Definition of Done)

- [x] 4 release tag GitHub'da (v1.17.0, v1.21.0, v1.22.0, v1.23.0)
- [ ] Faz A–G'nin hepsi merged + release tag
- [ ] Public URL'de canlı
- [ ] 200+ unit test
- [ ] Mobile PWA Lighthouse score ≥90
- [ ] HN launch post hazır (`/marketing/show-hn.md`)
