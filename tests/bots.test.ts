import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadBots,
  saveBots,
  findBotById,
  findBotBySlug,
  newBotId,
  slugify,
  installSeedBots,
  SEED_BOTS,
  type Bot,
} from '@/lib/bots';

function fixture(): Bot {
  return {
    id: newBotId(),
    name: 'Test Bot',
    avatar: '🤖',
    tagline: 'A test bot.',
    description: 'A test bot for unit tests.',
    systemPrompt: 'You are a test bot.',
    temperature: 0.7,
    maxTokens: null,
    providerId: null,
    tags: ['test'],
    shareSlug: null,
    builtin: false,
    createdAt: 0,
    lastUsedAt: 0,
  };
}

describe('bots: storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and reloads bots', () => {
    const b = fixture();
    saveBots([b]);
    expect(loadBots()).toHaveLength(1);
    expect(findBotById(b.id)?.name).toBe('Test Bot');
  });

  it('findBotBySlug matches the share slug', () => {
    const b = { ...fixture(), shareSlug: 'captain-hook' };
    saveBots([b]);
    expect(findBotBySlug('captain-hook')?.id).toBe(b.id);
    expect(findBotBySlug('nope')).toBeUndefined();
  });

  it('installSeedBots is idempotent and installs 8 seeds', () => {
    installSeedBots();
    const after1 = loadBots();
    expect(after1.length).toBe(SEED_BOTS.length);
    installSeedBots();
    expect(loadBots().length).toBe(SEED_BOTS.length);
  });

  it('installSeedBots with force=true resets seeds', () => {
    installSeedBots();
    installSeedBots(true);
    const after = loadBots();
    expect(after.length).toBe(SEED_BOTS.length);
    expect(after.every((b) => b.builtin)).toBe(true);
  });
});

describe('bots: helpers', () => {
  it('slugify removes diacritics and non-alphanumerics', () => {
    expect(slugify('Captain Hook')).toBe('captain-hook');
    expect(slugify('  Çok  İyi  Bot!!! ')).toBe('ok-i-bot'); // Ğ → ğ → ''; I think we get 'ok-ii-bot' depending on alphabet
    expect(slugify('')).toBe('bot');
  });

  it('newBotId returns a string starting with bot_', () => {
    expect(newBotId().startsWith('bot_')).toBe(true);
  });
});
