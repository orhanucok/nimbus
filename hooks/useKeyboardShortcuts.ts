'use client';

import { useEffect } from 'react';

interface ShortcutHandlers {
  /** Ctrl/Cmd+K — start a new chat. Fires regardless of focus. */
  onNewChat?: () => void;
  /** Escape — clear the input / cancel edit. Suppressed in inputs. */
  onClear?: () => void;
  /** ArrowUp (no input focused) — recall previous draft from history. */
  onHistoryUp?: () => void;
  /** ArrowDown (no input focused) — recall next draft from history. */
  onHistoryDown?: () => void;
}

/**
 * Global keyboard shortcuts for the chat UI.
 *
 * Behavior:
 * - `Ctrl+K` / `⌘+K`     → new chat (fires anywhere, including inputs)
 * - `Esc`                 → clear input (suppressed when an input/textarea
 *                           is focused and the value is empty, so we don't
 *                           steal close-on-blur semantics)
 * - `↑` / `↓`             → recall draft from in-memory history
 *                           (suppressed inside inputs so cursor navigation
 *                           keeps working)
 */
export function useKeyboardShortcuts(handlers: ShortcutHandlers): void {
  const { onNewChat, onClear, onHistoryUp, onHistoryDown } = handlers;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const inField =
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        target?.isContentEditable === true;

      const isMod = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();

      // New chat — global, no focus check
      if (isMod && key === 'k') {
        event.preventDefault();
        onNewChat?.();
        return;
      }

      // Clear — only when not editing a field
      if (!inField && event.key === 'Escape') {
        event.preventDefault();
        onClear?.();
        return;
      }

      // History nav — only outside fields
      if (!inField && event.key === 'ArrowUp') {
        event.preventDefault();
        onHistoryUp?.();
        return;
      }
      if (!inField && event.key === 'ArrowDown') {
        event.preventDefault();
        onHistoryDown?.();
        return;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onNewChat, onClear, onHistoryUp, onHistoryDown]);
}

export default useKeyboardShortcuts;
