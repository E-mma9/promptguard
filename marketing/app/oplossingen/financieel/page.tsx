import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Main } from '@/components/Main';
import { CtaSection } from '@/components/CtaSection';

export const metadata = {
  title: 'Voor de financiële sector — DORA, DNB, AFM',
  description:
    'PromptGuard voor banken, verzekeraars en pensioenfondsen: ICT-third-party-register voor DORA-naleving. Per-tool inventarisatie van staf-AI-gebruik.',
};

export default function FinancieelPage() {
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
              DORA in werking sinds 17 januari 2025
            </div>
            <h1 className="mt-7 text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Uw <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
                ICT-third-party-register
              </span>{' '}
              voor staf-AI-gebruik.
            </h1>
            <p className="mt-7 text-lg text-ink-300 max-w-2xl leading-relaxed">
              Onder DORA art. 28-30 moeten financiële instellingen een register bijhouden van alle
              ICT-derde-partij-diensten — inclusief publieke AI-tools die door medewerkers worden
              gebruikt voor klantanalyse, modelvalidatie of code-review. PromptGuard levert die
              registratie automatisch.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link href="/contact" className="btn-primary">Plan een gesprek</Link>
              <Link href="/wettelijk-kader" className="btn-secondary">Lees het kader</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <span className="section-label">Waarom dit telt</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-ink-900 leading-tight">
              DORA voegt drie verplichtingen toe die niemand handmatig kan bijhouden.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card
              tag="Art. 28"
              title="Strategie voor ICT-third-party-risico"
              body="Schriftelijk beleid dat ook gevoelige AI-tool-gebruik door staf afdekt — niet alleen ingekochte SaaS-contracten."
            />
            <Card
              tag="Art. 29"
              title="Pre-contractuele beoordeling"
              body="Vóór gebruik moet u risico inschatten. Bij gratis AI-tools is er geen contract — dus is monitoring de enige werkbare evaluatie."
            />
            <Card
              tag="Art. 30"
              title="Register van ICT-derde-partij-diensten"
              body="Bijgewerkt overzicht van alle gebruikte ICT-services. PromptGuard registreert continu welke AI-tools door welke afdelingen worden gebruikt."
            />
          </div>
        </div>
      </section>

      <section className="bg-ink-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <span className="section-label">Wat we leveren</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-ink-900 leading-tight">
              Aanvullend op het standaardpakket.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Deliverable
              title="DORA-register-export"
              body="Maandelijkse export in het door DNB geprefereerde formaat van alle in gebruik zijnde AI-tools per afdeling."
            />
            <Deliverable
              title="DNB Q&A-mapping"
              body="Antwoorden op de DNB-Q&A over AI-gebruik gemapt aan de detectie-categorieën van PromptGuard."
            />
            <Deliverable
              title="MaRisk-evidence"
              body="Voor verzekeraars: bewijslast onder de operationele-risico-pijler van Solvency II en MaRisk."
            />
            <Deliverable
              title="Modelvalidatie-trail"
              body="Detecteert wanneer modelvalidatoren productie-data of klantmodellen in publieke AI-tools gebruiken — direct relevant voor SR 11-7 / TRIM-equivalenten."
            />
            <Deliverable
              title="Geheimhouding & beroepsregels"
              body="Voor accountancy-divisies binnen banken: NBA-richtlijn 7 over geheimhoudingsplicht."
            />
            <Deliverable
              title="ESG-compliance-spoor"
              body="Inzicht in AI-tool-gebruik t.b.v. CSRD-rapportage over governance van AI-systemen."
            />
          </div>
        </div>
      </section>

      <CtaSection
        heading="Klaar voor uw eerste DORA-toetsing?"
        body="Stuur uw security-questionnaire — we beantwoorden binnen 3 werkdagen."
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

function Card({ tag, title, body }: { tag: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl ring-1 ring-ink-200 bg-white p-7">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">{tag}</div>
      <h3 className="mt-3 text-lg font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-ink-600 leading-relaxed">{body}</p>
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
