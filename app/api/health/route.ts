// app/api/health/route.ts
//
// Liveness + version probe. Used by Vercel/Docker healthchecks, uptime
// monitors, and the deploy smoke tests.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VERSION = process.env.npm_package_version ?? '0.0.0';

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: 'Nimbus',
      version: VERSION,
      runtime: process.env.NEXT_RUNTIME ?? 'nodejs',
      uptime: process.uptime(),
      now: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
