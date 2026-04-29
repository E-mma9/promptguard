import { requireUser } from '@/lib/auth';
import { loadByTeam } from '@/lib/queries';
import { fmtNum } from '@/lib/format';
import { TYPE_LABELS, TOOL_LABELS } from '@/lib/labels';
import { PageHeader } from '@/components/PageHeader';

export const dynamic = 'force-dynamic';

export default async function TeamsPage() {
  const user = await requireUser();
  const teams = await loadByTeam(user.orgId);
  const max = Math.max(...teams.map((t) => t.items), 1);

  return (
    <div>
      <PageHeader
        title="Teams"
        description="Welke afdelingen exposeren de meeste data via AI-tools?"
      />
      <div className="px-8 py-7 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {teams.length === 0 && (
          <div className="col-span-full pg-card p-10 text-center text-ink-500">
            Nog geen teamdata. Configureer per medewerker een team-tag in de extension-instellingen.
          </div>
        )}
        {teams.map((t) => {
          const totalSev = t.high + t.medium + t.low || 1;
          const topTypes = Object.entries(t.topTypes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
          const topTools = Object.entries(t.byTool)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
          return (
            <div key={String(t.id)} className="pg-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-ink-900">{t.name}</h3>
                  <div className="text-xs text-ink-500">{fmtNum(t.events)} events &middot; {fmtNum(t.items)} items</div>
                </div>
                <div
                  className="text-xs font-mono px-2 py-0.5 rounded bg-ink-100 text-ink-600"
                  title="Aandeel van de zwaarst geëxposeerde team"
                >
                  {Math.round((t.items / max) * 100)}%
                </div>
              </div>

              <div className="h-2 rounded-full overflow-hidden flex bg-ink-100 mb-2">
                {t.high > 0 && <div className="bg-sev-high h-full" style={{ width: `${(t.high / totalSev) * 100}%` }} />}
                {t.medium > 0 && <div className="bg-sev-medium h-full" style={{ width: `${(t.medium / totalSev) * 100}%` }} />}
                {t.low > 0 && <div className="bg-sev-low h-full" style={{ width: `${(t.low / totalSev) * 100}%` }} />}
              </div>
              <div className="flex justify-between text-[11px] text-ink-500 mb-4">
                <span><span className="pg-dot pg-dot-high mr-1" />{fmtNum(t.high)} kritiek</span>
                <span><span className="pg-dot pg-dot-medium mr-1" />{fmtNum(t.medium)} gevoelig</span>
                <span><span className="pg-dot pg-dot-low mr-1" />{fmtNum(t.low)} laag</span>
              </div>

              <div className="space-y-3 text-[13px]">
                <div>
                  <div className="pg-section-label mb-1">Vaakst gedetecteerd</div>
                  <div className="text-ink-700">
                    {topTypes.length === 0 ? '—' : topTypes.map(([k, v]) => `${v}× ${TYPE_LABELS[k] ?? k}`).join(', ')}
                  </div>
                </div>
                <div>
                  <div className="pg-section-label mb-1">Meest gebruikt</div>
                  <div className="text-ink-700">
                    {topTools.length === 0 ? '—' : topTools.map(([k, v]) => `${v}× ${TOOL_LABELS[k] ?? k}`).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
