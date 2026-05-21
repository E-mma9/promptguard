import { requireUser } from '@/lib/auth';
import { loadAuditLog } from '@/lib/queries';
import { fmtDateTime } from '@/lib/format';
import { PageHeader } from '@/components/PageHeader';

export const dynamic = 'force-dynamic';

const TYPE_LABELS: Record<string, string> = {
  'auth.login.success': 'Inlog geslaagd',
  'auth.login.failed': 'Inlog mislukt',
  'auth.signup': 'Account aangemaakt',
  'auth.logout': 'Uitgelogd',
  'auth.login.rate_limited': 'Inlog geblokkeerd (rate-limit)',
  'api.ingest.rate_limited': 'Ingest rate-limited',
  'api.report.exported': 'Rapport geëxporteerd',
  'api.apikey.regenerated': 'API-key opnieuw gegenereerd',
  'access.denied': 'Toegang geweigerd',
};

// Event types that signal a failed or blocked action — shown with a warning tint.
const ALERT_TYPES = new Set([
  'auth.login.failed',
  'auth.login.rate_limited',
  'api.ingest.rate_limited',
  'access.denied',
]);

export default async function AuditPage() {
  const user = await requireUser();
  const entries = await loadAuditLog(user.orgId, { take: 200 });

  return (
    <div>
      <PageHeader
        title="Audit-log"
        description="Beveiligingsrelevante gebeurtenissen: authenticatie, beheerhandelingen en geweigerde toegang. Duurzaam vastgelegd — bewijslast voor NEN 7510 / ISO 27001."
      />

      <div className="px-8 py-7 space-y-6 max-w-5xl">
        <section className="pg-card p-6">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-semibold text-ink-900">Recente gebeurtenissen</h2>
            <span className="text-xs text-ink-500">{entries.length} van max. 200 getoond</span>
          </div>

          {entries.length === 0 ? (
            <div className="py-10 text-center text-ink-400 text-sm">
              Nog geen audit-gebeurtenissen vastgelegd voor deze organisatie.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-500">
                  <th className="font-medium py-1.5">Tijdstip</th>
                  <th className="font-medium py-1.5">Gebeurtenis</th>
                  <th className="font-medium py-1.5">Gebruiker</th>
                  <th className="font-medium py-1.5">IP-adres</th>
                  <th className="font-medium py-1.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {entries.map((e) => {
                  const alert = ALERT_TYPES.has(e.type);
                  return (
                    <tr key={e.id} className={alert ? 'bg-amber-50/60' : undefined}>
                      <td className="py-2 text-ink-600 text-xs whitespace-nowrap">
                        {fmtDateTime(e.createdAt)}
                      </td>
                      <td className="py-2">
                        <span
                          className={
                            'inline-block px-2 py-0.5 rounded-full text-xs font-semibold ' +
                            (alert
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800')
                          }
                        >
                          {TYPE_LABELS[e.type] ?? e.type}
                        </span>
                      </td>
                      <td className="py-2 text-ink-700 text-xs font-mono">
                        {e.email ?? e.userId ?? '—'}
                      </td>
                      <td className="py-2 text-ink-600 text-xs font-mono">
                        {e.ipAddress ?? '—'}
                      </td>
                      <td className="py-2 text-ink-500 text-xs break-all max-w-xs">
                        {e.details ?? '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

        <p className="text-xs text-ink-400 leading-relaxed">
          Gebeurtenissen worden zowel als gestructureerde JSON-logregel (voor doorzending naar
          een SIEM) als duurzaam in de database vastgelegd. Pre-authenticatie-gebeurtenissen
          zonder bekende organisatie verschijnen niet in dit organisatie-gefilterde overzicht.
        </p>
      </div>
    </div>
  );
}
