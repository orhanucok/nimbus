'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  type Bot,
  loadBots,
  saveBots,
  installSeedBots,
  newBotId,
} from '@/lib/bots';

interface BotsContextValue {
  bots: Bot[];
  upsert: (input: Omit<Bot, 'id' | 'createdAt' | 'lastUsedAt' | 'builtin'> & { id?: string }) => Bot;
  remove: (id: string) => void;
  markUsed: (id: string) => void;
  findById: (id: string) => Bot | undefined;
  findBySlug: (slug: string) => Bot | undefined;
}

const BotsContext = createContext<BotsContextValue | null>(null);

export function useBots(): BotsContextValue {
  const ctx = useContext(BotsContext);
  if (!ctx) throw new Error('useBots must be used inside <BotsProvider>');
  return ctx;
}

export function BotsProvider({ children }: { children: React.ReactNode }) {
  const [bots, setBots] = useState<Bot[]>([]);

  // Hydrate from localStorage + install seed bots once.
  useEffect(() => {
    installSeedBots();
    setBots(loadBots());
  }, []);

  const persist = useCallback((next: Bot[]) => {
    setBots(next);
    saveBots(next);
  }, []);

  const upsert = useCallback(
    (input: Omit<Bot, 'id' | 'createdAt' | 'lastUsedAt' | 'builtin'> & { id?: string }): Bot => {
      const now = Date.now();
      const existing = input.id ? bots.find((b) => b.id === input.id) : undefined;
      const next: Bot = existing
        ? { ...existing, ...input, builtin: existing.builtin }
        : {
            ...input,
            id: newBotId(),
            builtin: false,
            createdAt: now,
            lastUsedAt: 0,
          };
      const merged = existing
        ? bots.map((b) => (b.id === next.id ? next : b))
        : [next, ...bots];
      persist(merged);
      return next;
    },
    [bots, persist]
  );

  const remove = useCallback(
    (id: string) => {
      const target = bots.find((b) => b.id === id);
      if (target?.builtin) return; // refuse to delete seed bots
      persist(bots.filter((b) => b.id !== id));
    },
    [bots, persist]
  );

  const markUsed = useCallback(
    (id: string) => {
      const merged = bots.map((b) => (b.id === id ? { ...b, lastUsedAt: Date.now() } : b));
      persist(merged);
    },
    [bots, persist]
  );

  const findById = useCallback((id: string) => bots.find((b) => b.id === id), [bots]);
  const findBySlug = useCallback(
    (slug: string) => bots.find((b) => b.shareSlug === slug),
    [bots]
  );

  const value = useMemo(
    () => ({ bots, upsert, remove, markUsed, findById, findBySlug }),
    [bots, upsert, remove, markUsed, findById, findBySlug]
  );

  return <BotsContext.Provider value={value}>{children}</BotsContext.Provider>;
}

export default BotsProvider;
