import Link from 'next/link';
import { MarketingHeader, MarketingFooter } from '@/components/MarketingShell';

export default function Landing() {
  return (
    <div className="min-h-screen">
      <MarketingHeader />

      <main>
        <section className="px-6 lg:px-10 py-16 lg:py-24 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="pg-pill pg-pill-neutral mb-5">
                <span className="pg-dot pg-dot-high" /> Shadow AI is hier
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-ink-900 leading-[1.05]">
                Zie wat uw medewerkers <span className="text-brand-700">in ChatGPT plakken</span>.
              </h1>
              <p className="mt-6 text-lg text-ink-600 max-w-xl leading-relaxed">
                PromptGuard detecteert <strong>lokaal in de browser</strong> welke gevoelige data &mdash; BSN's, IBAN's, salarisstroken, contracten, broncode &mdash; uw team plakt in ChatGPT, Claude, Gemini en Copilot.
              </p>
              <p className="mt-3 text-lg text-ink-600 max-w-xl leading-relaxed">
                <strong>10 minuten installeren. Eén dag wachten.</strong> Daarna weet u het.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup" className="pg-button-primary !px-6 !py-3 !text-base">
                  Gratis proberen — 14 dagen &rarr;
                </Link>
                <Link href="/pricing" className="pg-button-secondary !px-6 !py-3 !text-base">
                  Bekijk prijzen
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-6 text-sm text-ink-500 flex-wrap">
                <PrivacyBadge>Lokale detectie</PrivacyBadge>
                <PrivacyBadge>Open source extension</PrivacyBadge>
                <PrivacyBadge>AVG &amp; AI Act</PrivacyBadge>
                <PrivacyBadge>NL gehost</PrivacyBadge>
              </div>
            </div>

            <div className="lg:col-span-5">
              <DemoPreview />
            </div>
          </div>
        </section>

        <section className="bg-white border-y border-ink-200/70">
          <div className="px-6 lg:px-10 py-16 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-ink-900 mb-3">Drie krachten komen samen in 2026</h2>
            <p className="text-lg text-ink-600 max-w-2xl mb-10">
              Wachten op de eerste incident kost u meer dan voorbereiden.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <ForceCard
                tag="AVG-handhaving"
                title="AP heeft AI-gebruik bovenaan haar focuslijst voor 2026"
                body="De Autoriteit Persoonsgegevens vraagt actief om verantwoording over AI-data-exposure. Ondernemingen die niet kunnen aantonen welke persoonsgegevens worden gedeeld lopen handhavingsrisico."
              />
              <ForceCard
                tag="EU AI Act"
                title="Verplichte registratie van AI-systeem-gebruik"
                body="Vanaf augustus 2026 moeten organisaties documenteren welke AI-systemen ze gebruiken en met welk soort data. Geen registratie = geen voldoening."
              />
              <ForceCard
                tag="Cyberverzekering"
                title="Vragen over AI-data-exposure in 2026-polissen"
                body="Verzekeraars beginnen te vragen 'hoe monitort u welke data uw werknemers met AI-tools delen?' Geen antwoord = hogere premie of geen dekking."
              />
            </div>
          </div>
        </section>

        <section className="px-6 lg:px-10 py-16 lg:py-20 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-ink-900 mb-3">Waarom PromptGuard, niet Nightfall of Netskope?</h2>
            <p className="text-lg text-ink-600">
              Internationale tools werken niet voor Nederlandse data. Onze detectie kent BSN, RSIN, KvK, NL-IBAN, en de exporten van Exact, AFAS, Visma en Loket — uit de doos.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <ValueCard
              title="Nederlands uit de doos"
              body="BSN met elfproef, NL IBAN met mod-97, KvK, RSIN, BTW, postcode. Plus signatures van Exact, AFAS, Visma, Loket, Nmbrs, Twinfield."
            />
            <ValueCard
              title="Privacy-by-design"
              body="Detectie gebeurt 100% in de browser. Naar het dashboard gaat alleen geanonimiseerde metadata — nooit prompttekst."
            />
            <ValueCard
              title="AI Act-rapportage"
              body="Per kwartaal exporteer je een rapport van AI-gebruik per afdeling, tool en datatype. Direct bruikbaar voor compliance en cyberverzekeraar."
            />
            <ValueCard
              title="Demonstreerbaar in 10 minuten"
              body="Installeer de extension, wacht één dag, en het rapport schokt je leiderschap. Geen enterprise sales-cyclus."
            />
            <ValueCard
              title="Centraal uitrolbaar"
              body="Microsoft Intune, Group Policy, Jamf — wij leveren kant-en-klare templates met je API-key voorgeconfigureerd."
            />
            <ValueCard
              title="Open source extension"
              body="Je IT-team mag onze code lezen. Vertrouwen is verifieerbaar, geen marketingclaim."
            />
          </div>
        </section>

        <section className="px-6 lg:px-10 py-12 max-w-5xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-ink-900 to-ink-950 text-white p-10 lg:p-14 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-25"
              style={{
                background: 'radial-gradient(circle at 0% 0%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 100% 100%, #2563eb 0%, transparent 50%)',
              }}
            />
            <div className="relative max-w-3xl">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                In 10 minuten weet u wat uw medewerkers werkelijk delen.
              </h2>
              <p className="text-lg text-ink-300 mb-8 leading-relaxed">
                Geen creditcard nodig. Geen verkoopgesprek vooraf. 14 dagen kosteloos. Aan het einde van de proef heeft u het rapport — en dan praten we verder.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/signup" className="bg-white text-ink-900 hover:bg-ink-100 transition-colors rounded-lg px-6 py-3 font-semibold">
                  Start gratis proef &rarr;
                </Link>
                <Link href="/pricing" className="ring-1 ring-white/30 hover:bg-white/10 transition-colors rounded-lg px-6 py-3 font-semibold">
                  Bekijk prijzen
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

function PrivacyBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="#16a34a" />
        <path d="M5 8.5l2 2 4-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-medium text-ink-700">{children}</span>
    </div>
  );
}

function ValueCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="pg-card p-6">
      <h3 className="text-lg font-semibold mb-2 text-ink-900">{title}</h3>
      <p className="text-ink-600 leading-relaxed text-[14.5px]">{body}</p>
    </div>
  );
}

function ForceCard({ tag, title, body }: { tag: string; title: string; body: string }) {
  return (
    <div className="pg-card p-6">
      <span className="pg-pill pg-pill-neutral mb-3">{tag}</span>
      <h3 className="text-lg font-semibold mb-2 text-ink-900 leading-snug">{title}</h3>
      <p className="text-ink-600 leading-relaxed text-[14px]">{body}</p>
    </div>
  );
}

function DemoPreview() {
  return (
    <div className="pg-card p-5 bg-gradient-to-br from-ink-900 to-ink-950">
      <div className="rounded-xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
        <div className="px-4 py-3 border-b border-ink-100 flex items-center gap-2 bg-ink-50">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="ml-3 text-xs text-ink-500 font-mono">chatgpt.com/c/&hellip;</div>
        </div>
        <div className="p-5 space-y-4">
          <div className="border-l-4 border-red-500 bg-red-50 rounded-r-lg p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 grid place-items-center text-xs font-bold">!</span>
              <strong className="text-sm text-ink-900">PromptGuard heeft <span className="text-red-700">17</span> kritieke items gedetecteerd</strong>
            </div>
            <p className="text-xs text-ink-600 ml-8">14× BSN, 2× NL IBAN, 1× KvK-nummer</p>
            <p className="text-xs text-ink-500 ml-8 mt-0.5">Deze data zou bij <strong>ChatGPT</strong> terechtkomen.</p>
          </div>
          <div className="rounded-lg bg-ink-50 p-4 font-mono text-xs leading-relaxed text-ink-700">
            <span className="text-ink-400">&gt; </span>Hoi ChatGPT, kun je deze klantenlijst samenvatten?
            <br /><br />
            Naam: Jan de Vries, BSN <span className="bg-red-100 text-red-800 px-1 rounded">111222333</span>, IBAN <span className="bg-red-100 text-red-800 px-1 rounded">NL91&hellip;</span>
            <br />
            Naam: Marie Janssen, BSN <span className="bg-red-100 text-red-800 px-1 rounded">123456782</span>&hellip;
          </div>
          <div className="flex justify-end gap-2">
            <button className="text-sm font-semibold px-4 py-2 rounded-lg ring-1 ring-ink-200 text-ink-700">Annuleren</button>
            <button className="text-sm font-semibold px-4 py-2 rounded-lg bg-ink-900 text-white">Toch versturen</button>
          </div>
        </div>
      </div>
    </div>
  );
}
