import Link from 'next/link';
import { MarketingHeader, MarketingFooter } from '@/components/MarketingShell';

export default function SecurityPage() {
  return (
    <div className="min-h-screen">
      <MarketingHeader />
      <main className="px-6 lg:px-10 py-16 max-w-5xl mx-auto">
        <header className="mb-12">
          <span className="pg-pill pg-pill-neutral mb-4">Beveiliging &amp; privacy</span>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-ink-900 mb-3">Privacy-by-design, niet als afterthought.</h1>
          <p className="text-lg text-ink-600 max-w-3xl leading-relaxed">
            We zijn een tool om data-exposure te voorkomen — het zou hypocriet zijn als wij zelf data lekken. Hieronder leggen we uit wat we wel en niet zien, hoe we 't beveiligen, en hoe je 't zelf kunt verifiëren.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-4 mb-12">
          <Pillar
            title="Wat we WEL zien"
            list={[
              'Aantal events per browser per dag',
              "Tellingen per datatype: bv. '14× BSN, 2× IBAN'",
              'Welke AI-tool werd gebruikt (chatgpt, claude, etc.)',
              'Tijdstempel + de pagina-URL (bv. chatgpt.com)',
              'Anoniem installatie-ID (SHA-256 hash)',
              'Optioneel team-tag (door IT geconfigureerd)',
            ]}
            tone="neutral"
          />
          <Pillar
            title="Wat we NIET zien"
            list={[
              'De prompttekst zelf',
              'De gevonden BSN-/IBAN-waarden',
              'AI-antwoorden of conversatie-geschiedenis',
              'Wachtwoorden, e-mails, persoonsnamen',
              'Browser-historie buiten AI-tools',
              'Wat je medewerkers verder doen op hun laptop',
            ]}
            tone="negative"
          />
        </section>

        <Section title="Hoe het technisch werkt">
          <p>
            De PromptGuard browser-extension scant lokaal — in de browsergeheugen van je medewerker — wat ze in een AI-tool plakken of typen. De detection-engine is ~400 regels JavaScript, geen externe libraries, en de complete code is leesbaar in de extension-installatie zelf.
          </p>
          <p>
            Wanneer iets gevoeligs gevonden wordt, stuurt de extension een batched POST naar je dashboard. Dat POST-payload bevat alleen <strong>aantallen</strong> per datatype, plus metadata (tool, tijdstempel, ernst). Geen tekst.
          </p>
          <pre className="bg-ink-950 text-ink-100 text-xs p-4 rounded-lg my-3 overflow-x-auto">{`{
  "events": [{
    "tool": "chatgpt",
    "counts": { "bsn": 14, "iban-nl": 2, "kvk": 1 },
    "severityCounts": { "high": 16, "medium": 1, "low": 0 },
    "total": 17,
    "highest": "high",
    "action": "warned",
    "characterCount": 845,
    "installId": "a3f9e1c8d4b6...",
    "detectedAt": "2026-04-28T14:23:11Z"
  }]
}`}</pre>
          <p>
            Dat is alles. De prompttekst is op dat moment al lokaal verwerkt en weggegooid uit ons proces.
          </p>
        </Section>

        <Section title="Verificatie — niet alleen geloof">
          <ul>
            <li><strong>Open source extension</strong>: zip-file is op te eisen via een ondertekend pull request. Je IT-team kan ZE inspecteren voor uitrol.</li>
            <li><strong>Network-tab in DevTools</strong>: open je medewerker-laptop, ga naar chatgpt.com, plak iets gevoeligs, kijk in de DevTools Network-tab. Je ziet alleen de <code>POST /api/ingest</code> met aggregaten — niet de prompttekst.</li>
            <li><strong>Audit logs</strong>: alle dashboard-acties (login, rapport-export, gebruiker-verwijdering) worden gelogd en zijn beschikbaar voor je compliance-officer.</li>
          </ul>
        </Section>

        <Section title="Hosting &amp; data-residency">
          <ul>
            <li>Standaard EU-hosting bij een ISO 27001-/SOC2-gecertificeerde provider (Hetzner Falkenstein of TransIP, klantkeuze).</li>
            <li>Database encrypted at rest (AES-256), encrypted in transit (TLS 1.3).</li>
            <li>Enterprise-klanten: NL-specifieke data-residency op aanvraag, of on-premises deployment.</li>
            <li>Geen data shipping naar buiten EU. Geen US-CLOUD Act-exposure.</li>
          </ul>
        </Section>

        <Section title="AVG &amp; AI Act">
          <ul>
            <li><strong>Verwerkersovereenkomst (DPA)</strong>: standaardtekst beschikbaar op <Link href="/legal/dpa" className="text-brand-700 font-semibold">/legal/dpa</Link>. Aangepaste DPA op aanvraag voor enterprise.</li>
            <li><strong>Artikel 30 register</strong>: opgesteld en deelbaar met je FG.</li>
            <li><strong>Sub-processors</strong>: gepubliceerd op <Link href="/legal/sub-processors" className="text-brand-700 font-semibold">/legal/sub-processors</Link>.</li>
            <li><strong>AI Act-rapportage</strong>: per kwartaal exporteer je een rapport bruikbaar voor het EU AI-systeemregister.</li>
            <li><strong>Datalek-procedure</strong>: 24-uurs notificatieplicht naar getroffen klanten.</li>
          </ul>
        </Section>

        <Section title="Verantwoorde disclosure">
          <p>
            Heb je een beveiligingsprobleem gevonden? Mail <a href="mailto:security@promptguard.nl" className="text-brand-700 font-semibold">security@promptguard.nl</a> — we reageren binnen 48 uur en geven volledig credit aan researchers.
          </p>
        </Section>
      </main>
      <MarketingFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-6 border-t border-ink-200">
      <h2 className="text-xl font-bold text-ink-900 mb-4">{title}</h2>
      <div className="prose prose-ink max-w-none text-ink-700 [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_code]:bg-ink-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[12.5px]">
        {children}
      </div>
    </section>
  );
}

function Pillar({ title, list, tone }: { title: string; list: string[]; tone: 'neutral' | 'negative' }) {
  return (
    <div className="pg-card p-6">
      <h3 className="font-semibold text-ink-900 mb-3 flex items-center gap-2">
        {tone === 'negative' ? (
          <span className="w-6 h-6 rounded-full bg-red-50 text-red-700 grid place-items-center text-sm font-bold">×</span>
        ) : (
          <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 grid place-items-center text-sm font-bold">✓</span>
        )}
        {title}
      </h3>
      <ul className="space-y-2 text-sm text-ink-700">
        {list.map((it) => (
          <li key={it} className="flex gap-2 items-start">
            <span className="text-ink-400 mt-1.5">•</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
