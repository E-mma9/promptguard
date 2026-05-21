import Link from 'next/link';

export const metadata = {
  title: 'Wettelijk kader — AI Act, AVG, NIS2, DORA en NEN 7510 | PromptGuard',
  description:
    'Welke EU- en Nederlandse wetten verplichten organisaties tot monitoring en governance van generatieve-AI-gebruik door medewerkers, en hoe PromptGuard daarbij ondersteunt.',
};

export default function WettelijkKaderPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-4xl px-6 py-16">

        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            PromptGuard · Compliance-kader
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
            Wat de wet u nu al verplicht — en hoe PromptGuard dat bewijsbaar maakt
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Sinds 2025 geldt voor vrijwel elke Nederlandse organisatie minimaal één
            wettelijke verplichting rond het gebruik van generatieve AI door
            medewerkers. Deze pagina vat per wet samen <strong>wat u moet kunnen
            aantonen</strong>, en welk deel daarvan PromptGuard concreet ondersteunt.
            Geen marketingbeloftes — verwijzingen naar artikelnummers, zodat uw
            jurist of DPO de bewering direct kan natrekken.
          </p>
          <p className="mt-3 text-gray-500 text-sm">Laatste update: 20 mei 2026</p>
        </div>

        <section className="rounded-lg bg-amber-50 border border-amber-200 p-5 mb-12 text-sm leading-relaxed text-amber-900">
          <strong>Belangrijke nuance.</strong> De wet verplicht u niet om <em>PromptGuard</em> in te zetten — net zoals
          de wet u niet verplicht een specifiek antivirusproduct te draaien. De wet
          verplicht u tot <strong>passende technische en organisatorische maatregelen</strong> en tot het
          <strong> kunnen aantonen</strong> daarvan. PromptGuard is een van de manieren om dat bewijs te
          leveren, en is daar specifiek voor ontworpen.
        </section>

        <div className="space-y-14">

          {/* AI Act */}
          <section>
            <div className="flex items-baseline gap-3 mb-3">
              <h2 className="text-2xl font-bold text-gray-900">1. EU AI Act</h2>
              <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold">
                In werking
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Verordening (EU) 2024/1689. Fasering: prohibited practices 2 feb 2025,
              GPAI 2 aug 2025, high-risk-systems 2 aug 2026, volledige werking 2 aug 2027.
            </p>

            <div className="mt-5 rounded-lg ring-1 ring-gray-200 p-5 bg-gray-50">
              <h3 className="font-semibold text-gray-900">
                Artikel 4 — AI-geletterdheid
                <span className="ml-2 text-xs font-normal text-gray-500">(in werking sinds 2 februari 2025)</span>
              </h3>
              <p className="mt-2 text-gray-700 text-sm leading-relaxed">
                <em>"Providers and deployers of AI systems shall take measures to ensure, to their best
                extent, a sufficient level of AI literacy of their staff and other persons dealing
                with the operation and use of AI systems on their behalf."</em>
              </p>
              <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                <strong>Waarop het neerkomt:</strong> iedere organisatie die ChatGPT, Claude, Gemini,
                Copilot of vergelijkbare AI inzet — ook bij vrijwillig gebruik door medewerkers — moet
                aantoonbaar zorgen voor voldoende AI-geletterdheid. Geen drempel qua omvang. Geen
                uitzondering voor MKB.
              </p>
              <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                <strong>Wat de toezichthouder zal vragen om aan te tonen:</strong>
              </p>
              <ul className="mt-2 ml-5 list-disc text-sm text-gray-700 space-y-1">
                <li>Welke AI-tools binnen uw organisatie worden gebruikt</li>
                <li>Wie ervan gebruikmaakt en in welke context</li>
                <li>Welke instructie/training medewerkers hebben gehad</li>
                <li>Hoe u monitort of die training effect heeft (gedragsverandering)</li>
              </ul>
              <p className="mt-4 text-sm text-emerald-800 bg-emerald-50 ring-1 ring-emerald-200 rounded-lg p-3 leading-relaxed">
                <strong>PromptGuard levert:</strong> een continue, geanonimiseerde registratie van het
                AI-tool-gebruik per medewerker-installatie, per team, per tool en per
                datacategorie. Plus een kwartaalrapport dat als bijlage bij uw AI-Act-dossier
                kan worden gevoegd. Hiermee wordt de tweede en vierde vraag van een
                toezichthouder beantwoordbaar in plaats van speculatief.
              </p>
            </div>

            <div className="mt-4 rounded-lg ring-1 ring-gray-200 p-5 bg-gray-50">
              <h3 className="font-semibold text-gray-900">
                Artikel 26 — verplichtingen voor deployers van high-risk AI-systemen
                <span className="ml-2 text-xs font-normal text-gray-500">(2 augustus 2026)</span>
              </h3>
              <p className="mt-2 text-gray-700 text-sm leading-relaxed">
                Als AI wordt ingezet in een <strong>high-risk context</strong> (HR-besluiten,
                kredietbeoordeling, onderwijsplaatsing, kritieke infrastructuur, zorg, rechtshandhaving,
                migratie, justitie — bijlage III) gelden strenge plichten: monitoring tijdens gebruik,
                logregistratie minimaal 6 maanden, incident-melding, menselijk toezicht.
              </p>
              <p className="mt-3 text-sm text-emerald-800 bg-emerald-50 ring-1 ring-emerald-200 rounded-lg p-3 leading-relaxed">
                <strong>PromptGuard levert:</strong> de logregistratie voor staf-interactie met
                AI-tools. Voor zorgaanbieders relevant: zelfs als u ChatGPT alleen voor algemene
                taken laat gebruiken, is de drempel naar "high-risk-context" met BSN-aanrakingen
                snel bereikt.
              </p>
            </div>

            <div className="mt-4 text-sm text-gray-700 leading-relaxed">
              <strong>Boetes:</strong> tot 7% wereldwijde jaaromzet of € 35 miljoen voor prohibited practices;
              3% / € 15 miljoen voor andere overtredingen. Toezichthouder NL: <strong>Autoriteit
              Persoonsgegevens</strong> in samenwerking met sectorspecifieke toezichthouders (DNB, AFM,
              IGJ, RDI).
            </div>
          </section>

          {/* AVG */}
          <section>
            <div className="flex items-baseline gap-3 mb-3">
              <h2 className="text-2xl font-bold text-gray-900">2. AVG (GDPR)</h2>
              <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold">
                In werking
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Verordening (EU) 2016/679. Van toepassing op iedere organisatie die
              persoonsgegevens verwerkt. De Autoriteit Persoonsgegevens heeft sinds 2023 meermaals
              gewaarschuwd voor risico's van generatieve AI op de werkvloer.
            </p>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg ring-1 ring-gray-200 p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-900 text-sm">Art. 5 lid 2 — verantwoordingsplicht</h3>
                <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                  De verwerkingsverantwoordelijke is verplicht <em>aan te kunnen tonen</em> dat hij voldoet aan
                  de beginselen van lid 1 (rechtmatigheid, doelbinding, dataminimalisatie, juistheid, opslagbeperking, integriteit).
                </p>
              </div>
              <div className="rounded-lg ring-1 ring-gray-200 p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-900 text-sm">Art. 24 — verantwoordelijkheid</h3>
                <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                  Passende technische én organisatorische maatregelen om aan te tonen dat de verwerking
                  conform deze verordening plaatsvindt. Maatregelen worden zo nodig geëvalueerd en geactualiseerd.
                </p>
              </div>
              <div className="rounded-lg ring-1 ring-gray-200 p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-900 text-sm">Art. 25 — privacy by design</h3>
                <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                  Standaard alleen die persoonsgegevens worden verwerkt die nodig zijn voor het specifieke
                  doel. Toepasbaar op AI-tool-gebruik: medewerkers moeten worden gestuurd om geen
                  persoonsgegevens te plakken die niet relevant zijn.
                </p>
              </div>
              <div className="rounded-lg ring-1 ring-gray-200 p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-900 text-sm">Art. 32 — beveiliging van de verwerking</h3>
                <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                  Passende technische en organisatorische maatregelen, "rekening houdend met de stand van de techniek".
                  Sinds 2024 is monitoring van shadow-AI-gebruik onderdeel van "stand van de techniek" geworden.
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm text-emerald-800 bg-emerald-50 ring-1 ring-emerald-200 rounded-lg p-3 leading-relaxed">
              <strong>PromptGuard levert:</strong> de technische maatregel én het bewijs dat u die maatregel
              gerichte heeft genomen. Bij een AP-onderzoek of betrokkenenverzoek kunt u
              binnen één klik uw kwartaalrapport overhandigen.
            </p>

            <p className="mt-4 text-sm text-gray-700 leading-relaxed">
              <strong>Boetes:</strong> tot 4% wereldwijde jaaromzet of € 20 miljoen.
            </p>
          </section>

          {/* NIS2 */}
          <section>
            <div className="flex items-baseline gap-3 mb-3">
              <h2 className="text-2xl font-bold text-gray-900">3. NIS2 / Cyberbeveiligingswet</h2>
              <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold">
                In werking
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Richtlijn (EU) 2022/2555. Van toepassing op "essential entities" (energie, zorg, water,
              transport, financieel, digitale infrastructuur, publieke administratie, ruimte) en
              "important entities" (post, afval, chemie, voedsel, productie van medische
              hulpmiddelen, manufacturing, digitale aanbieders, onderzoek). Nederlandse implementatie:
              Cyberbeveiligingswet (in behandeling Tweede Kamer; tot inwerkingtreding geldt directe
              werking voor zover mogelijk).
            </p>

            <div className="mt-5 rounded-lg ring-1 ring-gray-200 p-5 bg-gray-50">
              <h3 className="font-semibold text-gray-900">
                Artikel 21 — risico-management-maatregelen
              </h3>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                Verplichte minimum-maatregelen onder NIS2, voor zover relevant voor PromptGuard:
              </p>
              <ul className="mt-2 ml-5 list-disc text-sm text-gray-700 space-y-1">
                <li><strong>a)</strong> Beleid voor risico-analyse en beveiliging van informatiesystemen</li>
                <li><strong>d)</strong> Beveiliging in toeleveringsketen (waaronder SaaS-tools zoals ChatGPT)</li>
                <li><strong>g)</strong> Basale cyberhygiëne-praktijken en cybersecurity-training</li>
                <li><strong>i)</strong> Beleid en procedures voor toegangscontrole en asset-management</li>
              </ul>
              <p className="mt-3 text-sm text-emerald-800 bg-emerald-50 ring-1 ring-emerald-200 rounded-lg p-3 leading-relaxed">
                <strong>PromptGuard levert:</strong> bewijsmateriaal voor (a) risico-analyse op
                AI-tool-gebruik, (d) inzicht in welke externe SaaS-AI-tools actief gebruikt worden,
                (g) cybersecurity-trainingsondersteuning via waarschuwingsbanners op het moment van overtreding,
                (i) per-team asset-overzicht.
              </p>
            </div>

            <p className="mt-4 text-sm text-gray-700 leading-relaxed">
              <strong>Boetes:</strong> essential entities tot 2% wereldwijde jaaromzet of € 10 miljoen;
              important entities tot 1,4% / € 7 miljoen. Bestuurders kunnen <strong>persoonlijk
              aansprakelijk</strong> worden gehouden bij grove nalatigheid (art. 20).
            </p>
          </section>

          {/* DORA */}
          <section>
            <div className="flex items-baseline gap-3 mb-3">
              <h2 className="text-2xl font-bold text-gray-900">4. DORA — Digital Operational Resilience Act</h2>
              <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold">
                In werking
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Verordening (EU) 2022/2554. In werking sinds 17 januari 2025. Van toepassing op
              alle financiële instellingen (banken, verzekeraars, pensioenfondsen,
              betalingsinstellingen, beleggingsondernemingen) plus hun ICT-derde-partij-aanbieders.
            </p>
            <p className="mt-3 text-gray-700 leading-relaxed">
              Hoofdstuk V (ICT-third-party risk management) verplicht financiële instellingen tot het
              bijhouden van een <strong>register van alle gebruikte ICT-services</strong> — inclusief generatieve
              AI-tools die door medewerkers worden gebruikt voor klantanalyse, rapportage of code.
            </p>
            <p className="mt-4 text-sm text-emerald-800 bg-emerald-50 ring-1 ring-emerald-200 rounded-lg p-3 leading-relaxed">
              <strong>PromptGuard levert:</strong> automatische inventarisatie van AI-tool-gebruik per
              tool en per team, exporteerbaar voor opname in het DORA ICT-third-party-register.
            </p>
            <p className="mt-3 text-sm text-gray-700">
              <strong>Toezichthouder NL:</strong> DNB en AFM.
            </p>
          </section>

          {/* NEN 7510 + Wabvpz */}
          <section>
            <div className="flex items-baseline gap-3 mb-3">
              <h2 className="text-2xl font-bold text-gray-900">5. Zorgsector — NEN 7510 + Wabvpz</h2>
              <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold">
                In werking
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Voor zorgaanbieders die elektronische uitwisseling van patiëntgegevens doen is naleving
              van NEN 7510-2:2017+A1:2020 verplicht, op grond van het Besluit elektronische
              gegevensverwerking door zorgaanbieders (art. 3) gekoppeld aan de Wabvpz. Dit raakt
              direct het gebruik van publieke AI-tools door zorgmedewerkers: zodra een medewerker BSN-,
              behandel- of medicatie-context in ChatGPT plakt, ontstaat een verwerking die onder
              NEN 7510 valt.
            </p>
            <p className="mt-3 text-gray-700 leading-relaxed">
              Een gedetailleerde mapping van PromptGuard tegen de NEN 7510-2 maatregelen vindt u op{' '}
              <Link href="/security/nen7510" className="text-indigo-600 underline">
                /security/nen7510
              </Link>
              .
            </p>
            <p className="mt-3 text-sm text-gray-700">
              <strong>Toezichthouder:</strong> Inspectie Gezondheidszorg en Jeugd (IGJ),
              naast de AP.
            </p>
          </section>

          {/* Sectorspecifiek */}
          <section>
            <div className="flex items-baseline gap-3 mb-3">
              <h2 className="text-2xl font-bold text-gray-900">6. Sectorspecifieke verplichtingen</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Onderwijs:</strong> Onderwijsinspectie en SIVON-richtlijn voor AI in het onderwijs (2024)
                stellen dat onderwijsinstellingen zicht moeten hebben op AI-gebruik door staf en leerlingen.
              </p>
              <p>
                <strong>Publieke sector / overheid:</strong> Baseline Informatiebeveiliging Overheid (BIO)
                maatregel 12.6.2 vereist beheer van software op werkplekken; AI-tools vallen onder shadow IT.
              </p>
              <p>
                <strong>Advocatuur:</strong> NOvA-gedragsregels en geheimhoudingsplicht; cliëntdossier-data in
                publieke AI-tools is in principe een schending van art. 11a Advocatenwet.
              </p>
              <p>
                <strong>Accountancy:</strong> NBA-richtlijn 7 over geheimhouding; klantdata in ChatGPT raakt
                deze richtlijn direct.
              </p>
            </div>
          </section>

          {/* Hoe PromptGuard ondersteunt */}
          <section className="rounded-2xl bg-gray-900 text-white p-8">
            <h2 className="text-2xl font-bold mb-4">Wat PromptGuard concreet aanlevert</h2>
            <div className="space-y-4 text-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm leading-relaxed">
                <div>
                  <strong className="text-white">AI-tool inventarisatie</strong>
                  <p>Welke AI-tools worden binnen uw organisatie gebruikt, door welk team, hoe vaak.</p>
                </div>
                <div>
                  <strong className="text-white">Per-categorie data-exposure-overzicht</strong>
                  <p>Hoe vaak medewerkers BSN, IBAN, KvK, salaris-, contract- en zorggegevens in AI-tools invoeren.</p>
                </div>
                <div>
                  <strong className="text-white">Per-team risico-attributie</strong>
                  <p>Welke afdeling de meeste high-severity events veroorzaakt — input voor gerichte training.</p>
                </div>
                <div>
                  <strong className="text-white">Kwartaal-bewijspakket</strong>
                  <p>Exporteerbaar rapport (CSV + JSON) per kwartaal, klaar voor opname in uw AI-Act-register, NIS2-dossier of AP-correspondentie.</p>
                </div>
                <div>
                  <strong className="text-white">Audit-trail</strong>
                  <p>Versie van de detectie-engine per event, zodat een auditor exact kan reconstrueren welke regels op welk moment actief waren.</p>
                </div>
                <div>
                  <strong className="text-white">EU-data-residency</strong>
                  <p>Alle verwerking binnen de EU (Frankfurt). Geen Amerikaanse subverwerkers voor klantdata.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700 text-sm text-gray-300 leading-relaxed">
              <strong className="text-white">Wat PromptGuard niét levert:</strong> een vrijwaring tegen
              boetes, een vervanging van uw eigen DPO-functie, of een dekking voor de
              keuzes die uw medewerkers maken. Wij leveren bewijsmateriaal. De juridische
              kwalificatie en organisatorische opvolging blijft bij u.
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Vragen of een gesprek?</h2>
            <p className="text-gray-700 leading-relaxed">
              Voor compliance-vragen of een afspraak met de PromptGuard-verantwoordelijke
              voor informatiebeveiliging:{' '}
              <a href="mailto:compliance@promptguard.nl" className="text-indigo-600 underline">
                compliance@promptguard.nl
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
