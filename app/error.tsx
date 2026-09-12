'use client';

import { useEffect } from 'react';
import FisnaLogo from '@/components/FisnaLogo';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to console — in production wire to a logger.
    console.error('[Fisna] Route error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <FisnaLogo className="w-14 h-14" />
        </div>

        <h1 className="text-3xl font-semibold mb-2">
          Bir şeyler ters gitti
        </h1>
        <p className="text-muted-foreground mb-6">
          Beklenmeyen bir hata oluştu. İnternet bağlantınızı ve API
          anahtarınızı kontrol edip tekrar deneyin.
        </p>

        {error.digest && (
          <p className="text-xs text-muted-foreground/60 font-mono mb-6">
            Hata kodu: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600
              hover:opacity-90 text-white rounded-lg font-medium transition-opacity"
          >
            Tekrar dene
          </button>
          <a
            href="/"
            className="px-4 py-2 border border-border hover:bg-accent
              rounded-lg font-medium transition-colors"
          >
            Ana sayfaya dön
          </a>
        </div>

        <p className="text-xs text-muted-foreground/60 mt-8">
          Fisna · MIT licensed · 100% unaffiliated with xAI
        </p>
      </div>
    </div>
  );
}
