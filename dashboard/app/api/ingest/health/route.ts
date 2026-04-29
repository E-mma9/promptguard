import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey } from '@/lib/auth';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Max-Age': '86400',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const org = await authenticateApiKey(req.headers.get('authorization'));
  if (!org) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }
  return NextResponse.json(
    { ok: true, organization: org.name, serverTime: new Date().toISOString() },
    { headers: CORS_HEADERS }
  );
}
