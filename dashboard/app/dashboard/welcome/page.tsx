import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { PageHeader } from '@/components/PageHeader';
import { ApiKeyDisplay } from '../settings/ApiKeyDisplay';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function WelcomePage() {
  const user = await requireUser();
  const detectionCount = await prisma.detection.count({ where: { orgId: user.orgId } });

  return (
    <div>
      <PageHeader
        title={`Welkom, ${user.name || user.email.split('@')[0]} 👋`}
        description={`Account aangemaakt voor ${user.org.name}. Drie stappen om live te zijn.`}
      />

      <div className="px-8 py-7 max-w-4xl space-y-6">
        <Step
          number={1}
          title="Kopieer je organisatie-API-key"
          done={false}
          body={
            <div>
              <p className="text-sm text-ink-600 mb-3">
                Iedere extension-installatie authenticeert zich met deze key bij je dashboard. Behandel 'm als een wachtwoord — wie 'm heeft kan events posten naar jouw org.
              </p>
              <ApiKeyDisplay apiKey={user.org.apiKey} />
            </div>
          }
        />

        <Step
          number={2}
          title="Installeer de extension"
          done={false}
          body={
            <div className="space-y-4">
              <p className="text-sm text-ink-600">
                Voor jouzelf (1 medewerker) of een proefgroep — handmatige installatie:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <BrowserCard
                  name="Chrome / Edge / Brave"
                  href="https://chromewebstore.google.com/"
                  badge="Aanbevolen"
                  status="upcoming"
                />
                <BrowserCard
                  name="Mozilla Firefox"
                  href="https://addons.mozilla.org/"
                  status="upcoming"
                />
                <BrowserCard
                  name="Safari (macOS)"
                  href="#"
                  status="planned"
                />
              </div>
              <p className="text-sm text-ink-600 pt-3 border-t border-ink-100">
                Voor uitrol over <strong>10 of meer laptops</strong>:{' '}
                <Link href="/dashboard/deploy" className="text-brand-700 font-semibold hover:underline">
                  bekijk de IT-uitrolinstructies →
                </Link>
              </p>
            </div>
          }
        />

        <Step
          number={3}
          title="Verifieer dat events binnenkomen"
          done={detectionCount > 0}
          body={
            detectionCount > 0 ? (
              <div className="rounded-xl bg-emerald-50 ring-1 ring-emerald-200 p-4">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-1">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"/></svg>
                  {detectionCount} event(s) ontvangen — extension werkt
                </div>
                <p className="text-sm text-emerald-700">
                  Bekijk ze op{' '}
                  <Link href="/dashboard/detections" className="font-semibold underline">
                    /dashboard/detections
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <div className="rounded-xl bg-ink-50 ring-1 ring-ink-200 p-4">
                <p className="text-sm text-ink-700">
                  Wacht op je eerste event. Open een AI-tool (ChatGPT, Claude, Gemini, Copilot) en plak iets met gevoelige data — bijvoorbeeld een nep-BSN <code className="text-xs bg-white px-1.5 py-0.5 rounded">111222333</code>. Binnen 60 seconden verschijnt het hier.
                </p>
              </div>
            )
          }
        />

        <section className="pt-4">
          <Link href="/dashboard" className="pg-button-primary">
            Naar het dashboard →
          </Link>
        </section>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  body,
  done,
}: {
  number: number;
  title: string;
  body: React.ReactNode;
  done?: boolean;
}) {
  return (
    <section className="pg-card overflow-hidden">
      <div className="flex items-start gap-5 p-6">
        <div
          className={
            'shrink-0 w-9 h-9 rounded-full grid place-items-center font-bold text-sm ' +
            (done ? 'bg-emerald-600 text-white' : 'bg-ink-900 text-white')
          }
        >
          {done ? (
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 00-1.4 0L8 12.6l-3.3-3.3a1 1 0 00-1.4 1.4l4 4a1 1 0 001.4 0l8-8a1 1 0 000-1.4z" />
            </svg>
          ) : number}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-ink-900 mb-3">{title}</h3>
          {body}
        </div>
      </div>
    </section>
  );
}

function BrowserCard({
  name,
  href,
  badge,
  status,
}: {
  name: string;
  href: string;
  badge?: string;
  status: 'available' | 'upcoming' | 'planned';
}) {
  const labels = {
    available: 'Installeren',
    upcoming: 'Binnenkort beschikbaar',
    planned: 'In ontwikkeling',
  };
  const isAvailable = status === 'available';
  return (
    <div className={'rounded-xl ring-1 ring-ink-200 p-4 ' + (isAvailable ? 'bg-white' : 'bg-ink-50')}>
      <div className="flex items-start justify-between mb-2">
        <div className="font-semibold text-ink-900 text-sm">{name}</div>
        {badge && <span className="text-[10px] font-bold uppercase bg-brand-100 text-brand-800 px-1.5 py-0.5 rounded">{badge}</span>}
      </div>
      {isAvailable ? (
        <a href={href} className="text-xs font-semibold text-brand-700 hover:underline" target="_blank" rel="noreferrer">
          {labels[status]} →
        </a>
      ) : (
        <span className="text-xs text-ink-500">{labels[status]}</span>
      )}
    </div>
  );
}
