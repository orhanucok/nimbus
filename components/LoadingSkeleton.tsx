'use client';

import { motion } from 'framer-motion';

/**
 * Three animated dots that say "model is thinking".
 * Drop-in replacement for any spinner on the streaming response.
 */
export function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-2 text-muted-foreground text-sm px-4 max-w-3xl mx-auto py-3"
      role="status"
      aria-label="Nimbus yanıt oluşturuyor"
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-current inline-block"
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <span className="opacity-70">Nimbus yazıyor…</span>
    </div>
  );
}

/**
 * Shimmering placeholder while the assistant message is being
 * streamed. Mimics a chat bubble with two shimmering lines.
 */
export function MessageSkeleton() {
  return (
    <div className="mb-6">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-70"
            aria-hidden="true"
          />
          <div className="flex-1 space-y-2">
            <motion.div
              className="h-4 bg-card/80 rounded w-3/4"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="h-4 bg-card/80 rounded w-1/2"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: 0.2,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Generic spinner with Nimbus gradient. Use in buttons (e.g. "Send")
 * while a request is in flight.
 */
export function Spinner({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
      aria-label="Yükleniyor"
      role="status"
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="50 100"
          opacity="0.9"
        />
      </svg>
    </motion.span>
  );
}
