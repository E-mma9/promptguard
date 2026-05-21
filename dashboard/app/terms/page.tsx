export const metadata = {
  title: 'Algemene voorwaarden | PromptGuard',
  description:
    'Algemene voorwaarden van PromptGuard — gebruiksvoorwaarden, dienstniveau en aansprakelijkheidsbeperking.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            PromptGuard
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
            Algemene voorwaarden
          </h1>
          <p className="mt-4 text-gray-500">
            Versie 1.0 — laatste update: 20 mei 2026
          </p>
        </div>

        <div className="prose prose-gray max-w-none space-y-10">

          <section className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
            <strong>Concept-versie.</strong> Deze voorwaarden zijn een werkbaar
            uitgangspunt en moeten vóór commerciële inzet worden gereviewd door een
            jurist. PromptGuard wordt geleverd door een Nederlandse onderneming
            (gegevens onderaan deze pagina).
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Definities</h2>
            <ul className="mt-3 list-disc list-inside space-y-2 text-gray-600">
              <li><strong>Leverancier:</strong> de onderneming achter PromptGuard, zoals onderaan vermeld.</li>
              <li><strong>Klant:</strong> de rechtspersoon of organisatie die een PromptGuard-abonnement afneemt.</li>
              <li><strong>Dienst:</strong> de PromptGuard browser-extensie en bijbehorend dashboard.</li>
              <li><strong>Persoonsgegevens:</strong> zoals gedefinieerd in artikel 4 lid 1 AVG.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. Aard van de dienst</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              PromptGuard is een hulpmiddel dat patronen herkent die mogelijk
              gevoelige data bevatten en hier statistieken over levert aan de
              IT-beheerder van de Klant. De Dienst <strong>vervangt geen menselijke
              beoordeling</strong> en is geen vervanging van interne procedures,
              bewustwordingstraining of het beleid van de Klant rond AI-gebruik.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              3. Best-effort-detectie
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              De detectie-engine werkt op basis van patroon-matching, checksums
              (BSN-elfproef, IBAN mod-97, Luhn) en heuristieken. Geen enkele
              detectie-engine — die van PromptGuard of een derde — kan 100%
              recall garanderen. False negatives (gevoelige data die niet wordt
              gedetecteerd) en false positives (onschuldige tekst die als
              gevoelig wordt aangeduid) kunnen voorkomen.
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              <strong>De Klant blijft te allen tijde verwerkingsverantwoordelijke
              voor de eigen data en draagt de eindverantwoordelijkheid voor het
              voorkomen van datadeling.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              4. Dienstniveau (SLA)
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              De Leverancier streeft een beschikbaarheid van 99,5% op jaarbasis na
              voor de dashboard-component. Geplande onderhoudsvensters worden vooraf
              gecommuniceerd. De extensie werkt offline; tijdelijke
              dashboard-onbeschikbaarheid leidt niet tot dataverlies — events
              worden lokaal in de browser bewaard en opnieuw verzonden zodra het
              dashboard beschikbaar is.
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Bij structurele onderschrijding (meer dan 2% per maand) heeft de Klant
              recht op een pro-rata creditering, te verrekenen met een volgende
              factuur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              5. Verwerkersovereenkomst en privacy
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              De Leverancier handelt als verwerker in de zin van de AVG. Voor elke
              Klant geldt de aanvullende{' '}
              <a href="/privacy" className="text-indigo-600 underline hover:text-indigo-800">
                privacyverklaring
              </a>{' '}
              en een ondertekende verwerkersovereenkomst (DPA), die integraal deel
              uitmaakt van deze overeenkomst. Bij tegenstrijdigheid prevaleert de
              DPA.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              6. Tarieven en betaling
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Abonnementen worden maandelijks of jaarlijks vooraf gefactureerd.
              Tarieven zijn excl. btw. De Leverancier kan tarieven jaarlijks
              indexeren op basis van CBS-CPI; verhogingen boven CPI worden 60 dagen
              vooraf aangekondigd en geven de Klant recht op tussentijdse
              opzegging.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              7. Looptijd en opzegging
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Maandabonnementen lopen per kalendermaand en kunnen op elk moment
              worden opgezegd tegen het einde van de lopende maand. Jaarabonnementen
              lopen voor 12 maanden en verlengen automatisch tenzij uiterlijk 30
              dagen voor het einde wordt opgezegd. Opzegging via{' '}
              <a
                href="mailto:info@promptguard.nl"
                className="text-indigo-600 underline hover:text-indigo-800"
              >
                info@promptguard.nl
              </a>{' '}
              of via het dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              8. Aansprakelijkheid
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              De totale aansprakelijkheid van de Leverancier, ongeacht de
              rechtsgrond, is per gebeurtenis en in totaal beperkt tot het bedrag
              dat de Klant in de twaalf (12) maanden voorafgaand aan de
              schadeveroorzakende gebeurtenis aan abonnementsvergoeding heeft
              betaald, met een maximum van € 10.000 per gebeurtenis. Iedere
              aansprakelijkheid voor indirecte schade — waaronder gevolgschade,
              gederfde omzet, reputatieschade en boetes opgelegd door
              toezichthouders — is uitgesloten, tenzij sprake is van opzet of
              bewuste roekeloosheid van de Leverancier.
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Voornoemde beperkingen gelden niet voor zover deze in strijd zijn
              met dwingend Nederlands recht.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              9. Overmacht
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Geen partij is aansprakelijk voor tekortkomingen als gevolg van
              overmacht. Onder overmacht wordt onder meer verstaan: uitval van
              netwerk- of cloudinfrastructuur waarop de Dienst draait, juridisch
              ingrijpen van toezichthouders en beveiligingsincidenten bij derden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              10. Toepasselijk recht en geschillen
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Op deze overeenkomst is uitsluitend Nederlands recht van toepassing.
              Geschillen worden in eerste aanleg voorgelegd aan de bevoegde rechter
              in het arrondissement waar de Leverancier is gevestigd.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">11. Contact</h2>
            <address className="mt-3 not-italic text-gray-600 leading-relaxed">
              PromptGuard B.V. in oprichting<br />
              Tot oprichting handelend als eenmanszaak onder de naam PromptGuard<br />
              KvK-nummer: [in te vullen]<br />
              btw-id: [in te vullen]<br />
              Vestigingsadres: [in te vullen]<br />
              <a
                href="mailto:info@promptguard.nl"
                className="text-indigo-600 underline hover:text-indigo-800"
              >
                info@promptguard.nl
              </a>
            </address>
          </section>
        </div>
      </div>
    </main>
  );
}
