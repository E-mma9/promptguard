import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Main } from '@/components/Main';

export const metadata = {
  title: 'Prijzen — eenvoudig, per organisatie',
  description:
    'PromptGuard pricing: één heldere vaste maandprijs per organisatie voor MKB, per-medewerker vanaf 500 werkplekken. Vanaf € 175/maand. Zorg- en Enterprise-tarieven op aanvraag.',
};

type Tier = {
  name: string;
  tagline: string;
  /** Flat monthly fee, pre-formatted in Dutch notation. */
  price: string;
  /** Werkplek-bandbreedte, e.g. "5–25 werkplekken". */
  range: string;
  /** Effective per-werkplek price for this tier. */
  perWp: string;
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
  features: string[];
};

const tiers: Tier[] = [
  {
    name: 'Starter',
    tagline: 'Voor organisaties van 5 tot 25 medewerkers',
    price: '€ 175',
    range: '5–25 werkplekken',
    perWp: '€ 7,00 per werkplek',
    cta: 'Begin een proefperiode',
    ctaHref: '/contact',
    features: [
      'Detectie op alle ondersteunde AI-tools',
      'Dashboard met events, tools, datatypes',
      'Kwartaalrapportage (CSV + JSON)',
      'Verwerkersovereenkomst inbegrepen',
      'E-mail support op werkdagen',
      'EU-only hosting (Frankfurt)',
    ],
  },
  {
    name: 'Team',
    tagline: 'Voor groeiend MKB van 26 tot 100 medewerkers',
    price: '€ 595',
    range: '26–100 werkplekken',
    perWp: 'vanaf € 5,95 per werkplek',
    cta: 'Demo aanvragen',
    ctaHref: '/contact',
    highlighted: true,
    features: [
      'Alles uit Starter',
      'Team-uitsplitsing (per afdeling)',
      'Managed deployment (Intune / GPO / Jamf)',
      'Audit-log van administratieve handelingen',
      'Maandrapportage in plaats van kwartaal',
      'Reactietijd 1 werkdag',
    ],
  },
  {
    name: 'Business',
    tagline: 'Voor organisaties van 101 tot 500 medewerkers',
    price: '€ 1.999',
    range: '101–500 werkplekken',
    perWp: 'vanaf € 3,99 per werkplek',
    cta: 'Demo aanvragen',
    ctaHref: '/contact',
    features: [
      'Alles uit Team',
      'SSO via Microsoft Entra ID (roadmap Q4-2026)',
      'Custom DPA-onderhandeling',
      'Kwartaalreview met productteam',
      'Detector-versie-pinning per organisatie',
      'Reactietijd 4 uur (kantooruren)',
    ],
  },
];

