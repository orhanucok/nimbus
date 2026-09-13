'use client';

import { useState } from 'react';
import { Settings, X } from 'lucide-react';

export interface SettingsState {
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export const DEFAULT_SETTINGS: SettingsState = {
  temperature: 0.7,
  maxTokens: 2048,
  systemPrompt: '',
};

interface SettingsPanelProps {
  value: SettingsState;
  onChange: (next: SettingsState) => void;
  className?: string;
}

const SYSTEM_PRESETS: Array<{ id: string; label: string; prompt: string }> = [
  { id: 'default', label: 'Default', prompt: '' },
  { id: 'concise', label: 'Concise', prompt: 'Be concise. Short sentences, no fluff.' },
  {
    id: 'detailed',
    label: 'Detailed',
    prompt: 'Be thorough. Explain your reasoning step-by-step.',
  },
  {
    id: 'creative',
    label: 'Creative',
    prompt: 'Be creative. Use vivid language and unexpected metaphors.',
  },
  {
    id: 'technical',
    label: 'Technical',
    prompt: 'Be precise. Use technical vocabulary. Cite sources when possible.',
  },
];

/**
 * SettingsPanel — a popover with model-generation knobs:
 * - temperature (0–2 slider)
 * - max tokens (64–32000)
 * - system prompt (free-text with quick-presets)
 *
 * Controlled component. Parent owns state + persistence (later:
 * localStorage). Reset button restores DEFAULT_SETTINGS.
 */
export function SettingsPanel({
  value,
  onChange,
  className,
}: SettingsPanelProps) {
  const [open, setOpen] = useState(false);

  const set = <K extends keyof SettingsState>(
    key: K,
    v: SettingsState[K]
  ): void => onChange({ ...value, [key]: v });

  return (
    <div className={`relative ${className ?? ''}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="p-1.5 hover:bg-accent rounded-md transition-colors"
        aria-label="Ayarlar"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Settings className="w-4 h-4 opacity-70 hover:opacity-100 transition-opacity" />
      </button>

      {open && (
        <>
          {/* Click-outside closer */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-label="Sohbet ayarları"
            className="absolute right-0 mt-2 w-80 bg-popover border border-border
              rounded-lg shadow-xl z-50 p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Ayarlar</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Kapat"
                className="p-1 hover:bg-accent rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <label className="text-xs flex items-center justify-between mb-1">
                <span>Temperature</span>
                <span className="font-mono">{value.temperature.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min={0}
                max={2}
                step={0.05}
                value={value.temperature}
                onChange={(e) => set('temperature', Number(e.target.value))}
                className="w-full accent-blue-500"
                aria-label="Temperature"
              />
            </div>

            <div>
              <label className="text-xs flex items-center justify-between mb-1">
                <span>Max tokens</span>
                <span className="font-mono">{value.maxTokens}</span>
              </label>
              <input
                type="number"
                min={64}
                max={32000}
                step={64}
                value={value.maxTokens}
                onChange={(e) => set('maxTokens', Number(e.target.value))}
                className="w-full mt-1 px-2 py-1 text-sm bg-background border border-border rounded"
                aria-label="Max tokens"
              />
            </div>

            <div>
              <label className="text-xs block mb-1">System prompt</label>
              <div className="flex flex-wrap gap-1 mb-2">
                {SYSTEM_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => set('systemPrompt', p.prompt)}
                    className="text-xs px-2 py-0.5 bg-accent/40 hover:bg-accent rounded transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                value={value.systemPrompt}
                onChange={(e) => set('systemPrompt', e.target.value)}
                placeholder="Varsayılan sistem prompt'unu geçersiz kıl…"
                className="w-full px-2 py-1 text-xs bg-background border border-border rounded resize-none"
                aria-label="System prompt"
              />
            </div>

            <button
              type="button"
              onClick={() => onChange(DEFAULT_SETTINGS)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Varsayılanlara sıfırla
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default SettingsPanel;
