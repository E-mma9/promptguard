import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Main } from '@/components/Main';
import { CtaSection } from '@/components/CtaSection';

export const metadata = {
  title: 'Voor de zorg — NEN 7510, Wabvpz, IGJ',
  description:
    'PromptGuard voor zorgaanbieders: NEN 7510-2 controls-mapping, Z-CERT-koppeling, datalekmelding binnen 24 uur. Speciaal voor de Nederlandse zorgsector.',
};

export default function ZorgPage() {
  return (
    <>
      <div className="bg-ink-950 text-white">
        <Header variant="dark" />
      </div>

      <Main>
      <section className="bg-ink-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full ring-1 ring-white/20 bg-white/5 text-xs font-medium">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Voor zorgaanbieders en zorginstellingen
            </div>
            <h1 className="mt-7 text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              ChatGPT-gebruik in de zorg —{' '}
              <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
                aantoonbaar onder controle.
              </span>
            </h1>
            <p className="mt-7 text-lg text-ink-300 max-w-2xl leading-relaxed">
              Zorgmedewerkers gebruiken AI om brieven te concipiëren, dossiers samen te vatten of
              codes te zoeken. Soms terecht, soms met BSN's, medicatie-informatie of cliëntcontext
              die er nooit had mogen staan. PromptGuard maakt dat zichtbaar — en bewijsbaar
              richting IGJ, AP en uw eigen Raad van Bestuur.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link href="/contact" className="btn-primary">
                Plan een gesprek met onze compliance-lead
              </Link>
              <a
                href="mailto:compliance@promptguard.nl?subject=NEN%207510%20documentatie%20opvragen"
                className="btn-secondary"
              >
                NEN 7510-evidence opvragen
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Wettelijk kader — zorg-specifiek */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <span className="section-label">Het kader</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-ink-900 leading-tight">
              Wat u onder de wet moet kunnen aantonen.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
            <KaderItem
              wet="NEN 7510-2:2017+A1:2020"
              wat="Verplicht op grond van het Besluit elektronische gegevensverwerking door zorgaanbieders (art. 3) gekoppeld aan de Wabvpz. Beheerd identiteitenbeheer, logische toegangsbeveiliging, audit-logging."
              promptguard="Volledige controls-mapping per maatregel, beschikbaar als bijlage bij uw eigen ISMS."
            />
            <KaderItem
              wet="AI Act art. 4 — AI-geletterdheid"
              wat="Sinds 2 feb 2025 van toepassing op iedere organisatie die AI inzet. U moet aantonen welke AI-tools binnen uw zorg in gebruik zijn en hoe staf hierin getraind is."
              promptguard="Continue registratie per tool en team. Trainingsmaterialen kunnen als policy-banner in de extensie worden uitgerold."
            />
            <KaderItem
              wet="AVG art. 9 — bijzondere persoonsgegevens"
              wat="Medische gegevens vallen onder art. 9 — verwerking in beginsel verboden, met uitzonderingen. Het plakken van behandel- of diagnose-context in ChatGPT is meestal géén toegestane uitzondering."
              promptguard="Detectie van zorgcontext (medicatie-, behandel- en diagnose-keywords). Severity hoog. Auditbaar via detector-versie."
            />
            <KaderItem
              wet="Wabvpz + Wkkgz"
              wat="Geheimhoudingsplicht en meldplicht voor incidenten. AI-tool-gebruik dat tot een datalek leidt, valt onder beide."
              promptguard="Datalekmelding binnen 24 uur richting uw zorgklant — strenger dan de wettelijke termijn van 72 uur richting AP."
            />
          </div>
        </div>
      </section>

      {/* Wat we leveren */}
      <section className="bg-ink-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <span className="section-label">Levering</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-ink-900 leading-tight">
              Wat zorgklanten krijgen.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Deliverable
              title="NEN 7510 controls-mapping"
              body="Per maatregel uit NEN 7510-2 beschreven hoe PromptGuard hieraan voldoet. Direct bruikbaar in uw eigen ISMS of voor uw IGJ-toetsing."
            />
            <Deliverable
              title="DPIA-bouwsteen"
              body="Voorgevulde DPIA-paragraaf over uw AI-tool-gebruik die u in uw bredere DPIA kunt opnemen. Bespaart uw FG drie tot vijf werkdagen."
            />
            <Deliverable
              title="Z-CERT-koppeling"
              body="Op verzoek: incident-meldingsketen via Z-CERT, het sectorale CSIRT voor de Nederlandse zorg. Inclusief threat-intelligence-uitwisseling."
            />
            <Deliverable
              title="Datalekprotocol"
              body="Datalekmelding richting uw organisatie binnen 24 uur na ontdekking — sneller dan de wettelijke 72 uur van AVG art. 33."
            />
            <Deliverable
              title="Penetratietest"
              body="Bij jaarcontracten ≥ € 25.000: eenmaal per jaar dragen wij € 5.000 bij aan een door u aangewezen CCV-erkende pentest-partij."
            />
            <Deliverable
              title="Code-escrow"
              body="Bij jaarcontracten ≥ € 50.000: broncode in escrow bij een notaris, voor continuïteit bij faillissement van de leverancier."
            />
          </div>
        </div>
      </section>

      {/* Hoe het werkt */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <span className="section-label">Implementatie</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-ink-900 leading-tight">
              In 90 dagen van pilot tot productie.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            <Stap
              n="1"
              titel="Week 1–2 — Discovery"
              body="Intake met uw FG, CISO en RvB. We delen onze NEN 7510-evidence, beantwoorden uw security-questionnaire en stellen samen de pilot-scope vast."
            />
            <Stap
              n="2"
              titel="Week 3–12 — Pilot"
              body="Uitrol bij één afdeling (50–100 medewerkers) via Intune. Wekelijkse check-ins. We leveren een interim-rapport voor uw RvB."
            />
            <Stap
              n="3"
              titel="Vanaf maand 4 — Productie"
              body="Organisatie-brede uitrol, jaarcontract. Kwartaalreview met uw FG en CISO. Inclusief case-study (optioneel, met uw goedkeuring)."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaSection
        heading="Klaar om dit met uw FG of CISO te bespreken?"
        body="We plannen een vrijblijvend gesprek van 30 minuten. Vooraf sturen we u alle juridische en technische documentatie, zodat u voorbereid het gesprek in kunt gaan."
        primary={{ label: 'Plan een gesprek', href: '/contact' }}
        secondary={{
          label: 'E-mail compliance@promptguard.nl',
          href: 'mailto:compliance@promptguard.nl',
          external: true,
        }}
      />
      </Main>

      <Footer />
    </>
  );
}

function KaderItem({ wet, wat, promptguard }: { wet: string; wat: string; promptguard: string }) {
  return (
    <div className="rounded-2xl ring-1 ring-ink-200 bg-white p-7">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">{wet}</div>
      <p className="mt-3 text-sm text-ink-700 leading-relaxed">{wat}</p>
      <div className="mt-5 pt-5 border-t border-ink-100">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
          PromptGuard
        </div>
        <p className="mt-2 text-sm text-ink-900 leading-relaxed">{promptguard}</p>
      </div>
    </div>
  );
}

function Deliverable({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-white p-7 ring-1 ring-ink-200">
      <h3 className="font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-ink-600 leading-relaxed">{body}</p>
    </div>
  );
}

function Stap({ n, titel, body }: { n: string; titel: string; body: string }) {
  return (
    <div className="rounded-2xl ring-1 ring-ink-200 bg-ink-50 p-7">
      <div className="text-5xl font-bold text-brand-600" aria-hidden="true">{n}</div>
      <h3 className="mt-4 font-semibold text-ink-900">
        <span className="sr-only">Stap {n}: </span>
        {titel}
      </h3>
      <p className="mt-2 text-sm text-ink-700 leading-relaxed">{body}</p>
    </div>
  );
}
