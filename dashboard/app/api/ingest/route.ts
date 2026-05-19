import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { consumeRateLimit, isRateLimited, penalizeRateLimit } from '@/lib/ratelimit';
import { clientIp } from '@/lib/request';
import { auditLog } from '@/lib/audit';

const ALLOWED_TOOLS = new Set([
  'chatgpt', 'claude', 'gemini', 'copilot', 'mistral', 'perplexity', 'you', 'unknown',
]);
const ALLOWED_SEVERITIES = new Set(['high', 'medium', 'low']);
const ALLOWED_ACTIONS = new Set(['monitored', 'warned', 'blocked']);

// Per-org rate limit: 60 requests/minute, persisted across serverless instances.
const ORG_MAX_PER_MINUTE = 60;

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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '3600',
  };
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

type IngestEvent = {
  installId?: string;
  tool?: string;
  source?: string;
  team?: string;
  counts?: Record<string, number>;
  severityCounts?: Record<string, number>;
  total?: number;
  highest?: string;
  characterCount?: number;
  action?: string;
  detectedAt?: string;
};

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (!isAllowedOrigin(origin)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403, headers: corsHeaders });
  }

  // Brute-force protection on the UNAUTHENTICATED path: an attacker guessing
  // API keys is throttled by source IP before any key check happens, and every
  // failed attempt is audited. (Fail-open: telemetry availability outweighs
  // strictness here, and key entropy already makes guessing infeasible.)
  const ip = clientIp(req);
  const userAgent = req.headers.get('user-agent') ?? undefined;
  const authKey = `ingest-auth:${ip}`;
  if (await isRateLimited(authKey, 20)) {
    auditLog({ type: 'access.denied', ipAddress: ip, userAgent, details: { endpoint: 'ingest', reason: 'auth_rate_limited' } });
    return NextResponse.json({ error: 'too many attempts' }, { status: 429, headers: corsHeaders });
  }

  const org = await authenticateApiKey(req.headers.get('authorization'));
  if (!org) {
    await penalizeRateLimit(authKey, 15 * 60 * 1000);
    auditLog({ type: 'access.denied', ipAddress: ip, userAgent, details: { endpoint: 'ingest', reason: 'invalid_api_key' } });
    return NextResponse.json({ error: 'unauthorized' }, { status: 401, headers: corsHeaders });
  }

  const rl = await consumeRateLimit(`ingest:${org.id}`, ORG_MAX_PER_MINUTE, 60_000);
  if (!rl.allowed) {
    auditLog({ type: 'api.ingest.rate_limited', orgId: org.id, ipAddress: ip, userAgent });
    return NextResponse.json({ error: 'rate limit exceeded' }, { status: 429, headers: corsHeaders });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400, headers: corsHeaders });
  }

  const events = (body as { events?: IngestEvent[] })?.events;
  if (!Array.isArray(events) || events.length === 0) {
    return NextResponse.json({ error: 'no events' }, { status: 400, headers: corsHeaders });
  }
  if (events.length > 1000) {
    return NextResponse.json({ error: 'batch too large' }, { status: 413, headers: corsHeaders });
  }

  // Resolve teams in this org once. Use upsert to avoid races when two
  // batches reference the same fresh team.
  const teamSlugs = Array.from(
    new Set(
      events
        .map((e) => (typeof e.team === 'string' ? e.team.trim().toLowerCase() : ''))
        .filter((s) => s.length > 0 && /^[a-z0-9][a-z0-9-]{0,40}$/.test(s))
    )
  );
  const teamBySlug = new Map<string, { id: string }>();
  for (const slug of teamSlugs) {
    const team = await prisma.team.upsert({
      where: { orgId_slug: { orgId: org.id, slug } },
      update: {},
      create: { orgId: org.id, slug, name: titleCase(slug) },
      select: { id: true },
    });
    teamBySlug.set(slug, team);
  }

  const rows = events
    .map((e) => normaliseEvent(e, org.id, teamBySlug))
    .filter((r): r is NonNullable<typeof r> => r !== null);

  if (rows.length === 0) {
    return NextResponse.json({ error: 'no valid events', accepted: 0 }, { status: 400, headers: corsHeaders });
  }

  await prisma.detection.createMany({ data: rows });

  return NextResponse.json({ ok: true, accepted: rows.length }, { headers: corsHeaders });
}

function normaliseEvent(
  e: IngestEvent,
  orgId: string,
  teamBySlug: Map<string, { id: string }>
) {
  const tool = typeof e.tool === 'string' && ALLOWED_TOOLS.has(e.tool) ? e.tool : 'unknown';
  const source = e.source === 'paste' || e.source === 'submit' ? e.source : 'paste';
  const action = typeof e.action === 'string' && ALLOWED_ACTIONS.has(e.action) ? e.action : 'monitored';
  const highest = typeof e.highest === 'string' && ALLOWED_SEVERITIES.has(e.highest) ? e.highest : 'low';
  const totalItems = Number.isFinite(e.total) ? Math.max(0, Math.floor(e.total as number)) : 0;
  if (totalItems === 0) return null;

  const characterCount = Number.isFinite(e.characterCount)
    ? Math.max(0, Math.floor(e.characterCount as number))
    : 0;

  // Sanitise counts: keep only numeric values for known + unknown type ids,
  // capped to a sensible max to prevent abuse.
  const counts: Record<string, number> = {};
  if (e.counts && typeof e.counts === 'object') {
    for (const [k, v] of Object.entries(e.counts)) {
      if (typeof v === 'number' && Number.isFinite(v) && v > 0 && /^[a-z0-9_-]{1,40}$/.test(k)) {
        counts[k] = Math.min(Math.floor(v), 10_000);
      }
    }
  }

  const severityCounts: Record<string, number> = { high: 0, medium: 0, low: 0 };
  if (e.severityCounts && typeof e.severityCounts === 'object') {
    for (const k of ['high', 'medium', 'low']) {
      const v = (e.severityCounts as Record<string, unknown>)[k];
      if (typeof v === 'number' && Number.isFinite(v) && v >= 0) {
        severityCounts[k] = Math.min(Math.floor(v), 10_000);
      }
    }
  }

  let detectedAt: Date | undefined;
  if (typeof e.detectedAt === 'string') {
    const t = new Date(e.detectedAt);
    // Allow up to 5 seconds in the future to accommodate clock skew
    if (!Number.isNaN(t.getTime()) && t.getTime() < Date.now() + 5_000) {
      detectedAt = t;
    }
  }

  const installId =
    typeof e.installId === 'string' && /^[a-f0-9]{32,128}$/.test(e.installId)
      ? e.installId
      : 'anon';

  // Validate slug against already-lowercased value
  const teamSlug = typeof e.team === 'string' ? e.team.trim().toLowerCase() : '';
  const teamId = teamSlug && /^[a-z0-9][a-z0-9-]{0,40}$/.test(teamSlug)
    ? teamBySlug.get(teamSlug)?.id ?? null
    : null;

  return {
    orgId,
    teamId,
    installId,
    tool,
    source,
    action,
    counts: JSON.stringify(counts),
    severityCounts: JSON.stringify(severityCounts),
    totalItems,
    highest,
    characterCount,
    ...(detectedAt ? { detectedAt } : {}),
  };
}

function titleCase(s: string) {
  return s
    .split(/[-_\s]+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
    .join(' ');
}
