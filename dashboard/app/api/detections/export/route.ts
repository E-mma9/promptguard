import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { loadDetections } from '@/lib/queries';
import { TOOL_LABELS, TYPE_LABELS, SEVERITY_LABELS, ACTION_LABELS } from '@/lib/labels';
import { fmtDateTime } from '@/lib/format';
import { csvRow, safeFilename } from '@/lib/csv';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return new Response('unauthorized', { status: 401 });

  const url = new URL(req.url);
  const tool = url.searchParams.get('tool') || undefined;
  const severity = url.searchParams.get('severity') || undefined;

  // Fetch up to 5000 rows for export
  const { rows } = await loadDetections(user.orgId, {
    take: 5000,
    skip: 0,
    tool,
    severity,
  });

  const lines: string[] = [];
  lines.push(csvRow(['Tijd', 'Ernst', 'Tool', 'Team', 'Items', 'Soorten', 'Actie']));

  for (const r of rows) {
    const types = Object.entries(r.counts)
      .map(([k, v]) => `${v}x ${TYPE_LABELS[k] ?? k}`)
      .join('; ');

    lines.push(
      csvRow([
        fmtDateTime(r.detectedAt),
        SEVERITY_LABELS[r.highest] ?? r.highest,
        TOOL_LABELS[r.tool] ?? r.tool,
        r.team?.name ?? '',
        r.totalItems,
        types,
        ACTION_LABELS[r.action] ?? r.action,
      ])
    );
  }

  // BOM for Excel compatibility with diacritics
  const body = '﻿' + lines.join('\n');
  const filename = `promptguard_detecties_${safeFilename(user.org.name)}.csv`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
