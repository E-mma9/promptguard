import Link from 'next/link';
import { MarketingHeader, MarketingFooter } from '@/components/MarketingShell';

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <MarketingHeader />
      <main className="px-6 lg:px-10 py-16 lg:py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="pg-pill pg-pill-neutral mb-4">Eenvoudige prijzen</span>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-ink-900 mb-3">Per medewerker, per maand.</h1>
          <p className="text-lg text-ink-600 leading-relaxed">
            Voorspelbaar. Geen verborgen kosten, geen volume-overschrijdingen, geen jaarlijkse contracten als u dat niet wilt.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <Plan
            name="Starter"
            price="€8"
            tagline="Voor MKB tot 25 medewerkers"
            features={[
              'Tot 25 medewerker-licenties',
              'Onbeperkte detection events',
              'Volledig dashboard',
              'NL-detectie (BSN, IBAN, KvK, salaris)',
              'CSV/JSON kwartaal-rapport',
              'E-mail support binnen 24u',
            ]}
            cta="Start 14-daagse proef"
            ctaHref="/signup"
          />
          <Plan
            name="Growth"
            price="€12"
            tagline="Tot 250 medewerkers"
            features={[
              'Alles uit Starter',
              'Tot 250 medewerker-licenties',
              'Microsoft Intune / GPO templates',
              'Force-install via mass-deploy',
              'Custom detection rules',
              'Slack & Teams alerts (binnenkort)',
              'Telefonische support',
            ]}
            cta="Start 14-daagse proef"
            ctaHref="/signup"
            highlight
          />
          <Plan
            name="Enterprise"
            price="Op maat"
            tagline="Vanaf 250 medewerkers"
            features={[
              'Alles uit Growth',
              'SAML / Microsoft Entra SSO',
              'Custom data residency (NL/EU)',
              'On-premises deployment optie',
              'Dedicated CSM + SLA',
              'Pen-test rapport bij implementatie',
              'Aangepaste verwerkersovereenkomst',
            ]}
            cta="Plan een gesprek"
            ctaHref="mailto:sales@promptguard.nl"
          />
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-ink-900 text-center mb-2">Veelgestelde vragen</h2>
          <p className="text-ink-600 text-center mb-10">Komt er iets niet voor? Mail <a href="mailto:hello@promptguard.nl" className="text-brand-700 font-semibold">hello@promptguard.nl</a>.</p>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 max-w-4xl mx-auto">
            <Faq q="Welke gegevens stuurt de extension naar het dashboard?">
              Alleen geanonimiseerde tellingen — bv. <em>"14× BSN, 2× IBAN gedetecteerd op chatgpt.com"</em>. Nooit de prompttekst zelf. De detectie gebeurt 100% in de browser.
            </Faq>
            <Faq q="Wat gebeurt er na de proefperiode?">
              Na 14 dagen krijg je een herinnering. Geen automatische conversie. Kies je voor doorgaan, dan factureren we maandelijks of jaarlijks (10% korting bij jaarlijks).
            </Faq>
            <Faq q="Kan ik de extension in mijn eigen organisatie deployen?">
              Ja — het Growth- en Enterprise-plan levert kant-en-klare templates voor Microsoft Intune, Group Policy en Jamf. Je IT zet de force-install policy uit en de extension verschijnt op iedere laptop met je API-key voorgeconfigureerd.
            </Faq>
            <Faq q="Waar worden onze gegevens opgeslagen?">
              In Nederland, bij een EU-gehoste provider met SOC2-certificering. Klanten op het Enterprise-plan kunnen kiezen voor on-premises deployment.
            </Faq>
            <Faq q="Zijn jullie AVG-compliant?">
              Ja. Wij sluiten een verwerkersovereenkomst (DPA) met je af, hebben een AVG-artikel-30 register, en publiceren onze sub-processors. Privacy by design — geen prompttekst verlaat je organisatie.
            </Faq>
            <Faq q="Welke browsers worden ondersteund?">
              Chrome, Edge, Brave, Firefox. Safari is in ontwikkeling. Mass-deploy ondersteund via alle major management-platforms.
            </Faq>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}

function Plan({
  name,
  price,
  tagline,
  features,
  cta,
  ctaHref,
  highlight,
}: {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        'rounded-2xl p-8 flex flex-col ' +
        (highlight
          ? 'bg-gradient-to-b from-ink-900 to-ink-950 text-white shadow-2xl scale-[1.02] relative ring-2 ring-brand-500/30'
          : 'bg-white shadow-card')
      }
    >
      {highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
          Meest gekozen
        </span>
      )}
      <div className="flex items-baseline justify-between mb-1">
        <h3 className={'text-xl font-bold ' + (highlight ? '' : 'text-ink-900')}>{name}</h3>
      </div>
      <p className={'text-sm ' + (highlight ? 'text-ink-300' : 'text-ink-500')}>{tagline}</p>
      <div className="my-6">
        <span className={'text-4xl font-bold ' + (highlight ? '' : 'text-ink-900')}>{price}</span>
        {price.startsWith('€') && (
          <span className={'text-sm ml-1 ' + (highlight ? 'text-ink-300' : 'text-ink-500')}>/ medewerker / maand</span>
        )}
      </div>
      <ul className="space-y-2.5 mb-8 flex-1">
        {features.map((f) => (
          <li key={f} className="flex gap-2 items-start text-sm">
            <svg width="18" height="18" viewBox="0 0 20 20" className={'shrink-0 mt-0.5 ' + (highlight ? 'text-emerald-400' : 'text-emerald-600')} fill="currentColor">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" />
            </svg>
            <span className={highlight ? 'text-ink-100' : 'text-ink-700'}>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={ctaHref}
        className={
          'rounded-lg px-5 py-3 text-sm font-semibold text-center transition-colors ' +
          (highlight
            ? 'bg-white text-ink-900 hover:bg-ink-100'
            : 'bg-ink-900 text-white hover:bg-ink-950')
        }
      >
        {cta}
      </Link>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-ink-900 mb-1.5">{q}</h3>
      <p className="text-sm text-ink-600 leading-relaxed">{children}</p>
    </div>
  );
}
