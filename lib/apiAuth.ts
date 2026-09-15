// lib/apiAuth.ts
// API key generation + Bearer-token parsing for /api/v1/* routes.
//
// Keys look like `nmb_<prefix>_<secret>` where:
//   - prefix: 8 chars, used as the public identifier (we store this hash + last 4)
//   - secret: 32 chars, used for HMAC verification (we store the SHA-256 hash)
//
// The full key is shown to the user ONCE at creation. After that, only the
// last 4 chars of the secret are recoverable.

export const API_KEY_PREFIX = 'nmb';
export const API_KEY_PUBLIC_BYTES = 8;
export const API_KEY_SECRET_BYTES = 32;
export const API_KEY_STORAGE_KEY = 'nimbus-api-keys';

export interface ApiKey {
  /** Public id (`nmb_xxxxxxxx`). */
  id: string;
  /** SHA-256 hash of the full key, hex. */
  hash: string;
  /** Last 4 chars of the secret for display. */
  last4: string;
  /** Optional human label. */
  name: string;
  /** Created-at epoch ms. */
  createdAt: number;
  /** Last-used epoch ms (0 = never). */
  lastUsedAt: number;
  /** Whether the key has been revoked. Revoked keys cannot authenticate. */
  revoked: boolean;
}

/** Convert a Uint8Array to a hex string. */
function toHex(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i++) {
    s += (bytes[i] ?? 0).toString(16).padStart(2, '0');
  }
  return s;
}

/** Readable random bytes via WebCrypto, falling back to Math.random. */
export function randomBytes(length: number): Uint8Array {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const buf = new Uint8Array(length);
    crypto.getRandomValues(buf);
    return buf;
  }
  // Last-resort fallback (NOT cryptographically strong).
  const out = new Uint8Array(length);
  for (let i = 0; i < length; i++) out[i] = Math.floor(Math.random() * 256);
  return out;
}

/** Base32-ish alphabet for human-friendly keys (no I/L/O/0/1). */
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function randomString(length: number): string {
  const bytes = randomBytes(length);
  let s = '';
  for (let i = 0; i < length; i++) {
    const idx = (bytes[i] ?? 0) % ALPHABET.length;
    s += ALPHABET.charAt(idx);
  }
  return s;
}

/** Synchronous SHA-256 (hex) using a tiny inline FIPS-180-4 implementation. */
// We deliberately avoid pulling SubtleCrypto async helpers because API
// middleware may need to verify on the edge synchronously. This is a
// lightweight implementation; for higher-throughput services, swap with
// `@noble/hashes` later.
export function sha256Hex(input: string): string {
  function ror(x: number, n: number): number {
    return (x >>> n) | (x << (32 - n));
  }
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

  // UTF-8 encode
  const utf8 = new TextEncoder().encode(input);
  const bitLen = utf8.length * 8;
  const padLen = (((utf8.length + 9) >> 6) << 6) + 64 - (utf8.length + 9);
  const buf = new Uint8Array(padLen);
  buf.set(utf8);
  buf[utf8.length] = 0x80;
  // length as 64-bit big-endian
  const dv = new DataView(buf.buffer);
  // High 32 bits
  dv.setUint32(padLen - 8, Math.floor(bitLen / 0x100000000));
  dv.setUint32(padLen - 4, bitLen >>> 0);

  const w = new Array<number>(64);
  for (let chunk = 0; chunk < buf.length; chunk += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = dv.getUint32(chunk + i * 4);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = ror(w[i - 15]!, 7) ^ ror(w[i - 15]!, 18) ^ (w[i - 15]! >>> 3);
      const s1 = ror(w[i - 2]!, 17) ^ ror(w[i - 2]!, 19) ^ (w[i - 2]! >>> 10);
      w[i] = (w[i - 16]! + s0 + w[i - 7]! + s1) >>> 0;
    }
    let a = h0, b = h1, c = h2, d = h3;
    let e = h4, f = h5, g = h6, hh = h7;
    for (let i = 0; i < 64; i++) {
      const S1 = ror(e, 6) ^ ror(e, 11) ^ ror(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (hh + S1 + ch + K[i]! + w[i]!) >>> 0;
      const S0 = ror(a, 2) ^ ror(a, 13) ^ ror(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;
      hh = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }
    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + hh) >>> 0;
  }
  const hash = new Uint8Array(32);
  const dv2 = new DataView(hash.buffer);
  dv2.setUint32(0, h0);
  dv2.setUint32(4, h1);
  dv2.setUint32(8, h2);
  dv2.setUint32(12, h3);
  dv2.setUint32(16, h4);
  dv2.setUint32(20, h5);
  dv2.setUint32(24, h6);
  dv2.setUint32(28, h7);
  return toHex(hash);
}

/**
 * Mint a new API key. Returns the full plaintext key (show once!) AND the
 * persisted record (which only stores the hash + last 4).
 */
export function generateApiKey(name: string): { key: string; record: ApiKey } {
  const prefix = randomString(API_KEY_PUBLIC_BYTES);
  const secret = randomString(API_KEY_SECRET_BYTES);
  const id = `${API_KEY_PREFIX}_${prefix}`;
  const key = `${id}_${secret}`;
  const record: ApiKey = {
    id,
    hash: sha256Hex(key),
    last4: secret.slice(-4),
    name,
    createdAt: Date.now(),
    lastUsedAt: 0,
    revoked: false,
  };
  return { key, record };
}

export function loadApiKeys(): ApiKey[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(API_KEY_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ApiKey[]) : [];
  } catch {
    return [];
  }
}

export function saveApiKeys(keys: ApiKey[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify(keys));
  } catch {
    // quota — silently drop
  }
}

export function findActiveKey(keys: ApiKey[], fullKey: string): ApiKey | undefined {
  const hash = sha256Hex(fullKey);
  return keys.find((k) => !k.revoked && k.hash === hash);
}

/** Extract bearer token from `Authorization: Bearer xxx`. */
export function parseBearer(authHeader: string | null | undefined): string | null {
  if (!authHeader) return null;
  const trimmed = authHeader.trim();
  if (!trimmed.toLowerCase().startsWith('bearer ')) return null;
  const token = trimmed.slice(7).trim();
  return token || null;
}

export function isApiKey(value: string): boolean {
  return value.startsWith(`${API_KEY_PREFIX}_`);
}
