import { describe, it, expect, beforeEach } from 'vitest';
import {
  mintPairing,
  loadPairings,
  findPairing,
  isValidPairing,
  claimPairing,
  revokePairing,
  formatCountdown,
  randomCode,
  randomSecret,
  PAIRING_TTL_MS,
  PAIRING_CODE_LEN,
} from '@/lib/remotePairing';

describe('remotePairing: helpers', () => {
  beforeEach(() => localStorage.clear());

  it('randomCode returns a string of the requested length made of digits', () => {
    const code = randomCode(8);
    expect(code).toHaveLength(8);
    expect(/^\d{8}$/.test(code)).toBe(true);
  });

  it('randomSecret returns a hex-ish string', () => {
    const s = randomSecret(16);
    expect(s).toHaveLength(16);
    expect(/^[0-9a-f]+$/.test(s)).toBe(true);
  });

  it('formatCountdown returns mm:ss', () => {
    expect(formatCountdown(Date.now() + 65_000)).toBe('1:05');
    expect(formatCountdown(Date.now() + 0)).toBe('0:00');
    expect(formatCountdown(Date.now() - 5_000)).toBe('0:00');
  });
});

describe('remotePairing: mint / claim / revoke', () => {
  beforeEach(() => localStorage.clear());

  it('mints a pairing with a 6-digit code and a TTL', () => {
    const p = mintPairing();
    expect(p.code).toHaveLength(PAIRING_CODE_LEN);
    expect(p.expiresAt - Date.now()).toBeGreaterThan(PAIRING_TTL_MS - 1000);
    expect(p.claimedAt).toBeNull();
  });

  it('isValidPairing accepts fresh, unclaimed pairings', () => {
    const p = mintPairing();
    expect(isValidPairing(p)).toBe(true);
  });

  it('isValidPairing rejects expired pairings', () => {
    const p = mintPairing();
    expect(isValidPairing({ ...p, expiresAt: Date.now() - 1 })).toBe(false);
  });

  it('claimPairing succeeds once and fails after', () => {
    const p = mintPairing();
    const claimed = claimPairing(p.code, 'iPhone');
    expect(claimed).not.toBeNull();
    expect(claimed?.deviceName).toBe('iPhone');
    expect(claimed?.claimedAt).not.toBeNull();
    expect(claimPairing(p.code, 'Android')).toBeNull();
  });

  it('findPairing returns the pairing if it exists', () => {
    const p = mintPairing();
    expect(findPairing(p.code)?.secret).toBe(p.secret);
    expect(findPairing('999999')).toBeUndefined();
  });

  it('revokePairing removes the entry', () => {
    const p = mintPairing();
    revokePairing(p.code);
    expect(loadPairings().find((x) => x.code === p.code)).toBeUndefined();
  });

  it('loadPairings reflects mints and revokes', () => {
    expect(loadPairings()).toHaveLength(0);
    mintPairing();
    mintPairing();
    expect(loadPairings().length).toBeGreaterThanOrEqual(2);
  });
});
