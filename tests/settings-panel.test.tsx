import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsPanel, DEFAULT_SETTINGS, type SettingsState } from '@/components/SettingsPanel';

describe('SettingsPanel', () => {
  const baseProps = {
    value: DEFAULT_SETTINGS,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a settings trigger button', () => {
    render(<SettingsPanel {...baseProps} />);
    expect(screen.getByRole('button', { name: /ayarlar/i })).toBeInTheDocument();
  });

  it('opens the dialog on click and exposes controls', () => {
    render(<SettingsPanel {...baseProps} />);
    fireEvent.click(screen.getByRole('button', { name: /ayarlar/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/temperature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/max tokens/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/system prompt/i)).toBeInTheDocument();
  });

  it('fires onChange when temperature slider moves', () => {
    const onChange = vi.fn();
    render(<SettingsPanel value={DEFAULT_SETTINGS} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /ayarlar/i }));
    const slider = screen.getByLabelText(/temperature/i);
    fireEvent.change(slider, { target: { value: '1.5' } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ temperature: 1.5 })
    );
  });

  it('resets to defaults when reset button clicked', () => {
    const onChange = vi.fn();
    render(<SettingsPanel value={{ ...DEFAULT_SETTINGS, temperature: 1.9 }} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /ayarlar/i }));
    fireEvent.click(screen.getByRole('button', { name: /varsayılanlara sıfırla/i }));
    expect(onChange).toHaveBeenCalledWith(DEFAULT_SETTINGS);
  });

  it('applies a system prompt preset when its chip is clicked', () => {
    const onChange = vi.fn();
    render(<SettingsPanel value={DEFAULT_SETTINGS} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /ayarlar/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Concise' }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        systemPrompt: 'Be concise. Short sentences, no fluff.',
      })
    );
  });

  it('exposes DEFAULT_SETTINGS with sane defaults', () => {
    expect(DEFAULT_SETTINGS.temperature).toBe(0.7);
    expect(DEFAULT_SETTINGS.maxTokens).toBe(2048);
    expect(DEFAULT_SETTINGS.systemPrompt).toBe('');
  });
});
