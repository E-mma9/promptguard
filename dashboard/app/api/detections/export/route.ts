import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { loadDetections } from '@/lib/queries';
import { TOOL_LABELS, TYPE_LABELS, SEVERITY_LABELS, ACTION_LABELS } from '@/lib/labels';
import { fmtDateTime } from '@/lib/format';

function csv(s: string | number | null | undefined): string {
  // CSV/Excel formula-injection guard: prefix dangerous leading chars
  // with an apostrophe so spreadsheets treat the cell as text.
  const v = String(s ?? '').replace(/"/g, '""');
  if (v.length > 0 && /^[=+\-@\t\r]/.test(v)) return `'${v}`;
  return v;
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return new Response('unauthorized', { status: 401 });

  // Bulk export reveals raw detection-events for the entire org —
  // restrict to admin role to match the /api/reports/quarterly contract.
  if (user.role !== 'admin') {
    return new Response('forbidden — admin only', { status: 403 });
  }

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
  lines.push(
    [
      'Tijd',
      'Ernst',
      'Tool',
      'Team',
      'Items',
      'Soorten',
      'Actie',
    ]
      .map((h) => `"${h}"`)
      .join(',')
  );

  for (const r of rows) {
    const types = Object.entries(r.counts)
      .map(([k, v]) => `${v}x ${TYPE_LABELS[k] ?? k}`)
      .join('; ');

    lines.push(
      [
        csv(fmtDateTime(r.detectedAt)),
        csv(SEVERITY_LABELS[r.highest] ?? r.highest),
        csv(TOOL_LABELS[r.tool] ?? r.tool),
        csv(r.team?.name ?? ''),
        r.totalItems,
        csv(types),
        csv(ACTION_LABELS[r.action] ?? r.action),
      ]
        .map((v) => `"${v}"`)
        .join(',')
    );
  }

  // BOM for Excel compatibility with diacritics
  const body = '﻿' + lines.join('\n');
  const orgSlug = user.org.name.replace(/\s+/g, '_');
  const filename = `promptguard_detecties_${orgSlug}.csv`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
