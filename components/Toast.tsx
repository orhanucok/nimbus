'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type ToastKind = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  kind: ToastKind;
  message: string;
  /** Milliseconds before auto-dismiss. Defaults to 3500. */
  durationMs?: number;
}

interface ToastContextValue {
  /** Push a new toast. Returns the toast id (useful for tests/dismiss). */
  show: (kind: ToastKind, message: string, durationMs?: number) => string;
  /** Manually dismiss a toast by id. */
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Provider hook for components that need to push toasts. Throws if used
 * outside a `<ToastProvider>` so misuse is caught early.
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return ctx;
}

const ICONS: Record<ToastKind, React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4" />,
  error: <AlertTriangle className="w-4 h-4" />,
  info: <Info className="w-4 h-4" />,
};

const KIND_CLASSES: Record<ToastKind, string> = {
  success: 'border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400',
  error: 'border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400',
  info: 'border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400',
};

interface ToastProviderProps {
  children: React.ReactNode;
  /** Cap how many toasts are visible at once. Older toasts drop off. */
  max?: number;
}

export function ToastProvider({ children, max = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const handle = timers.current.get(id);
    if (handle) {
      clearTimeout(handle);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (kind: ToastKind, message: string, durationMs = 3500) => {
      const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => {
        const next = [...prev, { id, kind, message, durationMs }];
        // Keep only the most recent `max` toasts.
        return next.length > max ? next.slice(next.length - max) : next;
      });
      if (durationMs > 0) {
        const handle = setTimeout(() => dismiss(id), durationMs);
        timers.current.set(id, handle);
      }
      return id;
    },
    [dismiss, max]
  );

  // Clear all pending timers on unmount.
  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((h) => clearTimeout(h));
      map.clear();
    };
  }, []);

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm pointer-events-none"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              role={t.kind === 'error' ? 'alert' : 'status'}
              initial={{ opacity: 0, x: 24, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.95 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={`pointer-events-auto flex items-start gap-2 px-4 py-3 rounded-lg
                border backdrop-blur-md shadow-lg ${KIND_CLASSES[t.kind]}`}
            >
              <span className="shrink-0 mt-0.5">{ICONS[t.kind]}</span>
              <p className="flex-1 text-sm leading-snug">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
