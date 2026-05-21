import { NextRequest } from 'next/server';

// Trusted client IP for rate-limiting / audit.
//
// `x-forwarded-for` is partly client-controlled: an attacker can prepend
// arbitrary values, so the LEFT-most entry is NOT trustworthy. On Vercel the
// platform sets `x-real-ip` to the true connecting IP (not influenced by a
// client header) and appends the real IP as the right-most XFF entry. We
// therefore prefer `x-real-ip`, then the right-most XFF hop, never the first.
export function clientIp(req: NextRequest): string {
  const realIp = req.headers.get('x-real-ip');
  if (realIp && realIp.trim()) return realIp.trim();

  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const parts = xff.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return 'unknown';
}
