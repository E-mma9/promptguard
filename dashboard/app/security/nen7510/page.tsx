export const metadata = {
  title: 'NEN 7510 — controls-mapping | PromptGuard',
  description:
    'Hoe PromptGuard de NEN 7510-2 maatregelen voor informatiebeveiliging in de zorg in zijn architectuur en bedrijfsvoering heeft verankerd.',
};

type Row = {
  control: string;
  area: string;
  status: 'Geïmplementeerd' | 'In ontwikkeling' | 'Niet van toepassing';
  evidence: string;
};

const rows: Row[] = [
  {
    control: '5.1 — Beleid voor informatiebeveiliging',
    area: 'Bestuurlijk',
    status: 'Geïmplementeerd',
    evidence:
      'Informatiebeveiligingsbeleid vastgelegd in /security en gepubliceerd voor klanten. Jaarlijkse herziening.',
  },
  {
    control: '5.10 — Aanvaardbaar gebruik van informatie en bedrijfsmiddelen',
    area: 'Bestuurlijk',
    status: 'Geïmplementeerd',
    evidence: 'Algemene voorwaarden en DPA leggen verantwoordelijkheden Klant en Verwerker vast.',
  },
  {
    control: '5.12 — Classificatie van informatie',
    area: 'Bestuurlijk',
    status: 'Geïmplementeerd',
    evidence:
      'Detection events worden geclassificeerd op severity (high/medium/low). Geen persoonsgegevens van bijzondere aard worden door PromptGuard verwerkt — alleen aggregaten.',
  },
  {
    control: '5.15 — Toegangsbeveiliging',
    area: 'Technisch',
    status: 'Geïmplementeerd',
    evidence:
      'Rolgebaseerde toegang (admin/viewer). bcrypt-passwordhashing (cost 12). Sessie via signed JWT, HttpOnly + Secure + SameSite=Lax cookies. MFA voor admins als roadmap-item Q4-2026.',
  },
  {
    control: '5.23 — Informatiebeveiliging bij gebruik van cloud-diensten',
    area: 'Technisch',
    status: 'Geïmplementeerd',
    evidence:
      'Vercel (EU-fra1) en Neon (EU-regio) zijn de enige cloud-subverwerkers. SOC 2 Type II rapporten beschikbaar op aanvraag via deze leveranciers.',
  },
  {
    control: '5.33 — Bescherming van registraties',
    area: 'Technisch',
    status: 'Geïmplementeerd',
    evidence:
      'Audit-log van administratieve handelingen (API-key regenereren, gebruikersbeheer). Dagelijkse Postgres-backups (Neon), retentie 30 dagen.',
  },
  {
    control: '5.34 — Privacy en bescherming van persoonsgegevens',
    area: 'Bestuurlijk',
    status: 'Geïmplementeerd',
    evidence:
      'Data-minimalisatie als architectuurprincipe — prompttekst verlaat browser nooit. Privacyverklaring gepubliceerd. Verwerkersovereenkomst beschikbaar.',
  },
  {
    control: '8.1 — Gebruikers-endpoints',
    area: 'Technisch',
    status: 'Geïmplementeerd',
    evidence:
      'Browser-extensie is sandboxed (Manifest V3). Geen toegang tot bestanden of overige browser-data buiten geconfigureerde AI-tool-domeinen.',
  },
  {
    control: '8.2 — Bevoorrechte toegangsrechten',
    area: 'Technisch',
    status: 'In ontwikkeling',
    evidence:
      'Admin-rol noodzakelijk voor API-key regeneratie en exports (geïmplementeerd). Volledige audit-logging van alle privileged handelingen: in ontwikkeling — afronding Q3-2026.',
  },
  {
    control: '8.3 — Beperking van informatietoegang',
    area: 'Technisch',
    status: 'Geïmplementeerd',
    evidence:
      'Multi-tenant isolatie op orgId — Prisma-queries scopen altijd op de organisatie van de geverifieerde sessie. Cascade-delete bij organisatie-verwijdering.',
  },
  {
    control: '8.5 — Veilige authenticatie',
    area: 'Technisch',
    status: 'Geïmplementeerd',
    evidence:
      'Wachtwoordbeleid: minimaal 12 tekens, hoofdletter, kleine letter, cijfer, speciaal teken. Bcrypt cost 12. Rate-limiting op auth-endpoints.',
  },
  {
    control: '8.6 — Capaciteitsbeheer',
    area: 'Technisch',
    status: 'Geïmplementeerd',
    evidence:
      'Rate-limiting op ingest-API (60 req/min per organisatie). Auto-scaling via Vercel. Neon Postgres scaling on-demand.',
  },
  {
    control: '8.7 — Bescherming tegen malware',
    area: 'Technisch',
    status: 'In ontwikkeling',
    evidence:
      'Geen executable uploads geaccepteerd (geïmplementeerd). Geautomatiseerde afhankelijkheids-scanning (Dependabot/npm audit in CI): inrichting gepland Q3-2026.',
  },
  {
    control: '8.8 — Beheer van technische kwetsbaarheden',
    area: 'Technisch',
    status: 'In ontwikkeling',
    evidence:
      'Meldkanaal security@promptguard.nl actief. Geformaliseerd coordinated-vulnerability-disclosure-beleid met vaste patch-termijnen: in opstelling, doel Q3-2026.',
  },
  {
    control: '8.9 — Configuratiebeheer',
    area: 'Technisch',
    status: 'Geïmplementeerd',
    evidence:
      'Infrastructure-as-code via vercel.json. Schema-migrations via Prisma. Detector-versie traceerbaar per event.',
  },
  {
    control: '8.16 — Activiteitsmonitoring',
    area: 'Technisch',
    status: 'In ontwikkeling',
    evidence:
      'Basale request-logging aanwezig. Gestructureerde anomaliedetectie en alerting (401-pieken, rate-limit hits, error-rates) via een externe observability-tool: inrichting gepland Q3-2026.',
  },
  {
    control: '8.24 — Cryptografische beheersmaatregelen',
    area: 'Technisch',
    status: 'Geïmplementeerd',
    evidence:
      'TLS 1.2+ verplicht (HTTPS-only via Vercel). AES-256 at-rest (Neon standaard). SHA-256 voor installatie-pseudonimisering. JWT HS256 met SESSION_SECRET ≥ 32 tekens.',
  },
  {
    control: '8.28 — Veilige software-ontwikkeling',
    area: 'Operationeel',
    status: 'In ontwikkeling',
    evidence:
      'TypeScript strict mode, ESLint, geen prod-credentials in code (.env-only) — geïmplementeerd. Verplichte peer-code-review via Pull Request wordt ingericht zodra de tweede ontwikkelaar is aangenomen.',
  },
  {
    control: '5.30 — ICT-gereedheid voor bedrijfscontinuïteit',
    area: 'Operationeel',
    status: 'In ontwikkeling',
    evidence:
      'Vercel SLA 99,99% + Neon point-in-time recovery (30 dagen). Disaster-recovery runbook in Q3-2026.',
  },
  {
    control: '5.7 — Informatie over bedreigingen',
    area: 'Bestuurlijk',
    status: 'In ontwikkeling',
    evidence:
      'Z-CERT aansluiting (sectorale CSIRT voor zorg) op de roadmap als klanten in zorgsector toenemen.',
  },
];

