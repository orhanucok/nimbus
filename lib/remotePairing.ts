// lib/remotePairing.ts
//
// A tiny pairing protocol that lets a phone take over a desktop Nimbus
// session over the REST API.
//
// Lifecycle:
//   1. Desktop calls `mintPairing()` → 6-char human code + secret + ttl
//   2. Desktop polls `consumePairing()` until the code is claimed
//   3. Phone submits the code to `POST /api/v1/pair` → gets a sessionToken
//   4. Phone uses sessionToken to call `GET /api/v1/remote/sessions` and
//      `POST /api/v1/remote/sessions/:id/messages`
//
// Codes are short so they're easy to type; the secret length + 5 min TTL
// keep them safe enough for a casual remote-control use case.

const STORAGE_KEY = 'nimbus-remote-pairings';

export interface Pairing {
  /** Short numeric code the user types in (e.g. `482193`). */
  code: string;
  /** Long secret kept in localStorage; sent only to /api/v1/pair claim. */
  secret: string;
  /** Epoch ms when the pairing auto-expires. */
  expiresAt: number;
  /** Set when a phone claims it. */
  claimedAt: number | null;
  /** Optional phone label. */
  deviceName: string | null;
}

export const PAIRING_TTL_MS = 5 * 60 * 1000;
export const PAIRING_CODE_LEN = 6;

export function loadPairings(): Pairing[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Pairing[]) : [];
  } catch {
    return [];
  }
}

export function savePairings(list: Pairing[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

/** Random numeric string (avoids leading-zero ambiguity by not enforcing length). */
export function randomCode(length: number): string {
  const buf = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(buf);
  } else {
    for (let i = 0; i < length; i++) buf[i] = Math.floor(Math.random() * 256);
  }
  let out = '';
  for (let i = 0; i < length; i++) {
    out += String((buf[i] ?? 0) % 10);
  }
  return out;
}

export function randomSecret(length = 24): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '').slice(0, length);
  }
  const buf = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(buf);
  } else {
    for (let i = 0; i < length; i++) buf[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(buf, (b) => (b ?? 0).toString(16).padStart(2, '0')).join('').slice(0, length);
}

export function mintPairing(): Pairing {
  const list = loadPairings();
  // Drop expired
  const now = Date.now();
  const fresh = list.filter((p) => p.expiresAt > now && !p.claimedAt);
  const pairing: Pairing = {
    code: randomCode(PAIRING_CODE_LEN),
    secret: randomSecret(),
    expiresAt: now + PAIRING_TTL_MS,
    claimedAt: null,
    deviceName: null,
  };
  fresh.push(pairing);
  savePairings(fresh);
  return pairing;
}

export function findPairing(code: string): Pairing | undefined {
  return loadPairings().find((p) => p.code === code);
}

export function isValidPairing(p: Pairing, now = Date.now()): boolean {
  return p.expiresAt > now && p.claimedAt === null;
}

export function revokePairing(code: string): void {
  const list = loadPairings();
  savePairings(list.filter((p) => p.code !== code));
}

export function claimPairing(code: string, deviceName: string): Pairing | null {
  const list = loadPairings();
  const now = Date.now();
  const idx = list.findIndex((p) => p.code === code && p.expiresAt > now && !p.claimedAt);
  if (idx === -1) return null;
  const claimed: Pairing = {
    ...list[idx]!,
    claimedAt: now,
    deviceName,
  };
  list[idx] = claimed;
  savePairings(list);
  return claimed;
}

export function formatCountdown(target: number, now = Date.now()): string {
  const diff = Math.max(0, target - now);
  const m = Math.floor(diff / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return `${m}:${String(s).padStart(2, '0')}`;
}
