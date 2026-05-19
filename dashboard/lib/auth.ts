import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from './db';

const COOKIE_NAME = 'pg_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours — appropriate for a security monitoring dashboard

function secret(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error('SESSION_SECRET must be set to a 32+ character random string');
  }
  return new TextEncoder().encode(s);
}

export async function hashPassword(plain: string): Promise<string> {
  // Cost 12 (matches the README security claim). bcrypt.compare reads the cost
  // from the stored hash, so existing cost-10 hashes keep verifying.
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function createSession(userId: string): Promise<string> {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secret());
  return token;
}

// Whether the session cookie gets the Secure flag.
//
// Default: on in production, off in development. A Secure cookie is rejected
// by browsers over plain HTTP, so a self-hosted LAN deployment served over
// http:// MUST set SESSION_COOKIE_SECURE=false (otherwise login silently never
// persists). When the deployment moves behind HTTPS (e.g. Caddy on Hetzner),
// set it to true / unset it.
function cookieSecure(): boolean {
  const override = process.env.SESSION_COOKIE_SECURE;
  if (override === 'true') return true;
  if (override === 'false') return false;
  return process.env.NODE_ENV === 'production';
}

export async function setSessionCookie(token: string) {
  const c = await cookies();
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: 'strict', // strict prevents the cookie from being sent on any cross-site request (stronger CSRF protection than 'lax')
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

export async function readSession(): Promise<{ userId: string } | null> {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.sub !== 'string') return null;
    return { userId: payload.sub };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await readSession();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    include: { org: true },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHENTICATED');
  }
  return user;
}

// API-key auth for the extension. Returns the org or null.
export async function authenticateApiKey(authHeader: string | null) {
  if (!authHeader) return null;
  const match = /^Bearer\s+(.+)$/i.exec(authHeader);
  if (!match) return null;
  const apiKey = match[1].trim();
  if (!apiKey) return null;
  const org = await prisma.organization.findUnique({ where: { apiKey } });
  return org;
}

export function generateApiKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const b64 = Buffer.from(bytes).toString('base64url');
  return `pg_live_${b64}`;
}
