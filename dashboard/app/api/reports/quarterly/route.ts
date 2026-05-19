import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { loadQuarterly } from '@/lib/queries';
import { TOOL_LABELS, TYPE_LABELS } from '@/lib/labels';
import { quarterOf } from '@/lib/format';
import { csvCell, csvRow, safeFilename } from '@/lib/csv';
import { clientIp } from '@/lib/request';
import { auditLog } from '@/lib/audit';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return new Response('unauthorized', { status: 401 });

  const ip = clientIp(req);
  const userAgent = req.headers.get('user-agent') ?? undefined;

  if (user.role !== 'admin') {
    auditLog({
      type: 'access.denied',
      userId: user.id,
      orgId: user.orgId,
      ipAddress: ip,
      userAgent,
      details: { endpoint: 'reports/quarterly', reason: 'not_admin' },
    });
    return new Response('forbidden', { status: 403 });
  }

  const url = new URL(req.url);
  const cur = quarterOf(new Date());

  const rawYear = parseInt(url.searchParams.get('year') ?? String(cur.year), 10) || cur.year;
  const minYear = 2020;
  const maxYear = cur.year + 1;
  if (rawYear < minYear || rawYear > maxYear) {
    return new Response(`year must be between ${minYear} and ${maxYear}`, { status: 400 });
  }
  const year = rawYear;

  const rawQuarter = parseInt(url.searchParams.get('quarter') ?? String(cur.quarter), 10) || cur.quarter;
  if (rawQuarter < 1 || rawQuarter > 4) {
    return new Response('quarter must be 1, 2, 3, or 4', { status: 400 });
  }
  const quarter = rawQuarter;

  const format = url.searchParams.get('format') === 'json' ? 'json' : 'csv';

  const data = await loadQuarterly(user.orgId, year, quarter);

  auditLog({
    type: 'api.report.exported',
    userId: user.id,
    orgId: user.orgId,
    ipAddress: ip,
    userAgent,
    details: { year, quarter, format },
  });

  const filename = `promptguard_${safeFilename(user.org.name)}_Q${quarter}_${year}.${format}`;

  if (format === 'json') {
    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  }

  // Build CSV: a single document with multiple sections.
  const lines: string[] = [];
  lines.push(csvCell('PromptGuard rapport'));
  lines.push(csvRow(['Organisatie', user.org.name]));
  lines.push(csvRow(['Periode', `Q${quarter} ${year}`]));
  lines.push(csvRow(['Start', data.period.start.toISOString()]));
  lines.push(csvRow(['Eind', data.period.end.toISOString()]));
  lines.push(csvRow(['Totaal events', data.totals.events]));
  lines.push(csvRow(['Totaal items', data.totals.items]));
  lines.push('');

  lines.push(csvRow(['AI-tool', 'Events', 'Items', 'Kritiek', 'Gevoelig', 'Laag', 'Geblokkeerd', 'Gewaarschuwd', 'Geregistreerd']));
  for (const t of data.byTool) {
    lines.push(csvRow([
      TOOL_LABELS[t.tool] ?? t.tool,
      t.events, t.items, t.high, t.medium, t.low, t.blocked, t.warned, t.monitored,
    ]));
  }
  lines.push('');

  lines.push(csvRow(['Team', 'Events', 'Items', 'Kritiek', 'Gevoelig', 'Laag']));
  for (const t of data.byTeam) {
    lines.push(csvRow([t.name, t.events, t.items, t.high, t.medium, t.low]));
  }
  lines.push('');

  lines.push(csvRow(['Datatype', 'Items', 'Events']));
  for (const t of data.byType) {
    lines.push(csvRow([TYPE_LABELS[t.type] ?? t.type, t.total, t.events]));
  }
  lines.push('');

  // BOM for Excel compatibility with diacritics
  const body = '﻿' + lines.join('\n');
  return new Response(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
