import Link from 'next/link';
import { MarketingHeader, MarketingFooter } from '@/components/MarketingShell';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <MarketingHeader />
      <main className="px-6 lg:px-10 pt-32 lg:pt-36 pb-16 max-w-6xl mx-auto">
        <header className="text-center max-w-2xl mx-auto mb-14">
          <span className="pg-pill pg-pill-neutral mb-4">Wat zit erin</span>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-ink-900 mb-3">Alles om Shadow AI in beeld te brengen.</h1>
          <p className="text-lg text-ink-600 leading-relaxed">
            Detectie, dashboard, deployment en compliance — gebouwd specifiek voor het Nederlandse MKB.
          </p>
        </header>

        <FeatureBlock
          tag="Detectie"
          title="Nederlandse patronen, zonder maatwerk"
          body="Algoritmes met checksum-validatie minimaliseren false positives. Multi-keyword heuristieken vangen complexere documenten zoals salarisstroken en contracten."
          items={[
            'BSN met elfproef-validatie',
            'NL IBAN met mod-97 checksum',
            'KvK-nummers en RSIN',
            'BTW-id en BTW-nummers',
            'Postcodes en NL-telefoonnummers',
            'Creditcards met Luhn-validatie',
            'API-keys (OpenAI, Anthropic, AWS, GitHub, Stripe, Google, Slack, JWT, SSH)',
            'Salarisstroken (loonheffing, vakantiegeld, pensioenpremie multi-keyword)',
            'Contracten (ondergetekende, hierna te noemen, komen overeen)',
            'NL business systems (Exact, AFAS, Visma, Loket, Nmbrs, Twinfield)',
            'Broncode-detectie (heuristisch op symbol-density)',
          ]}
        />

        <FeatureBlock
          tag="Dashboard"
          title="In één blik weten wat speelt"
          body="Van helicopter view tot per-event detail — voor zowel directie als IT-/compliance-team."
          items={[
            'Tijdreeks-chart per dag/week/kwartaal',
            'KPI-cards: events, items, kritiek-aandeel, meest geëxposeerd team',
            'Per-team breakdown met severity-balk',
            'Per-AI-tool view (welke leverancier krijgt wat)',
            'Per-datatype ranking',
            'Filtering op tool × ernst × team',
            'Live updates (3 sec na detectie)',
            'AI Act-rapport per kwartaal — CSV en JSON',
          ]}
          reversed
        />

        <FeatureBlock
          tag="Uitrol"
          title="Voor IT zonder script-werk"
          body="Templates met je API-key voorgeconfigureerd. Ondersteunt force-install op alle major platforms."
          items={[
            'Microsoft Intune Configuration Profile',
            'Active Directory Group Policy (ADMX + .reg)',
            'Jamf Pro / macOS Custom Settings',
            'Firefox enterprise policies.json',
            'Force-install — geen handmatige installatie nodig',
            'Managed storage — eindgebruiker kan API-key niet wijzigen',
            'Auto-update via officiële extension stores',
          ]}
        />

        <FeatureBlock
          tag="Privacy"
          title="Privacy-by-design, geen marketing-claim"
          body="De extension is open source. Je IT kan de code lezen voor je 'm uitrolt."
          items={[
            'Detectie 100% in de browser — geen prompttekst leaves device',
            'Alleen geanonimiseerde tellingen verlaten de browser',
            'Anonieme installatie-ID (SHA-256 hash, geen e-mail)',
            'Geen tracking, geen telemetry, geen third-party trackers',
            'AVG-artikel-30 register opgesteld',
            'Verwerkersovereenkomst (DPA) standaard meegeleverd',
          ]}
          reversed
        />

        <section className="mt-16 text-center">
          <Link href="/signup" className="pg-button-primary !px-7 !py-3 !text-base">
            Start gratis proef &rarr;
          </Link>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}

function FeatureBlock({
  tag,
  title,
  body,
  items,
  reversed,
}: {
  tag: string;
  title: string;
  body: string;
  items: string[];
  reversed?: boolean;
}) {
  return (
    <section className={'grid lg:grid-cols-12 gap-10 items-start py-10 ' + (reversed ? 'lg:[direction:rtl]' : '')}>
      <div className={'lg:col-span-5 ' + (reversed ? 'lg:[direction:ltr]' : '')}>
        <span className="pg-pill pg-pill-neutral mb-3">{tag}</span>
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-ink-900 mb-3 leading-tight">{title}</h2>
        <p className="text-ink-600 leading-relaxed">{body}</p>
      </div>
      <div className={'lg:col-span-7 pg-card p-6 ' + (reversed ? 'lg:[direction:ltr]' : '')}>
        <ul className="grid sm:grid-cols-2 gap-x-5 gap-y-2.5">
          {items.map((it) => (
            <li key={it} className="flex gap-2 items-start text-sm text-ink-700">
              <svg width="16" height="16" viewBox="0 0 20 20" className="shrink-0 mt-1 text-emerald-600" fill="currentColor">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" />
              </svg>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
