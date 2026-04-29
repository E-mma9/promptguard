export const metadata = { title: 'Verwerkersovereenkomst — PromptGuard' };

export default function DpaPage() {
  const today = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <>
      <h1>Verwerkersovereenkomst (DPA)</h1>
      <p className="text-ink-500 text-sm">Laatst bijgewerkt: {today}</p>

      <p>
        Deze verwerkersovereenkomst (hierna "DPA") maakt onderdeel uit van de overeenkomst tussen <strong>PromptGuard B.V.</strong> (verwerker) en de klantorganisatie (verwerkingsverantwoordelijke), en is van kracht zodra de klant zijn account aanmaakt en akkoord gaat tijdens registratie.
      </p>

      <h2>1. Definities</h2>
      <p>
        Termen uit de Algemene Verordening Gegevensbescherming (AVG / GDPR) hebben dezelfde betekenis in deze DPA. <em>Verwerker</em> = PromptGuard. <em>Verantwoordelijke</em> = de klantorganisatie die zich heeft aangemeld.
      </p>

      <h2>2. Onderwerp en doel van de verwerking</h2>
      <p>
        PromptGuard verwerkt namens de verantwoordelijke gegevens voor de detectie en rapportage van Shadow AI-data-exposure binnen de organisatie van de verantwoordelijke.
      </p>

      <h2>3. Aard en duur</h2>
      <p>
        De verwerking duurt voor de looptijd van de overeenkomst. Na beëindiging worden de gegevens binnen 30 dagen verwijderd of, op verzoek, in machine-leesbaar formaat geretourneerd.
      </p>

      <h2>4. Soorten persoonsgegevens</h2>
      <ul>
        <li>Pseudonieme installatie-ID's (SHA-256 hashes)</li>
        <li>Optionele team-tags (bv. "marketing", "finance")</li>
        <li>Tellingen van datatypes per detection event (geen waarden)</li>
        <li>Tijdstempels</li>
        <li>Webdomein van de gebruikte AI-tool</li>
      </ul>
      <p>
        <strong>Geen prompttekst, geen daadwerkelijke gevoelige waarden, geen identificeerbare medewerkergegevens worden verwerkt.</strong>
      </p>

      <h2>5. Categorieën betrokkenen</h2>
      <p>
        Werknemers, externe medewerkers en/of contractanten van de verantwoordelijke die de PromptGuard browser-extension gebruiken op een werkdevice.
      </p>

      <h2>6. Verplichtingen van de verwerker</h2>
      <ul>
        <li>Verwerkt persoonsgegevens uitsluitend op basis van schriftelijke instructies van de verantwoordelijke.</li>
        <li>Verbindt personen die toegang hebben tot persoonsgegevens contractueel tot geheimhouding.</li>
        <li>Treft passende technische en organisatorische maatregelen (zie bijlage A).</li>
        <li>Schakelt sub-verwerkers alleen in met goedkeuring van verantwoordelijke (zie <a href="/legal/sub-processors">sub-processors</a>).</li>
        <li>Helpt verantwoordelijke met antwoorden op verzoeken van betrokkenen binnen 5 werkdagen.</li>
        <li>Stelt verantwoordelijke onverwijld op de hoogte bij een datalek (binnen 24 uur na ontdekking).</li>
        <li>Wist of retourneert na contractbeëindiging alle persoonsgegevens binnen 30 dagen.</li>
        <li>Stelt alle informatie ter beschikking die nodig is om naleving aan te tonen, en werkt mee aan audits.</li>
      </ul>

      <h2>7. Doorgifte naar derde landen</h2>
      <p>
        Geen doorgifte naar buiten de EER zonder passende waarborgen (Standard Contractual Clauses + aanvullende waarborgen).
      </p>

      <h2>8. Bijlage A — Technische en organisatorische maatregelen</h2>
      <ul>
        <li>Encryptie at rest (AES-256) en in transit (TLS 1.3)</li>
        <li>Wachtwoorden gehashed met bcrypt</li>
        <li>Multi-factor authentication voor alle PromptGuard medewerkers</li>
        <li>Rolgebaseerde toegangscontrole (RBAC)</li>
        <li>Logging van alle administratieve handelingen</li>
        <li>Jaarlijkse pen-test door externe partij</li>
        <li>SOC2-/ISO 27001-gecertificeerde hostingpartner</li>
        <li>Datalekprocedure binnen 24 uur</li>
        <li>Awareness-training personeel jaarlijks</li>
      </ul>

      <h2>9. Bijlage B — Sub-processors</h2>
      <p>
        De actuele lijst staat op <a href="/legal/sub-processors">/legal/sub-processors</a>. Wij stellen verantwoordelijke 30 dagen vooraf op de hoogte bij wijzigingen, met een bezwaarrecht.
      </p>

      <h2>10. Contact</h2>
      <p>
        Vragen of bezwaren over deze DPA? Mail <a href="mailto:dpa@promptguard.nl" className="text-brand-700 font-semibold">dpa@promptguard.nl</a>.
      </p>
    </>
  );
}
