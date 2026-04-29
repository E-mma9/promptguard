export const metadata = { title: 'Privacybeleid — PromptGuard' };

export default function PrivacyPage() {
  const today = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <>
      <h1>Privacybeleid</h1>
      <p className="text-ink-500 text-sm">Laatst bijgewerkt: {today}</p>

      <p>
        Dit privacybeleid beschrijft welke persoonsgegevens PromptGuard verwerkt over jou als bezoeker van onze website, gebruiker van ons dashboard, en eindgebruiker van onze browser-extension.
      </p>

      <h2>1. Verwerkingsverantwoordelijke</h2>
      <p>
        PromptGuard B.V. (KvK xxx, gevestigd in Amsterdam, hierna "PromptGuard") is verwerkingsverantwoordelijke voor de eigen website en accounts van klanten. Voor data die via klantorganisaties wordt verwerkt fungeren wij als verwerker — zie onze <a href="/legal/dpa">verwerkersovereenkomst</a>.
      </p>

      <h2>2. Welke gegevens verwerken wij?</h2>
      <h3>2.1 Bij websitegebruik</h3>
      <ul>
        <li>IP-adres (geanonimiseerd na 24 uur)</li>
        <li>Browser-type en versie</li>
        <li>Bezochte pagina's</li>
        <li>Referrer-URL</li>
      </ul>
      <p>
        Wij gebruiken <strong>geen</strong> Google Analytics, Facebook Pixel, of andere third-party trackers. Alleen first-party server-logs voor security en stabiliteit.
      </p>

      <h3>2.2 Bij dashboard-account</h3>
      <ul>
        <li>Werk-e-mailadres</li>
        <li>Volledige naam (optioneel)</li>
        <li>Wachtwoord (gehashed met bcrypt, nooit in clear text opgeslagen)</li>
        <li>Organisatienaam</li>
        <li>Aanmaakdatum, laatste-loginstempel</li>
      </ul>

      <h3>2.3 Via de browser-extension</h3>
      <p>
        Detection events bevatten <strong>geen prompttekst en geen daadwerkelijke gevoelige waarden</strong>. Alleen geanonimiseerde tellingen zoals <em>"14× BSN, 2× IBAN-NL gedetecteerd op chatgpt.com om 14:23"</em>. Daarnaast:
      </p>
      <ul>
        <li>Pseudonieme installatie-ID (SHA-256 hash van een random UUID, niet herleidbaar tot persoon)</li>
        <li>Optioneel team-tag (door IT geconfigureerd)</li>
        <li>Welke AI-tool gebruikt werd</li>
        <li>Tijdstempel</li>
      </ul>

      <h2>3. Doel &amp; rechtsgrond</h2>
      <table>
        <thead>
          <tr><th>Doel</th><th>Rechtsgrond</th></tr>
        </thead>
        <tbody>
          <tr><td>Account aanmaken &amp; beheren</td><td>Uitvoering overeenkomst</td></tr>
          <tr><td>Verlenen van de detection-dienst</td><td>Uitvoering overeenkomst</td></tr>
          <tr><td>Beveiliging &amp; misbruikpreventie</td><td>Gerechtvaardigd belang</td></tr>
          <tr><td>Wettelijke verplichtingen (AVG, AI Act)</td><td>Wettelijke verplichting</td></tr>
        </tbody>
      </table>

      <h2>4. Bewaartermijnen</h2>
      <ul>
        <li>Server-logs: 30 dagen</li>
        <li>Account-gegevens: tot 30 dagen na contractbeëindiging, daarna verwijderd of geanonimiseerd</li>
        <li>Detection events: standaard 24 maanden, configureerbaar per klantorganisatie</li>
        <li>Factuurgegevens: 7 jaar (fiscale bewaarplicht)</li>
      </ul>

      <h2>5. Met wie delen we?</h2>
      <p>
        Alleen met door ons aangewezen sub-processors die ondersteunen bij hosting, monitoring en betalingen. De volledige lijst staat op <a href="/legal/sub-processors">/legal/sub-processors</a>. Geen data wordt buiten de EU verwerkt zonder passende waarborgen.
      </p>

      <h2>6. Jouw rechten</h2>
      <p>
        Je hebt het recht op inzage, correctie, verwijdering, beperking, en overdraagbaarheid van je persoonsgegevens. Mail <a href="mailto:privacy@promptguard.nl" className="text-brand-700 font-semibold">privacy@promptguard.nl</a> — wij reageren binnen 30 dagen.
      </p>
      <p>
        Klacht? Je kunt die ook indienen bij de <a href="https://www.autoriteitpersoonsgegevens.nl/" target="_blank" rel="noreferrer" className="text-brand-700 font-semibold">Autoriteit Persoonsgegevens</a>.
      </p>

      <h2>7. Beveiliging</h2>
      <ul>
        <li>TLS 1.3 in transit, AES-256 at rest</li>
        <li>Wachtwoorden gehashed met bcrypt (cost 10)</li>
        <li>Sessie-cookies HttpOnly, SameSite=Lax, Secure in productie</li>
        <li>Pen-test bij elke major release</li>
        <li>SOC2-/ISO 27001-gecertificeerde hosting</li>
      </ul>

      <h2>8. Wijzigingen</h2>
      <p>
        Wij actualiseren dit beleid wanneer onze dienstverlening verandert. Substantiële wijzigingen worden minimaal 30 dagen vooraf gecommuniceerd via e-mail naar account-admins.
      </p>

      <h2>9. Contact</h2>
      <p>
        <strong>Functionaris Gegevensbescherming</strong> — <a href="mailto:fg@promptguard.nl" className="text-brand-700 font-semibold">fg@promptguard.nl</a>
      </p>
    </>
  );
}
