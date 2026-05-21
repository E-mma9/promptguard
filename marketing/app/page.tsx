import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ComplianceBadges } from '@/components/ComplianceBadges';

export default function HomePage() {
  return (
    <>
      {/* ============================================================
          HERO — dark, gradient mesh background
          ============================================================ */}
      <section className="relative bg-ink-950 overflow-hidden">
        <div className="absolute inset-0 mesh-bg" aria-hidden="true" />
        <div className="absolute inset-0 grain" aria-hidden="true" />
        <Header variant="dark" />

        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full ring-1 ring-white/20 bg-white/5 text-xs font-medium text-white/90">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            AI Act art. 4 in werking sinds 2 februari 2025
          </div>

          <h1 className="mt-7 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.05]">
            Uw medewerkers gebruiken ChatGPT.{' '}
            <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
              De toezichthouder gaat ervan uit dat u dat weet.
            </span>
          </h1>

          <p className="mt-7 text-lg md:text-xl text-ink-300 max-w-2xl mx-auto leading-relaxed">
            PromptGuard registreert lokaal welke gevoelige datacategorieën medewerkers in ChatGPT,
            Claude, Gemini en Copilot invoeren — en levert het bewijsmateriaal dat de AI Act, AVG,
            NIS2 en NEN 7510 van u verlangen.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="btn-primary">
              Demo aanvragen
              <Arrow />
            </Link>
            <Link href="/wettelijk-kader" className="btn-secondary">
              Wat de wet u verplicht
            </Link>
          </div>

          <p className="mt-7 text-xs text-ink-400">
            Detectie 100% lokaal · EU-only hosting (Frankfurt) · Geen prompttekst verlaat de browser
          </p>
        </div>

        {/* Compliance band */}
        <div className="relative border-t border-white/10 bg-white/[0.02] py-7">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-center text-xs uppercase tracking-[0.18em] text-ink-500 mb-5">
              Ontworpen tegen het Europese en Nederlandse compliance-kader
            </p>
            <ComplianceBadges light />
          </div>
        </div>
      </section>

      {/* ============================================================
          PROBLEM
          ============================================================ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <span className="section-label">Het probleem</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-ink-900 leading-tight">
              Uw medewerkers gebruiken AI — alleen niet zoals uw beleid voorschrijft.
            </h2>
            <p className="mt-5 text-lg text-ink-600 leading-relaxed">
              Uit recent onderzoek blijkt dat een groot deel van de medewerkers wekelijks tot dagelijks
              een vorm van publieke AI gebruikt voor werk. De meerderheid van hun werkgevers heeft daar
              geen zicht op. Voor toezichthouders is dat geen excuus — voor u is het wel een direct
              compliance-tekort.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
            <Stat
              number="78%"
              label="van medewerkers"
              body="gebruikt regelmatig publieke generatieve AI voor werk, vaak zonder dit aan IT te melden."
            />
            <Stat
              number="2 feb 2025"
              label="AI Act art. 4"
              body="verplicht alle organisaties AI-geletterdheid van personeel aantoonbaar te maken."
            />
            <Stat
              number="€ 35M"
              label="maximum boete"
              body="onder de AI Act voor prohibited practices, plus persoonlijke bestuurdersaansprakelijkheid onder NIS2 art. 20."
            />
          </div>

          <p className="mt-10 text-xs text-ink-500 italic max-w-2xl leading-relaxed">
            Cijfers zijn indicatief en gebaseerd op publieke marktonderzoeken (Cisco AI Readiness 2024,
            Microsoft Work Trend Index). Boetebedragen volgen Verordening (EU) 2024/1689 art. 99.
          </p>
        </div>
      </section>

      {/* ============================================================
          SOLUTION — 3 columns
          ============================================================ */}
      <section className="bg-ink-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="section-label">De oplossing</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-ink-900 leading-tight">
              Detecteren. Registreren. Aantonen.
            </h2>
            <p className="mt-5 text-lg text-ink-600">
              Eén browser-extensie. Eén dashboard. Alle bewijs op één plek.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Feature
              icon="eye"
              title="Detecteren"
              body="Lokale detectie van BSN, IBAN, KvK, BTW, salarisstroken, contracten, broncode en AI-/cloud API-keys — direct in de browser. De prompttekst zelf verlaat het toestel nooit."
              meta="29 datatypes · NL-specifiek met checksums · Open auditable code"
            />
            <Feature
              icon="shield"
              title="Registreren"
              body="Per medewerker, team, tool en datatype: hoeveel events, welke severity, op welk moment. Drie modi: stil monitoren, actief waarschuwen, of helemaal blokkeren."
              meta="EU-only · Geen prompttekst · Pseudoniem installatie-ID"
            />
            <Feature
              icon="document"
              title="Aantonen"
              body="Kwartaalrapport als bijlage bij uw AI Act-deployer-register, AVG-verwerkingsregister, NIS2-dossier of cyberverzekeringsvragenlijst. Eén klik, klaar."
              meta="CSV + JSON export · Met detector-versie · Auditbaar"
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          USE CASES — sector cards
          ============================================================ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <span className="section-label">Per sector</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-ink-900 leading-tight">
              Eén product. Andere bewijslast per sector.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-5">
            <SectorCard
              href="/oplossingen/zorg"
              tag="Zorg"
              title="Voor zorgaanbieders"
              body="NEN 7510-2 controls-mapping kant-en-klaar. Z-CERT-koppeling op aanvraag. Datalekmelding binnen 24 uur richting zorgklant — strenger dan de AVG-termijn."
              kicker="Wabvpz · NEN 7510 · IGJ · AVG art. 9"
            />
            <SectorCard
              href="/oplossingen/financieel"
              tag="Financieel"
              title="Voor banken & verzekeraars"
              body="ICT-third-party-register voor DORA-naleving. Per-tool inventarisatie van staf-AI-gebruik bij klantanalyses, modelvalidatie of code-review. DNB/AFM-klaar."
              kicker="DORA · DNB · AFM · AVG"
            />
            <SectorCard
              href="/oplossingen/mkb"
              tag="MKB"
              title="Voor het Nederlandse MKB"
              body="Voor accountants, juristen, IT-bureaus, marketingbureaus en consultancies — alle bedrijven die met klantdata werken en geen DPO in huis hebben. Eenvoudig opzetbaar."
              kicker="AVG · AI Act art. 4 · NOvA · NBA"
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          PRIVACY MOAT — what we do/don't see
          ============================================================ */}
      <section className="bg-ink-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-30" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="section-label-light">Privacy-by-design</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-white">
              De prompttekst verlaat de browser nooit.
            </h2>
            <p className="mt-5 text-lg text-ink-300 leading-relaxed">
              Een DPO kan dit in vijf minuten zelf verifiëren via de Network-tab van Chrome DevTools.
              Geen audit, geen leverancier-belofte — gewoon technisch waarneembaar.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <Panel
              positive
              title="Wat we wél zien"
              items={[
                'Aantal events per dag, tool en team',
                'Categorie en aantal van gedetecteerde datatypes',
                'Severity (hoog/midden/laag) per event',
                'Pseudoniem installatie-ID (SHA-256)',
                'Tijdstempel en versie van detector',
              ]}
            />
            <Panel
              title="Wat we NIET zien"
              items={[
                'De prompttekst zelf',
                'De daadwerkelijke BSN- of IBAN-waarden',
                'AI-antwoorden van ChatGPT/Claude/etc.',
                'Wachtwoorden, e-mails, persoonsnamen',
                'Browser-historie buiten AI-tools',
              ]}
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          PRICING TEASER
          ============================================================ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="section-label">Prijzen</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-ink-900">
              Eenvoudig. Per organisatie. Geen verrassingen.
            </h2>
            <p className="mt-5 text-lg text-ink-600">
              € 7,00 per medewerker per maand voor MKB. Volume-korting vanaf 100 werkplekken.
              Enterprise vanaf € 4,00/wp. Zorg met NEN 7510-evidence vanaf € 5,00/wp.
            </p>
            <div className="mt-8">
              <Link href="/prijzen" className="btn-primary-dark">
                Bekijk alle pakketten
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA
          ============================================================ */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Klaar om uw AI-gebruik bewijsbaar te maken?
          </h2>
          <p className="mt-5 text-lg text-brand-100 max-w-2xl mx-auto">
            30 minuten demo. Vrijblijvend. We laten u zien hoe een DPO uw kwartaalrapport zou lezen.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="btn-primary">
              Demo aanvragen
              <Arrow />
            </Link>
            <a href="mailto:info@promptguard.nl" className="btn-secondary">
              Stel een vraag
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ============================================================
   SMALL COMPONENTS
   ============================================================ */

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10m0 0L8 3m4 4l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Stat({ number, label, body }: { number: string; label: string; body: string }) {
  return (
    <div className="rounded-2xl ring-1 ring-ink-200 bg-white p-7">
      <div className="text-4xl md:text-5xl font-bold tracking-tight text-ink-900">{number}</div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">{label}</div>
      <p className="mt-3 text-sm text-ink-600 leading-relaxed">{body}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
  meta,
}: {
  icon: 'eye' | 'shield' | 'document';
  title: string;
  body: string;
  meta: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-7 ring-1 ring-ink-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-11 h-11 rounded-lg bg-brand-50 ring-1 ring-brand-100 grid place-items-center text-brand-700">
        <Icon name={icon} />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-ink-600 leading-relaxed">{body}</p>
      <p className="mt-5 text-xs text-ink-500 border-t border-ink-100 pt-4">{meta}</p>
    </div>
  );
}

function SectorCard({
  href,
  tag,
  title,
  body,
  kicker,
}: {
  href: string;
  tag: string;
  title: string;
  body: string;
  kicker: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl bg-gradient-to-br from-ink-900 to-ink-950 p-7 text-white ring-1 ring-ink-800 hover:ring-brand-500 transition-all hover:-translate-y-0.5"
    >
      <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-brand-300">
        {tag}
      </span>
      <h3 className="mt-3 text-xl font-semibold leading-snug">{title}</h3>
      <p className="mt-3 text-sm text-ink-300 leading-relaxed">{body}</p>
      <div className="mt-6 pt-5 border-t border-ink-800 flex items-center justify-between text-xs">
        <span className="text-ink-400">{kicker}</span>
        <span className="text-brand-300 font-semibold group-hover:translate-x-1 transition-transform">
          Lees meer →
        </span>
      </div>
    </Link>
  );
}

function Panel({
  positive,
  title,
  items,
}: {
  positive?: boolean;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
      <div className="flex items-center gap-2.5">
        <div
          className={
            'w-7 h-7 grid place-items-center rounded-full ' +
            (positive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300')
          }
        >
          {positive ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7l2.5 2.5L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M4 4l6 6m0-6l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-ink-300">
        {items.map((it) => (
          <li key={it} className="flex gap-2">
            <span className="text-ink-500">·</span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Icon({ name }: { name: 'eye' | 'shield' | 'document' }) {
  if (name === 'eye') {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M2 11s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="11" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (name === 'shield') {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 2l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V5l8-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M7.5 11l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M5 3h8l4 4v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M13 3v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 12h8M7 15h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
