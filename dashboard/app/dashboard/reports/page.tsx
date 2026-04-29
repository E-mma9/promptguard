import { requireUser } from '@/lib/auth';
import { loadQuarterly } from '@/lib/queries';
import { fmtDate, fmtNum, quarterOf } from '@/lib/format';
import { TYPE_LABELS, TOOL_LABELS } from '@/lib/labels';
import { PageHeader } from '@/components/PageHeader';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function quarterOptions() {
  const now = new Date();
  const cur = quarterOf(now);
  const out: { year: number; quarter: number; label: string }[] = [];
  let { year, quarter } = cur;
  for (let i = 0; i < 8; i++) {
    out.push({ year, quarter, label: `Q${quarter} ${year}` });
    quarter -= 1;
    if (quarter === 0) { quarter = 4; year -= 1; }
  }
  return out;
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; quarter?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const now = new Date();
  const cur = quarterOf(now);
  const year = parseInt(params.year ?? String(cur.year), 10) || cur.year;
  const quarter = Math.min(4, Math.max(1, parseInt(params.quarter ?? String(cur.quarter), 10) || cur.quarter));

  const data = await loadQuarterly(user.orgId, year, quarter);
  const options = quarterOptions();

  return (
    <div>
      <PageHeader
        title="Rapportages"
        description="Exporteer per kwartaal een samenvatting voor AI Act-compliance, AVG-audit of cyberverzekeraar."
      />

      <div className="px-8 py-7 space-y-6">
        <section className="pg-card p-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="pg-section-label mb-2">Rapportage-periode</div>
              <div className="flex items-center gap-1 bg-ink-100 p-0.5 rounded-lg">
                {options.map((o) => {
                  const active = o.year === year && o.quarter === quarter;
                  return (
                    <Link
                      key={`${o.year}-${o.quarter}`}
                      href={`/dashboard/reports?year=${o.year}&quarter=${o.quarter}`}
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
            <div className="flex gap-2">
              <a
                href={`/api/reports/quarterly?year=${year}&quarter=${quarter}&format=csv`}
                className="pg-button-secondary"
              >
                Download CSV
              </a>
              <a
                href={`/api/reports/quarterly?year=${year}&quarter=${quarter}&format=json`}
                className="pg-button-secondary"
              >
                JSON
              </a>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="pg-card p-5">
            <div className="pg-section-label">Periode</div>
            <div className="mt-1 text-lg font-bold text-ink-900">Q{quarter} {year}</div>
            <div className="text-xs text-ink-500 mt-0.5">
              {fmtDate(data.period.start)} &mdash; {fmtDate(new Date(data.period.end.getTime() - 1))}
            </div>
          </div>
          <div className="pg-card p-5">
            <div className="pg-section-label">Totale events</div>
            <div className="mt-1 text-3xl font-bold pg-num text-ink-900">{fmtNum(data.totals.events)}</div>
          </div>
          <div className="pg-card p-5">
            <div className="pg-section-label">Gevoelige items</div>
            <div className="mt-1 text-3xl font-bold pg-num text-ink-900">{fmtNum(data.totals.items)}</div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="pg-card p-6">
            <h3 className="font-semibold text-ink-900 mb-3">Per AI-tool</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-500">
                  <th className="font-medium py-1.5">Tool</th>
                  <th className="font-medium py-1.5 text-right">Events</th>
                  <th className="font-medium py-1.5 text-right">Items</th>
                  <th className="font-medium py-1.5 text-right">Geblokkeerd</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {data.byTool.length === 0 && (
                  <tr><td colSpan={4} className="py-3 text-center text-ink-400">Geen data</td></tr>
                )}
                {data.byTool.map((t) => (
                  <tr key={t.tool}>
                    <td className="py-2 font-medium text-ink-900">{TOOL_LABELS[t.tool] ?? t.tool}</td>
                    <td className="py-2 text-right pg-num">{fmtNum(t.events)}</td>
                    <td className="py-2 text-right pg-num">{fmtNum(t.items)}</td>
                    <td className="py-2 text-right pg-num text-red-700">{fmtNum(t.blocked)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pg-card p-6">
            <h3 className="font-semibold text-ink-900 mb-3">Per team</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-500">
                  <th className="font-medium py-1.5">Team</th>
                  <th className="font-medium py-1.5 text-right">Events</th>
                  <th className="font-medium py-1.5 text-right">Items</th>
                  <th className="font-medium py-1.5 text-right">Kritiek</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {data.byTeam.length === 0 && (
                  <tr><td colSpan={4} className="py-3 text-center text-ink-400">Geen data</td></tr>
                )}
                {data.byTeam.map((t) => (
                  <tr key={String(t.id)}>
                    <td className="py-2 font-medium text-ink-900">{t.name}</td>
                    <td className="py-2 text-right pg-num">{fmtNum(t.events)}</td>
                    <td className="py-2 text-right pg-num">{fmtNum(t.items)}</td>
                    <td className="py-2 text-right pg-num text-red-700">{fmtNum(t.high)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="pg-card p-6">
          <h3 className="font-semibold text-ink-900 mb-3">Per datatype</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.byType.length === 0 && (
              <div className="col-span-full text-center text-ink-400 py-3">Geen data</div>
            )}
            {data.byType.map((t) => (
              <div key={t.type} className="rounded-lg ring-1 ring-ink-200 p-3">
                <div className="text-[11px] text-ink-500 uppercase tracking-wider">{TYPE_LABELS[t.type] ?? t.type}</div>
                <div className="mt-1 text-xl font-bold pg-num text-ink-900">{fmtNum(t.total)}</div>
                <div className="text-[11px] text-ink-500 mt-0.5">{fmtNum(t.events)} events</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-ink-900 text-white p-6 leading-relaxed">
          <h3 className="font-semibold mb-2">Wat staat er in dit rapport?</h3>
          <p className="text-ink-300 text-sm">
            Aggregaten van alle detection events in dit kwartaal: per AI-tool, per team en per datatype.{' '}
            <strong className="text-white">Geen prompttekst</strong> &mdash; alleen tellingen.{' '}
            Dit rapport is bedoeld voor uw AI Act-register, AVG-verantwoordingsplicht en jaarlijkse cyberverzekeringsvragenlijst.
          </p>
        </section>
      </div>
    </div>
  );
}
