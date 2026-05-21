import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Main } from '@/components/Main';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata = {
  title: 'Wettelijk kader — AI Act, AVG, NIS2, DORA, NEN 7510',
  description:
    'Welke EU- en Nederlandse wetten organisaties verplichten tot monitoring en governance van AI-gebruik door medewerkers — en hoe PromptGuard daarbij ondersteunt.',
};

type Wet = {
  naam: string;
  sinds: string;
  wieValtEronder: string;
  watEist: string;
  watLevertPG: string;
  boete?: string;
};

const wetten: Wet[] = [
  {
    naam: 'AI Act — Art. 4 (AI-geletterdheid)',
    sinds: '2 februari 2025',
    wieValtEronder:
      'Iedere organisatie die AI inzet — geen uitzondering voor MKB, geen drempel qua omvang.',
    watEist:
      'Aantoonbaar zorgen voor voldoende AI-geletterdheid van staf. Toezichthouder verwacht: welke AI-tools worden gebruikt, door wie, met welke training en welke monitoring.',
    watLevertPG:
      'Continue registratie van AI-tool-gebruik per medewerker-installatie, team en datacategorie. Kwartaalrapport als bijlage bij uw AI-Act-dossier.',
    boete:
      'Tot 7% wereldwijde jaaromzet of € 35M voor prohibited practices; 3% / € 15M voor andere overtredingen.',
  },
  {
    naam: 'AVG — Art. 24, 25, 32 (verantwoordingsplicht)',
    sinds: 'Mei 2018',
    wieValtEronder: 'Iedere organisatie die persoonsgegevens verwerkt.',
    watEist:
      'Passende technische én organisatorische maatregelen, "rekening houdend met de stand van de techniek". Sinds 2024 is monitoring van shadow-AI-gebruik onderdeel van die "stand van de techniek".',
    watLevertPG:
      'De technische maatregel én het bewijs dat u die maatregel gericht heeft genomen. Bij AP-onderzoek of betrokkenenverzoek: rapport binnen één klik.',
    boete: 'Tot 4% wereldwijde jaaromzet of € 20M.',
  },
  {
    naam: 'NIS2 / Cyberbeveiligingswet — Art. 21',
    sinds: 'EU-richtlijn 17 oktober 2024',
    wieValtEronder:
      'Essential entities (zorg, energie, water, transport, financieel, digitale infrastructuur, publieke administratie) en important entities (post, afval, chemie, voedsel, manufacturing, ICT-managed services).',
    watEist:
      'Risico-analyse, beveiliging toeleveringsketen (incl. SaaS-tools), cyberhygiëne en training, toegangscontrole en asset-management.',
    watLevertPG:
      'Bewijsmateriaal voor (a) risico-analyse op AI-tool-gebruik, (d) inzicht in externe SaaS-AI-tools, (g) trainings-ondersteuning via banners, (i) per-team asset-overzicht.',
    boete:
      'Essential entities tot 2% wereldwijde jaaromzet of € 10M. Bestuurders persoonlijk aansprakelijk bij grove nalatigheid (art. 20).',
  },
  {
    naam: 'DORA — Hoofdstuk V (ICT-third-party risk)',
    sinds: '17 januari 2025',
    wieValtEronder:
      'Alle financiële instellingen: banken, verzekeraars, pensioenfondsen, betalingsinstellingen, beleggingsondernemingen.',
    watEist:
      'Register van alle gebruikte ICT-services, inclusief generatieve AI-tools die door staf worden gebruikt voor klantanalyse of modelvalidatie.',
    watLevertPG:
      'Automatische inventarisatie van AI-tool-gebruik per tool en team, exporteerbaar voor opname in het DORA ICT-third-party-register.',
  },
  {
    naam: 'NEN 7510-2 + Wabvpz',
    sinds: 'Verplicht voor zorgaanbieders sinds 2018',
    wieValtEronder:
      'Zorgaanbieders die elektronische uitwisseling van patiëntgegevens doen (vrijwel iedereen in de Nederlandse zorg).',
    watEist:
      'Beheerd identiteitenbeheer, logische toegangsbeveiliging, audit-logging, datalekprotocol — zodra een medewerker BSN- of medicatiecontext in ChatGPT plakt, ontstaat een verwerking onder NEN 7510.',
    watLevertPG:
      'Volledige controls-mapping per NEN 7510-maatregel beschikbaar. Z-CERT-koppeling op aanvraag. Datalekmelding binnen 24 uur.',
  },
];

