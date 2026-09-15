import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateApiKey,
  loadApiKeys,
  saveApiKeys,
  findActiveKey,
  parseBearer,
  isApiKey,
  sha256Hex,
  randomString,
} from '@/lib/apiAuth';

describe('apiAuth: keys', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('mints a key in the expected format', () => {
    const { key, record } = generateApiKey('test');
    expect(key.startsWith('nmb_')).toBe(true);
    expect(record.id).toMatch(/^nmb_[A-Z0-9]{8}$/);
    expect(record.last4).toHaveLength(4);
    expect(record.hash).toHaveLength(64); // sha256 hex
    expect(record.revoked).toBe(false);
    expect(record.name).toBe('test');
  });

  it('persists and reloads keys', () => {
    const { record } = generateApiKey('first');
    saveApiKeys([record]);
    const loaded = loadApiKeys();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.id).toBe(record.id);
  });

  it('findActiveKey matches the full plaintext key', () => {
    const { key, record } = generateApiKey('match');
    const stored = [record];
    expect(findActiveKey(stored, key)).toBeDefined();
    expect(findActiveKey(stored, 'nmb_FAKEFAKE_ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ')).toBeUndefined();
  });

  it('revoked keys do not authenticate', () => {
    const { key, record } = generateApiKey('revoke-me');
    const stored = [{ ...record, revoked: true }];
    expect(findActiveKey(stored, key)).toBeUndefined();
  });
});

describe('apiAuth: bearer parsing', () => {
  it('parses a well-formed Authorization header', () => {
    expect(parseBearer('Bearer abc.def.ghi')).toBe('abc.def.ghi');
    expect(parseBearer('bearer xyz')).toBe('xyz');
    expect(parseBearer('  Bearer   spaced  ')).toBe('spaced');
  });

  it('rejects missing/wrong-scheme headers', () => {
    expect(parseBearer(null)).toBeNull();
    expect(parseBearer(undefined)).toBeNull();
    expect(parseBearer('')).toBeNull();
    expect(parseBearer('Basic abc')).toBeNull();
  });
});

describe('apiAuth: helpers', () => {
  it('isApiKey recognises Nimbus keys', () => {
    expect(isApiKey('nmb_AAAAAAAA_secret')).toBe(true);
    expect(isApiKey('sk-abc')).toBe(false);
  });

  it('randomString returns unique strings', () => {
    const a = randomString(16);
    const b = randomString(16);
    expect(a).not.toEqual(b);
    expect(a).toHaveLength(16);
    // Avoid ambiguous I/L/O/0/1
    expect(/[ILO01]/.test(a)).toBe(false);
  });

  it('sha256Hex matches the canonical empty-string digest', () => {
    expect(sha256Hex('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    );
  });

  it('sha256Hex matches the canonical "abc" digest', () => {
    expect(sha256Hex('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    );
  });
});
