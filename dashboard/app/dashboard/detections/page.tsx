import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { loadDetections } from '@/lib/queries';
import { fmtDateTime, fmtNum } from '@/lib/format';
import { TYPE_LABELS, TOOL_LABELS } from '@/lib/labels';
import { PageHeader } from '@/components/PageHeader';
import { SeverityPill, ToolBadge, ActionPill } from '@/components/SeverityPill';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 50;

export default async function DetectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tool?: string; severity?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
  const tool = params.tool;
  const severity = params.severity;

  const { rows, total } = await loadDetections(user.orgId, {
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
    tool: tool || undefined,
    severity: severity || undefined,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <PageHeader
        title="Detecties"
        description={`${fmtNum(total)} events geregistreerd. Filter op tool en ernst.`}
      />

      <div className="px-8 py-7 space-y-4">
        <FilterBar tool={tool} severity={severity} />

        <div className="pg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-ink-50/50 border-b border-ink-100">
                <th className="px-4 py-3 pg-section-label">Tijd</th>
                <th className="px-4 py-3 pg-section-label">Ernst</th>
                <th className="px-4 py-3 pg-section-label">Tool</th>
                <th className="px-4 py-3 pg-section-label">Team</th>
                <th className="px-4 py-3 pg-section-label">Items</th>
                <th className="px-4 py-3 pg-section-label">Soorten</th>
                <th className="px-4 py-3 pg-section-label">Actie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-ink-500">
                    Geen detecties gevonden in dit venster.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-ink-50/40">
                  <td className="px-4 py-3 text-ink-700 pg-num text-[12.5px] whitespace-nowrap">
                    {fmtDateTime(r.detectedAt)}
                  </td>
                  <td className="px-4 py-3"><SeverityPill severity={r.highest} /></td>
                  <td className="px-4 py-3"><ToolBadge tool={r.tool} /></td>
                  <td className="px-4 py-3 text-ink-700">{r.team?.name ?? <span className="text-ink-400">—</span>}</td>
                  <td className="px-4 py-3 font-semibold pg-num text-ink-900">{fmtNum(r.totalItems)}</td>
                  <td className="px-4 py-3 text-ink-600 max-w-md truncate">
                    {Object.entries(r.counts)
                      .map(([k, v]) => `${v}× ${TYPE_LABELS[k] ?? k}`)
                      .join(', ')}
                  </td>
                  <td className="px-4 py-3"><ActionPill action={r.action} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm">
            <div className="text-ink-500">
              Pagina <span className="pg-num font-semibold text-ink-900">{page}</span> van{' '}
              <span className="pg-num font-semibold text-ink-900">{totalPages}</span>
            </div>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={buildUrl({ page: String(page - 1), tool, severity })}
                  className="pg-button-secondary"
                >
                  Vorige
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={buildUrl({ page: String(page + 1), tool, severity })}
                  className="pg-button-secondary"
                >
                  Volgende
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterBar({ tool, severity }: { tool?: string; severity?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <FilterGroup label="Tool" current={tool} options={[
        { value: '', label: 'Alle' },
        { value: 'chatgpt', label: 'ChatGPT' },
        { value: 'claude', label: 'Claude' },
        { value: 'gemini', label: 'Gemini' },
        { value: 'copilot', label: 'Copilot' },
        { value: 'mistral', label: 'Mistral' },
        { value: 'perplexity', label: 'Perplexity' },
      ]} param="tool" otherParam="severity" otherValue={severity} />
      <FilterGroup label="Ernst" current={severity} options={[
        { value: '', label: 'Alle' },
        { value: 'high', label: 'Kritiek' },
        { value: 'medium', label: 'Gevoelig' },
        { value: 'low', label: 'Laag' },
      ]} param="severity" otherParam="tool" otherValue={tool} />
    </div>
  );
}

function FilterGroup({
  label,
  current,
  options,
  param,
  otherParam,
  otherValue,
}: {
  label: string;
  current?: string;
  options: { value: string; label: string }[];
  param: string;
  otherParam: string;
  otherValue?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="pg-section-label">{label}</span>
      <div className="flex gap-1 bg-ink-100 rounded-lg p-0.5">
        {options.map((o) => {
          const active = (current ?? '') === o.value;
          const params: Record<string, string> = {};
          if (o.value) params[param] = o.value;
          if (otherValue) params[otherParam] = otherValue;
          return (
            <Link
              key={o.value || 'all'}
              href={buildUrl(params)}
              className={
                'px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ' +
                (active ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-600 hover:text-ink-900')
              }
            >
              {o.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function buildUrl(params: Record<string, string | undefined>): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) usp.set(k, v);
  }
  const qs = usp.toString();
  return '/dashboard/detections' + (qs ? `?${qs}` : '');
}
