export const metadata = { title: 'Algemene voorwaarden — PromptGuard' };

export default function TermsPage() {
  const today = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <>
      <h1>Algemene voorwaarden</h1>
      <p className="text-ink-500 text-sm">Laatst bijgewerkt: {today}</p>

      <p>
        Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten tussen PromptGuard B.V. en de klantorganisatie die zich registreert voor onze dienst.
      </p>

      <h2>1. Definities</h2>
      <p>
        <strong>Dienst</strong>: het PromptGuard SaaS-dashboard en de bijbehorende browser-extension.{' '}
        <strong>Klant</strong>: de organisatie die zich heeft aangemeld voor een account.{' '}
        <strong>Eindgebruiker</strong>: een werknemer of contractant van de klant die de extension gebruikt.
      </p>

      <h2>2. Aanvang en duur</h2>
      <p>
        De overeenkomst gaat in op het moment dat de klant zich registreert. De eerste 14 dagen zijn een kosteloze proefperiode. Daarna gaat de overeenkomst over in een betaald maandelijks of jaarlijks abonnement, tenzij de klant tijdig opzegt.
      </p>

      <h2>3. Opzegging</h2>
      <p>
        Maandelijks abonnement: opzegbaar tegen einde van iedere maand, zonder opzegtermijn. Jaarlijks abonnement: opzegbaar tegen einde van de contracttermijn met een opzegtermijn van 30 dagen.
      </p>

      <h2>4. Betalingen</h2>
      <p>
        Vooruit per maand of jaar via Stripe. Bij wanbetaling kunnen wij de dienst opschorten na schriftelijke aanmaning en 14 dagen extra betalingstermijn.
      </p>

      <h2>5. Aansprakelijkheid</h2>
      <p>
        PromptGuard is niet aansprakelijk voor indirecte schade, gevolgschade, of gederfde winst. Onze totale aansprakelijkheid is beperkt tot het bedrag dat de klant in de 12 maanden vóór de schadeveroorzakende gebeurtenis heeft betaald.
      </p>

      <h2>6. Intellectueel eigendom</h2>
      <p>
        Alle intellectuele eigendomsrechten op de Dienst berusten bij PromptGuard. De klant krijgt een niet-exclusieve, niet-overdraagbare gebruikslicentie voor de duur van de overeenkomst. De broncode van de browser-extension is open source onder MIT-licentie.
      </p>

      <h2>7. Privacy &amp; verwerkersovereenkomst</h2>
      <p>
        Zie <a href="/legal/privacy">privacybeleid</a> en <a href="/legal/dpa">verwerkersovereenkomst</a>.
      </p>

      <h2>8. Uptime &amp; SLA</h2>
      <p>
        Standaard streven wij naar 99.5% uptime per maand, gemeten over de production-omgeving. Enterprise-klanten kunnen een aangepaste SLA met service-credits afnemen.
      </p>

      <h2>9. Wijzigingen voorwaarden</h2>
      <p>
        Substantiële wijzigingen worden minimaal 30 dagen vooraf gecommuniceerd. De klant heeft het recht de overeenkomst dan zonder gevolgen op te zeggen.
      </p>

      <h2>10. Toepasselijk recht</h2>
      <p>
        Op deze overeenkomst is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter te Amsterdam.
      </p>
    </>
  );
}
