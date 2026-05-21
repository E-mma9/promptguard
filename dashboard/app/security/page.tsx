export const metadata = {
  title: 'Beveiliging & compliance | PromptGuard',
  description:
    'Hoe PromptGuard data-minimalisatie, EU-data-residency en compliance-principes (AVG, NEN 7510, ISO 27001) in zijn architectuur heeft verankerd.',
};

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            PromptGuard
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
            Beveiliging &amp; compliance
          </h1>
          <p className="mt-4 text-gray-500">
            Laatste update: 20 mei 2026
          </p>
        </div>

        <div className="prose prose-gray max-w-none space-y-10">

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              1. Het ontwerpprincipe
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              PromptGuard is ontworpen rond één regel: <strong>prompttekst verlaat
              de browser nooit</strong>. De detectie van gevoelige data (BSN, IBAN,
              KvK, salarisstroken, API-keys, etc.) gebeurt 100% lokaal in de browser
              van de medewerker. Naar onze servers stromen uitsluitend
              geaggregeerde tellingen.
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Dit is geen marketing-belofte maar een architectuur-keuze die u zelf
              kunt verifiëren — zie sectie 3 hieronder.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              2. EU-data-residency
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Alle dashboard-componenten draaien uitsluitend binnen de EU:
            </p>
            <ul className="mt-3 list-disc list-inside space-y-2 text-gray-600">
              <li>
                <strong>Applicatie-hosting:</strong> Vercel, regio <code className="bg-gray-100 px-1 rounded">fra1</code> (Frankfurt, Duitsland).
                Vastgelegd in <code className="bg-gray-100 px-1 rounded">vercel.json</code>.
              </li>
              <li>
                <strong>Database:</strong> PostgreSQL via Neon, EU-regio
                (Frankfurt of Amsterdam). Per klant configureerbaar.
              </li>
              <li>
                <strong>Logging:</strong> alleen via Vercel-eigen logs, geen externe
                APM/log-aggregator die data buiten de EU verwerkt.
              </li>
              <li>
                <strong>Geen US-subprocessors</strong> voor de verwerking van
                klantgegevens. De volledige subprocessor-lijst staat in onze
                verwerkersovereenkomst.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              3. Wat wij wél en niet versturen
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Hieronder een complete voorbeeld-payload zoals onze browser-extensie
              die naar onze ingest-API stuurt. Een DPO of beveiligingsspecialist kan
              dit zelf verifiëren via de Network-tab van Chrome DevTools:
            </p>
            <pre className="mt-3 rounded-lg bg-gray-900 text-gray-100 p-4 text-xs overflow-x-auto">
{`POST /api/ingest
Authorization: Bearer pg_live_…
Content-Type: application/json

{
  "events": [{
    "tool": "chatgpt",
    "source": "paste",
    "counts": { "bsn": 1, "iban-nl": 1 },
    "severityCounts": { "high": 2, "medium": 0, "low": 0 },
    "total": 2,
    "highest": "high",
    "characterCount": 312,
    "detectorVersion": "1.0.0",
    "installId": "5f3a7b9c…",  // SHA-256 per installatie
    "team": "marketing",        // optioneel, door IT gezet
    "action": "warned",
    "detectedAt": "2026-05-20T14:32:11Z"
  }]
}`}
            </pre>
            <p className="mt-4 text-gray-600 leading-relaxed">
              <strong>Niet aanwezig in de payload:</strong>
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
              <li>De prompttekst zelf</li>
              <li>De daadwerkelijke BSN/IBAN-waarden of andere gedetecteerde strings</li>
              <li>AI-antwoorden van ChatGPT/Claude/etc.</li>
              <li>E-mailadressen of namen van medewerkers</li>
              <li>Browser-historie buiten de geconfigureerde AI-tools</li>
              <li>IP-adressen (worden niet bewust gelogd; eventueel kortstondig in netwerk-laag)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              4. Open auditbaarheid van de detectielogica
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              De volledige detectie-engine (<code className="bg-gray-100 px-1 rounded">detector.js</code>)
              is leesbaar in de geïnstalleerde browser-extensie en wordt gepubliceerd
              als open-source. Elke detectie-regel — van de BSN-elfproef tot de
              IBAN mod-97 — is door u te verifiëren.
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Iedere detection-event bevat een <code className="bg-gray-100 px-1 rounded">detectorVersion</code>-veld
              dat een auditor in staat stelt te reconstrueren welke ruleset op het
              moment van detectie actief was.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              5. Compliance-positionering
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              PromptGuard is <strong>ontworpen volgens</strong> de principes van:
            </p>
            <ul className="mt-3 list-disc list-inside space-y-2 text-gray-600">
              <li>
                <strong>AVG (GDPR):</strong> data-minimalisatie (art. 5 lid 1 sub c),
                privacy-by-design (art. 25), beveiliging van de verwerking (art. 32).
                Wij treden op als verwerker; klant is verwerkingsverantwoordelijke.
                Een verwerkersovereenkomst (DPA) is beschikbaar voor elke klant.
              </li>
              <li>
                <strong>NEN 7510-2:</strong> de Nederlandse norm voor
                informatiebeveiliging in de zorg. Onze architectuur is opgezet volgens
                de NEN 7510-principes (logische toegangsbeveiliging, audit-logging,
                beheerd identiteitenbeheer). Een gedetailleerde{' '}
                <a href="/security/nen7510" className="text-indigo-600 underline hover:text-indigo-800">
                  controls-mapping per NEN 7510-maatregel
                </a>{' '}
                is beschikbaar voor klanten in de zorgsector. Externe NEN 7510-certificering staat
                op de roadmap.
              </li>
              <li>
                <strong>ISO/IEC 27001:2022:</strong> de internationale
                ISMS-standaard. PromptGuard is gestructureerd volgens de Annex
                A-controls die relevant zijn voor een SaaS van deze omvang.
                Externe ISO 27001-certificering is een roadmap-item.
              </li>
              <li>
                <strong>EU AI Act:</strong> PromptGuard is geen AI-systeem in de zin van
                de AI Act. Onze kwartaalrapportage kan klanten <em>ondersteunen</em>
                bij het opstellen van hun deployer-inventarisatie van AI-tools binnen
                de organisatie.
              </li>
            </ul>
            <p className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm leading-relaxed">
              <strong>Belangrijke nuance:</strong> PromptGuard <em>ondersteunt</em>
              uw compliance-programma. Het product maakt uw organisatie niet vanzelf
              AVG-/AI Act-/NEN 7510-conform — die kwalificatie is afhankelijk van
              uw eigen verwerkingen, beleid en (waar relevant) externe audits.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              6. Beveiligingsmaatregelen
            </h2>
            <ul className="mt-3 list-disc list-inside space-y-2 text-gray-600">
              <li>
                <strong>Transport:</strong> uitsluitend TLS 1.2+. HTTP-only fallback
                op productie geblokkeerd in de extensie.
              </li>
              <li>
                <strong>Authenticatie extensie ↔ dashboard:</strong> per-organisatie
                API-key (prefix <code className="bg-gray-100 px-1 rounded">pg_live_</code>),
                regenereerbaar in het dashboard.
              </li>
              <li>
                <strong>Wachtwoorden:</strong> bcrypt (cost 12). Sessies via signed
                JWT in HttpOnly + Secure + SameSite=Lax cookies (jose, HS256).
              </li>
              <li>
                <strong>Rate-limiting:</strong> 60 requests/minuut per organisatie op
                de ingest-API.
              </li>
              <li>
                <strong>Toegangscontrole:</strong> rolgebaseerd (admin/viewer). Audit-log
                van administratieve handelingen.
              </li>
              <li>
                <strong>Data-retentie:</strong> detection events worden bewaard zolang
                de klant gebruik maakt van de dienst. Bij beëindiging worden alle
                klantgegevens binnen 30 dagen verwijderd.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              7. Verwerkersovereenkomst (DPA)
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Elke klant ondertekent een verwerkersovereenkomst voor het in gebruik
              nemen van PromptGuard. Een conceptversie is op aanvraag beschikbaar
              via{' '}
              <a
                href="mailto:info@promptguard.nl"
                className="text-indigo-600 underline hover:text-indigo-800"
              >
                info@promptguard.nl
              </a>{' '}
              en wordt na inloggen ook beschikbaar gesteld onder Instellingen &gt;
              Juridische documenten.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              8. Beveiligingsincidenten melden
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Beveiligingsonderzoekers en klanten kunnen kwetsbaarheden vertrouwelijk
              melden via{' '}
              <a
                href="mailto:security@promptguard.nl"
                className="text-indigo-600 underline hover:text-indigo-800"
              >
                security@promptguard.nl
              </a>
              . Wij bevestigen ontvangst binnen 2 werkdagen en houden u op de hoogte
              van de afhandeling. Coordinated disclosure conform NCSC-richtlijnen.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
