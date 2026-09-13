# Contributing to Nimbus

Thanks for your interest in making Nimbus better. Every PR, issue, and Discord message helps.

## 🛠️ Local development

```bash
git clone https://github.com/orhanucok/nimbus.git
cd nimbus
npm install
cp .env.example .env.local       # add DEEPSEEK_API_KEY etc.
npm run dev                       # http://localhost:3000
```

Open a second terminal for the test runner:

```bash
npm test            # vitest run (one-shot)
npm run test:watch  # vitest watch
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
```

## 🔀 Pull requests

1. **Fork** the repo, create a branch off `main`:
   ```bash
   git checkout -b feat/my-feature
   ```
2. **Make your change.** Keep PRs small and focused — one feature or fix per PR.
3. **Add a test** if your change touches logic. We have `tests/` set up with Vitest + Testing Library.
4. **Run the full check locally before pushing:**
   ```bash
   npm run typecheck && npm test && npm run build
   ```
5. **Commit** with a clear message:
   ```
   <scope>: <imperative summary>
   
   <body explaining the why, not the what>
   ```
   Scope examples: `chat`, `sidebar`, `provider`, `docs`, `tests`.
6. **Push** and **open a PR** against `main`. Fill in the template — keep it short.

A maintainer will review within a few days. We may request changes. Don't take it personally — we want to keep the codebase healthy.

## 🐛 Bug reports

Open a **GitHub Issue** with the **Bug Report** template. Include:
- Nimbus version (`git rev-parse HEAD` short hash)
- Node + npm version (`node --version && npm --version`)
- Browser + OS
- Steps to reproduce (minimal)
- Expected vs actual
- Console logs / screenshots if relevant

## 💡 Feature requests

Open an issue with the **Feature Request** template. Tell us:
- **The problem** you're trying to solve (not just the solution)
- Who else has this problem
- What you've tried so far
- Willing to send a PR?

We bias toward **smaller, faster PRs**. If your feature is big, let's split it.

## 🧪 Adding a provider

Nimbus ships with 6 OpenAI-compatible providers (DeepSeek, OpenAI, Groq, xAI, OpenRouter, Ollama). To add a new one:

1. Edit `app/config.tsx`:
   ```tsx
   const PROVIDERS = {
     // ...
     your_provider: {
       baseURL: 'https://api.example.com/v1',
       apiKey: process.env.YOUR_PROVIDER_API_KEY,
       model: process.env.YOUR_PROVIDER_MODEL || 'default-model',
     },
   };
   ```
2. Add to `PROVIDERS` exported array in `components/ProviderSwitcher.tsx`.
3. Add a row to `.env.example`.
4. Add a row to the **Fisna vs Grok** table in `README.md` (if it differs).
5. Add a unit test in `tests/provider-switcher.test.tsx`.

If your provider isn't OpenAI-compatible, you'll need a custom `fetch` adapter — open an issue first to discuss.

## 🎨 Design / UI

Nimbus uses:
- **Tailwind CSS** for utility classes
- **shadcn-style** primitives in `components/ui/`
- **Framer Motion** for entry animations
- **lucide-react** for icons

Please match the existing visual language (rounded-lg, soft shadows, dark-mode aware). If you're proposing a major visual change, attach a screenshot/GIF.

## 🔒 Security

Report security issues privately — see `SECURITY.md`. **Do not** open a public issue.

## 📜 License

By contributing, you agree that your contributions will be licensed under the project's MIT license.

## 💬 Community

- **GitHub Discussions** — for questions, ideas, show & tell
- **Issues** — for bugs and feature requests only

Thanks again. Happy hacking. 🐟
