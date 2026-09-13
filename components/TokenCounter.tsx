'use client';

import { useMemo } from 'react';
import { Zap } from 'lucide-react';

interface TokenCounterMessage {
  role: 'user' | 'assistant' | 'system' | string;
  content: string | { text?: string } | unknown;
}

interface TokenCounterProps {
  messages: TokenCounterMessage[];
  /** Model context window. Defaults to 8K (conservative for most providers). */
  maxTokens?: number;
  className?: string;
}

/**
 * Rough character→token approximation. Most OpenAI-compatible LLMs
 * average ~4 chars per token (English-heavy code & prose).
 * For exact counts, swap with gpt-tokenizer / tiktoken later.
 */
const estimateTokens = (text: string): number => Math.ceil(text.length / 4);

const extractText = (content: TokenCounterMessage['content']): string => {
  if (typeof content === 'string') return content;
  if (content && typeof content === 'object' && 'text' in content) {
    const t = (content as { text?: unknown }).text;
    if (typeof t === 'string') return t;
  }
  return '';
};

/**
 * TokenCounter — compact context-window meter.
 * Renders the estimated token count + a colored progress bar.
 * Bar turns yellow at 70%, red at 90%.
 */
export function TokenCounter({
  messages,
  maxTokens = 8192,
  className,
}: TokenCounterProps) {
  const used = useMemo(
    () => messages.reduce((sum, m) => sum + estimateTokens(extractText(m.content)), 0),
    [messages]
  );

  const pct = Math.min(100, Math.round((used / maxTokens) * 100));
  const color =
    pct >= 90 ? 'text-red-500' : pct >= 70 ? 'text-yellow-500' : 'text-muted-foreground';
  const barColor =
    pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-blue-500';

  return (
    <div
      className={`flex items-center gap-1.5 text-xs ${color} ${className ?? ''}`}
      title={`${used.toLocaleString('tr-TR')} / ${maxTokens.toLocaleString(
        'tr-TR'
      )} token (yaklaşık)`}
      aria-label={`Context window: ${pct}% used`}
    >
      <Zap className="w-3.5 h-3.5" aria-hidden="true" />
      <span className="font-mono tabular-nums">
        {used.toLocaleString('tr-TR')}
      </span>
      <div
        className="w-16 h-1.5 bg-accent/40 rounded overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full transition-all duration-300 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default TokenCounter;
