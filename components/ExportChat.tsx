'use client';

import { FileJson, FileText } from 'lucide-react';

interface ExportableMessage {
  role: 'user' | 'assistant' | 'system' | string;
  content: string | { text?: string } | unknown;
}

interface ExportChatProps {
  messages: ExportableMessage[];
  chatTitle?: string;
  className?: string;
}

const extractText = (content: ExportableMessage['content']): string => {
  if (typeof content === 'string') return content;
  if (content && typeof content === 'object' && 'text' in content) {
    const t = (content as { text?: unknown }).text;
    if (typeof t === 'string') return t;
  }
  return '';
};

const messagesToMarkdown = (
  messages: ExportableMessage[],
  title?: string
): string => {
  const lines: string[] = [];
  if (title) lines.push(`# ${title}`, '');
  for (const m of messages) {
    const role = m.role.charAt(0).toUpperCase() + m.role.slice(1);
    const text = extractText(m.content);
    lines.push(`## ${role}`, '', text, '', '---', '');
  }
  return lines.join('\n');
};

const messagesToJSON = (
  messages: ExportableMessage[],
  title?: string
): string =>
  JSON.stringify(
    {
      title,
      exportedAt: new Date().toISOString(),
      messages,
    },
    null,
    2
  );

const download = (filename: string, content: string, mime: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const slugify = (s: string): string =>
  s
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
    .toLowerCase() || 'chat';

const timestamp = (): string =>
  new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');

/**
 * ExportChat — two-button drop for downloading the active chat
 * as Markdown (human-readable) or JSON (machine-readable).
 * Renders nothing if the conversation is empty.
 */
export function ExportChat({
  messages,
  chatTitle,
  className,
}: ExportChatProps) {
  if (messages.length === 0) return null;

  const base = `nimbus-${slugify(chatTitle ?? 'chat')}-${timestamp()}`;

  const handleMarkdown = () => {
    download(`${base}.md`, messagesToMarkdown(messages, chatTitle), 'text/markdown');
  };
  const handleJson = () => {
    download(`${base}.json`, messagesToJSON(messages, chatTitle), 'application/json');
  };

  return (
    <div className={`flex items-center gap-1 ${className ?? ''}`}>
      <button
        type="button"
        onClick={handleMarkdown}
        title="Markdown olarak indir"
        aria-label="Sohbeti Markdown olarak indir"
        className="p-1.5 hover:bg-accent rounded-md transition-colors group"
      >
        <FileText className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
      </button>
      <button
        type="button"
        onClick={handleJson}
        title="JSON olarak indir"
        aria-label="Sohbeti JSON olarak indir"
        className="p-1.5 hover:bg-accent rounded-md transition-colors group"
      >
        <FileJson className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  );
}

export default ExportChat;
