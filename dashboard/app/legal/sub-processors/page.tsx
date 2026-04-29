export const metadata = { title: 'Sub-processors — PromptGuard' };

export default function SubProcessorsPage() {
  const today = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <>
      <h1>Sub-processors</h1>
      <p className="text-ink-500 text-sm">Laatst bijgewerkt: {today}</p>

      <p>
        Onderstaande partijen verwerken namens PromptGuard persoonsgegevens van klantorganisaties. Wij hebben met elke sub-processor een verwerkersovereenkomst die vergelijkbare waarborgen biedt als onze eigen DPA met klanten.
      </p>

      <table>
        <thead>
          <tr>
            <th>Sub-processor</th>
            <th>Doel</th>
            <th>Locatie</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Hetzner Online GmbH</strong></td>
            <td>Hosting van applicatieserver en database</td>
            <td>Falkenstein, Duitsland (EU)</td>
          </tr>
          <tr>
            <td><strong>Cloudflare, Inc.</strong></td>
            <td>CDN, DDoS-bescherming, WAF</td>
            <td>EU edge nodes (data residency Frankfurt)</td>
          </tr>
          <tr>
            <td><strong>Postmark (ActiveCampaign)</strong></td>
            <td>Transactionele e-mail (verificatie, password reset)</td>
            <td>Verenigde Staten — onder SCC's</td>
          </tr>
          <tr>
            <td><strong>Stripe Payments Europe Ltd.</strong></td>
            <td>Betaalverwerking (alleen factuurgegevens, geen detection data)</td>
            <td>Ierland (EU)</td>
          </tr>
          <tr>
            <td><strong>Sentry GmbH</strong></td>
            <td>Error monitoring (alleen anonieme stack traces)</td>
            <td>Wenen, Oostenrijk (EU)</td>
          </tr>
        </tbody>
      </table>

      <h2>Wijzigingen aan deze lijst</h2>
      <p>
        Wij stellen klantorganisaties 30 dagen vooraf op de hoogte van toevoegingen of wijzigingen, met een bezwaarrecht. Aanmelden voor deze notificaties kan via <a href="mailto:dpa@promptguard.nl" className="text-brand-700 font-semibold">dpa@promptguard.nl</a>.
      </p>

      <h2>EU-data residency</h2>
      <p>
        Detection events (geanonimiseerde tellingen) worden uitsluitend verwerkt en opgeslagen binnen de EU. Niet-EU sub-processors (zoals Postmark) verwerken alleen niet-detection-gerelateerde gegevens onder Standard Contractual Clauses.
      </p>
    </>
  );
}
