import { prisma } from './db';
import { quarterRange } from './format';

type WindowSpec = { from: Date; to: Date };

export function defaultWindow(days = 30): WindowSpec {
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
  return { from, to };
}

function parseCounts(s: string): Record<string, number> {
  try {
    const v = JSON.parse(s);
    return v && typeof v === 'object' ? v : {};
  } catch {
    return {};
  }
}

export async function loadOverview(orgId: string, windowSpec: WindowSpec = defaultWindow(30)) {
  const { from, to } = windowSpec;

  const [eventCount, items, severityRows, toolRows, teamRows, typeAggregate, recent, dailySeries] = await Promise.all([
    prisma.detection.count({ where: { orgId, detectedAt: { gte: from, lte: to } } }),

    prisma.detection.aggregate({
      where: { orgId, detectedAt: { gte: from, lte: to } },
      _sum: { totalItems: true, characterCount: true },
    }),

    prisma.detection.groupBy({
      by: ['highest'],
      where: { orgId, detectedAt: { gte: from, lte: to } },
      _count: { _all: true },
      _sum: { totalItems: true },
    }),

    prisma.detection.groupBy({
      by: ['tool'],
      where: { orgId, detectedAt: { gte: from, lte: to } },
      _count: { _all: true },
      _sum: { totalItems: true },
      orderBy: { _count: { id: 'desc' } },
    }),

    prisma.detection.groupBy({
      by: ['teamId'],
      where: { orgId, detectedAt: { gte: from, lte: to } },
      _count: { _all: true },
      _sum: { totalItems: true },
    }),

    // For top data types we need to parse the counts JSON; do it in JS.
    prisma.detection.findMany({
      where: { orgId, detectedAt: { gte: from, lte: to } },
      select: { counts: true, severityCounts: true, detectedAt: true },
    }),

    prisma.detection.findMany({
      where: { orgId },
      orderBy: { detectedAt: 'desc' },
      take: 12,
      include: { team: { select: { name: true, slug: true } } },
    }),

    prisma.detection.findMany({
      where: { orgId, detectedAt: { gte: from, lte: to } },
      select: { detectedAt: true, totalItems: true, highest: true },
    }),
  ]);

  // Build per-type totals from typeAggregate
  const typeTotals: Record<string, number> = {};
  for (const row of typeAggregate) {
    const c = parseCounts(row.counts);
    for (const [k, v] of Object.entries(c)) {
      typeTotals[k] = (typeTotals[k] ?? 0) + (typeof v === 'number' ? v : 0);
    }
  }
  const topTypes = Object.entries(typeTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([type, total]) => ({ type, total }));

  const teams = await prisma.team.findMany({ where: { orgId } });
  const teamMap = new Map(teams.map((t) => [t.id, t]));
  const byTeam = teamRows
    .map((r) => ({
      id: r.teamId,
      name: r.teamId ? teamMap.get(r.teamId)?.name ?? 'Onbekend' : 'Geen team',
      events: r._count._all,
      items: r._sum.totalItems ?? 0,
    }))
    .sort((a, b) => b.items - a.items);

  // Build daily timeseries (events count + sums per severity)
  const days = Math.ceil((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
  const buckets = new Map<string, { day: string; total: number; high: number; medium: number; low: number }>();
  for (let i = 0; i <= days; i++) {
    const d = new Date(from.getTime() + i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, { day: key, total: 0, high: 0, medium: 0, low: 0 });
  }
  for (const r of dailySeries) {
    const key = r.detectedAt.toISOString().slice(0, 10);
    const b = buckets.get(key);
    if (!b) continue;
    b.total += 1;
    if (r.highest === 'high') b.high += r.totalItems;
    else if (r.highest === 'medium') b.medium += r.totalItems;
    else b.low += r.totalItems;
  }
  const series = Array.from(buckets.values());

  const severityTotals = { high: 0, medium: 0, low: 0 };
  for (const row of severityRows) {
    if (row.highest === 'high' || row.highest === 'medium' || row.highest === 'low') {
      severityTotals[row.highest as 'high' | 'medium' | 'low'] = row._count._all;
    }
  }

  const mostExposedTeam = byTeam[0] ?? null;

  return {
    eventCount,
    totalItems: items._sum.totalItems ?? 0,
    totalCharacters: items._sum.characterCount ?? 0,
    severityTotals,
    byTool: toolRows.map((r) => ({ tool: r.tool, events: r._count._all, items: r._sum.totalItems ?? 0 })),
    byTeam,
    topTypes,
    mostExposedTeam,
    recent: recent.map((r) => ({
      id: r.id,
      tool: r.tool,
      action: r.action,
      highest: r.highest,
      totalItems: r.totalItems,
      counts: parseCounts(r.counts),
      detectedAt: r.detectedAt,
      teamName: r.team?.name ?? null,
    })),
    series,
    window: { from, to },
  };
}

export async function loadDetections(orgId: string, opts: { take?: number; skip?: number; tool?: string; severity?: string } = {}) {
  const where: Record<string, unknown> = { orgId };
  if (opts.tool) where.tool = opts.tool;
  if (opts.severity) where.highest = opts.severity;

  const [rows, total] = await Promise.all([
    prisma.detection.findMany({
      where,
      orderBy: { detectedAt: 'desc' },
      take: opts.take ?? 50,
      skip: opts.skip ?? 0,
      include: { team: { select: { name: true, slug: true } } },
    }),
    prisma.detection.count({ where }),
  ]);

  return {
    rows: rows.map((r) => ({
      ...r,
      counts: parseCounts(r.counts),
      severityCounts: parseCounts(r.severityCounts),
    })),
    total,
  };
}

export async function loadByTeam(orgId: string, windowSpec: WindowSpec = defaultWindow(30)) {
  const teams = await prisma.team.findMany({ where: { orgId } });
  const detections = await prisma.detection.findMany({
    where: { orgId, detectedAt: { gte: windowSpec.from, lte: windowSpec.to } },
    select: { teamId: true, tool: true, totalItems: true, highest: true, counts: true },
  });

  const map = new Map<string | null, {
    id: string | null;
    name: string;
    slug: string | null;
    events: number;
    items: number;
    high: number;
    medium: number;
    low: number;
    byTool: Record<string, number>;
    topTypes: Record<string, number>;
  }>();

  const init = (id: string | null, name: string, slug: string | null) => ({
    id, name, slug, events: 0, items: 0, high: 0, medium: 0, low: 0,
    byTool: {} as Record<string, number>,
    topTypes: {} as Record<string, number>,
  });

  map.set(null, init(null, 'Geen team', null));
  for (const t of teams) map.set(t.id, init(t.id, t.name, t.slug));

  for (const d of detections) {
    const bucket = map.get(d.teamId) ?? init(d.teamId, 'Onbekend', null);
    bucket.events += 1;
    bucket.items += d.totalItems;
    if (d.highest === 'high') bucket.high += d.totalItems;
    else if (d.highest === 'medium') bucket.medium += d.totalItems;
    else bucket.low += d.totalItems;
    bucket.byTool[d.tool] = (bucket.byTool[d.tool] ?? 0) + 1;
    const counts = parseCounts(d.counts);
    for (const [k, v] of Object.entries(counts)) {
      bucket.topTypes[k] = (bucket.topTypes[k] ?? 0) + (typeof v === 'number' ? v : 0);
    }
    map.set(d.teamId, bucket);
  }

  return Array.from(map.values()).sort((a, b) => b.items - a.items);
}

export async function loadByTool(orgId: string, windowSpec: WindowSpec = defaultWindow(30)) {
  const detections = await prisma.detection.findMany({
    where: { orgId, detectedAt: { gte: windowSpec.from, lte: windowSpec.to } },
    select: { tool: true, totalItems: true, highest: true, counts: true, action: true },
  });

  const map = new Map<string, {
    tool: string;
    events: number;
    items: number;
    high: number;
    medium: number;
    low: number;
    blocked: number;
    warned: number;
    monitored: number;
    topTypes: Record<string, number>;
  }>();

  for (const d of detections) {
    const b = map.get(d.tool) ?? {
      tool: d.tool, events: 0, items: 0, high: 0, medium: 0, low: 0,
      blocked: 0, warned: 0, monitored: 0, topTypes: {},
    };
    b.events += 1;
    b.items += d.totalItems;
    if (d.highest === 'high') b.high += d.totalItems;
    else if (d.highest === 'medium') b.medium += d.totalItems;
    else b.low += d.totalItems;
    if (d.action === 'blocked') b.blocked += 1;
    else if (d.action === 'warned') b.warned += 1;
    else b.monitored += 1;
    const counts = parseCounts(d.counts);
    for (const [k, v] of Object.entries(counts)) {
      b.topTypes[k] = (b.topTypes[k] ?? 0) + (typeof v === 'number' ? v : 0);
    }
    map.set(d.tool, b);
  }

  return Array.from(map.values()).sort((a, b) => b.items - a.items);
}

export async function loadByType(orgId: string, windowSpec: WindowSpec = defaultWindow(30)) {
  const detections = await prisma.detection.findMany({
    where: { orgId, detectedAt: { gte: windowSpec.from, lte: windowSpec.to } },
    select: { counts: true, tool: true },
  });

  const map = new Map<string, { type: string; total: number; events: number; byTool: Record<string, number> }>();
  for (const d of detections) {
    const counts = parseCounts(d.counts);
    for (const [k, v] of Object.entries(counts)) {
      const b = map.get(k) ?? { type: k, total: 0, events: 0, byTool: {} };
      b.total += typeof v === 'number' ? v : 0;
      b.events += 1;
      b.byTool[d.tool] = (b.byTool[d.tool] ?? 0) + 1;
      map.set(k, b);
    }
  }

  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

export async function loadQuarterly(orgId: string, year: number, quarter: number) {
  const { start, end } = quarterRange(year, quarter);

  const [byTool, byTeam, byType, total] = await Promise.all([
    loadByTool(orgId, { from: start, to: end }),
    loadByTeam(orgId, { from: start, to: end }),
    loadByType(orgId, { from: start, to: end }),
    prisma.detection.aggregate({
      where: { orgId, detectedAt: { gte: start, lte: end } },
      _count: { _all: true },
      _sum: { totalItems: true },
    }),
  ]);

  return {
    period: { year, quarter, start, end },
    totals: {
      events: total._count._all,
      items: total._sum.totalItems ?? 0,
    },
    byTool,
    byTeam,
    byType,
  };
}
