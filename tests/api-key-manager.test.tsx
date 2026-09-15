import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ApiKeyManager } from '@/components/ApiKeyManager';
import { ToastProvider } from '@/components/Toast';

// Mock clipboard so we don't need a real Clipboard API in jsdom.
beforeEach(() => {
  localStorage.clear();
  Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
});

function renderWithToast(ui: React.ReactNode) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

describe('ApiKeyManager', () => {
  it('shows the empty state when there are no keys', () => {
    renderWithToast(<ApiKeyManager />);
    expect(screen.getByText(/No API keys yet/i)).toBeInTheDocument();
  });

  it('creates a key when Create is clicked', async () => {
    renderWithToast(<ApiKeyManager />);
    fireEvent.change(screen.getByPlaceholderText(/key name/i), {
      target: { value: 'mobile-app' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    await waitFor(() => {
      expect(screen.getByText(/mobile-app/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Copy this key now/i)).toBeInTheDocument();
  });

  it('persists created keys to localStorage', async () => {
    renderWithToast(<ApiKeyManager />);
    fireEvent.change(screen.getByPlaceholderText(/key name/i), {
      target: { value: 'ci-bot' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('nimbus-api-keys') ?? '[]');
      expect(stored.length).toBe(1);
      expect(stored[0].name).toBe('ci-bot');
    });
  });

  it('copies a key to clipboard when Copy is clicked', async () => {
    renderWithToast(<ApiKeyManager />);
    fireEvent.change(screen.getByPlaceholderText(/key name/i), {
      target: { value: 'clip-test' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    await waitFor(() => screen.getByText(/Copy this key now/i));
    const copyBtn = screen.getByRole('button', { name: /^Copy key$/i });
    fireEvent.click(copyBtn);
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });

  it('removes a key when Delete is clicked', async () => {
    renderWithToast(<ApiKeyManager />);
    fireEvent.change(screen.getByPlaceholderText(/key name/i), {
      target: { value: 'doomed' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    await waitFor(() => screen.getByText(/doomed/i));
    fireEvent.click(screen.getByRole('button', { name: /Delete doomed/i }));
    await waitFor(() => {
      expect(screen.queryByText('doomed')).toBeNull();
    });
  });
});
