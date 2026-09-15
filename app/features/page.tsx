import Link from 'next/link';
import {
  Bot,
  Boxes,
  Brain,
  Cpu,
  KeyRound,
  MessageSquare,
  Network,
  Sparkles,
  Workflow,
  Wrench,
  Zap,
} from 'lucide-react';

export const metadata = {
  title: 'Nimbus — Features',
  description: 'A quick tour of everything Nimbus can do out of the box.',
};

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
}

const FEATURES: FeatureCard[] = [
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: 'Streaming chat',
    description:
      'Server-sent-event streaming, markdown + code-block rendering, image input, edit & regenerate, copy to clipboard.',
    href: '/',
  },
  {
    icon: <Network className="w-5 h-5" />,
    title: '7 LLM providers',
    description:
      'DeepSeek, OpenAI, Groq, xAI Grok, OpenRouter, Ollama (local), or any OpenAI-compatible endpoint via the Custom dialog.',
    href: '/settings/api-keys',
  },
  {
    icon: <Bot className="w-5 h-5" />,
    title: 'Grok Bot personas',
    description:
      '8 built-in seeds (Jarvis, Captain Hook, Stoic, Code Reviewer, Tutor, Sous Chef, Therapist, ELI5) plus a 4-step wizard for your own.',
    href: '/bots',
  },
  {
    icon: <Workflow className="w-5 h-5" />,
    title: 'Grok Build workflows',
    description:
      'DAG executor with prompt / tool / branch / http / code nodes and 8 deterministic tools. 5 starter templates included.',
    href: '/build',
  },
  {
    icon: <KeyRound className="w-5 h-5" />,
    title: 'REST API + keys',
    description:
      'POST /api/v1/chat streams responses over SSE. Mint `nmb_…` keys from the UI, revoke, audit last-used.',
    href: '/settings/api-keys',
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: 'Mobile PWA',
    description:
      'Installable on iOS/Android. Offline shell, safe-area padding, 44 px touch targets, manifest with shortcuts.',
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: 'Three personalities',
    description:
      'Original (JARVIS / Tony Stark), Street (Jesse Pinkman), Unhinged (Joker / Rick / Deadpool). Per-bot override.',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Keyboard-first',
    description:
      'Ctrl+K new chat, ? help overlay, ↑/↓ history, Esc clear. Toast feedback on every action.',
  },
  {
    icon: <Boxes className="w-5 h-5" />,
    title: 'Local-first storage',
    description:
      'Chats, bots, workflows, settings, API keys — all in localStorage. Zero accounts, zero telemetry, BYOK.',
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: 'Open source, MIT',
    description:
      'Forked from DatoBHJ/grok-clone (MIT). 100% unaffiliated with xAI. No vendor lock-in, no surprise model swaps.',
    href: 'https://github.com/orhanucok/nimbus',
  },
  {
    icon: <Wrench className="w-5 h-5" />,
    title: 'Self-host in 60 seconds',
    description:
      'docker compose up -d, or `npm run dev`. Works on Vercel, Fly.io, a Raspberry Pi. Multi-arch Docker images.',
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-5xl mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-semibold">Features</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Everything Nimbus ships with, out of the box. MIT, self-hostable,
            no vendor lock-in.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => {
            const inner = (
              <div className="bg-card border border-border rounded-xl p-5 h-full hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-2 text-blue-500 mb-2">
                  {f.icon}
                  <h2 className="font-medium text-base">{f.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
            return f.href ? (
              <Link key={f.title} href={f.href}>
                {inner}
              </Link>
            ) : (
              <div key={f.title}>{inner}</div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
