'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Eye, EyeOff, Key, Plus, Trash2, Check, Shield } from 'lucide-react';
import {
  type ApiKey,
  generateApiKey,
  loadApiKeys,
  saveApiKeys,
} from '@/lib/apiAuth';
import { useToast } from './Toast';

function formatDate(ms: number): string {
  if (!ms) return 'Never';
  return new Date(ms).toLocaleString();
}

export function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newName, setNewName] = useState('');
  const [justMinted, setJustMinted] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const toast = useToast();

  // Hydrate from localStorage on mount.
  useEffect(() => {
    setKeys(loadApiKeys());
  }, []);

  const persist = (next: ApiKey[]) => {
    setKeys(next);
    saveApiKeys(next);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const name = (newName || 'Untitled key').slice(0, 64);
    const { key, record } = generateApiKey(name);
    persist([record, ...keys]);
    setJustMinted(key);
    setRevealed(true);
    setNewName('');
    toast.show('success', 'API key created — copy it now, it won\'t be shown again');
  };

  const handleRevoke = (id: string) => {
    const next = keys.map((k) => (k.id === id ? { ...k, revoked: true } : k));
    persist(next);
    toast.show('info', 'Key revoked');
  };

  const handleDelete = (id: string) => {
    persist(keys.filter((k) => k.id !== id));
    toast.show('info', 'Key removed');
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.show('success', 'Copied to clipboard');
    } catch {
      toast.show('error', 'Copy failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Mint new key */}
      <form
        onSubmit={handleCreate}
        className="flex items-center gap-2 bg-card border border-border rounded-lg p-3"
      >
        <Key className="w-4 h-4 opacity-60 shrink-0" />
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Key name (e.g. Mobile app)"
          maxLength={64}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg
            bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Create
        </button>
      </form>

      {/* Newly minted plaintext — show once */}
      <AnimatePresence>
        {justMinted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border border-green-500/40 bg-green-500/10 rounded-lg p-4 space-y-2"
          >
            <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              Copy this key now — you won't see it again.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-background border border-border rounded-lg font-mono text-xs break-all">
                {revealed ? justMinted : '••••••••••••••••••••••••••••••••••••••••••••••••••••'}
              </code>
              <button
                type="button"
                onClick={() => setRevealed((v) => !v)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label={revealed ? 'Hide key' : 'Show key'}
                title={revealed ? 'Hide' : 'Show'}
              >
                {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => handleCopy(justMinted)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Copy key"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setJustMinted(null)}
                className="px-3 py-2 text-xs rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key list */}
      <div>
        <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
          Your keys
          <span className="text-xs text-muted-foreground">({keys.length})</span>
        </h3>
        {keys.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg p-6 text-center text-sm text-muted-foreground">
            No API keys yet. Create one above to use the Nimbus API from your own scripts or apps.
          </div>
        ) : (
          <ul className="space-y-2">
            {keys.map((k) => (
              <li
                key={k.id}
                className={`flex items-center gap-3 px-3 py-2.5 bg-card border border-border rounded-lg
                  ${k.revoked ? 'opacity-60' : ''}`}
              >
                <Key className="w-4 h-4 opacity-50 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{k.name}</span>
                    {k.revoked && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-red-500/20 text-red-600 dark:text-red-400 font-medium">
                        REVOKED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <span>{k.id}</span>
                    <span>···</span>
                    <span>{k.last4}</span>
                    <span className="opacity-60">·</span>
                    <span>last used {formatDate(k.lastUsedAt)}</span>
                  </div>
                </div>
                {!k.revoked && (
                  <button
                    type="button"
                    onClick={() => handleRevoke(k.id)}
                    className="px-2 py-1 text-xs rounded-md hover:bg-red-500/10 text-red-500 transition-colors"
                    title="Revoke"
                  >
                    Revoke
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(k.id)}
                  className="p-1.5 rounded-md hover:bg-destructive/20 text-destructive transition-colors"
                  aria-label={`Delete ${k.name}`}
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Usage hint */}
      <div className="rounded-lg bg-muted/40 border border-border p-3 text-xs">
        <p className="font-medium mb-1">Quick start</p>
        <pre className="font-mono text-[11px] overflow-x-auto whitespace-pre">{`curl -X POST https://your-nimbus.example/api/v1/chat \\
  -H "Authorization: Bearer ${justMinted ?? 'nmb_…_<secret>'}" \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"Hello!"}]}'`}</pre>
      </div>
    </div>
  );
}

export default ApiKeyManager;
