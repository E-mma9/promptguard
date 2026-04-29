import { requireUser } from '@/lib/auth';
import { loadByType } from '@/lib/queries';
import { fmtNum } from '@/lib/format';
import { TYPE_LABELS, TYPE_SEVERITY, TOOL_LABELS } from '@/lib/labels';
import { PageHeader } from '@/components/PageHeader';
import { SeverityPill } from '@/components/SeverityPill';

export const dynamic = 'force-dynamic';

export default async function TypesPage() {
  const user = await requireUser();
  const types = await loadByType(user.orgId);
  const max = types[0]?.total ?? 1;

  return (
    <div>
      <PageHeader
        title="Datatypes"
        description="Welke soorten gevoelige data verlaten uw bedrijf via AI-tools?"
      />
      <div className="px-8 py-7">
        <div className="pg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-ink-50/50 border-b border-ink-100">
                <th className="px-4 py-3 pg-section-label">Datatype</th>
                <th className="px-4 py-3 pg-section-label">Ernst</th>
                <th className="px-4 py-3 pg-section-label">Items</th>
                <th className="px-4 py-3 pg-section-label">Events</th>
                <th className="px-4 py-3 pg-section-label">Top tools</th>
                <th className="px-4 py-3 pg-section-label w-[28%]">Aandeel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {types.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-ink-500">
                    Nog geen datatype-statistieken.
                  </td>
                </tr>
              )}
              {types.map((t) => {
                const pct = Math.max(2, Math.round((t.total / max) * 100));
                const sev = TYPE_SEVERITY[t.type] ?? 'low';
                const tools = Object.entries(t.byTool)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([k, v]) => `${v}× ${TOOL_LABELS[k] ?? k}`)
                  .join(', ');
                return (
                  <tr key={t.type} className="hover:bg-ink-50/40">
                    <td className="px-4 py-3 font-semibold text-ink-900">{TYPE_LABELS[t.type] ?? t.type}</td>
                    <td className="px-4 py-3"><SeverityPill severity={sev} /></td>
                    <td className="px-4 py-3 pg-num font-semibold text-ink-900">{fmtNum(t.total)}</td>
                    <td className="px-4 py-3 pg-num text-ink-700">{fmtNum(t.events)}</td>
                    <td className="px-4 py-3 text-ink-600 text-[12.5px] truncate max-w-xs">{tools || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                        <div
                          className={
                            'h-full rounded-full ' +
                            (sev === 'high' ? 'bg-sev-high' : sev === 'medium' ? 'bg-sev-medium' : 'bg-sev-low')
                          }
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
