import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProviderSwitcher, PROVIDERS } from '@/components/ProviderSwitcher';

describe('ProviderSwitcher', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the active provider name in the trigger button', () => {
    render(<ProviderSwitcher value="deepseek" />);
    expect(screen.getByRole('button', { name: /switch llm provider/i })).toHaveTextContent(
      'DeepSeek'
    );
  });

  it('opens the menu when the trigger is clicked', () => {
    render(<ProviderSwitcher value="deepseek" />);
    fireEvent.click(screen.getByRole('button', { name: /switch llm provider/i }));
    // 6 providers from PROVIDERS list — all should appear in the menu
    PROVIDERS.forEach((p) => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    });
  });

  it('marks the active provider with aria-checked=true', () => {
    render(<ProviderSwitcher value="openai" />);
    fireEvent.click(screen.getByRole('button', { name: /switch llm provider/i }));
    const openaiOption = screen.getByRole('menuitemradio', { name: /openai/i });
    expect(openaiOption.getAttribute('aria-checked')).toBe('true');
  });

  it('calls onChange when a different provider is picked', () => {
    const onChange = vi.fn();
    render(<ProviderSwitcher value="deepseek" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /switch llm provider/i }));
    fireEvent.click(screen.getByRole('menuitemradio', { name: /groq/i }));
    expect(onChange).toHaveBeenCalledWith('groq');
  });

  it('exposes all 6 providers in the public PROVIDERS list', () => {
    expect(PROVIDERS).toHaveLength(6);
    expect(PROVIDERS.map((p) => p.id)).toEqual([
      'deepseek',
      'openai',
      'groq',
      'xai',
      'openrouter',
      'ollama',
    ]);
  });
});
