'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, RefreshCw, Smartphone, Trash2, Wifi } from 'lucide-react';
import { useToast } from '@/components/Toast';
import {
  type Pairing,
  loadPairings,
  savePairings,
  mintPairing,
  revokePairing,
  formatCountdown,
} from '@/lib/remotePairing';

export default function RemotePage() {
  const [pairings, setPairings] = useState<Pairing[]>([]);
  const [tick, setTick] = useState(0);
  const toast = useToast();

  useEffect(() => {
    setPairings(loadPairings());
  }, []);

  // Tick once a second so the countdown updates.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const refresh = () => setPairings(loadPairings());

  const handleMint = () => {
    const p = mintPairing();
    setPairings(loadPairings());
    toast.show('success', `Pairing code ${p.code} generated`);
  };

  const handleRevoke = (code: string) => {
    revokePairing(code);
    setPairings(loadPairings());
    toast.show('info', 'Pairing revoked');
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.show('success', 'Copied');
    } catch {
      toast.show('error', 'Copy failed');
    }
  };

  const livePairings = pairings.filter((p) => p.expiresAt > Date.now() && !p.claimedAt);
  const recent = pairings
    .filter((p) => p.claimedAt !== null)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-3xl mx-auto px-4 py-10">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold flex items-center gap-2">
            <Smartphone className="w-7 h-7 opacity-70" />
            Remote control
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pair your phone to send messages and check chat history from the
            other side of the room. Codes expire in 5 minutes.
          </p>
        </header>

        <button
          type="button"
          onClick={handleMint}
          className="flex items-center gap-2 px-5 py-3 text-base rounded-xl
            bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white font-medium transition-opacity"
        >
          <RefreshCw className="w-5 h-5" />
          Generate pairing code
        </button>

        <section className="mt-8">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
            Live pairings
          </h2>
          <AnimatePresence mode="popLayout">
            {livePairings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No active codes. Click the button above to mint one.
              </p>
            ) : (
              <ul className="space-y-3">
                {livePairings.map((p) => (
                  <motion.li
                    key={p.code}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="bg-card border border-border rounded-xl p-5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <code className="text-3xl font-mono tracking-[0.3em] font-bold text-blue-500">
                        {p.code}
                      </code>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                        <Wifi className="w-3 h-3 text-green-500 animate-pulse" />
                        Expires in {formatCountdown(p.expiresAt)} · {tick}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(p.code)}
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                        aria-label="Copy code"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRevoke(p.code)}
                        className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                        aria-label="Revoke code"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </AnimatePresence>
        </section>

        {recent.length > 0 && (
          <section className="mt-8">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
              Recent claims
            </h2>
            <ul className="space-y-2 text-sm">
              {recent.map((p) => (
                <li
                  key={p.code}
                  className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-2"
                >
                  <span>
                    <code className="font-mono">{p.code}</code>
                    {' · '}
                    {p.deviceName ?? 'unknown device'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {p.claimedAt
                      ? new Date(p.claimedAt).toLocaleString()
                      : ''}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10 p-4 bg-card border border-border rounded-xl text-sm">
          <p className="font-medium mb-2">How it works</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Generate a pairing code on this screen.</li>
            <li>On your phone, open <Link href="/remote/control" className="underline">/remote/control</Link> and enter the 6-digit code.</li>
            <li>Use the same API key you created in <Link href="/settings/api-keys" className="underline">API keys</Link> to authenticate chat requests.</li>
            <li>Codes expire automatically after 5 minutes; revoke manually with the trash button.</li>
          </ol>
        </section>
      </main>
    </div>
  );
}
