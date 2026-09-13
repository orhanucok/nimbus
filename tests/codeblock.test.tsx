import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CodeBlock } from '@/components/CodeBlock';

describe('CodeBlock', () => {
  beforeEach(() => {
    // Mock clipboard for jsdom
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it('renders the language label in uppercase', () => {
    render(<CodeBlock code="const x = 1" language="typescript" />);
    expect(screen.getByText('TYPESCRIPT')).toBeInTheDocument();
  });

  it('renders "TEXT" when no language is provided', () => {
    render(<CodeBlock code="hello" />);
    expect(screen.getByText('TEXT')).toBeInTheDocument();
  });

  it('renders the code content inside <code>', () => {
    render(<CodeBlock code="console.log('hi')" language="javascript" />);
    expect(screen.getByText("console.log('hi')")).toBeInTheDocument();
  });

  it('copies the code to clipboard when copy button is clicked', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<CodeBlock code="let y = 2" language="javascript" />);
    fireEvent.click(screen.getByRole('button', { name: /kodu kopyala/i }));
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('let y = 2');
    });
  });

  it('shows "Kopyalandı" feedback after copy', async () => {
    render(<CodeBlock code="abc" language="python" />);
    fireEvent.click(screen.getByRole('button', { name: /kodu kopyala/i }));
    await waitFor(() => {
      expect(screen.getByText(/kopyalandı/i)).toBeInTheDocument();
    });
  });
});
