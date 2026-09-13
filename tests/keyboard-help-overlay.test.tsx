import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import KeyboardHelpOverlay from '@/components/KeyboardHelpOverlay';

describe('KeyboardHelpOverlay', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <KeyboardHelpOverlay open={false} onClose={() => {}} />
    );
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders shortcut groups when open', () => {
    render(<KeyboardHelpOverlay open onClose={() => {}} />);
    expect(screen.getByRole('dialog', { name: /keyboard shortcuts/i })).toBeInTheDocument();
    expect(screen.getByText(/send message/i)).toBeInTheDocument();
    expect(screen.getByText(/new line/i)).toBeInTheDocument();
    expect(screen.getByText(/new chat/i)).toBeInTheDocument();
  });

  it('calls onClose when Esc is pressed', () => {
    const onClose = vi.fn();
    render(<KeyboardHelpOverlay open onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<KeyboardHelpOverlay open onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close keyboard shortcuts/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the X button is clicked', () => {
    const onClose = vi.fn();
    render(<KeyboardHelpOverlay open onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /^Close$/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
