'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Sparkles } from 'lucide-react';
import { BotsProvider, useBots } from '@/components/BotsProvider';
import { BotCard } from '@/components/BotCard';

function BotsLibrary() {
  const { bots } = useBots();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bots;
    return bots.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [bots, query]);

  const userBots = filtered.filter((b) => !b.builtin);
  const seedBots = filtered.filter((b) => b.builtin);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <header className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold flex items-center gap-2">
              <Sparkles className="w-7 h-7 opacity-70" />
              Nimbus Bots
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Custom AI personas. Build a pirate captain, a Stoic philosopher,
              a code reviewer — whatever fits your workflow.
            </p>
          </div>
          <Link
            href="/bots/new"
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg
              bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white font-medium transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New bot
          </Link>
        </header>

        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bots by name, tagline, or tag…"
            className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        {seedBots.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
              Built-in ({seedBots.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {seedBots.map((b) => (
                <BotCard key={b.id} bot={b} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
            Your bots ({userBots.length})
          </h2>
          {userBots.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl p-8 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                You haven&apos;t created any bots yet.
              </p>
              <Link
                href="/bots/new"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create your first bot
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userBots.map((b) => (
                <BotCard key={b.id} bot={b} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function BotsPage() {
  return (
    <BotsProvider>
      <BotsLibrary />
    </BotsProvider>
  );
}
