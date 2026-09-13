import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadCustomProvider,
  saveCustomProvider,
  clearCustomProvider,
  encodeCustomProviderHeader,
  decodeCustomProviderHeader,
  type CustomProviderConfig,
} from '@/lib/customProvider';

const SAMPLE: CustomProviderConfig = {
  baseURL: 'https://my-llm.example.com/v1',
  model: 'my-model',
  apiKey: 'sk-abc',
};

describe('customProvider storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when nothing is stored', () => {
    expect(loadCustomProvider()).toBeNull();
  });

  it('round-trips a config through saveCustomProvider + loadCustomProvider', () => {
    saveCustomProvider(SAMPLE);
    expect(loadCustomProvider()).toEqual(SAMPLE);
  });

  it('drops malformed JSON', () => {
    localStorage.setItem('nimbus-custom-provider', '{not json');
    expect(loadCustomProvider()).toBeNull();
  });

  it('drops configs missing required fields', () => {
    localStorage.setItem(
      'nimbus-custom-provider',
      JSON.stringify({ baseURL: 'https://x' })
    );
    expect(loadCustomProvider()).toBeNull();
  });

  it('clearCustomProvider removes the key', () => {
    saveCustomProvider(SAMPLE);
    clearCustomProvider();
    expect(loadCustomProvider()).toBeNull();
  });
});

describe('customProvider header encoding', () => {
  it('round-trips a config through encodeCustomProviderHeader + decodeCustomProviderHeader', () => {
    const header = encodeCustomProviderHeader(SAMPLE);
    expect(typeof header).toBe('string');
    expect(header.length).toBeGreaterThan(0);
    expect(decodeCustomProviderHeader(header)).toEqual(SAMPLE);
  });

  it('returns null for invalid header content', () => {
    expect(decodeCustomProviderHeader('not-base64!@#')).toBeNull();
  });
});
