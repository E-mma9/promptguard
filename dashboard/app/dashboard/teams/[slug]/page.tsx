import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { loadTeamDetail } from '@/lib/queries';
import { fmtNum, fmtDateTime } from '@/lib/format';
import { TYPE_LABELS, TOOL_LABELS, SEVERITY_LABELS, ACTION_LABELS } from '@/lib/labels';
import { PageHeader } from '@/components/PageHeader';

export const dynamic = 'force-dynamic';

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireUser();
  const data = await loadTeamDetail(user.orgId, slug);
  if (!data) notFound();

  const sevTotal = data.severity.high + data.severity.medium + data.severity.low || 1;
  const pctKritiek = Math.round((data.severity.high / sevTotal) * 100);
  const seriesMax = Math.max(...data.series.map((s) => s.total), 1);
  const toolMax = Math.max(...data.byTool.map((t) => t.events), 1);
  const typeMax = Math.max(...data.byType.map((t) => t.total), 1);
  const actionTotal = data.action.blocked + data.action.warned + data.action.monitored || 1;

  return (
    <div>
      <div className="px-8 pt-6">
        <Link href="/dashboard/teams" className="text-sm text-brand-700 font-semibold hover:underline">
          ← Terug naar teams
        </Link>
      </div>
      <PageHeader
        title={`Team — ${data.team.name}`}
        description="Volledige uitsplitsing over de laatste 30 dagen. Aggregaten, geen prompttekst."
      />

      <div className="px-8 py-7 space-y-6 max-w-5xl">

        {/* KPI row */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Kpi label="Detection events" value={fmtNum(data.events)} />
          <Kpi label="Gevoelige items" value={fmtNum(data.items)} />
          <Kpi label="% kritiek" value={`${pctKritiek}%`} accent={pctKritiek >= 50 ? 'high' : undefined} />
          <Kpi label="Actieve installaties" value={fmtNum(data.activeInstalls)} />
        </section>

        {/* Severity split */}
        <section className="pg-card p-6">
          <h3 className="font-semibold text-ink-900 mb-3">Ernstverdeling</h3>
          <div className="h-3 rounded-full overflow-hidden flex bg-ink-100">
            {data.severity.high > 0 && <div className="bg-sev-high h-full" style={{ width: `${(data.severity.high / sevTotal) * 100}%` }} />}
            {data.severity.medium > 0 && <div className="bg-sev-medium h-full" style={{ width: `${(data.severity.medium / sevTotal) * 100}%` }} />}
            {data.severity.low > 0 && <div className="bg-sev-low h-full" style={{ width: `${(data.severity.low / sevTotal) * 100}%` }} />}
          </div>
          <div className="flex justify-between text-xs text-ink-500 mt-2">
            <span><span className="pg-dot pg-dot-high mr-1" />{fmtNum(data.severity.high)} kritiek</span>
            <span><span className="pg-dot pg-dot-medium mr-1" />{fmtNum(data.severity.medium)} gevoelig</span>
            <span><span className="pg-dot pg-dot-low mr-1" />{fmtNum(data.severity.low)} laag</span>
          </div>
        </section>

        {/* Activity over time */}
        <section className="pg-card p-6">
          <h3 className="font-semibold text-ink-900 mb-1">Activiteit over tijd</h3>
          <p className="text-xs text-ink-500 mb-4">Aantal events per dag, laatste 30 dagen.</p>
          <div className="flex items-end gap-1 h-32">
            {data.series.map((s) => (
              <div key={s.day} className="flex-1 flex flex-col justify-end" title={`${s.day}: ${s.total} events`}>
                <div
                  className="bg-brand-500 rounded-t"
                  style={{ height: `${Math.max((s.total / seriesMax) * 100, s.total > 0 ? 6 : 0)}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-ink-400 mt-2">
            <span>{data.series[0]?.day ?? ''}</span>
            <span>{data.series[data.series.length - 1]?.day ?? ''}</span>
          </div>
        </section>

        {/* Per tool + per type */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="pg-card p-6">
            <h3 className="font-semibold text-ink-900 mb-4">Per AI-tool</h3>
            {data.byTool.length === 0 && <div className="text-sm text-ink-400">Geen data</div>}
            <div className="space-y-3">
              {data.byTool.map((t) => (
                <div key={t.tool}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink-800">{TOOL_LABELS[t.tool] ?? t.tool}</span>
                    <span className="pg-num text-ink-500">{fmtNum(t.events)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
                    <div className="h-full bg-brand-500" style={{ width: `${(t.events / toolMax) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pg-card p-6">
            <h3 className="font-semibold text-ink-900 mb-4">Per datatype</h3>
            {data.byType.length === 0 && <div className="text-sm text-ink-400">Geen data</div>}
            <div className="space-y-3">
              {data.byType.slice(0, 8).map((t) => (
                <div key={t.type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink-800">{TYPE_LABELS[t.type] ?? t.type}</span>
                    <span className="pg-num text-ink-500">{fmtNum(t.total)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
                    <div className="h-full bg-brand-700" style={{ width: `${(t.total / typeMax) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="pg-card p-6">
          <h3 className="font-semibold text-ink-900 mb-1">Hoe reageerde de extensie?</h3>
          <p className="text-xs text-ink-500 mb-4">
            Welk deel van de detecties werd alleen gelogd, gewaarschuwd of geblokkeerd — afhankelijk van de ingestelde modus.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <ActionStat label="Gemonitord" value={data.action.monitored} pct={Math.round((data.action.monitored / actionTotal) * 100)} />
            <ActionStat label="Gewaarschuwd" value={data.action.warned} pct={Math.round((data.action.warned / actionTotal) * 100)} />
            <ActionStat label="Geblokkeerd" value={data.action.blocked} pct={Math.round((data.action.blocked / actionTotal) * 100)} />
          </div>
        </section>

        {/* Recent detections */}
        <section className="pg-card p-6">
          <h3 className="font-semibold text-ink-900 mb-3">Recente detecties</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-500">
                <th className="font-medium py-1.5">Tijd</th>
                <th className="font-medium py-1.5">Tool</th>
                <th className="font-medium py-1.5">Ernst</th>
                <th className="font-medium py-1.5">Items</th>
                <th className="font-medium py-1.5">Soorten</th>
                <th className="font-medium py-1.5">Actie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {data.recent.length === 0 && (
                <tr><td colSpan={6} className="py-3 text-center text-ink-400">Geen detecties in deze periode</td></tr>
              )}
              {data.recent.map((r, i) => (
                <tr key={i}>
                  <td className="py-2 text-ink-600 text-xs">{fmtDateTime(r.detectedAt)}</td>
                  <td className="py-2 text-ink-900">{TOOL_LABELS[r.tool] ?? r.tool}</td>
                  <td className="py-2">
                    <span
                      className={
                        'pg-pill ' +
                        (r.highest === 'high' ? 'pg-pill-high' : r.highest === 'medium' ? 'pg-pill-medium' : 'pg-pill-low')
                      }
                    >
                      {SEVERITY_LABELS[r.highest] ?? r.highest}
                    </span>
                  </td>
                  <td className="py-2 pg-num">{fmtNum(r.totalItems)}</td>
                  <td className="py-2 text-ink-600 text-xs">
                    {Object.entries(r.counts)
                      .map(([k, v]) => `${v}× ${TYPE_LABELS[k] ?? k}`)
                      .join(', ') || '—'}
                  </td>
                  <td className="py-2 text-ink-600 text-xs">{ACTION_LABELS[r.action] ?? r.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {data.detectorVersions.length > 0 && (
          <p className="text-xs text-ink-400">
            Detector-versie(s) in deze periode: {data.detectorVersions.join(', ')} — auditbaar per event.
          </p>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: 'high' }) {
  return (
    <div className="pg-card p-5">
      <div className="pg-section-label">{label}</div>
      <div className={'mt-1 text-3xl font-bold pg-num ' + (accent === 'high' ? 'text-red-700' : 'text-ink-900')}>
        {value}
      </div>
    </div>
  );
}

function ActionStat({ label, value, pct }: { label: string; value: number; pct: number }) {
  return (
    <div className="rounded-lg ring-1 ring-ink-200 p-4">
      <div className="text-[11px] text-ink-500 uppercase tracking-wider">{label}</div>
      <div className="mt-1 text-2xl font-bold pg-num text-ink-900">{value}</div>
      <div className="text-xs text-ink-500">{pct}% van detecties</div>
    </div>
  );
}
