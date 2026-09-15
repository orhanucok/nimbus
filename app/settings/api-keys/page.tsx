'use client';

import { ApiKeyManager } from '@/components/ApiKeyManager';

export default function ApiKeysPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">API keys</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Programmatically control Nimbus from your own scripts, mobile apps, or CI.
            Authenticate each request with <code className="bg-muted px-1 py-0.5 rounded text-xs">Authorization: Bearer nmb_…</code>.
          </p>
        </header>

        <ApiKeyManager />
      </main>
    </div>
  );
}
