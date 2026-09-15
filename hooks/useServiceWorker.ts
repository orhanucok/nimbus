'use client';

import { useEffect } from 'react';

const SW_URL = '/sw.js';

/**
 * Register the PWA service worker once on the client. Idempotent — calling
 * this hook from multiple components is fine; only one registration is
 * created.
 *
 * We avoid registering in dev (NODE_ENV !== 'production') to keep HMR
 * predictable.
 */
export function useServiceWorker(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;

    // Defer registration until the window has fully loaded so the SW
    // installation doesn't compete with first-paint network requests.
    const onLoad = () => {
      navigator.serviceWorker
        .register(SW_URL, { scope: '/' })
        .catch((err) => {
          // Log only — the app must keep working without the SW.
          console.warn('[Nimbus] service worker registration failed:', err);
        });
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad, { once: true });
    }
  }, []);
}

export default useServiceWorker;
