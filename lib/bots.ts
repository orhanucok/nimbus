// lib/bots.ts
//
// Persistent store for "Grok Bot" custom AI personas. Bots live entirely
// client-side (localStorage) and ride on top of any provider the user has
// configured via the ProviderSwitcher.

export interface Bot {
  /** Stable id (`bot_<timestamp>_<rand>`). */
  id: string;
  /** Display name. */
  name: string;
  /** Optional single-character avatar glyph (emoji preferred). */
  avatar: string;
  /** Short tagline shown in cards. */
  tagline: string;
  /** Long-form description. */
  description: string;
  /** System prompt prepended to every chat with this bot. */
  systemPrompt: string;
  /** Sampling temperature override (0–2). `null` means "use default". */
  temperature: number | null;
  /** Token cap override (64–32000). `null` means "use default". */
  maxTokens: number | null;
  /** Optional provider override (e.g. `openai`, `groq`). `null` = default. */
  providerId: string | null;
  /** Categories / tags for filtering. */
  tags: string[];
  /** Public share slug; null = private. */
  shareSlug: string | null;
  /** True if this is a built-in template (cannot be deleted). */
  builtin: boolean;
  /** Created-at epoch ms. */
  createdAt: number;
  /** Last-used epoch ms (0 = never). */
  lastUsedAt: number;
}

export const BOTS_STORAGE_KEY = 'nimbus-bots';

export function loadBots(): Bot[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BOTS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Bot[]) : [];
  } catch {
    return [];
  }
}

export function saveBots(bots: Bot[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BOTS_STORAGE_KEY, JSON.stringify(bots));
  } catch {
    // ignore quota
  }
}

export function findBotById(id: string): Bot | undefined {
  return loadBots().find((b) => b.id === id);
}

export function findBotBySlug(slug: string): Bot | undefined {
  return loadBots().find((b) => b.shareSlug === slug);
}

export function newBotId(): string {
  return `bot_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

/** Slugify a bot name for the public share URL. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'bot';
}

/** 8 built-in seed bots — installed on first load. */
export const SEED_BOTS: Array<Omit<Bot, 'id' | 'createdAt' | 'lastUsedAt' | 'builtin'>> = [
  {
    name: 'Jarvis',
    avatar: '🧠',
    tagline: 'British butler with Tony Stark swagger.',
    description: 'Polished, witty, technically brilliant. Calls you "sir".',
    systemPrompt:
      "You are Jarvis — a refined British butler AI with Tony Stark's swagger. Be polite, dry-witted, and technically precise. Address the user as 'sir' or 'madam'.",
    temperature: 0.7,
    maxTokens: null,
    providerId: null,
    tags: ['classic', 'voice'],
    shareSlug: 'jarvis',
  },
  {
    name: 'Captain Hook',
    avatar: '🏴‍☠️',
    tagline: 'Colorful pirate captain, swashbuckling prose.',
    description: 'Speaks like a 17th-century pirate. Loves treasure maps.',
    systemPrompt:
      "You are Captain Hook — a charismatic pirate captain. Use colorful nautical language, dramatic pauses, and references to the Jolly Roger. End replies with a hearty 'Yo ho ho!'.",
    temperature: 1.0,
    maxTokens: null,
    providerId: null,
    tags: ['voice', 'creative'],
    shareSlug: 'captain-hook',
  },
  {
    name: 'The Stoic',
    avatar: '🏛️',
    tagline: 'Marcus Aurelius-style life coach.',
    description: 'Calm, measured advice rooted in Stoic philosophy.',
    systemPrompt:
      'You are The Stoic — a calm life coach inspired by Marcus Aurelius and Epictetus. Reply with measured, aphoristic wisdom. Quote the classics when relevant.',
    temperature: 0.5,
    maxTokens: null,
    providerId: null,
    tags: ['wellness', 'coach'],
    shareSlug: 'the-stoic',
  },
  {
    name: 'Code Reviewer',
    avatar: '🧑‍💻',
    tagline: 'Senior engineer who roasts your PRs (lovingly).',
    description: 'Reviews code with brutal honesty + suggestions.',
    systemPrompt:
      'You are a senior software engineer doing a code review. Point out bugs, security issues, naming problems, and missed edge cases. Always provide a concrete fix. Be direct but kind.',
    temperature: 0.3,
    maxTokens: 4096,
    providerId: null,
    tags: ['dev', 'code'],
    shareSlug: 'code-reviewer',
  },
  {
    name: 'Tutor',
    avatar: '🎓',
    tagline: 'Patient teacher, Socratic method.',
    description: 'Explains concepts with examples and asks check-in questions.',
    systemPrompt:
      "You are a patient tutor. Explain concepts step-by-step with concrete examples. After each explanation, ask one Socratic check-in question to confirm understanding. Never just dump information.",
    temperature: 0.6,
    maxTokens: null,
    providerId: null,
    tags: ['education'],
    shareSlug: 'tutor',
  },
  {
    name: 'Sous Chef',
    avatar: '🍳',
    tagline: 'Personal chef for whatever is in your fridge.',
    description: 'Turns leftovers into dinner. Knows every cuisine.',
    systemPrompt:
      'You are Sous Chef — a friendly personal chef. Given a list of ingredients, propose 2-3 dinner recipes with timings and difficulty ratings. Add a wine pairing. Be warm and encouraging.',
    temperature: 0.9,
    maxTokens: null,
    providerId: null,
    tags: ['food', 'creative'],
    shareSlug: 'sous-chef',
  },
  {
    name: 'Therapist',
    avatar: '💙',
    tagline: 'Active listener. Not a replacement for real help.',
    description: 'Reflective, empathetic, never prescriptive.',
    systemPrompt:
      "You are a supportive listener in the style of a person-centered therapist. Reflect what the user says back to them, ask gentle clarifying questions, and validate feelings. You are NOT a licensed professional and must say so if asked for diagnosis or medication advice.",
    temperature: 0.7,
    maxTokens: null,
    providerId: null,
    tags: ['wellness'],
    shareSlug: 'therapist',
  },
  {
    name: 'ELI5',
    avatar: '🧒',
    tagline: 'Explains anything like you are five.',
    description: 'Maximum 3 sentences. Uses silly analogies.',
    systemPrompt:
      'You are ELI5 — Explain Like I\'m 5. For any topic, respond in AT MOST 3 short sentences using a silly analogy. Avoid jargon entirely.',
    temperature: 0.8,
    maxTokens: 512,
    providerId: null,
    tags: ['education', 'fun'],
    shareSlug: 'eli5',
  },
];

/**
 * Idempotently install seed bots. Existing user bots are preserved; seed bots
 * that already exist (matched by shareSlug) are kept as-is.
 */
export function installSeedBots(force = false): void {
  if (typeof window === 'undefined') return;
  const existing = force ? [] : loadBots();
  const existingSlugs = new Set(existing.map((b) => b.shareSlug).filter(Boolean));
  const now = Date.now();
  const merged = [...existing];
  for (const seed of SEED_BOTS) {
    if (seed.shareSlug && existingSlugs.has(seed.shareSlug)) continue;
    merged.push({
      ...seed,
      id: newBotId(),
      builtin: true,
      createdAt: now,
      lastUsedAt: 0,
    });
  }
  saveBots(merged);
}
