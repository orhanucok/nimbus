'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  /** Raw code text (already trimmed of trailing newline). */
  code: string;
  /** Detected language id (e.g. "typescript", "python") — optional. */
  language?: string;
  className?: string;
}

/**
 * CodeBlock — wraps fenced code in markdown with a header bar
 * (language label + copy button). Drop-in replacement for the
 * default `<pre><code>` render inside ReactMarkdown.
 *
 * Syntax highlighting itself is deferred to Hour 3.5 — this
 * component only adds the chrome (label, copy, hover state).
 * When rehype-pretty-code lands, wrap the <code> with its result.
 */
export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  const langLabel = language ? language.toUpperCase() : 'TEXT';

  return (
    <div
      className={`relative my-3 rounded-lg overflow-hidden border border-border/40 bg-card/30 ${
        className ?? ''
      }`}
    >
      <div className="flex items-center justify-between bg-card/80 px-3 py-1.5 text-xs border-b border-border/40">
        <span className="font-mono opacity-70">{langLabel}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
          aria-label={copied ? 'Kod kopyalandı' : 'Kodu kopyala'}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-500">Kopyalandı</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Kopyala</span>
            </>
          )}
        </button>
      </div>

      <pre className="bg-gray-100 dark:bg-zinc-900 overflow-x-auto p-3 text-sm leading-relaxed">
        <code className={`language-${language ?? 'text'} font-mono`}>{code}</code>
      </pre>
    </div>
  );
}

export default CodeBlock;
