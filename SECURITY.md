# Security Policy

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Send a private report to: **security@nimbus.local** (placeholder — replace
with a real email when you publish the repo, or use GitHub Security Advisories
under the Security tab).

Include:
- Description of the vulnerability
- Steps to reproduce
- Affected version(s) / commit hash
- Potential impact

We will respond within **72 hours** and aim to ship a fix within **14 days**
for critical issues, **30 days** for non-critical.

## Supported versions

| Version | Supported |
|---|---|
| `main` branch (latest) | ✅ |
| Last 2 minor releases | ✅ |
| Anything older | ❌ |

Nimbus is young software — only `main` is actively maintained. We tag
semver releases when we cut them.

## Threat model

Nimbus is a **self-hosted AI chat client**. The threat model is:

- **API key leakage** — your provider keys (`DEEPSEEK_API_KEY`, etc.)
  live in `.env.local`. Never commit them. Use `.env.example` as the
  template, never the real file.
- **Chat history** — chats are stored in **localStorage** on the device
  you run Nimbus on. We never see them. If you want cross-device sync,
  you wire that up yourself (we don't have a server).
- **XSS in chat messages** — Nimbus renders Markdown with
  `react-markdown`. By default we pass `skipHtml` so raw HTML in
  model output is escaped. Don't remove that flag without a CSP
  review.
- **Prompt injection** — if you pipe untrusted text into the chat,
  the model can be tricked. Nimbus doesn't add defenses here; that's
  the model's job (and the provider's). Be careful with file upload
  + ask combinations.
- **Supply chain** — `npm install` pulls from npm. We don't pin
  everything; a compromised package could land in your install.
  Review diffs of `package.json` and `package-lock.json` in PRs.

## What Nimbus does NOT do

- ❌ No telemetry (no analytics pings, no error reporting by default)
- ❌ No server-side chat storage (everything stays in your browser)
- ❌ No account system (no emails, no passwords, no user IDs)
- ❌ No CDN for assets you didn't audit yourself

## Hardening checklist (for self-hosters)

- [ ] Run behind HTTPS (Caddy / Nginx / Cloudflare)
- [ ] Set `UPSTASH_REDIS_REST_URL` + `TOKEN` for rate-limiting
- [ ] Set `SERPER_API_KEY`, `FAL_KEY`, `TWITTER_BEARER_TOKEN` only
      if you actually use those features
- [ ] Rotate your provider API keys regularly
- [ ] If exposing publicly, add Cloudflare Access / Authelia /
      oauth2-proxy in front
- [ ] Enable Dependabot (Settings → Code security → Dependabot)

## Credits

Security disclosure process modeled on the [GitHub Security Lab](https://securitylab.github.com/) best practices and the [OpenSSF Security Disclosure Guide](https://github.com/ossf/security-disclosure-best-practices).
