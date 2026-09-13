'use client';

import { useState, useEffect } from 'react';
import { X, Save, Globe, Cpu, Key, Trash2, ExternalLink } from 'lucide-react';
import {
  type CustomProviderConfig,
  loadCustomProvider,
  saveCustomProvider,
  clearCustomProvider,
} from '@/lib/customProvider';

interface CustomProviderDialogProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Called when the user closes the dialog (cancel, X, or Esc). */
  onClose: () => void;
  /** Called after the config is saved. Receives the new config. */
  onSaved?: (cfg: CustomProviderConfig) => void;
  /** Called after the config is cleared. */
  onCleared?: () => void;
}

const DEFAULTS: CustomProviderConfig = {
  baseURL: 'https://api.example.com/v1',
  model: 'my-model',
  apiKey: '',
};

/**
 * Modal dialog for configuring a custom OpenAI-compatible endpoint.
 * Stores the config in localStorage so subsequent requests can use it.
 */
export function CustomProviderDialog({
  open,
  onClose,
  onSaved,
  onCleared,
}: CustomProviderDialogProps) {
  const [baseURL, setBaseURL] = useState(DEFAULTS.baseURL);
  const [model, setModel] = useState(DEFAULTS.model);
  const [apiKey, setApiKey] = useState(DEFAULTS.apiKey);
  const [error, setError] = useState<string | null>(null);

  // Hydrate from localStorage whenever the dialog opens.
  useEffect(() => {
    if (!open) return;
    const existing = loadCustomProvider();
    if (existing) {
      setBaseURL(existing.baseURL);
      setModel(existing.model);
      setApiKey(existing.apiKey ?? '');
    } else {
      setBaseURL(DEFAULTS.baseURL);
      setModel(DEFAULTS.model);
      setApiKey(DEFAULTS.apiKey);
    }
    setError(null);
  }, [open]);

  // Esc key closes the dialog.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedURL = baseURL.trim();
    const trimmedModel = model.trim();
    if (!trimmedURL) {
      setError('Base URL is required');
      return;
    }
    if (!trimmedModel) {
      setError('Model name is required');
      return;
    }
    try {
      const u = new URL(trimmedURL);
      if (!u.protocol.startsWith('http')) {
        setError('Base URL must use http or https');
        return;
      }
    } catch {
      setError('Base URL is not a valid URL');
      return;
    }
    const cfg: CustomProviderConfig = {
      baseURL: trimmedURL.replace(/\/+$/, ''),
      model: trimmedModel,
      apiKey: apiKey.trim() || undefined,
    };
    saveCustomProvider(cfg);
    onSaved?.(cfg);
    onClose();
  };

  const handleClear = () => {
    clearCustomProvider();
    setBaseURL(DEFAULTS.baseURL);
    setModel(DEFAULTS.model);
    setApiKey(DEFAULTS.apiKey);
    onCleared?.();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-provider-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative w-full max-w-md bg-popover border border-border rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2
              id="custom-provider-dialog-title"
              className="text-lg font-semibold flex items-center gap-2"
            >
              <Globe className="w-5 h-5 opacity-70" />
              Custom Provider
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Any OpenAI-compatible chat completions endpoint.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div>
            <label
              htmlFor="cp-base-url"
              className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 opacity-60" />
              Base URL
              <span className="text-red-500">*</span>
            </label>
            <input
              id="cp-base-url"
              type="url"
              value={baseURL}
              onChange={(e) => setBaseURL(e.target.value)}
              placeholder="https://api.example.com/v1"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg
                text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              required
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              We append <code className="bg-muted px-1 rounded">/chat/completions</code> automatically.
            </p>
          </div>

          <div>
            <label
              htmlFor="cp-model"
              className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 opacity-60" />
              Model
              <span className="text-red-500">*</span>
            </label>
            <input
              id="cp-model"
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="my-model-name"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg
                text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              required
            />
          </div>

          <div>
            <label
              htmlFor="cp-api-key"
              className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5 opacity-60" />
              API Key
              <span className="text-xs text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              id="cp-api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              autoComplete="off"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg
                text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Sent as <code className="bg-muted px-1 rounded">Authorization: Bearer …</code>
            </p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg
                text-muted-foreground hover:bg-accent transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset
            </button>
            <div className="flex items-center gap-2">
              <a
                href="https://platform.openai.com/docs/api-reference/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg
                  text-muted-foreground hover:bg-accent transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                API spec
              </a>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-lg
                  hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg
                  bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomProviderDialog;
