'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

interface KeyboardHelpOverlayProps {
  open: boolean;
  onClose: () => void;
}

interface ShortcutGroup {
  title: string;
  items: Array<{ keys: string[]; description: string }>;
}

const SHORTCUTS: ShortcutGroup[] = [
  {
    title: 'Chat',
    items: [
      { keys: ['Enter'], description: 'Send message' },
      { keys: ['Shift', 'Enter'], description: 'New line' },
      { keys: ['Ctrl', 'K'], description: 'New chat' },
      { keys: ['Esc'], description: 'Clear input / close dialog' },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { keys: ['↑', '↓'], description: 'Cycle input history' },
    ],
  },
];

export function KeyboardHelpOverlay({ open, onClose }: KeyboardHelpOverlayProps) {
  // Esc closes the overlay.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="kbhelp-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="Close keyboard shortcuts"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-popover border border-border rounded-xl shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                id="kbhelp-title"
                className="text-lg font-semibold flex items-center gap-2"
              >
                <Keyboard className="w-5 h-5 opacity-70" />
                Keyboard shortcuts
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5">
              {SHORTCUTS.map((group) => (
                <div key={group.title}>
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    {group.title}
                  </h3>
                  <ul className="space-y-1.5">
                    {group.items.map((s, i) => (
                      <li
                        key={`${group.title}-${i}`}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span className="opacity-80">{s.description}</span>
                        <span className="flex items-center gap-1 shrink-0">
                          {s.keys.map((k, ki) => (
                            <span key={ki} className="flex items-center gap-1">
                              {ki > 0 && (
                                <span className="text-[10px] opacity-50">+</span>
                              )}
                              <kbd className="px-2 py-0.5 text-xs bg-muted border border-border rounded font-mono">
                                {k}
                              </kbd>
                            </span>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-muted-foreground mt-5 pt-4 border-t border-border">
              Press <kbd className="px-1 py-0.5 bg-muted border border-border rounded font-mono">?</kbd> anytime to open this dialog. Press <kbd className="px-1 py-0.5 bg-muted border border-border rounded font-mono">Esc</kbd> to close.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default KeyboardHelpOverlay;
