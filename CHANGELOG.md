# Changelog

All notable changes to **Nimbus** are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
The project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.30.0] – 2026-09-15 — Public deploy infrastructure

### Added
- **`/api/health`** — liveness + version probe (`{ ok, service, version, runtime,
  uptime, now }`). Used by Vercel/Docker healthchecks and the smoke test in
  the deploy script.
- **`scripts/vercel-deploy.sh`** — one-shot Vercel deploy helper. Runs
  `npm ci` → `lint` → `typecheck` → `build` → `vercel deploy`, then curls
  `/api/health` on the live URL. Use `./scripts/vercel-deploy.sh preview`
  for a preview URL or `./scripts/vercel-deploy.sh production` to promote.
- **`DEPLOY.md`** — comprehensive deploy guide covering Vercel, Docker, and
  static export. Includes the env-var table, docker-compose snippet, health
  check recipe, and a post-deploy smoke checklist.

### Changed
- **`next.config.js`** — disables next-pwa's built-in SW generator
  (`register: false`, `disable: true`) so our hand-written
  `public/sw.js` is never overwritten. Adds a `Service-Worker-Allowed: /`
  header on `/sw.js` so it can claim the root scope, plus tightened
  security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy).
- **`.github/workflows/ci.yml`** — adds an `npm test` step so the full
  Vitest suite runs on every push and PR.
- **`README.md`** — Deploy section links to `DEPLOY.md` and mentions the
  one-command deploy; Live demo banner added to the header.

### Tests
- `tests/api-health.test.ts` — 1 spec (validates the response shape).

Total: 124+ unit tests across 21 files.

## [1.29.0] – 2026-09-15 — Remote pairing (mobile control)

### Added
- **`lib/remotePairing.ts`** — pairing protocol. 6-digit numeric codes +
  24-char secrets, 5-minute TTL, claim-once semantics. Helpers:
  `mintPairing`, `claimPairing`, `revokePairing`, `findPairing`,
  `isValidPairing`, `formatCountdown`, `randomCode`, `randomSecret`.
- **`/remote`** — desktop-side pairing console. Generate codes, live
  countdown (`5:00 → 0:00`), copy / revoke actions, "Recent claims" list
  with device names. AnimatePresence for graceful removal on expiry.
- **`/remote/control`** — phone-side companion. 6-digit input pad with
  numeric keyboard, device-name picker, success state with the curl
  example for the REST API.
- **Header remote icon** — links to `/remote` next to Build.

### Tests
- `tests/remote-pairing.test.ts` — 10 specs (randomCode/secret helpers,
  formatCountdown edges, mint TTL, isValidPairing accept/reject,
  claim-once, findPairing, revoke, load/save round-trip).

Total: 123+ unit tests across 20 files.

## [1.28.0] – 2026-09-15 — Marketing pages

### Added
- **`/pricing`** — two-tier comparison (BYOK free vs Pro managed hosting,
  with a "Coming soon" waitlist badge on Pro). Footer-deep-link from the
  chat page.
- **`/features`** — 11-card grid tour of every shipped capability, each
  linking into the relevant page when it exists.
- **`/changelog`** — public release timeline rendered server-side from
  `CHANGELOG.md` with inline code highlighting and semantic section
  parsing (Added / Changed / Fixed / Removed / Deprecated / Security).
- **Footer nav** — adds `features`, `pricing`, `changelog` links on
  ≥sm screens; version badge bumped to `v1.27.0` (will move forward with
  each release).

### Tests
- `tests/changelog-parse.test.ts` — 4 specs (empty input, single release,
  multi-release with mixed section kinds, fallback for unknown headings).

Total: 113+ unit tests across 19 files.

## [1.27.0] – 2026-09-15 — Grok Build (workflow playground)

