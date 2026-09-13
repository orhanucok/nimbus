import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

function ShortcutHarness({
  onNewChat,
  onClear,
  onToggleHelp,
  onHistoryUp,
  onHistoryDown,
}: {
  onNewChat?: () => void;
  onClear?: () => void;
  onToggleHelp?: () => void;
  onHistoryUp?: () => void;
  onHistoryDown?: () => void;
}) {
  useKeyboardShortcuts({ onNewChat, onClear, onToggleHelp, onHistoryUp, onHistoryDown });
  return (
    <div>
      <input data-testid="text-input" placeholder="type here" />
      <button data-testid="trigger">focusable</button>
    </div>
  );
}

describe('useKeyboardShortcuts', () => {
  it('triggers onNewChat on Ctrl+K from anywhere', () => {
    const onNewChat = vi.fn();
    render(<ShortcutHarness onNewChat={onNewChat} />);
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(onNewChat).toHaveBeenCalledTimes(1);
  });

  it('triggers onToggleHelp on "?" outside text fields', () => {
    const onToggleHelp = vi.fn();
    render(<ShortcutHarness onToggleHelp={onToggleHelp} />);
    fireEvent.keyDown(window, { key: '?' });
    expect(onToggleHelp).toHaveBeenCalledTimes(1);
  });

  it('does NOT trigger onToggleHelp when an input is focused', () => {
    const onToggleHelp = vi.fn();
    render(<ShortcutHarness onToggleHelp={onToggleHelp} />);
    const input = document.querySelector('[data-testid="text-input"]') as HTMLElement;
    input.focus();
    fireEvent.keyDown(input, { key: '?' });
    expect(onToggleHelp).not.toHaveBeenCalled();
  });

  it('triggers onClear on Escape outside text fields', () => {
    const onClear = vi.fn();
    render(<ShortcutHarness onClear={onClear} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('triggers onHistoryUp/Down on arrows outside text fields', () => {
    const onUp = vi.fn();
    const onDown = vi.fn();
    render(<ShortcutHarness onHistoryUp={onUp} onHistoryDown={onDown} />);
    fireEvent.keyDown(window, { key: 'ArrowUp' });
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(onUp).toHaveBeenCalledTimes(1);
    expect(onDown).toHaveBeenCalledTimes(1);
  });
});
