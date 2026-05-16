import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey } from '@/lib/auth';

// CORS: only allow browser extensions and explicitly configured origins.
// Extension background scripts send no origin header at all; content scripts
// send chrome-extension:// or moz-extension:// origins.
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // Extension background scripts have no origin
  if (origin.startsWith('chrome-extension://')) return true;
  if (origin.startsWith('moz-extension://')) return true;
  return ALLOWED_ORIGINS.includes(origin);
}

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowed = isAllowedOrigin(origin);
  return {
    'Access-Control-Allow-Origin': allowed && origin ? origin : 'null',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '3600',
  };
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (!isAllowedOrigin(origin)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403, headers: corsHeaders });
  }

  const org = await authenticateApiKey(req.headers.get('authorization'));
  if (!org) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401, headers: corsHeaders });
  }
  return NextResponse.json(
    { ok: true, organization: org.name, serverTime: new Date().toISOString() },
    { headers: corsHeaders }
  );
}
