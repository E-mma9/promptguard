import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, createSession, setSessionCookie } from '@/lib/auth';

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'unknown';

  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (entry) {
    if (now < entry.resetAt) {
      if (entry.count >= RATE_LIMIT_MAX) {
        return NextResponse.json(
          { error: 'Te veel pogingen, probeer het over 15 minuten opnieuw' },
          { status: 429 }
        );
      }
    } else {
      // Window has expired, reset
      loginAttempts.delete(ip);
    }
  }

  const body = await req.json().catch(() => null) as { email?: string; password?: string } | null;
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? '';
  if (!email || !password) {
    return NextResponse.json({ error: 'missing credentials' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Increment attempt counter on failed login
    const current = loginAttempts.get(ip);
    if (current && now < current.resetAt) {
      current.count += 1;
    } else {
      loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    }
    return NextResponse.json({ error: 'invalid credentials' }, { status: 401 });
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    // Increment attempt counter on failed login
    const current = loginAttempts.get(ip);
    if (current && now < current.resetAt) {
      current.count += 1;
    } else {
      loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    }
    return NextResponse.json({ error: 'invalid credentials' }, { status: 401 });
  }

  // Successful login — clear rate limit counter for this IP
  loginAttempts.delete(ip);

  const token = await createSession(user.id);
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
