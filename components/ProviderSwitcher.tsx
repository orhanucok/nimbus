'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Server } from 'lucide-react';

export interface ProviderInfo {
  id: string;
  name: string;
  model: string;
  description: string;
}

export const PROVIDERS: ProviderInfo[] = [
  {
    id: 'deepseek',
    name: 'DeepSeek',
    model: 'deepseek-chat',
    description: 'Cheap, fast, OpenAI-compatible (recommended)',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    model: 'gpt-4o-mini',
    description: 'Standard GPT-4o mini via OpenAI',
  },
  {
    id: 'groq',
    name: 'Groq',
    model: 'llama-3.3-70b-versatile',
    description: 'Ultra-fast inference, free tier available',
  },
  {
    id: 'xai',
    name: 'xAI Grok',
    model: 'grok-beta',
    description: 'The original Grok from xAI',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    model: 'meta-llama/llama-3.3-70b-instruct',
    description: 'Many models, one API key',
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    model: 'llama3.2',
    description: 'Run on your own machine, fully private',
  },
];

const STORAGE_KEY = 'Nimbus-provider';

interface ProviderSwitcherProps {
  /** Currently active provider id (controlled). Falls back to localStorage. */
  value?: string;
  /** Called when user picks a different provider. */
  onChange?: (id: string) => void;
  /** Visual variant â€” 'header' for compact header use, 'block' for settings. */
  variant?: 'header' | 'block';
}

export function ProviderSwitcher({
  value,
  onChange,
  variant = 'header',
}: ProviderSwitcherProps) {
  const [internal, setInternal] = useState<string>('deepseek');
  const [open, setOpen] = useState(false);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && PROVIDERS.some((p) => p.id === saved)) {
      setInternal(saved);
    }
  }, []);

  const active = value ?? internal;

  const handleSelect = (id: string) => {
    if (!value) setInternal(id);
    localStorage.setItem(STORAGE_KEY, id);
    onChange?.(id);
    setOpen(false);
  };

  const current = PROVIDERS.find((p) => p.id === active) ?? PROVIDERS[0];

  if (variant === 'block') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleSelect(p.id)}
            className={`text-left p-4 rounded-lg border transition-colors ${
              p.id === active
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-border hover:border-border/60 hover:bg-accent/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">{p.name}</span>
              {p.id === active && (
                <span className="text-xs text-blue-500 font-semibold">âœ“ Active</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-2">{p.description}</p>
            <code className="text-[10px] text-muted-foreground/70 font-mono">
              {p.model}
            </code>
          </button>
        ))}
      </div>
    );
  }

  // Compact header dropdown.
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg
          hover:bg-accent border border-border/40 transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Switch LLM provider"
      >
        <Server className="w-4 h-4 opacity-70" />
        <span className="font-medium">{current.name}</span>
        <ChevronDown
          className={`w-3 h-3 opacity-60 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="menu"
            className="absolute right-0 mt-2 w-72 bg-popover border border-border
              rounded-lg shadow-xl z-50 py-1 overflow-hidden"
          >
            <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border bg-muted/30">
              <strong className="text-foreground">Backend switch:</strong> set{' '}
              <code className="text-[11px] bg-background px-1 py-0.5 rounded">
                LLM_PROVIDER
              </code>{' '}
              in{' '}
              <code className="text-[11px] bg-background px-1 py-0.5 rounded">
                .env.local
              </code>{' '}
              and restart the dev server.
            </div>
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                type="button"
                role="menuitemradio"
                aria-checked={p.id === active}
                onClick={() => handleSelect(p.id)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors ${
                  p.id === active ? 'bg-accent/50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{p.name}</span>
                  {p.id === active && (
                    <span className="text-xs text-blue-500">âœ“</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {p.description}
                </div>
                <code className="text-[10px] text-muted-foreground/70 font-mono">
                  {p.model}
                </code>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProviderSwitcher;