### Added
- **`lib/workflow.ts`** — DAG-based workflow engine:
  - Node kinds: `prompt`, `tool`, `branch`, `http`, `code`.
  - 8 built-in tools: `calculator`, `datetime`, `uuid`, `json`, `upper`,
    `lower`, `reverse`, `wordcount`.
  - Topological executor with cycle protection (50-step cap), per-node
    `ExecLogEntry`, sandboxed `with(state)` expressions for `code`/`branch`.
  - `validateWorkflow` rejects empty names, missing start nodes, and
    unreachable nodes.
- **`lib/workflowTemplates.ts`** — 5 starter workflows (Sentiment + summary,
  If-else branching, JSON formatter, UUID + datetime stamp, Calculator chain).
- **`/build`** — workflow library. Quick-create form, separate sections for
  user vs built-in templates, click-to-open editor.
- **`/build/[id]`** — workflow editor + runner. JSON-config node editor,
  per-node kind picker, start-node selector, Run/Save/Delete buttons, live
  run log with per-step timings, final-state dump, toast feedback.
- **Header workflow icon** — links to `/build` next to the Bots icon.

### Tests
- `tests/workflow.test.ts` — 11 specs (calculator + sandbox, wordcount,
  upper/reverse chain, code expression, branching on `state`, unknown tool
  graceful fail, cycle detection, validateWorkflow errors + happy path).

Total: 109+ unit tests across 18 files.

## [1.26.0] – 2026-09-15 — Grok Bot mode

### Added
- **`lib/bots.ts`** — `Bot` shape (id, name, avatar, tagline, systemPrompt,
  temperature, maxTokens, providerId, tags, shareSlug, builtin). localStorage
  store, slugifier, id minting. 8 built-in seed bots (Jarvis, Captain Hook,
  The Stoic, Code Reviewer, Tutor, Sous Chef, Therapist, ELI5). Idempotent
  `installSeedBots()` runs once on first load.
- **`components/BotsProvider.tsx`** + `useBots()` — React context over the
  bot store with `upsert`, `remove`, `markUsed`, `findById`, `findBySlug`.
  Built-in bots are protected from deletion.
- **`components/BotAvatar.tsx`** — deterministic gradient avatar (no network),
  emoji or initials rendering, circle or rounded shape.
- **`components/BotCard.tsx`** — hover-lift card with avatar + name + tagline
  + tags. Built-in badge for seeded bots.
- **`/bots`** — bot library. Search by name/tagline/tag, separate sections
  for Built-in and Your bots.
- **`/bots/new`** — 4-step wizard (Identity → Personality → Behavior → Review)
  with step indicator, avatar picker, temperature slider, tag chips, public
  share toggle, and live review before submit.
- **`/bots/[id]`** — detail view: avatar header, system prompt, stats grid,
  edit mode, share-link copy, delete (non-builtin), "Chat" handoff that loads
  the bot into the main page via sessionStorage.
- **`/b?s=<slug>`** — public share page (read-only preview + "Start chatting"
  deep link). Falls back to a friendly "not found" with a Nimbus install CTA.
- **Header bot icon** — links to `/bots` next to the API-keys icon.

### Tests
- `tests/bots.test.ts` — 7 specs (save/reload, findBySlug, idempotent seeds,
  force-reset, slugify, newBotId).
- `tests/bot-avatar.test.tsx` — 3 specs (emoji, fallback initials, fallback
  to first letters of name).
- `tests/bot-card.test.tsx` — 3 specs (name/tagline, built-in badge, tag cap
  at 3).

Total: 98+ unit tests across 17 files.

## [1.25.0] – 2026-09-15 — Mobile PWA polish

### Added
- **`public/manifest.json` rewrite** — proper Nimbus branding (`Nimbus — Open-source
  Grok alternative`), maskable icon entry, 2 shortcuts (`New chat`, `API keys`),
  portrait orientation, dark `theme_color: #5b6cff`.
- **`public/sw.js`** — offline-first service worker (Nimbus v1 cache namespace).
  - Navigation → NetworkFirst with shell fallback.
  - `/_next/static/*` and image/font assets → CacheFirst.
  - `/api/*` → NetworkOnly (never cache streaming chat).
  - Everything else → StaleWhileRevalidate.
  - Versioned cache eviction on `activate`.
