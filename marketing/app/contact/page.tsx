import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Main } from '@/components/Main';

export const metadata = {
  title: 'Contact — plan een gesprek',
  description:
    'Vraag een demo aan of stuur ons een security-vraag. Wij reageren binnen één werkdag.',
};

export default function ContactPage() {
  return (
    <>
      <div className="bg-ink-950 text-white">
        <Header variant="dark" />
      </div>

      <Main>
      <section className="bg-ink-950 text-white">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-12 text-center">
          <span className="section-label-light">Contact</span>
          <h1 className="mt-3 text-5xl md:text-6xl font-bold tracking-tight">
            Laten we een gesprek plannen.
          </h1>
          <p className="mt-5 text-lg text-ink-300 max-w-2xl mx-auto">
            30 minuten. Vrijblijvend. Vooraf delen we onze juridische en technische documentatie.
          </p>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ContactCard
              titel="Demo & sales"
              email="info@promptguard.nl"
              body="Voor een demo, prijsindicatie of vragen over functionaliteit."
            />
            <ContactCard
              titel="Compliance & security"
              email="compliance@promptguard.nl"
              body="Voor security-questionnaires, DPA's, NEN 7510-evidence of audit-vragen."
            />
            <ContactCard
              titel="Beveiligingsincidenten"
              email="security@promptguard.nl"
              body="Voor het vertrouwelijk melden van kwetsbaarheden. We bevestigen binnen 2 werkdagen."
            />
            <ContactCard
              titel="Inkoop & contracten"
              email="contracten@promptguard.nl"
              body="Voor inkoop-traject, raamcontracten of multi-jaarafspraken."
            />
          </div>

          <div className="mt-14 rounded-2xl bg-ink-50 ring-1 ring-ink-200 p-7">
            <h2 className="font-semibold text-ink-900">Wat we vooraf delen</h2>
            <p className="mt-2 text-sm text-ink-600 leading-relaxed">
              Voor uw eerste gesprek krijgt u standaard de volgende documenten toegestuurd, zodat
              uw FG, CISO of DPO meteen kan meelezen:
            </p>
            <ul className="mt-5 space-y-2 text-sm text-ink-700">
              <li className="flex gap-2"><Bullet /> Architectuurbeschrijving en EU-data-residency-bewijs</li>
              <li className="flex gap-2"><Bullet /> NEN 7510-2 controls-mapping (voor zorgklanten)</li>
              <li className="flex gap-2"><Bullet /> Concept-verwerkersovereenkomst</li>
              <li className="flex gap-2"><Bullet /> Subverwerkers-lijst</li>
              <li className="flex gap-2"><Bullet /> Wettelijk kader-overzicht (AI Act, AVG, NIS2, DORA)</li>
            </ul>
            <div className="mt-7">
              <Link
                href="/wettelijk-kader"
                className="inline-block text-sm font-semibold text-brand-700 hover:underline focus-ring"
              >
                Of lees alvast het wettelijk kader <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="mt-10 text-center text-sm text-ink-600">
            Liever direct bellen? Bel ons gerust op werkdagen tussen 09:00 en 17:00 — telefoonnummer
            ontvangt u na uw e-mail.
          </div>
        </div>
      </section>
      </Main>

      <Footer />
    </>
  );
}

function ContactCard({ titel, email, body }: { titel: string; email: string; body: string }) {
  return (
    <div className="rounded-2xl ring-1 ring-ink-200 bg-white p-6 hover:shadow-md transition-shadow">
      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">{titel}</div>
      <a
        href={`mailto:${email}`}
        className="mt-2 inline-block text-lg font-semibold text-ink-900 hover:text-brand-700 transition-colors focus-ring"
      >
        {email}
      </a>
      <p className="mt-2 text-sm text-ink-600 leading-relaxed">{body}</p>
    </div>
  );
}

function Bullet() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 shrink-0 text-emerald-600">
      <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.18" />
      <path d="M5 8.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
