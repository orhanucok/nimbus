// app/api/v1/chat/route.ts
//
// Public REST endpoint: POST /api/v1/chat
// Auth: `Authorization: Bearer nmb_xxxxxxxx_secret...`
// Body:
//   {
//     "messages": [{ "role": "user"|"assistant"|"system", "content": "..." }],
//     "providerId": "deepseek"|"openai"|...|"custom",  (optional, defaults to env)
//     "temperature": number,                              (optional)
//     "maxTokens":   number,                              (optional)
//     "stream":      boolean                              (default true)
//   }
//
// Response (when stream=true): Server-Sent Events, `data: {...}\n\n` lines.
// Response (when stream=false): JSON `{ id, content, provider, model }`.
//
// v1.24.0 — first public API endpoint. The browser UI keeps using
// /api/chat (no auth) because it is on the same origin.

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createRequestBody } from '@/types/chat';
import { getProviderConfig } from '@/app/config';
import {
  parseBearer,
  isApiKey,
  loadApiKeys,
  findActiveKey,
} from '@/lib/apiAuth';

export const runtime = 'edge';

const COOKIE_NAME = 'nimbus-provider';

interface ChatBody {
  messages?: Array<{ role?: string; content?: string }>;
  providerId?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

function unauthorized(message: string) {
  return NextResponse.json({ error: message }, { status: 401 });
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  // 1. Auth via Bearer
  const bearer = parseBearer(request.headers.get('authorization'));
  if (!bearer || !isApiKey(bearer)) {
    return unauthorized('Missing or malformed Authorization: Bearer nmb_… token');
  }

  // We can't read localStorage from the Edge runtime; in this single-user
  // browser-hosted mode, the same browser is both UI client and API server.
  // For a real multi-user backend, swap `loadApiKeys` for a DB lookup. The
  // `findActiveKey` helper centralises that contract.
  const keys = loadApiKeys();
  const matched = findActiveKey(keys, bearer);
  if (!matched) {
    return unauthorized('Invalid or revoked API key');
  }

  // 2. Body validation
  let body: ChatBody;
  try {
    body = (await request.json()) as ChatBody;
  } catch {
    return badRequest('Body must be JSON');
  }
  const rawMessages = Array.isArray(body.messages) ? body.messages : [];
  const messages = rawMessages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant' || m.role === 'system'))
    .map((m) => ({ role: m.role as 'user' | 'assistant' | 'system', content: String(m.content ?? '') }));
  if (messages.length === 0) {
    return badRequest('At least one message is required');
  }

  const stream = body.stream !== false;

  // 3. Provider resolution (body.providerId overrides cookie/env)
  const cookieStore = cookies();
  const providerFromCookie = cookieStore.get(COOKIE_NAME)?.value;
  const providerId = body.providerId || providerFromCookie;
  let runtime = getProviderConfig(providerId, 'chat');

  // 4. Custom provider header (X-Nimbus-Custom-Provider) — same contract as /api/chat
  if (providerId === 'custom') {
    const raw = request.headers.get('x-nimbus-custom-provider');
    if (raw) {
      try {
        const json = decodeURIComponent(escape(atob(raw)));
        const parsed = JSON.parse(json) as {
          baseURL?: unknown;
          model?: unknown;
          apiKey?: unknown;
        };
        if (typeof parsed.baseURL === 'string' && typeof parsed.model === 'string') {
          runtime = {
            BaseURL: parsed.baseURL.replace(/\/+$/, ''),
            API_KEY:
              typeof parsed.apiKey === 'string' && parsed.apiKey
                ? parsed.apiKey
                : 'custom',
            Model: parsed.model,
          };
        }
      } catch (e) {
        console.warn('v1 chat: bad custom header', e);
      }
    }
  }

  const requestBody = createRequestBody(messages, {
    temperature: typeof body.temperature === 'number' ? body.temperature : 0.7,
    maxTokens: typeof body.maxTokens === 'number' ? body.maxTokens : 2048,
  });

  let upstream: Response;
  try {
    upstream = await fetch(`${runtime.BaseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${runtime.API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });
  } catch (e) {
    console.error('v1 chat upstream error', e);
    return NextResponse.json({ error: 'Upstream provider unreachable' }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => '');
    return NextResponse.json(
      { error: `Provider error ${upstream.status}`, detail: text.slice(0, 500) },
      { status: upstream.status }
    );
  }

  if (!stream) {
    // Non-streaming: aggregate upstream and return as JSON.
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let content = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      for (const line of chunk.split('\n')) {
        const t = line.trim();
        if (!t.startsWith('data:')) continue;
        const payload = t.slice(5).trim();
        if (payload === '[DONE]') continue;
        try {
          const parsed = JSON.parse(payload) as {
            choices?: Array<{ delta?: { content?: string } }>;
          };
          const piece = parsed.choices?.[0]?.delta?.content ?? '';
          if (piece) content += piece;
        } catch {
          // skip non-JSON lines
        }
      }
    }
    return NextResponse.json({
      id: `v1-${Date.now().toString(36)}`,
      provider: providerId,
      model: runtime.Model,
      content,
    });
  }

  // Streaming SSE — pass through.
  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Nimbus-Key-Id': matched.id,
      'X-Nimbus-Provider': providerId ?? 'default',
      'X-Nimbus-Model': runtime.Model,
    },
  });
}

export async function GET() {
  return NextResponse.json({
    name: 'Nimbus Chat',
    version: 'v1',
    auth: 'Authorization: Bearer nmb_…',
    docs: 'POST this endpoint with { messages, providerId?, stream? }',
  });
}
