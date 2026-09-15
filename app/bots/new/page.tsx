'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bot as BotIcon, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BotsProvider, useBots } from '@/components/BotsProvider';
import { BotAvatar } from '@/components/BotAvatar';
import { useToast } from '@/components/Toast';
import { slugify } from '@/lib/bots';

const AVATAR_CHOICES = ['🤖', '🧠', '🎩', '👨‍🍳', '🎓', '🏴‍☠️', '💙', '🧒', '🦊', '🐉', '🦄', '✨', '🔥', '🌊', '🌙', '⚡'];

const TAG_SUGGESTIONS = ['voice', 'coach', 'code', 'dev', 'education', 'creative', 'wellness', 'fun', 'food', 'classic'];

function NewBotWizard() {
  const router = useRouter();
  const { upsert } = useBots();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🤖');
  const [tagline, setTagline] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [tags, setTags] = useState<string[]>([]);
  const [sharePublic, setSharePublic] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const canNext = (() => {
    if (step === 0) return name.trim().length >= 2;
    if (step === 1) return tagline.trim().length >= 4 && systemPrompt.trim().length >= 10;
    if (step === 2) return true;
    return true;
  })();

  const handleCreate = () => {
    if (!name.trim() || !systemPrompt.trim()) {
      toast.show('error', 'Name and system prompt are required');
      return;
    }
    const bot = upsert({
      name: name.trim(),
      avatar,
      tagline: tagline.trim() || 'A custom Nimbus bot.',
      description: tagline.trim() || 'A custom Nimbus bot.',
      systemPrompt: systemPrompt.trim(),
      temperature,
      maxTokens: null,
      providerId: null,
      tags,
      shareSlug: sharePublic ? slugify(name) : null,
    });
    toast.show('success', `Bot "${bot.name}" created`);
    router.push(`/bots/${bot.id}`);
  };

  const stepTitles = ['Identity', 'Personality', 'Behavior', 'Review'];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/bots"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to library
        </Link>

        <header className="mb-6">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <BotIcon className="w-6 h-6 opacity-70" />
            New bot
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Four steps. You can edit anything later.
          </p>
        </header>

        {/* Step indicator */}
        <ol className="flex items-center mb-8" aria-label="Wizard steps">
          {stepTitles.map((label, i) => (
            <li
              key={label}
              className={`flex-1 flex items-center ${i < stepTitles.length - 1 ? '' : ''}`}
            >
              <div className="flex flex-col items-center">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    i < step
                      ? 'bg-blue-500 text-white'
                      : i === step
                      ? 'bg-blue-500/20 text-blue-500 ring-2 ring-blue-500/40'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  aria-current={i === step ? 'step' : undefined}
                >
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {label}
                </span>
              </div>
              {i < stepTitles.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 ${i < step ? 'bg-blue-500' : 'bg-border'}`}
                />
              )}
            </li>
          ))}
        </ol>

        <div className="bg-card border border-border rounded-xl p-6 min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18 }}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="font-medium">Identity</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="My clever bot"
                      maxLength={48}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Avatar</label>
                    <div className="flex flex-wrap gap-2">
                      {AVATAR_CHOICES.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setAvatar(g)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-colors ${
                            avatar === g
                              ? 'bg-blue-500/20 ring-2 ring-blue-500/60'
                              : 'bg-muted hover:bg-accent'
                          }`}
                          aria-pressed={avatar === g}
                          aria-label={`Avatar ${g}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="font-medium">Personality</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tagline</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="One sentence that captures the vibe."
                      maxLength={120}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">System prompt</label>
                    <textarea
                      rows={6}
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      placeholder="You are…"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Prepended to every chat. Be specific — voice, scope, format, do-nots.
                    </p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="font-medium">Behavior</h2>
                  <div>
                    <label className="flex items-center justify-between text-sm font-medium mb-1">
                      <span>Temperature</span>
                      <span className="font-mono">{temperature.toFixed(2)}</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={2}
                      step={0.05}
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      0 = precise · 1 = balanced · 2 = wild
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {TAG_SUGGESTIONS.map((t) => {
                        const active = tags.includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() =>
                              setTags((cur) =>
                                active ? cur.filter((x) => x !== t) : [...cur, t]
                              )
                            }
                            className={`px-2 py-1 text-xs rounded-md transition-colors ${
                              active
                                ? 'bg-blue-500 text-white'
                                : 'bg-muted hover:bg-accent text-muted-foreground'
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="pt-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={sharePublic}
                        onChange={(e) => setSharePublic(e.target.checked)}
                        className="accent-blue-500"
                      />
                      <span>Share publicly at <code className="text-xs bg-muted px-1 rounded">/b/{slugify(name || 'bot')}</code></span>
                    </label>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="font-medium">Review</h2>
                  <div className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg">
                    <BotAvatar glyph={avatar} name={name} size={56} shape="rounded" />
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {name || '(no name)'}
                        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <p className="text-sm text-muted-foreground">{tagline || '(no tagline)'}</p>
                    </div>
                  </div>
                  <pre className="p-3 bg-background border border-border rounded-lg text-xs font-mono whitespace-pre-wrap">
                    {systemPrompt || '(no system prompt)'}
                  </pre>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="bg-background border border-border rounded-lg p-2">
                      <div className="text-muted-foreground">Temperature</div>
                      <div className="font-mono">{temperature.toFixed(2)}</div>
                    </div>
                    <div className="bg-background border border-border rounded-lg p-2">
                      <div className="text-muted-foreground">Tags</div>
                      <div>{tags.length === 0 ? '—' : tags.join(', ')}</div>
                    </div>
                    <div className="bg-background border border-border rounded-lg p-2">
                      <div className="text-muted-foreground">Share</div>
                      <div>{sharePublic ? `Public /b/${slugify(name)}` : 'Private'}</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={prev}
            disabled={step === 0}
            className="px-4 py-2 text-sm rounded-lg hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Back
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={next}
              disabled={!canNext}
              className="px-5 py-2 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCreate}
              className="px-5 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white font-medium transition-opacity"
            >
              Create bot
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default function NewBotPage() {
  return (
    <BotsProvider>
      <NewBotWizard />
    </BotsProvider>
  );
}