export default function NEN7510Page() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            PromptGuard · Compliance-evidence
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            NEN 7510-2 — controls-mapping
          </h1>
          <p className="mt-4 text-gray-500 text-sm">
            Versie 1.0 — 20 mei 2026 · Voor klanten in de zorgsector
          </p>
        </div>

        <div className="space-y-8">

          <section className="rounded-lg bg-blue-50 border border-blue-200 p-5 text-sm leading-relaxed text-blue-900">
            <strong>Positionering.</strong> Dit document is een transparante
            zelf-evaluatie van PromptGuard tegen de relevante maatregelen uit
            NEN 7510-2:2017+A1:2020. Het is <strong>geen NEN 7510-certificaat</strong>.
            Een geaccrediteerde audit-firma kan op basis van dit document een formele
            certificering uitvoeren; dit staat op onze roadmap voor 2027 zodra
            klantvolume dit rechtvaardigt. Klanten in de zorgsector die nu al
            PromptGuard willen inzetten kunnen op basis van dit document een eigen
            risico-evaluatie maken.
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Reikwijdte van de evaluatie
            </h2>
            <p className="text-gray-700 leading-relaxed">
              PromptGuard verwerkt voor klanten in de zorgsector uitsluitend
              <strong> aggregaat-metadata</strong> over detection events. Wij
              verwerken geen elektronische patiëntendossiers (EPD), medische beelden,
              labuitslagen of andere bijzondere persoonsgegevens uit art. 9 AVG. De
              detectie van BSN's vindt lokaal in de browser plaats; de waarde van het
              BSN verlaat de browser nooit. Alleen de telling ("BSN gedetecteerd × 3")
              wordt opgeslagen in onze database.
            </p>
            <p className="mt-3 text-gray-700 leading-relaxed">
              Dit beperkt de reikwijdte van de NEN 7510-eisen aanzienlijk: de meeste
              maatregelen rondom medische data zijn op PromptGuard niet van toepassing,
              omdat wij die data fysiek nooit ontvangen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Controls-overzicht
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 border-b font-semibold">Maatregel</th>
                    <th className="text-left p-3 border-b font-semibold">Domein</th>
                    <th className="text-left p-3 border-b font-semibold">Status</th>
                    <th className="text-left p-3 border-b font-semibold">Bewijs</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.control} className="align-top">
                      <td className="p-3 border-b font-semibold text-gray-900">{r.control}</td>
                      <td className="p-3 border-b text-gray-700">{r.area}</td>
                      <td className="p-3 border-b">
                        <span
                          className={
                            'inline-block px-2 py-0.5 rounded-full text-xs font-semibold ' +
                            (r.status === 'Geïmplementeerd'
                              ? 'bg-emerald-100 text-emerald-800'
                              : r.status === 'In ontwikkeling'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-700')
                          }
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3 border-b text-gray-700">{r.evidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Aanvullende waarborgen voor zorgklanten
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>
                <strong>Z-CERT-koppeling</strong> op verzoek voor incidentmelding en
                threat-intelligence-uitwisseling.
              </li>
              <li>
                <strong>Datalekmelding aan zorgklant binnen 24 uur</strong> na ontdekking
                — strenger dan de wettelijke termijn van 72 uur richting AP.
              </li>
              <li>
                <strong>DPIA-ondersteuning</strong> — PromptGuard levert een ingevulde
                DPIA-bouwsteen die de zorgklant in zijn eigen DPIA-document kan
                opnemen.
              </li>
              <li>
                <strong>Penetratietest op verzoek</strong> — éénmaal per jaar
                vergoeden wij een penetratietest door een door de klant aangewezen
                CCV-erkende partij, tot een maximum van € 5.000 bij contracten
                ≥ € 25.000 jaaromzet.
              </li>
              <li>
                <strong>Code-escrow op verzoek</strong> — bij contracten ≥ € 50.000
                jaaromzet plaatsen wij de broncode in escrow bij een notaris, zodat
                continuïteit bij faillissement van de leverancier geborgd is.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Contact voor compliance-vragen
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Voor vragen over deze controls-mapping, aanvullende evidence of een
              afspraak met de PromptGuard-verantwoordelijke voor informatiebeveiliging:{' '}
              <a
                href="mailto:security@promptguard.nl"
                className="text-indigo-600 underline hover:text-indigo-800"
              >
                security@promptguard.nl
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
