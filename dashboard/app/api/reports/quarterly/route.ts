import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { loadQuarterly } from '@/lib/queries';
import { TOOL_LABELS, TYPE_LABELS } from '@/lib/labels';
import { quarterOf } from '@/lib/format';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return new Response('unauthorized', { status: 401 });

  const url = new URL(req.url);
  const cur = quarterOf(new Date());
  const year = parseInt(url.searchParams.get('year') ?? String(cur.year), 10) || cur.year;
  const quarter = Math.min(4, Math.max(1, parseInt(url.searchParams.get('quarter') ?? String(cur.quarter), 10) || cur.quarter));
  const format = url.searchParams.get('format') === 'json' ? 'json' : 'csv';

  const data = await loadQuarterly(user.orgId, year, quarter);
  const filename = `promptguard_${user.org.name.replace(/\s+/g, '_')}_Q${quarter}_${year}.${format}`;

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
  lines.push(`"PromptGuard rapport"`);
  lines.push(`"Organisatie","${csv(user.org.name)}"`);
  lines.push(`"Periode","Q${quarter} ${year}"`);
  lines.push(`"Start","${data.period.start.toISOString()}"`);
  lines.push(`"Eind","${data.period.end.toISOString()}"`);
  lines.push(`"Totaal events","${data.totals.events}"`);
  lines.push(`"Totaal items","${data.totals.items}"`);
  lines.push('');

  lines.push(`"AI-tool","Events","Items","Kritiek","Gevoelig","Laag","Geblokkeerd","Gewaarschuwd","Geregistreerd"`);
  for (const t of data.byTool) {
    lines.push([
      csv(TOOL_LABELS[t.tool] ?? t.tool),
      t.events, t.items, t.high, t.medium, t.low, t.blocked, t.warned, t.monitored,
    ].map((v) => `"${v}"`).join(','));
  }
  lines.push('');

  lines.push(`"Team","Events","Items","Kritiek","Gevoelig","Laag"`);
  for (const t of data.byTeam) {
    lines.push([csv(t.name), t.events, t.items, t.high, t.medium, t.low].map((v) => `"${v}"`).join(','));
  }
  lines.push('');

  lines.push(`"Datatype","Items","Events"`);
  for (const t of data.byType) {
    lines.push([csv(TYPE_LABELS[t.type] ?? t.type), t.total, t.events].map((v) => `"${v}"`).join(','));
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

function csv(s: string): string {
  return String(s).replace(/"/g, '""');
}
