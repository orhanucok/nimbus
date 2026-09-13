import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToast } from '@/components/Toast';

function Probe() {
  const toast = useToast();
  return (
    <div>
      <button onClick={() => toast.show('success', 'Saved!')}>success</button>
      <button onClick={() => toast.show('error', 'Boom')}>error</button>
      <button onClick={() => toast.show('info', 'FYI', 0)}>info</button>
    </div>
  );
}

describe('ToastProvider + useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('throws if useToast is called outside a provider', () => {
    // Suppress console.error for the React error boundary noise
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });

  it('renders a success toast when show is called', () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('success'));
    expect(screen.getByRole('status')).toHaveTextContent('Saved!');
  });

  it('renders an error toast with role="alert"', () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('error'));
    expect(screen.getByRole('alert')).toHaveTextContent('Boom');
  });

  it('does not auto-dismiss when duration is 0', () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('info'));
    expect(screen.getByRole('status')).toHaveTextContent('FYI');
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(screen.getByRole('status')).toHaveTextContent('FYI');
  });

  it('auto-dismisses after the duration', () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('success'));
    expect(screen.getByRole('status')).toHaveTextContent('Saved!');
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('lets the user dismiss a toast manually', () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('success'));
    const closeBtn = screen.getByRole('button', { name: /dismiss/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('status')).toBeNull();
  });
});
