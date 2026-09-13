# Changelog

All notable changes to **Nimbus** are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
The project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