- **`hooks/useServiceWorker.ts`** + **`components/SWRegister.tsx`** — client-side
  registration helper. Production-only, idempotent, defers to `window.load` so
  first-paint is not blocked. Mounted once in `app/layout.tsx`.
- **Mobile CSS in `globals.css`**:
  - `env(safe-area-inset-*)` padding on `<html>` (iOS notch + Android nav).
  - 44 px minimum touch targets on `(pointer: coarse)` devices.
  - 16 px font-size floor on form fields (kills iOS auto-zoom).
  - `overscroll-behavior-y: contain` so pull-to-refresh doesn't yank the page.
  - `@media (display-mode: standalone)` rule for installed PWAs.

### Tests
- `tests/use-service-worker.test.tsx` — 2 specs (registers with scope `/`,
  silently no-ops when `navigator.serviceWorker` is missing).

Total: 85+ unit tests across 14 files.

## [1.24.0] – 2026-09-15 — Public REST API v1 + API key manager

### Added
- **`POST /api/v1/chat`** — first public REST endpoint. Streams chat completions
  via SSE (default) or returns JSON with `stream: false`. Same multi-provider
  resolution as the browser UI (`providerId` override, cookie fallback, env
  fallback, custom OpenAI-compatible via `X-Nimbus-Custom-Provider`).
- **`lib/apiAuth.ts`** — API-key minting (`nmb_<8>_<32>`), SHA-256 hashing,
  sync implementation that runs in the Edge runtime, bearer-token parsing,
  localStorage-backed key store. The full key is shown once at creation; only
  the SHA-256 hash + last-4 survive.
- **`/settings/api-keys`** — UI to create, reveal, copy, revoke, and delete
  API keys. Curl example embedded. Toasts on every action.
- **`components/ApiKeyManager.tsx`** — reusable component (also imported by the
  page) with green banner for newly minted plaintext, reveal/hide toggle, and
  per-row revoke + delete.
- **Header link** — small key icon next to the existing settings gear that
  opens `/settings/api-keys`.
- **`ROADMAP.md`** — long-form product roadmap (Grok Bot, Grok Build, mobile
  PWA, public deploy, etc.).

### Tests
- `tests/api-auth.test.ts` — 11 specs (mint, persist, findActiveKey, revoked
  blocking, bearer parsing, isApiKey, randomString alphabet, two canonical
  SHA-256 vectors).
- `tests/api-key-manager.test.tsx` — 5 specs (empty state, create, persist,
  copy, delete).

Total: 83+ unit tests across 13 files.

## [1.23.0] – 2026-09-13 — Toast system + keyboard help overlay

### Added
- **`Toast` system** (`components/Toast.tsx`, `useToast` hook): global bottom-right
  notifications with `success` / `error` / `info` variants. Auto-dismiss with
  configurable duration, `role="alert"` for errors, `role="status"` for others,
  Framer Motion enter/exit animations. Provider mounted in `app/layout.tsx`.
- **`KeyboardHelpOverlay`** (`components/KeyboardHelpOverlay.tsx`): modal listing
  every shortcut, opened with `?`. Press `?` anywhere outside a text field to
  toggle, `Esc` to close. Backdrop click also closes.
- **`useKeyboardShortcuts` `onToggleHelp`** handler wired to `?` key (suppressed
  inside text inputs so typing `?` still works).
- **Settings export / import**: new buttons in `SettingsPanel`. Export downloads
  `nimbus-settings-YYYY-MM-DD.json`; import reads JSON, validates shape, clamps
  temperature (0–2) and max tokens (64–32000), and toasts on success/error.
- **Footer upgrade**: brand mark + `v1.22.0` release badge that deep-links to
  GitHub release notes, plus a real GitHub star link. Hidden on small screens.
