import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BotCard } from '@/components/BotCard';
import { type Bot } from '@/lib/bots';
import { ToastProvider } from '@/components/Toast';

const bot: Bot = {
  id: 'bot_test',
  name: 'Test Bot',
  avatar: '🤖',
  tagline: 'A friendly tester.',
  description: 'A friendly tester.',
  systemPrompt: 'You are a test.',
  temperature: 0.7,
  maxTokens: null,
  providerId: null,
  tags: ['test', 'fun'],
  shareSlug: null,
  builtin: false,
  createdAt: 0,
  lastUsedAt: 0,
};

beforeEach(() => {
  // Next's <Link> requires a router context — stub the bare minimum.
  // @ts-expect-error - jsdom doesn't ship with this property
  globalThis.__NEXT_DATA__ = { buildId: 'test' };
});

describe('BotCard', () => {
  it('renders the bot name and tagline', () => {
    render(
      <ToastProvider>
        <BotCard bot={bot} />
      </ToastProvider>
    );
    expect(screen.getByText('Test Bot')).toBeInTheDocument();
    expect(screen.getByText('A friendly tester.')).toBeInTheDocument();
  });

  it('shows a BUILT-IN badge for seeded bots', () => {
    render(
      <ToastProvider>
        <BotCard bot={{ ...bot, builtin: true }} />
      </ToastProvider>
    );
    expect(screen.getByText('BUILT-IN')).toBeInTheDocument();
  });

  it('shows the first 3 tags', () => {
    render(
      <ToastProvider>
        <BotCard
          bot={{
            ...bot,
            tags: ['a', 'b', 'c', 'd', 'e'],
          }}
        />
      </ToastProvider>
    );
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('c')).toBeInTheDocument();
    expect(screen.queryByText('d')).toBeNull();
    expect(screen.queryByText('e')).toBeNull();
  });
});
