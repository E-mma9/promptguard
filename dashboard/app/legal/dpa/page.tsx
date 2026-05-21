import { PrintButton } from './PrintButton';

export const metadata = {
  title: 'Verwerkersovereenkomst (DPA) | PromptGuard',
  description:
    'Concept-verwerkersovereenkomst tussen klant en PromptGuard onder de AVG (art. 28).',
};

export default function DpaPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-3xl px-6 py-16 print:py-4">
        <div className="mb-10 print:mb-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            PromptGuard
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Verwerkersovereenkomst (concept)
          </h1>
          <p className="mt-3 text-gray-500 text-sm">
            Versie 1.0 — 20 mei 2026 · Conform AVG art. 28 / EDPB-template ·{' '}
            <PrintButton />
          </p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-[15px] leading-relaxed">

          <section className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900 print:border-none">
            <strong>Concept-versie.</strong> Deze template is een werkbaar
            uitgangspunt op basis van de EDPB-modelclausules. Vóór ondertekening
            moet de DPA door een jurist (eigen of van de Klant) worden gereviewd
            en aangevuld met partij-specifieke gegevens. PromptGuard ondertekent
            individuele DPA's op verzoek van de Klant.
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Partijen</h2>
            <p className="mt-3 text-gray-700">
              <strong>Verwerkingsverantwoordelijke (Klant):</strong>
            </p>
            <p className="mt-1 text-gray-700">
              Naam organisatie: [in te vullen]<br />
              Adres: [in te vullen]<br />
              KvK-nummer: [in te vullen]<br />
              Vertegenwoordigd door: [naam, functie]
            </p>
            <p className="mt-4 text-gray-700">
              <strong>Verwerker (Leverancier):</strong>
            </p>
            <p className="mt-1 text-gray-700">
              Naam: PromptGuard B.V. in oprichting<br />
              Tot oprichting handelend als eenmanszaak onder de naam PromptGuard<br />
              Adres: [in te vullen]<br />
              KvK-nummer: [in te vullen]<br />
              Contact: info@promptguard.nl
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Onderwerp</h2>
            <p className="mt-3 text-gray-700">
              Deze overeenkomst regelt de verwerking van persoonsgegevens door de
              Verwerker ten behoeve van de Verwerkingsverantwoordelijke in het
              kader van het gebruik van de PromptGuard browser-extensie en
              dashboard ("de Dienst"). Op deze overeenkomst is artikel 28 AVG van
              toepassing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              2. Aard, doel en duur van de verwerking
            </h2>
            <ul className="mt-3 list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Aard:</strong> opslaan en verwerken van aggregaat-metadata over detection events.</li>
              <li><strong>Doel:</strong> de Verwerkingsverantwoordelijke voorzien van inzicht in welke datacategorieën medewerkers invoeren in publieke AI-tools.</li>
              <li><strong>Duur:</strong> voor de duur van het abonnement, plus maximaal 30 dagen retentie na beëindiging.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              3. Categorieën van betrokkenen en persoonsgegevens
            </h2>
            <p className="mt-3 text-gray-700"><strong>Betrokkenen:</strong> medewerkers van de Verwerkingsverantwoordelijke die de browser-extensie hebben geïnstalleerd.</p>
            <p className="mt-3 text-gray-700"><strong>Verwerkte gegevens:</strong></p>
            <ul className="mt-1 list-disc list-inside space-y-1 text-gray-700">
              <li>Pseudoniem installatie-ID (SHA-256 hash, geen directe identificatie mogelijk)</li>
              <li>Categorie en aantal van gedetecteerde datatypes (bv. "bsn: 1, iban-nl: 2")</li>
              <li>Severity-classificatie per event</li>
              <li>Naam van de AI-tool waarop gedetecteerd is</li>
              <li>Tijdstempel van detectie</li>
              <li>Optioneel: team-tag (door IT geconfigureerd)</li>
              <li>Karakter-aantal van de prompt (geen inhoud)</li>
              <li>Versie van de detectie-engine</li>
            </ul>
            <p className="mt-3 text-gray-700">
              <strong>De Verwerker verwerkt nadrukkelijk geen:</strong> prompttekst,
              wachtwoorden, namen, e-mailadressen, BSN/IBAN-waarden, AI-antwoorden,
              of browser-historie buiten de geconfigureerde AI-tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              4. Verplichtingen van de Verwerker
            </h2>
            <p className="mt-3 text-gray-700">De Verwerker:</p>
            <ul className="mt-1 list-disc list-inside space-y-1 text-gray-700">
              <li>Verwerkt persoonsgegevens uitsluitend op gedocumenteerde instructie van de Verwerkingsverantwoordelijke.</li>
              <li>Zorgt dat personen die persoonsgegevens verwerken zich tot geheimhouding hebben verbonden.</li>
              <li>Treft passende technische en organisatorische maatregelen, zoals beschreven in bijlage A.</li>
              <li>Ondersteunt de Verwerkingsverantwoordelijke bij betrokkenenverzoeken en DPIA's voor zover redelijkerwijs mogelijk.</li>
              <li>Verleent op verzoek alle informatie die nodig is om naleving van art. 28 AVG aan te tonen en stelt audits door of namens de Verwerkingsverantwoordelijke toe, maximaal éénmaal per jaar tenzij na een incident.</li>
              <li>Meldt datalekken aan de Verwerkingsverantwoordelijke binnen 24 uur na ontdekking, met de informatie genoemd in art. 33 lid 3 AVG.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              5. Subverwerkers
            </h2>
            <p className="mt-3 text-gray-700">
              De Verwerkingsverantwoordelijke geeft algemene toestemming voor het
              inzetten van de subverwerkers genoemd in bijlage B. Bij toevoeging of
              vervanging van een subverwerker informeert de Verwerker minimaal 30
              dagen vooraf. De Klant kan binnen die termijn gemotiveerd bezwaar
              maken.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              6. Doorgifte buiten de EER
            </h2>
            <p className="mt-3 text-gray-700">
              Alle verwerkingsactiviteiten vinden plaats binnen de Europese
              Economische Ruimte (EER), specifiek binnen de EU (zie bijlage B).
              Doorgifte naar derde landen vindt niet plaats zonder voorafgaande
              schriftelijke toestemming van de Verwerkingsverantwoordelijke en
              uitsluitend op basis van een geldig doorgiftemechanisme onder
              hoofdstuk V AVG.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              7. Beëindiging en teruggave
            </h2>
            <p className="mt-3 text-gray-700">
              Bij beëindiging van de hoofdovereenkomst verwijdert de Verwerker alle
              persoonsgegevens binnen 30 dagen, behoudens een wettelijke
              bewaarverplichting. Op verzoek levert de Verwerker een
              export-bestand (CSV/JSON) van de detection events vóór verwijdering.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              8. Aansprakelijkheid
            </h2>
            <p className="mt-3 text-gray-700">
              De aansprakelijkheid van de Verwerker onder deze DPA is gemaximeerd
              conform de aansprakelijkheidsregeling in de hoofdovereenkomst /
              algemene voorwaarden. Deze beperking laat de hoofdelijke
              aansprakelijkheid van Verwerker jegens betrokkenen op grond van
              <strong> artikel 82 lid 2 AVG </strong>onverlet. Bij een door beide partijen
              veroorzaakt incident geldt artikel 82 lid 4 AVG: regres mogelijk naar
              rato van ieders aandeel in de schade. Geen contractsbepaling kan de
              aansprakelijkheid jegens een betrokkene op grond van dwingend
              gegevensbeschermingsrecht uitsluiten of beperken.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              9. Ondernemingsraad — WOR art. 27
            </h2>
            <p className="mt-3 text-gray-700">
              De Verwerkingsverantwoordelijke verklaart bewust te zijn dat de
              inzet van PromptGuard als monitoring-systeem voor personeel onder de
              werkingssfeer valt van <strong>artikel 27 lid 1 onder l van de Wet
              op de ondernemingsraden</strong> (WOR), waaruit voortvloeit dat de
              ondernemingsraad instemmingsrecht heeft op de implementatie en het
              wijzigen van zulke systemen. De Verwerker stelt de
              Verwerkingsverantwoordelijke een document-template ter beschikking
              om dit verzoek aan de OR voor te leggen.
            </p>
            <p className="mt-3 text-gray-700">
              De Verwerkingsverantwoordelijke draagt zelf de
              verantwoordelijkheid om de OR-instemming te verkrijgen vóór
              productie-uitrol. De Verwerker geeft geen juridisch advies hierover.
            </p>
          </section>

          <hr className="my-10 border-gray-200" />

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              Bijlage A — Technische en organisatorische maatregelen
            </h2>
            <ul className="mt-3 list-disc list-inside space-y-1 text-gray-700">
              <li>Pseudonimisering van installatie-ID via SHA-256.</li>
              <li>Versleuteling in transit: TLS 1.2+.</li>
              <li>Versleuteling at rest: AES-256 (Neon Postgres standaard).</li>
              <li>Toegangsbeheer: rolgebaseerd (admin/viewer); MFA aanbevolen voor admin.</li>
              <li>Audit-logging van administratieve handelingen.</li>
              <li>Rate-limiting op ingest-API (60/min per organisatie).</li>
              <li>Wachtwoordhashing: bcrypt cost 12.</li>
              <li>Periodieke afhankelijkheids-scans (npm audit) en patching.</li>
              <li>Incident-response procedure inclusief lekmeldingsketen.</li>
              <li>Back-ups dagelijks; bewaartermijn 30 dagen.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              Bijlage B — Subverwerkers
            </h2>
            <table className="mt-3 w-full text-sm border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-2 border-b">Subverwerker</th>
                  <th className="text-left p-2 border-b">Functie</th>
                  <th className="text-left p-2 border-b">Locatie</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border-b">Vercel Inc. (via Vercel B.V., EU-entiteit)</td>
                  <td className="p-2 border-b">Hosting van het dashboard en API</td>
                  <td className="p-2 border-b">EU — Frankfurt (fra1)</td>
                </tr>
                <tr>
                  <td className="p-2 border-b">Neon Inc.</td>
                  <td className="p-2 border-b">PostgreSQL-database</td>
                  <td className="p-2 border-b">EU-regio (Frankfurt / Amsterdam)</td>
                </tr>
                <tr>
                  <td className="p-2">Stripe Payments Europe Ltd.</td>
                  <td className="p-2">Betaalverwerking (geen detection-data)</td>
                  <td className="p-2">EU — Ierland</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-3 text-gray-600 text-sm">
              Wijzigingen in deze lijst worden minimaal 30 dagen vooraf
              gecommuniceerd via het dashboard of per e-mail aan de geregistreerde
              admin-contactpersoon van de Klant.
            </p>
          </section>

          <hr className="my-10 border-gray-200" />

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Ondertekening</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div>
                <p className="font-semibold text-gray-900">Verwerkingsverantwoordelijke</p>
                <p className="mt-6">Naam: ___________________________</p>
                <p className="mt-3">Functie: __________________________</p>
                <p className="mt-3">Datum: ___________________________</p>
                <p className="mt-6">Handtekening:</p>
                <div className="mt-2 h-16 border-b border-gray-400"></div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Verwerker (PromptGuard)</p>
                <p className="mt-6">Naam: ___________________________</p>
                <p className="mt-3">Functie: __________________________</p>
                <p className="mt-3">Datum: ___________________________</p>
                <p className="mt-6">Handtekening:</p>
                <div className="mt-2 h-16 border-b border-gray-400"></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
