import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { fmtDate } from '@/lib/format';
import { PageHeader } from '@/components/PageHeader';
import { ApiKeyDisplay } from './ApiKeyDisplay';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await requireUser();
  const [teams, members, totalDetections] = await Promise.all([
    prisma.team.findMany({ where: { orgId: user.orgId }, orderBy: { name: 'asc' } }),
    prisma.user.findMany({ where: { orgId: user.orgId }, select: { id: true, email: true, name: true, role: true, createdAt: true } }),
    prisma.detection.count({ where: { orgId: user.orgId } }),
  ]);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';

  return (
    <div>
      <PageHeader
        title="Instellingen"
        description="Beheer organisatie, API-key en teams."
      />

      <div className="px-8 py-7 space-y-6 max-w-4xl">
        <section className="pg-card p-6">
          <h2 className="font-semibold text-ink-900">Organisatie</h2>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <Field label="Naam" value={user.org.name} />
            <Field label="Aangemaakt" value={fmtDate(user.org.createdAt)} />
            <Field label="Detection events" value={String(totalDetections)} mono />
            <Field label="Dashboard URL" value={baseUrl} mono small />
          </div>
        </section>

        <section className="pg-card p-6">
          <h2 className="font-semibold text-ink-900">API-key voor de extension</h2>
          <p className="text-sm text-ink-500 mt-1 max-w-xl">
            Deel deze key met de browser-extension via de instellingen-pagina. Elke installatie van de extension authenticatie zich met deze key bij uw dashboard.
          </p>
          <div className="mt-4">
            <ApiKeyDisplay apiKey={user.org.apiKey} />
          </div>
        </section>

        <section className="pg-card p-6">
          <h2 className="font-semibold text-ink-900 mb-3">Teams ({teams.length})</h2>
          <p className="text-sm text-ink-500 mb-4">
            Teams worden automatisch aangemaakt als medewerkers in de extension een team-tag invullen.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {teams.length === 0 && <div className="col-span-full text-sm text-ink-400">Nog geen teams.</div>}
            {teams.map((t) => (
              <div key={t.id} className="rounded-lg ring-1 ring-ink-200 px-3 py-2 flex justify-between items-center text-sm">
                <span className="font-medium">{t.name}</span>
                <code className="text-[11px] text-ink-500">{t.slug}</code>
              </div>
            ))}
          </div>
        </section>

        <section className="pg-card p-6">
          <h2 className="font-semibold text-ink-900 mb-3">Gebruikers ({members.length})</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-500">
                <th className="font-medium py-1.5">Naam</th>
                <th className="font-medium py-1.5">E-mail</th>
                <th className="font-medium py-1.5">Rol</th>
                <th className="font-medium py-1.5">Sinds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="py-2">{m.name ?? '—'}</td>
                  <td className="py-2 font-mono text-[12.5px]">{m.email}</td>
                  <td className="py-2"><span className="pg-pill pg-pill-neutral">{m.role}</span></td>
                  <td className="py-2 text-ink-500 text-xs">{fmtDate(m.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

function Field({ label, value, mono, small }: { label: string; value: string; mono?: boolean; small?: boolean }) {
  return (
    <div>
      <div className="pg-section-label">{label}</div>
      <div className={`mt-1 ${mono ? 'font-mono' : 'font-semibold'} ${small ? 'text-[12px]' : 'text-base'} text-ink-900 break-all`}>
        {value || '—'}
      </div>
    </div>
  );
}
