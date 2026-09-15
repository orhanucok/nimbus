import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/health/route';

describe('GET /api/health', () => {
  it('returns ok + service + version', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      ok: boolean;
      service: string;
      version: string;
      runtime: string;
      uptime: number;
      now: string;
    };
    expect(body.ok).toBe(true);
    expect(body.service).toBe('Nimbus');
    expect(typeof body.version).toBe('string');
    expect(typeof body.uptime).toBe('number');
    expect(typeof body.now).toBe('string');
  });
});
