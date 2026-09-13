// lib/customProvider.ts
// Helpers for storing user-defined OpenAI-compatible endpoints in localStorage
// and surfacing them to the /api/chat route via a request header.

export interface CustomProviderConfig {
  /** Base URL of the OpenAI-compatible endpoint, e.g. https://api.example.com/v1 */
  baseURL: string;
  /** Model name to send with chat completions, e.g. llama-3.1-70b */
  model: string;
  /** Optional bearer token. Local servers may not need it. */
  apiKey?: string;
}

export const CUSTOM_PROVIDER_STORAGE_KEY = 'nimbus-custom-provider';

/**
 * Read the saved custom provider config from localStorage.
 * Returns null if missing, malformed, or running on the server.
 */
export function loadCustomProvider(): CustomProviderConfig | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CUSTOM_PROVIDER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CustomProviderConfig>;
    if (typeof parsed.baseURL !== 'string' || typeof parsed.model !== 'string') {
      return null;
    }
    return {
      baseURL: parsed.baseURL,
      model: parsed.model,
      apiKey: typeof parsed.apiKey === 'string' ? parsed.apiKey : undefined,
    };
  } catch {
    return null;
  }
}

export function saveCustomProvider(cfg: CustomProviderConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOM_PROVIDER_STORAGE_KEY, JSON.stringify(cfg));
  } catch {
    // ignore quota errors
  }
}

export function clearCustomProvider(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CUSTOM_PROVIDER_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Encode the config as a base64 JSON string for safe HTTP header transport.
 * The header is X-Nimbus-Custom-Provider.
 */
export function encodeCustomProviderHeader(cfg: CustomProviderConfig): string {
  if (typeof window === 'undefined') return '';
  try {
    return window.btoa(unescape(encodeURIComponent(JSON.stringify(cfg))));
  } catch {
    return '';
  }
}

export function decodeCustomProviderHeader(raw: string): CustomProviderConfig | null {
  try {
    const json = decodeURIComponent(escape(window.atob(raw)));
    const parsed = JSON.parse(json) as Partial<CustomProviderConfig>;
    if (typeof parsed.baseURL !== 'string' || typeof parsed.model !== 'string') {
      return null;
    }
    return {
      baseURL: parsed.baseURL,
      model: parsed.model,
      apiKey: typeof parsed.apiKey === 'string' ? parsed.apiKey : undefined,
    };
  } catch {
    return null;
  }
}
