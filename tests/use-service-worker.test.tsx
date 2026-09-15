import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

function Harness() {
  useServiceWorker();
  return null;
}

describe('useServiceWorker', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      serviceWorker: {
        register: vi.fn().mockResolvedValue({ scope: '/' }),
      },
    });
  });

  it('registers the SW with scope /', async () => {
    // jsdom starts with readyState='complete' by default.
    render(<Harness />);
    await waitFor(() => {
      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js', {
        scope: '/',
      });
    });
  });

  it('does not throw when navigator.serviceWorker is unavailable', () => {
    const original = (navigator as { serviceWorker?: unknown }).serviceWorker;
    // @ts-expect-error - simulate unsupported environment
    delete navigator.serviceWorker;
    expect(() => render(<Harness />)).not.toThrow();
    Object.assign(navigator, { serviceWorker: original });
  });
});
