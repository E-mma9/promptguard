import { requireUser } from '@/lib/auth';
import { loadOverview } from '@/lib/queries';
import { fmtNum, fmtRelative } from '@/lib/format';
import { TYPE_LABELS, TOOL_LABELS } from '@/lib/labels';
import { PageHeader } from '@/components/PageHeader';
import { KpiCard } from '@/components/Kpi';
import { StackedAreaSeries, BarBreakdown, SeverityDonut } from '@/components/Charts';
import { SeverityPill, ToolBadge, ActionPill } from '@/components/SeverityPill';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function OverviewPage() {
  const user = await requireUser();
  const data = await loadOverview(user.orgId);

  const totalSev = data.severityTotals.high + data.severityTotals.medium + data.severityTotals.low;
  const highShare = totalSev > 0 ? Math.round((data.severityTotals.high / totalSev) * 100) : 0;

  const toolBars = data.byTool.slice(0, 6).map((t) => ({
    name: TOOL_LABELS[t.tool] ?? t.tool,
    value: t.events,
  }));

  return (
    <div>
      <PageHeader
        title="Overzicht"
        description="Wat uw medewerkers in de afgelopen 30 dagen in publieke AI-tools hebben geplakt."
        actions={
          <Link href="/dashboard/reports" className="pg-button-secondary">
            Rapport exporteren
          </Link>
        }
      />

      <div className="px-8 py-7 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Detection events"
            value={data.eventCount}
            sub={data.recent[0] ? `Laatste: ${fmtRelative(data.recent[0].detectedAt)}` : 'Nog geen events'}
            accent="brand"
          />
          <KpiCard
            label="Gevoelige items"
            value={data.totalItems}
            sub={`${highShare}% van events is kritiek`}
            accent="high"
          />
          <KpiCard
            label="Actieve AI-tools"
            value={data.byTool.length}
            sub={data.byTool[0] ? `Top: ${TOOL_LABELS[data.byTool[0].tool] ?? data.byTool[0].tool}` : '—'}
            accent="medium"
          />
          <KpiCard
            label="Meest geëxposeerd"
            value={data.mostExposedTeam ? data.mostExposedTeam.name : '—'}
            sub={data.mostExposedTeam ? `${fmtNum(data.mostExposedTeam.items)} items` : 'Geen data'}
            accent="low"
          />
        </section>

        <section className="pg-card p-6">
          <div className="flex items-end justify-between mb-2">
            <div>
              <h2 className="font-semibold text-ink-900">Detecties over tijd</h2>
              <p className="text-xs text-ink-500 mt-0.5">Aantal gevoelige items per dag, opgesplitst naar ernst.</p>
            </div>
            <Legend />
          </div>
          <StackedAreaSeries data={data.series} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="pg-card p-6 lg:col-span-2">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="font-semibold text-ink-900">Top AI-tools</h2>
                <p className="text-xs text-ink-500 mt-0.5">Aantal events per tool, laatste 30 dagen.</p>
              </div>
            </div>
            <BarBreakdown data={toolBars} />
          </div>

          <div className="pg-card p-6">
            <h2 className="font-semibold text-ink-900 mb-1">Verdeling per ernst</h2>
            <p className="text-xs text-ink-500">Events ingedeeld op hoogste ernstniveau.</p>
            <div className="mt-4">
              <SeverityDonut
                high={data.severityTotals.high}
                medium={data.severityTotals.medium}
                low={data.severityTotals.low}
              />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              <SevStat label="Kritiek" value={data.severityTotals.high} sev="high" />
              <SevStat label="Gevoelig" value={data.severityTotals.medium} sev="medium" />
              <SevStat label="Laag" value={data.severityTotals.low} sev="low" />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="pg-card p-6 lg:col-span-1">
            <h2 className="font-semibold text-ink-900 mb-4">Top datatypes</h2>
            <ol className="space-y-2">
              {data.topTypes.length === 0 && (
                <li className="text-sm text-ink-500">Geen data in dit venster.</li>
              )}
              {data.topTypes.map(({ type, total }, i) => {
                const max = data.topTypes[0]?.total ?? 1;
                const pct = Math.max(2, Math.round((total / max) * 100));
                return (
                  <li key={type} className="space-y-1">
                    <div className="flex justify-between text-[13px]">
                      <span className="font-medium text-ink-800">
                        <span className="text-ink-400 mr-2 pg-num text-xs">{String(i + 1).padStart(2, '0')}</span>
                        {TYPE_LABELS[type] ?? type}
                      </span>
                      <span className="pg-num text-ink-700 font-semibold">{fmtNum(total)}</span>
                    </div>
                    <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-700 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="pg-card p-6 lg:col-span-2">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="font-semibold text-ink-900">Recente detecties</h2>
                <p className="text-xs text-ink-500 mt-0.5">De laatste 12 events. Geen prompttekst opgeslagen.</p>
              </div>
              <Link href="/dashboard/detections" className="text-xs font-semibold text-brand-700 hover:text-brand-800">
                Alles bekijken &rarr;
              </Link>
            </div>
            <ul className="divide-y divide-ink-100">
              {data.recent.length === 0 && (
                <li className="py-8 text-sm text-ink-500 text-center">Nog geen detecties geregistreerd.</li>
              )}
              {data.recent.map((r) => (
                <li key={r.id} className="py-2.5 flex items-center gap-3">
                  <SeverityPill severity={r.highest} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] text-ink-900 truncate font-medium">
                      {fmtNum(r.totalItems)} item(s) gedetecteerd
                      {r.teamName && <span className="text-ink-500 font-normal"> &middot; {r.teamName}</span>}
                    </div>
                    <div className="text-xs text-ink-500 truncate mt-0.5">
                      {Object.entries(r.counts)
                        .slice(0, 3)
                        .map(([k, v]) => `${v}× ${TYPE_LABELS[k] ?? k}`)
                        .join(', ')}
                    </div>
                  </div>
                  <ToolBadge tool={r.tool} />
                  <ActionPill action={r.action} />
                  <div className="text-xs text-ink-400 pg-num w-20 text-right">{fmtRelative(r.detectedAt)}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-sev-high" /> <span className="text-ink-600">Kritiek</span></span>
      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-sev-medium" /> <span className="text-ink-600">Gevoelig</span></span>
      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-sev-low" /> <span className="text-ink-600">Laag</span></span>
    </div>
  );
}

function SevStat({ label, value, sev }: { label: string; value: number; sev: 'high' | 'medium' | 'low' }) {
  const colorClass =
    sev === 'high' ? 'text-sev-high' : sev === 'medium' ? 'text-sev-medium' : 'text-sev-low';
  return (
    <div>
      <div className={`text-2xl font-bold pg-num ${colorClass}`}>{fmtNum(value)}</div>
      <div className="text-[11px] text-ink-500 uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}
