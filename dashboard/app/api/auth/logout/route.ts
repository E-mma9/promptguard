import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie, getCurrentUser } from '@/lib/auth';
import { clientIp } from '@/lib/request';
import { auditLog } from '@/lib/audit';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  await clearSessionCookie();
  auditLog({
    type: 'auth.logout',
    userId: user?.id,
    orgId: user?.orgId,
    email: user?.email,
    ipAddress: clientIp(req),
    userAgent: req.headers.get('user-agent') ?? undefined,
  });
  return NextResponse.json({ ok: true });
}