export default function WettelijkKaderPage() {
  return (
    <>
      <div className="bg-ink-950 text-white">
        <Header variant="dark" />
      </div>

      <Main>
      <section className="bg-ink-950 text-white">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-16 text-center">
          <span className="section-label-light">Compliance-kader</span>
          <h1 className="mt-3 text-5xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05]">
            Wat de wet u nu al verplicht.
          </h1>
          <p className="mt-7 text-lg text-ink-300 max-w-2xl mx-auto leading-relaxed">
            Sinds 2025 geldt voor vrijwel elke Nederlandse organisatie minimaal één wettelijke
            verplichting rond het gebruik van generatieve AI door medewerkers. Per wet vermeld met
            artikelnummers — uw jurist of DPO kan elke claim direct natrekken.
          </p>
        </div>
      </section>

      <section className="bg-amber-50 border-y border-amber-200 py-6">
        <div className="mx-auto max-w-7xl px-6 text-sm text-amber-900 leading-relaxed">
          <strong>Belangrijke nuance.</strong> De wet verplicht u niet om <em>PromptGuard</em> in
          te zetten — net zoals de wet u niet verplicht een specifiek antivirusproduct te
          draaien. De wet verplicht u tot <strong>passende technische en organisatorische
          maatregelen</strong> en tot het <strong>kunnen aantonen</strong> daarvan. PromptGuard
          is een van de manieren om dat bewijs te leveren, en is daar specifiek voor ontworpen.
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6 space-y-12">
          {wetten.map((wet) => (
            <article key={wet.naam} className="rounded-2xl ring-1 ring-ink-200 p-7 md:p-9">
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="text-2xl font-bold tracking-tight text-ink-900">{wet.naam}</h2>
                <span className="text-xs uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-red-50 text-red-800 font-semibold ring-1 ring-red-200">
                  In werking
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-500">Sinds: {wet.sinds}</p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-500">
                    Wie valt eronder
                  </div>
                  <p className="mt-2 text-sm text-ink-700 leading-relaxed">{wet.wieValtEronder}</p>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-500">
                    Wat de wet eist
                  </div>
                  <p className="mt-2 text-sm text-ink-700 leading-relaxed">{wet.watEist}</p>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-emerald-50 ring-1 ring-emerald-200 p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-800">
                  Wat PromptGuard levert
                </div>
                <p className="mt-2 text-sm text-emerald-950 leading-relaxed">{wet.watLevertPG}</p>
              </div>

              {wet.boete && (
                <p className="mt-5 text-xs text-ink-500 leading-relaxed">
                  <strong className="text-ink-700">Boete bij niet-naleving:</strong> {wet.boete}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="bg-ink-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-ink-900">
            Wilt u het uitgebreide juridische kader?
          </h2>
          <p className="mt-5 text-lg text-ink-600">
            Onze klantenpagina bevat het volledige overzicht inclusief sectorspecifieke
            verplichtingen, een uitgebreide kader-beschrijving en links naar broncode-evidence.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`${APP_URL}/wettelijk-kader`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary-dark"
              aria-label="Volledig kader bekijken — opent in een nieuw tabblad"
            >
              Volledig kader bekijken
            </a>
            <Link href="/contact" className="btn-secondary-light">Plan een gesprek</Link>
          </div>
        </div>
      </section>
      </Main>

      <Footer />
    </>
  );
}
