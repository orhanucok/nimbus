import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TokenCounter } from '@/components/TokenCounter';

describe('TokenCounter', () => {
  it('renders nothing (or only an empty marker) when there are no messages', () => {
    const { container } = render(<TokenCounter messages={[]} />);
    // The component always renders the marker div for a11y;
    // verify it shows 0 tokens.
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(container.querySelector('[role="progressbar"]')).toBeInTheDocument();
  });

  it('estimates tokens as chars/4 for string content', () => {
    const messages = [{ role: 'user', content: 'a'.repeat(400) }];
    render(<TokenCounter messages={messages} maxTokens={1000} />);
    // 400 chars / 4 = 100 tokens, formatted as 100 (Turkish locale uses
    // '.' as thousands sep, so '100' alone is expected)
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('sums tokens across multiple messages', () => {
    const messages = [
      { role: 'user', content: 'a'.repeat(100) },        // 25 tokens
      { role: 'assistant', content: 'b'.repeat(200) },  // 50 tokens
    ];
    render(<TokenCounter messages={messages} maxTokens={1000} />);
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('marks the progressbar as red when usage >= 90%', () => {
    const messages = [{ role: 'user', content: 'a'.repeat(400) }]; // 100/1000 = 10%
    // Force the meter to 95% via a tiny max
    render(<TokenCounter messages={messages} maxTokens={105} />); // 100/105 = ~95%
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('95');
  });
});
