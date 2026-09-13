import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomProviderDialog from '@/components/CustomProviderDialog';
import { CUSTOM_PROVIDER_STORAGE_KEY } from '@/lib/customProvider';

describe('CustomProviderDialog', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <CustomProviderDialog open={false} onClose={() => {}} />
    );
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders the dialog when open', () => {
    render(<CustomProviderDialog open onClose={() => {}} />);
    expect(
      screen.getByRole('dialog', { name: /custom provider/i })
    ).toBeInTheDocument();
  });

  it('shows required field labels (Base URL, Model)', () => {
    render(<CustomProviderDialog open onClose={() => {}} />);
    expect(screen.getByLabelText(/Base URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Model/i)).toBeInTheDocument();
  });

  it('hydrates fields from localStorage when opening', () => {
    localStorage.setItem(
      CUSTOM_PROVIDER_STORAGE_KEY,
      JSON.stringify({
        baseURL: 'https://my-llm.example/v1',
        model: 'my-cool-model',
        apiKey: 'sk-test',
      })
    );
    render(<CustomProviderDialog open onClose={() => {}} />);
    expect(
      (screen.getByLabelText(/Base URL/i) as HTMLInputElement).value
    ).toBe('https://my-llm.example/v1');
    expect(
      (screen.getByLabelText(/^Model/i) as HTMLInputElement).value
    ).toBe('my-cool-model');
    expect(
      (screen.getByLabelText(/API Key/i) as HTMLInputElement).value
    ).toBe('sk-test');
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<CustomProviderDialog open onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('validates required fields and shows an inline error', () => {
    render(<CustomProviderDialog open onClose={() => {}} />);
    // Wipe default value, leave empty
    const url = screen.getByLabelText(/Base URL/i) as HTMLInputElement;
    fireEvent.change(url, { target: { value: '' } });
    const form = url.closest('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form!);
    expect(screen.getByRole('alert')).toHaveTextContent(/required/i);
  });

  it('rejects non-http URLs', () => {
    render(<CustomProviderDialog open onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText(/Base URL/i), {
      target: { value: 'ftp://no.example' },
    });
    const form = screen.getByLabelText(/Base URL/i).closest('form');
    fireEvent.submit(form!);
    expect(screen.getByRole('alert')).toHaveTextContent(/http or https/i);
  });

  it('saves a valid config to localStorage and calls onSaved + onClose', () => {
    const onSaved = vi.fn();
    const onClose = vi.fn();
    render(<CustomProviderDialog open onClose={onClose} onSaved={onSaved} />);
    fireEvent.change(screen.getByLabelText(/Base URL/i), {
      target: { value: 'https://api.test.com/v1/' },
    });
    fireEvent.change(screen.getByLabelText(/^Model/i), {
      target: { value: 'foo-model' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^Save$/i }));
    const stored = JSON.parse(localStorage.getItem(CUSTOM_PROVIDER_STORAGE_KEY)!);
    expect(stored.baseURL).toBe('https://api.test.com/v1'); // trailing slash stripped
    expect(stored.model).toBe('foo-model');
    expect(onSaved).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
