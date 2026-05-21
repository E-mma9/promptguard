// Persistent fixed-window rate limiting.
//
// The previous implementation kept counters in a module-level Map. On Vercel
// every serverless invocation can hit a fresh instance, so that Map reset
// constantly and the limit was effectively unenforced — unacceptable for a
// security product. These helpers persist counters in Postgres/SQLite via the
// `RateLimit` model so the window holds across instances.
//
// All helpers FAIL OPEN: if the database is unavailable we never lock users
// out (availability over strictness — bcrypt + auth still gate login, and
// ingest must not drop telemetry because of a transient DB blip).

import { prisma } from './db';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

// failClosed: on a DB error, deny instead of allow. Use for the LOGIN path
// (brute-force throttle must not be disabled by a DB hiccup). Leave false
// for ingest/telemetry where availability outweighs strictness.
export interface RateLimitOpts {
  failClosed?: boolean;
}

// Opportunistically delete expired rows so the table can't grow unbounded
// from one-off keys (e.g. scanner IPs). Cheap: runs ~1% of calls.
async function maybePrune(now: Date): Promise<void> {
  if (Math.random() >= 0.01) return;
  try {
    await prisma.rateLimit.deleteMany({ where: { resetAt: { lt: now } } });
  } catch {
    /* best effort */
  }
}

// Increment the counter for `key` and report whether the request is allowed.
// Use for per-request limits (e.g. ingest throughput).
export async function consumeRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
  opts: RateLimitOpts = {}
): Promise<RateLimitResult> {
  const now = new Date();
  try {
    const row = await prisma.rateLimit.findUnique({ where: { key } });

    if (!row || row.resetAt <= now) {
      const resetAt = new Date(now.getTime() + windowMs);
      await prisma.rateLimit.upsert({
        where: { key },
        create: { key, count: 1, resetAt },
        update: { count: 1, resetAt },
      });
      void maybePrune(now);
      return { allowed: true, remaining: maxRequests - 1, resetAt: resetAt.getTime() };
    }

    if (row.count >= maxRequests) {
      return { allowed: false, remaining: 0, resetAt: row.resetAt.getTime() };
    }

    const updated = await prisma.rateLimit.update({
      where: { key },
      data: { count: { increment: 1 } },
    });
    return {
      allowed: true,
      remaining: Math.max(0, maxRequests - updated.count),
      resetAt: row.resetAt.getTime(),
    };
  } catch {
    if (opts.failClosed) {
      return { allowed: false, remaining: 0, resetAt: now.getTime() + windowMs };
    }
    // Fail open — never block traffic on a DB error.
    return { allowed: true, remaining: maxRequests, resetAt: now.getTime() + windowMs };
  }
}

// Read-only check: is `key` already over the limit? Does NOT increment, so a
// legitimate user pre-gated before authentication isn't penalized for it.
export async function isRateLimited(
  key: string,
  maxRequests: number,
  opts: RateLimitOpts = {}
): Promise<boolean> {
  try {
    const row = await prisma.rateLimit.findUnique({ where: { key } });
    if (!row) return false;
    if (row.resetAt <= new Date()) return false;
    return row.count >= maxRequests;
  } catch {
    return opts.failClosed ? true : false;
  }
}

// Record one strike against `key` (e.g. a failed login attempt), starting a
// fresh window if none is active.
export async function penalizeRateLimit(key: string, windowMs: number): Promise<void> {
  const now = new Date();
  try {
    const row = await prisma.rateLimit.findUnique({ where: { key } });
    if (!row || row.resetAt <= now) {
      const resetAt = new Date(now.getTime() + windowMs);
      await prisma.rateLimit.upsert({
        where: { key },
        create: { key, count: 1, resetAt },
        update: { count: 1, resetAt },
      });
      void maybePrune(now);
      return;
    }
    await prisma.rateLimit.update({ where: { key }, data: { count: { increment: 1 } } });
  } catch {
    /* fail open */
  }
}

// Clear the counter for `key` (e.g. on a successful login).
export async function resetRateLimit(key: string): Promise<void> {
  try {
    await prisma.rateLimit.deleteMany({ where: { key } });
  } catch {
    /* best effort */
  }
}
