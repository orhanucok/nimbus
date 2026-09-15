'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import { Bot as BotIcon, MessageCircle } from 'lucide-react';
import { BotsProvider, useBots } from '@/components/BotsProvider';
import { BotAvatar } from '@/components/BotAvatar';

function SharedBotView() {
  const params = useSearchParams();
  const slug = params.get('s') ?? '';
  const { bots } = useBots();
  const bot = useMemo(() => bots.find((b) => b.shareSlug === slug), [bots, slug]);

  if (!slug || !bot) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <BotIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <h1 className="text-lg font-semibold mb-1">Bot not found</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Either this share link is invalid, or the bot owner hasn&apos;t installed
            Nimbus on this device yet. Ask them to open the link first to seed the bot.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
          >
            Open Nimbus
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-start gap-4 mb-6">
          <BotAvatar glyph={bot.avatar} name={bot.name} size={88} shape="rounded" />
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-semibold">{bot.name}</h1>
            <p className="text-base text-muted-foreground mt-1">{bot.tagline}</p>
            {bot.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {bot.tags.map((t) => (
                  <span key={t} className="px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-sm leading-relaxed mb-6">{bot.description}</p>

        <section className="mb-6">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            System prompt
          </h2>
          <pre className="p-4 bg-card border border-border rounded-xl text-sm font-mono whitespace-pre-wrap">
            {bot.systemPrompt}
          </pre>
        </section>

        <Link
          href={`/?bot=${bot.id}`}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm rounded-lg
            bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white font-medium transition-opacity"
        >
          <MessageCircle className="w-4 h-4" />
          Start chatting
        </Link>

        <p className="text-xs text-muted-foreground mt-8">
          Shared via <Link href="/bots" className="underline">Nimbus Bots</Link>.
        </p>
      </main>
    </div>
  );
}

export default function SharedBotPage() {
  return (
    <BotsProvider>
      <Suspense fallback={null}>
        <SharedBotView />
      </Suspense>
    </BotsProvider>
  );
}