export default function PrijzenPage() {
  return (
    <>
      <div className="bg-ink-950 text-white">
        <Header variant="dark" />
      </div>

      <Main>
      <section className="bg-ink-950 text-white">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-12 text-center">
          <span className="section-label-light">Prijzen</span>
          <h1 className="mt-3 text-5xl md:text-6xl font-bold tracking-tight">
            Eén heldere prijs per organisatie.
          </h1>
          <p className="mt-5 text-lg text-ink-300 max-w-2xl mx-auto leading-relaxed">
            MKB betaalt een vaste maandprijs per organisatie — geen per-medewerker-rekensommen.
            Maandelijks opzegbaar. 14 dagen proef zonder creditcard. Vanaf 500 werkplekken stappen
            we over op een per-werkplek-model dat past bij uw inkooptraject.
          </p>

          {/* Value anchor — what €7/wp actually costs */}
          <div className="mt-9 inline-flex flex-col sm:flex-row items-stretch gap-px overflow-hidden rounded-2xl ring-1 ring-white/15 bg-white/5 text-left">
            <Anchor
              big="€ 0,23"
              small="per medewerker per dag"
              note="Starter-tarief van € 7,00/maand, omgerekend over een werkmaand."
            />
            <Anchor
              big="€ 20.000.000"
              small="maximale AVG-boete"
              note="Eén compliance-tekort onder AVG art. 83 — de verhouding spreekt voor zich."
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tiers.map((tier) => (
              <TierCard key={tier.name} tier={tier} />
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-sm text-ink-600 leading-relaxed">
            <strong className="text-ink-900">Vaste maandprijs, niet per seat.</strong> U betaalt
            het tarief van het pakket dat bij uw aantal werkplekken hoort — niet per individuele
            licentie. De prijs-per-werkplek hieronder is puur ter vergelijking: hij daalt naarmate
            uw organisatie groeit. Bij overgang naar een hoger pakket rekenen we pro-rata af.
          </p>
        </div>
      </section>

      {/* Enterprise / Zorg */}
      <section className="bg-ink-50 py-20">
        <div className="mx-auto max-w-7xl px-6 space-y-6">

          <div className="rounded-3xl bg-gradient-to-br from-ink-900 to-ink-950 text-white p-10 md:p-14 ring-1 ring-ink-800">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              <div className="lg:col-span-2">
                <span className="section-label-light">Enterprise</span>
                <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
                  Vanaf € 4,00 per medewerker per maand — bij 500+ werkplekken.
                </h2>
                <p className="mt-5 text-ink-300 leading-relaxed max-w-2xl">
                  Vanaf 500 werkplekken stappen we over op een per-werkplek-tarief met
                  volumekorting. Inclusief jaarcontract, multi-jaarkorting, dedicated
                  account-management en SLA met financiële garantie.
                </p>
                <p className="mt-4 text-sm text-ink-300">
                  Indicatief: 500 werkplekken vanaf{' '}
                  <strong className="text-white">€ 24.000 per jaar</strong>; 2.000 werkplekken
                  vanaf <strong className="text-white">€ 96.000 per jaar</strong>.
                </p>
                <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-ink-200">
                  <li className="flex gap-2"><Check /> Pilot 60–90 dagen, vaste prijs</li>
                  <li className="flex gap-2"><Check /> Jaarcontract + multi-jaarkorting</li>
                  <li className="flex gap-2"><Check /> Custom DPA + security-questionnaire-response</li>
                  <li className="flex gap-2"><Check /> Dedicated customer success-contact</li>
                  <li className="flex gap-2"><Check /> Jaarlijkse penetratietest-bijdrage tot € 5.000</li>
                  <li className="flex gap-2"><Check /> Broncode-escrow op aanvraag</li>
                </ul>
              </div>
              <div>
                <Link href="/contact" className="btn-primary w-full justify-center">
                  Vrijblijvend gesprek
                </Link>
                <a
                  href="mailto:compliance@promptguard.nl"
                  className="btn-secondary w-full justify-center mt-3"
                >
                  Stuur security-vragen
                </a>
              </div>
            </div>
          </div>

          {/* Zorg-tier — separate to signal premium positioning */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-10 md:p-14 ring-1 ring-emerald-800">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              <div className="lg:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                  Zorg &amp; sector-specifiek
                </span>
                <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
                  Vanaf € 5,00 per medewerker per maand — voor zorgaanbieders.
                </h2>
                <p className="mt-5 text-emerald-50 leading-relaxed max-w-2xl">
                  Voor zorgaanbieders en andere sectoren met NEN 7510, Wabvpz, Wkkgz, BIO, DORA of
                  vergelijkbare verplichtingen. Premie-tarief omdat de implementatie hierop is
                  toegesneden: kant-en-klare evidence, FG-bijstand en zwaardere SLA.
                </p>
                <p className="mt-4 text-sm text-emerald-50">
                  Indicatief: 2.000 zorgmedewerkers vanaf{' '}
                  <strong className="text-white">€ 120.000 per jaar</strong>, inclusief
                  NEN 7510-evidence.
                </p>
                <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-emerald-50">
                  <li className="flex gap-2"><Check light /> NEN 7510-controls-evidence kant-en-klaar</li>
                  <li className="flex gap-2"><Check light /> Z-CERT-koppeling (zorg)</li>
                  <li className="flex gap-2"><Check light /> DPIA-bouwsteen voor uw eigen DPIA</li>
                  <li className="flex gap-2"><Check light /> Datalekmelding binnen 24 uur</li>
                  <li className="flex gap-2"><Check light /> Pilot 90 dagen, vooruitbetaling</li>
                  <li className="flex gap-2"><Check light /> Optioneel: code-escrow bij notaris</li>
                </ul>
              </div>
              <div>
                <Link href="/oplossingen/zorg" className="btn-primary w-full justify-center">
                  Bekijk zorg-oplossing
                </Link>
                <a
                  href="mailto:compliance@promptguard.nl?subject=Zorg-pakket%20offerteaanvraag"
                  className="btn-secondary w-full justify-center mt-3"
                >
                  Offerte aanvragen
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-ink-900">
            Veelgestelde vragen
          </h2>
          <div className="mt-10 space-y-7">
            <Faq q="Per medewerker of per organisatie?">
              Voor MKB per organisatie: één vaste maandprijs voor uw hele bedrijf. Wij geloven niet
              in user-seat-pricing voor een compliance-tool — uw DPO koopt geen 75 licenties, die
              koopt één capability. Vanaf 500 werkplekken hanteren we wél een per-werkplek-tarief,
              omdat dat beter aansluit bij grote inkooptrajecten.
            </Faq>
            <Faq q="Wat als ik halverwege het jaar groei van 80 naar 110 medewerkers?">
              U stapt over naar het volgende pakket op het moment van overgang, pro-rata. Geen
              boetes, geen lock-in.
            </Faq>
            <Faq q="Krijgen we korting als jaarcontract?">
              Ja — 10% op jaarbasis bij vooruitbetaling. Voor multi-jaarcontracten (2 of 3 jaar)
              tot 15–20%, op aanvraag.
            </Faq>
            <Faq q="Wat is inbegrepen in de proefperiode?">
              14 dagen volledige toegang zonder creditcard. Geen functiebeperkingen, geen
              ingebakken event-limieten. U beëindigt eenvoudig door geen abonnement te starten.
            </Faq>
            <Faq q="Welke andere kosten kunnen er ontstaan?">
              Geen verborgen kosten. Bij Enterprise zijn éénmalige professional services voor
              custom DPA-onderhandeling of penetratietest mogelijk apart begroot. Wij communiceren
              dit altijd vooraf en schriftelijk.
            </Faq>
            <Faq q="Hoe zit het met de browser-extensie?">
              De extensie is gratis (uiteraard — anders kan PromptGuard niet werken). Het abonnement
              is voor het dashboard en de ingest-API. U mag de extensie ongelimiteerd uitrollen.
            </Faq>
          </div>
        </div>
      </section>
      </Main>

      <Footer />
    </>
  );
}

function Anchor({ big, small, note }: { big: string; small: string; note: string }) {
  return (
    <div className="bg-white/[0.04] px-6 py-5 sm:max-w-xs">
      <div className="text-2xl font-bold tracking-tight text-white">{big}</div>
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-300">
        {small}
      </div>
      <p className="mt-2 text-xs text-ink-300 leading-relaxed">{note}</p>
    </div>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  const isHighlight = !!tier.highlighted;
  return (
    <div
      className={
        'relative flex flex-col rounded-2xl p-8 ' +
        (isHighlight
          ? 'bg-ink-950 text-white ring-2 ring-brand-500 shadow-xl'
          : 'bg-white text-ink-900 ring-1 ring-ink-200')
      }
    >
      {isHighlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-500 text-white text-[10px] font-bold uppercase tracking-[0.18em]">
          Meest gekozen
        </div>
      )}
      <h2 className={'text-xl font-bold ' + (isHighlight ? 'text-white' : 'text-ink-900')}>
        {tier.name}
      </h2>
      <p className={'mt-1 text-sm ' + (isHighlight ? 'text-ink-300' : 'text-ink-600')}>
        {tier.tagline}
      </p>

      <div className="mt-6">
        <div className="flex items-baseline gap-1.5">
          <span
            className={
              'text-5xl font-bold tracking-tight ' +
              (isHighlight ? 'text-white' : 'text-ink-900')
            }
          >
            {tier.price}
          </span>
          <span className={'text-sm font-medium ' + (isHighlight ? 'text-ink-300' : 'text-ink-500')}>
            / maand
          </span>
        </div>
        <div className={'mt-2 text-sm ' + (isHighlight ? 'text-ink-300' : 'text-ink-600')}>
          Vaste maandprijs · {tier.range}
        </div>
        <div
          className={
            'mt-1 text-xs ' + (isHighlight ? 'text-ink-400' : 'text-ink-500')
          }
        >
          Ter vergelijking: {tier.perWp} per maand
        </div>
      </div>

      <Link
        href={tier.ctaHref}
        className={(isHighlight ? 'btn-primary' : 'btn-primary-dark') + ' w-full justify-center mt-7'}
      >
        {tier.cta}
      </Link>

      <ul className={'mt-8 space-y-3 text-sm ' + (isHighlight ? 'text-ink-200' : 'text-ink-700')}>
        {tier.features.map((f) => (
          <li key={f} className="flex gap-2.5">
            <Check light={isHighlight} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Check({ light }: { light?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={'mt-0.5 shrink-0 ' + (light ? 'text-brand-300' : 'text-emerald-600')}
    >
      <circle cx="9" cy="9" r="8" fill="currentColor" opacity="0.15" />
      <path
        d="M5.5 9.5l2.4 2.4L13 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-ink-100 pb-7">
      <h3 className="font-semibold text-ink-900">{q}</h3>
      <p className="mt-2 text-ink-600 leading-relaxed">{children}</p>
    </div>
  );
}