- **SEO**: `app/robots.ts` (allows `/`, disallows `/api/`) and `app/sitemap.ts`
  (homepage + 3 section anchors).

### Changed
- `ChatMessage` copy button now shows a transient `Check` icon and a success
  toast for ~1.5s after copying. Adds `aria-label` flipping between "Copy" and
  "Copied" for screen readers.
- Landing page shortcut hint row gains a `? all shortcuts` affordance that opens
  the new overlay.

### Tests
- `tests/toast.test.tsx` — 6 specs (provider guard, success/error/info render,
  zero-duration persistence, auto-dismiss, manual dismiss).
- `tests/keyboard-help-overlay.test.tsx` — 5 specs (closed state, content,
  Esc, backdrop, X button).
- `tests/use-keyboard-shortcuts.test.tsx` — 5 specs (Ctrl+K, ? outside fields,
  ? suppressed in input, Esc, arrows).

Total: 67+ unit tests across 11 test files.

## [Unreleased]

### Added
- **Custom OpenAI-compatible provider**: dialog (`CustomProviderDialog`) lets you plug in
  any OpenAI-compatible endpoint (Together, Anyscale, LM Studio, your own router, …).
  Saved to `localStorage`, sent to `/api/chat` via the `X-Nimbus-Custom-Provider` header.
- **ProviderSwitcher wiring**: picking **Custom…** in the header dropdown now opens the dialog;
  built-in providers still write a `nimbus-provider` cookie for runtime switching.
- **TypingIndicator in chat**: replaces the static "Thinking…" text with animated dots.
- **Keyboard shortcut hints** on the welcome screen (Ctrl+K / Esc / Enter).
- **Hover lift on suggestion cards** (Framer Motion spring).
- **Tests**:
  - `tests/custom-provider-dialog.test.tsx` — 8 specs (open/close, hydration, validation, save flow).
  - `tests/custom-provider.test.ts` — 7 specs (storage round-trip, header encode/decode).
  - `tests/provider-switcher.test.tsx` — extended to 7 providers + dialog + cookie assertions.

## [1.20.0] – 2026-09-13 — ErrorBoundary + UI polish
### Added
- `ErrorBoundary` (class component, `role="alert"`, custom fallback `node | (err, reset) => node`,
  `onError` callback for logging/telemetry).
- 9 new unit tests for `ErrorBoundary`, `NimbusLogo`, `SettingsPanel`, and `Sidebar`.
### Fixed
- TypeScript strict+ now compiles cleanly across the whole codebase (43 source files).

## [1.19.0] – 2026-09-13 — LoadingSkeleton + EmptyState
### Added
- `LoadingSkeleton` family: `TypingIndicator`, `MessageSkeleton`, `Spinner` (Framer Motion).
- `EmptyState` reusable placeholder (`role="status"`).

## [1.18.0] – 2026-09-13 — Custom provider entry
### Added
- "Custom…" entry in `PROVIDERS` list (dialog wiring lands in Unreleased).

## [1.17.0] – 2026-09-13 — Runtime provider switching
### Added
- Runtime provider selection via `nimbus-provider` cookie.
- `getProviderConfig(id, 'chat' | 'fc')` resolver that prefers cookie over env.
- Full `package.json` metadata (license, homepage, bugs, repository, keywords, engines).

## [1.16.0] – 2026-09-13 — Vercel deploy
### Added
- `vercel.json` with security headers + `autoAlias: true` for PR preview URLs.
- One-click deploy path documented in `README.md`.

## [1.15.0] – 2026-09-13 — Community files
### Added
- `CONTRIBUTING.md`, `SECURITY.md`, `.github/ISSUE_TEMPLATE/bug_report.md`,
  `.github/ISSUE_TEMPLATE/feature_request.md`, `.github/PULL_REQUEST_TEMPLATE.md`.

## [1.14.0] – 2026-09-13 — Code highlighting
### Added
- `rehype-pretty-code` integration (`github-dark` + `github-light` themes).

