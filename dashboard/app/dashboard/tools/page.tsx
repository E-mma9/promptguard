import { requireUser } from '@/lib/auth';
import { loadByTool } from '@/lib/queries';
import { fmtNum } from '@/lib/format';
import { TYPE_LABELS, TOOL_LABELS, TOOL_VENDORS } from '@/lib/labels';
import { PageHeader } from '@/components/PageHeader';
import { ToolBadge } from '@/components/SeverityPill';

export const dynamic = 'force-dynamic';

export default async function ToolsPage() {
  const user = await requireUser();
  const tools = await loadByTool(user.orgId);

  return (
    <div>
      <PageHeader
        title="AI-tools"
        description="Welke AI-leveranciers ontvangen de meeste data van uw medewerkers?"
      />
      <div className="px-8 py-7 space-y-3">
        {tools.length === 0 && (
          <div className="pg-card p-10 text-center text-ink-500">
            Nog geen tooldata. Plaats de extension uit en wacht op de eerste sessies.
          </div>
        )}
        {tools.map((t) => {
          const sevTotal = t.high + t.medium + t.low || 1;
          const topTypes = Object.entries(t.topTypes).sort((a, b) => b[1] - a[1]).slice(0, 4);
          return (
            <div key={t.tool} className="pg-card p-5">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12 md:col-span-3 flex items-center gap-3">
                  <ToolBadge tool={t.tool} />
                  <div>
                    <div className="font-semibold text-ink-900">{TOOL_LABELS[t.tool] ?? t.tool}</div>
                    <div className="text-[11px] text-ink-500">{TOOL_VENDORS[t.tool] ?? '—'}</div>
                  </div>
                </div>

                <div className="col-span-6 md:col-span-3 grid grid-cols-2 gap-3">
                  <div>
                    <div className="pg-section-label">Events</div>
                    <div className="text-xl font-bold pg-num">{fmtNum(t.events)}</div>
                  </div>
                  <div>
                    <div className="pg-section-label">Items</div>
                    <div className="text-xl font-bold pg-num">{fmtNum(t.items)}</div>
                  </div>
                </div>

                <div className="col-span-6 md:col-span-3">
                  <div className="pg-section-label mb-1">Verdeling</div>
                  <div className="h-2 rounded-full overflow-hidden flex bg-ink-100">
                    <div className="bg-sev-high h-full" style={{ width: `${(t.high / sevTotal) * 100}%` }} />
                    <div className="bg-sev-medium h-full" style={{ width: `${(t.medium / sevTotal) * 100}%` }} />
                    <div className="bg-sev-low h-full" style={{ width: `${(t.low / sevTotal) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-[10.5px] text-ink-500 mt-1">
                    <span>{fmtNum(t.high)} kritiek</span>
                    <span>{fmtNum(t.medium)} gevoelig</span>
                    <span>{fmtNum(t.low)} laag</span>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3">
                  <div className="pg-section-label mb-1">Top-data</div>
                  <div className="text-[12.5px] text-ink-700 leading-relaxed">
                    {topTypes.length === 0 ? '—' : topTypes.map(([k, v]) => `${v}× ${TYPE_LABELS[k] ?? k}`).join(', ')}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-ink-100 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-[11px] text-ink-500 uppercase tracking-wider">Geregistreerd</div>
                  <div className="font-semibold text-ink-900 pg-num">{fmtNum(t.monitored)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-amber-700 uppercase tracking-wider">Gewaarschuwd</div>
                  <div className="font-semibold text-amber-700 pg-num">{fmtNum(t.warned)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-red-700 uppercase tracking-wider">Geblokkeerd</div>
                  <div className="font-semibold text-red-700 pg-num">{fmtNum(t.blocked)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
