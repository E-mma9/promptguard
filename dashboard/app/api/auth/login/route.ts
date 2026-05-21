import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, createSession, setSessionCookie } from '@/lib/auth';
import { isRateLimited, penalizeRateLimit, resetRateLimit } from '@/lib/ratelimit';
import { clientIp } from '@/lib/request';
import { auditLog } from '@/lib/audit';

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const userAgent = req.headers.get('user-agent') ?? undefined;
  const rlKey = `login:${ip}`;

  // Fail CLOSED: a DB error must not silently disable brute-force throttling
  // on the authentication path.
  if (await isRateLimited(rlKey, RATE_LIMIT_MAX, { failClosed: true })) {
    auditLog({ type: 'auth.login.rate_limited', ipAddress: ip, userAgent });
    return NextResponse.json(
      { error: 'Te veel pogingen, probeer het over 15 minuten opnieuw' },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null) as { email?: string; password?: string } | null;
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? '';
  if (!email || !password) {
    return NextResponse.json({ error: 'missing credentials' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    await penalizeRateLimit(rlKey, RATE_LIMIT_WINDOW_MS);
    auditLog({ type: 'auth.login.failed', email, ipAddress: ip, userAgent, details: { reason: 'no_such_user' } });
    return NextResponse.json({ error: 'invalid credentials' }, { status: 401 });
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    await penalizeRateLimit(rlKey, RATE_LIMIT_WINDOW_MS);
    auditLog({ type: 'auth.login.failed', email, userId: user.id, orgId: user.orgId, ipAddress: ip, userAgent, details: { reason: 'bad_password' } });
    return NextResponse.json({ error: 'invalid credentials' }, { status: 401 });
  }

  // Successful login — clear the rate-limit counter for this IP.
  await resetRateLimit(rlKey);
  auditLog({ type: 'auth.login.success', email, userId: user.id, orgId: user.orgId, ipAddress: ip, userAgent });

  const token = await createSession(user.id);
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
