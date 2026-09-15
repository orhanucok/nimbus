'use client';

import { useServiceWorker } from '@/hooks/useServiceWorker';

/**
 * Tiny invisible client component that registers the PWA service worker.
 * Mounted once at the layout level.
 */
export function SWRegister() {
  useServiceWorker();
  return null;
}

export default SWRegister;