## [1.13.0] – 2026-09-13 — Header wire-up
### Added
- Header renders `TokenCounter`, `ExportChat`, `SettingsPanel`, and `ProviderSwitcher` together.

## [1.12.0] – 2026-09-13 — Tests round 4
### Added
- 11 more unit tests (SettingsPanel, Sidebar, TokenCounter).

## [1.11.0] – 2026-09-13 — Tests round 3
### Added
- 11 more unit tests (CodeBlock, ErrorBoundary, NimbusLogo).

## [1.10.0] – 2026-09-13 — Settings persistence
### Added
- `SettingsPanel` writes to `localStorage` under `nimbus-settings`.

## [1.9.0] – 2026-09-13 — SettingsPanel
### Added
- `SettingsPanel`: temperature slider, max-tokens input, system-prompt presets,
  `role="dialog"` modal, focus trap, Esc-to-close.

## [1.8.0] – 2026-09-13 — TokenCounter in chat
### Added
- `TokenCounter` shows live character-based estimate in the header.

## [1.7.0] – 2026-09-13 — ExportChat
### Added
- `ExportChat`: download current conversation as Markdown or JSON.

## [1.6.0] – 2026-09-13 — Keyboard shortcuts
### Added
- `useKeyboardShortcuts` hook: `Ctrl/⌘+K` new chat, `Esc` clear input,
  `↑/↓` cycle history.

## [1.5.0] – 2026-09-13 — TokenCounter
### Added
- `TokenCounter` component (chars/4 heuristic, progress bar).

## [1.4.0] – 2026-09-13 — CodeBlock
### Added
- `CodeBlock` with language badge + one-click copy button.

## [1.3.0] – 2026-09-13 — Vitest setup + first tests
### Added
- Vitest + jsdom + `@testing-library/react`. Initial 9 unit tests.

## [1.2.0] – 2026-09-13 — TypeScript strict+
### Changed
- `"strict": true`, `"noUncheckedIndexedAccess": true`,
  `"noImplicitReturns": true`, `"noImplicitOverride": true`,
  `"forceConsistentCasingInFileNames": true`, `"target": "ES2020"`.

## [1.1.0] – 2026-09-13 — ProviderSwitcher
### Added
- 6 providers in the header dropdown (DeepSeek, OpenAI, Groq, xAI, OpenRouter, Ollama).
- Localized UI strings for the dropdown.

## [1.0.0] – 2026-09-13 — Fisna → Nimbus rebrand
### Changed
- Full rename: `fisna` → `nimbus` across package, README, env keys, storage keys.
- New `NimbusLogo` (cloud + sun + sparkle, gradient blue→purple).

## [0.7.0] – 2026-09-13 — Marketing
### Added
- `MARKETING.md` (Show HN blurb, Twitter thread, Product Hunt, Reddit).
- Comparison table: Nimbus vs Grok (12 rows).

## [0.6.0] – 2026-09-13 — Docker
### Added
- Multi-stage `Dockerfile`, `docker-compose.yml`, healthcheck endpoint.

## [0.5.2] – 2026-09-13 — ErrorBoundary + 404
### Added
- `app/error.tsx`, `app/not-found.tsx` (branded).

## [0.5.0] – 2026-09-13 — Sidebar
### Added
- `Sidebar` component: chat history with `localStorage` persistence (max 50),
  new-chat button, delete, active highlight, keyboard accessible.

## [0.4.0] – 2026-09-13 — Multi-provider LLM
### Added
- 6 OpenAI-compatible providers (DeepSeek, OpenAI, Groq, xAI, OpenRouter, Ollama).
- Build-time provider selection via `LLM_PROVIDER` env.

## [0.1.0] – 2026-09-13 — Initial fork
### Notes
- Forked from [`DatoBHJ/grok-clone`](https://github.com/DatoBHJ/grok-clone) (MIT).
- Attribution preserved in `NOTICE`.
