import Link from 'next/link';
import { Check, Key, Sparkles, Server } from 'lucide-react';

export const metadata = {
  title: 'Nimbus — Pricing',
  description: 'Nimbus is MIT and self-hosted by default. Optional managed hosting if you do not want to run a server.',
};

const FREE_FEATURES = [
  'MIT-licensed full source',
  'Multi-provider LLM (DeepSeek, OpenAI, Groq, xAI, OpenRouter, Ollama, Custom…)',
  'Unlimited chats, unlimited bots, unlimited workflows',
  'Web + mobile PWA',
  'REST API + API keys',
  'Community Discord',
];

const PRO_FEATURES = [
  'Everything in Free, plus:',
  'Zero-config managed hosting',
  'Bring-your-own-domain (CNAME)',
  'Automatic model fallback',
  'Cross-device chat history sync (E2E encrypted)',
  'Email support',
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-5xl mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-semibold">Pricing</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Nimbus is MIT-licensed and self-hosted by default. We offer a managed
            tier for users who do not want to run a server.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 text-blue-500">
              <Key className="w-5 h-5" />
              <h2 className="text-xl font-semibold">BYOK (free)</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Self-host with your own LLM API key.
            </p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-semibold">$0</span>
              <span className="text-muted-foreground">/forever</span>
            </div>
            <ul className="mt-6 space-y-2 text-sm">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="https://github.com/orhanucok/nimbus"
              className="mt-6 block w-full text-center px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
            >
              Get the source
            </Link>
          </div>

          <div className="bg-card border-2 border-blue-500/60 rounded-2xl p-6 relative">
            <span className="absolute -top-3 left-6 px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-500 text-white uppercase tracking-wider">
              Coming soon
            </span>
            <div className="flex items-center gap-2 text-purple-500">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Nimbus Pro</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Managed hosting with no API key required.
            </p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-semibold">$9</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mt-6 space-y-2 text-sm">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled
              className="mt-6 block w-full px-4 py-2 rounded-lg bg-muted text-muted-foreground font-medium cursor-not-allowed"
            >
              Join the waitlist
            </button>
          </div>
        </div>

        <section className="mt-16 text-center max-w-2xl mx-auto">
          <Server className="w-6 h-6 mx-auto opacity-60 mb-3" />
          <h3 className="text-lg font-medium">Prefer your own server?</h3>
          <p className="text-sm text-muted-foreground mt-1">
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">docker compose up -d</code> is
            all you need. Read the{' '}
            <Link href="https://github.com/orhanucok/nimbus#-deploy" className="underline">
              deploy docs
            </Link>{' '}
            for DigitalOcean, Fly.io, and bare-metal guides.
          </p>
        </section>
      </main>
    </div>
  );
}
