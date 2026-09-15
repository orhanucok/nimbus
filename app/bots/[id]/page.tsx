'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Bot as BotIcon, Edit3, MessageCircle, Trash2, Share2, Copy } from 'lucide-react';
import { BotsProvider, useBots } from '@/components/BotsProvider';
import { BotAvatar } from '@/components/BotAvatar';
import { useToast } from '@/components/Toast';
import { slugify, type Bot } from '@/lib/bots';

function BotDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { findById, upsert, remove, markUsed, bots } = useBots();
  const toast = useToast();

  const id = typeof params.id === 'string' ? params.id : '';
  const bot = useMemo(() => findById(id), [bots, findById, id]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Bot | null>(bot ?? null);

  useEffect(() => {
    setDraft(bot ?? null);
  }, [bot]);

  if (!bot) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="text-center">
          <BotIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <h1 className="text-lg font-semibold mb-1">Bot not found</h1>
          <p className="text-sm text-muted-foreground mb-4">
            The bot you&apos;re looking for doesn&apos;t exist in this browser.
          </p>
          <Link
            href="/bots"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to library
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (!draft) return;
    upsert({
      id: draft.id,
      name: draft.name,
      avatar: draft.avatar,
      tagline: draft.tagline,
      description: draft.description,
      systemPrompt: draft.systemPrompt,
      temperature: draft.temperature,
      maxTokens: draft.maxTokens,
      providerId: draft.providerId,
      tags: draft.tags,
      shareSlug: draft.shareSlug,
    });
    setEditing(false);
    toast.show('success', 'Bot saved');
  };

  const handleDelete = () => {
    if (bot.builtin) {
      toast.show('error', 'Built-in bots cannot be deleted');
      return;
    }
    if (!confirm(`Delete bot "${bot.name}"? This cannot be undone.`)) return;
    remove(bot.id);
    toast.show('info', 'Bot deleted');
    router.push('/bots');
  };

  const handleShare = async () => {
    const slug = bot.shareSlug ?? slugify(bot.name);
    const url = `${window.location.origin}/b/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.show('success', `Share link copied: /b/${slug}`);
    } catch {
      toast.show('error', 'Copy failed');
    }
  };

  const handleStartChat = () => {
    markUsed(bot.id);
    sessionStorage.setItem('nimbus-active-bot', JSON.stringify({ id: bot.id, name: bot.name, avatar: bot.avatar }));
    toast.show('info', `Loaded ${bot.name} into chat`);
    router.push('/?bot=' + bot.id);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/bots"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to library
        </Link>

        <header className="flex items-start gap-4 mb-6">
          <BotAvatar glyph={bot.avatar} name={bot.name} size={80} shape="rounded" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold truncate">{bot.name}</h1>
              {bot.builtin && (
                <span className="px-1.5 py-0.5 text-[10px] rounded bg-blue-500/20 text-blue-500 font-medium">
                  BUILT-IN
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{bot.tagline}</p>
            {bot.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {bot.tags.map((t) => (
                  <span key={t} className="px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={handleStartChat}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg
                bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white font-medium transition-opacity"
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </button>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setEditing((v) => !v)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label={editing ? 'Cancel edit' : 'Edit bot'}
                title="Edit"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Share link"
                title="Copy share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              {!bot.builtin && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                  aria-label="Delete bot"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </header>

        {editing && draft ? (
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Avatar (emoji or letter)</label>
                <input
                  type="text"
                  value={draft.avatar}
                  onChange={(e) => setDraft({ ...draft, avatar: e.target.value })}
                  maxLength={2}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Tagline</label>
              <input
                type="text"
                value={draft.tagline}
                onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">System prompt</label>
              <textarea
                rows={6}
                value={draft.systemPrompt}
                onChange={(e) => setDraft({ ...draft, systemPrompt: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-3 py-1.5 text-sm rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <section>
              <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                System prompt
              </h2>
              <pre className="p-4 bg-card border border-border rounded-xl text-sm font-mono whitespace-pre-wrap">
                {bot.systemPrompt}
              </pre>
            </section>

            <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <Stat label="Temperature" value={bot.temperature?.toFixed(2) ?? 'default'} />
              <Stat label="Max tokens" value={bot.maxTokens?.toString() ?? 'default'} />
              <Stat label="Provider" value={bot.providerId ?? 'default'} />
              <Stat label="Created" value={new Date(bot.createdAt).toLocaleDateString()} />
            </section>

            {bot.shareSlug && (
              <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/40 rounded-lg text-sm">
                <Copy className="w-4 h-4 text-blue-500 shrink-0" />
                <code className="flex-1 font-mono truncate">/b/{bot.shareSlug}</code>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-mono mt-1">{value}</div>
    </div>
  );
}

export default function BotDetailPage() {
  return (
    <BotsProvider>
      <BotDetail />
    </BotsProvider>
  );
}
