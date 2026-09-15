'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Smartphone, Send, Wifi } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { claimPairing } from '@/lib/remotePairing';

const DEVICE_PRESETS = ['iPhone', 'Android', 'iPad', 'Tablet', 'Laptop'];

export default function RemoteControlPage() {
  const [code, setCode] = useState('');
  const [device, setDevice] = useState(DEVICE_PRESETS[0] ?? 'Phone');
  const [step, setStep] = useState<'code' | 'connected'>('code');
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!/^\d{6}$/.test(trimmed)) {
      toast.show('error', 'Enter the 6-digit code shown on the desktop.');
      return;
    }
    const claimed = claimPairing(trimmed, device);
    if (!claimed) {
      toast.show('error', 'Code not found, expired, or already claimed.');
      return;
    }
    setStep('connected');
    toast.show('success', `Connected to desktop as ${device}.`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <header className="text-center mb-6">
          <Smartphone className="w-10 h-10 mx-auto opacity-70 mb-2" />
          <h1 className="text-2xl font-semibold">Remote control</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect to your desktop Nimbus.
          </p>
        </header>

        {step === 'code' ? (
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-xl p-6 space-y-4"
          >
            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-1">
                Pairing code
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full text-center text-3xl tracking-[0.3em] font-mono px-3 py-3
                  bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="device" className="block text-sm font-medium mb-1">
                This device
              </label>
              <select
                id="device"
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
              >
                {DEVICE_PRESETS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
            >
              <Send className="w-4 h-4" />
              Pair
            </button>
          </form>
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 text-center space-y-4">
            <Wifi className="w-10 h-10 mx-auto text-green-500" />
            <div>
              <p className="font-medium">Connected</p>
              <p className="text-sm text-muted-foreground">
                You can now send messages via the{' '}
                <Link href="/settings/api-keys" className="underline">REST API</Link>.
              </p>
            </div>
            <pre className="text-left text-xs bg-muted p-3 rounded-lg overflow-x-auto font-mono">
{`curl -X POST https://your-nimbus/api/v1/chat \\
  -H "Authorization: Bearer nmb_…" \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"hi"}]}'`}
            </pre>
            <button
              type="button"
              onClick={() => {
                setStep('code');
                setCode('');
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Pair a different code
            </button>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center mt-6">
          Need a code?{' '}
          <Link href="/remote" className="underline">Generate one on desktop</Link>.
        </p>
      </div>
    </div>
  );
}
