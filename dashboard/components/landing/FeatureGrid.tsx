const FEATURES = [
  {
    title: 'Nederlandse detectie out-of-the-box',
    body: 'BSN met elfproef, NL-IBAN met mod-97, KvK, RSIN, BTW, postcodes, salarisstroken, NL-systemen (Exact, AFAS, Visma, Loket).',
    icon: IconShield,
    glow: 'from-brand-500/20 to-brand-700/10',
  },
  {
    title: 'Privacy by design',
    body: 'Detectie gebeurt 100% in de browser. Naar het dashboard gaat alleen geanonimiseerde metadata — nooit prompttekst.',
    icon: IconLock,
    glow: 'from-emerald-500/20 to-emerald-700/10',
  },
  {
    title: 'Centraal uitrolbaar',
    body: 'Microsoft Intune, Group Policy en Jamf-templates met je API-key voorgeconfigureerd. Force-install op alle werklaptops.',
    icon: IconCloud,
    glow: 'from-blue-500/20 to-blue-700/10',
  },
  {
    title: 'AI Act-rapportage',
    body: 'Per kwartaal exporteer je een rapport per afdeling, tool en datatype. Direct bruikbaar voor compliance-audit.',
    icon: IconReport,
    glow: 'from-fuchsia-500/20 to-fuchsia-700/10',
  },
  {
    title: 'Open-source extension',
    body: 'Je IT mag onze code lezen voor uitrol. Ongeveer 400 regels JavaScript zonder externe libraries — auditeerbaar in 30 minuten.',
    icon: IconCode,
    glow: 'from-violet-500/20 to-violet-700/10',
  },
  {
    title: 'Demonstreerbaar in 10 minuten',
    body: 'Geen 6-weken POC. Installeer, wacht één dag, presenteer het rapport aan je directie. Geen sales-cyclus.',
    icon: IconBolt,
    glow: 'from-amber-500/20 to-amber-700/10',
  },
];

export function FeatureGrid() {
  return (
    <section className="relative bg-gradient-to-b from-white to-ink-50/40 py-24 lg:py-28 overflow-hidden">
      <div className="px-6 lg:px-10 max-w-[1280px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="pg-pill pg-pill-neutral mb-4">Waarom PromptGuard</span>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-ink-900 leading-[1.05]">
            Internationale tools werken niet voor <span className="text-brand-700">Nederlandse data</span>.
          </h2>
          <p className="mt-5 text-lg text-ink-600 leading-relaxed">
            Nightfall en Microsoft Purview kennen geen BSN-elfproef, geen NL-IBAN-formaat, geen Exact/AFAS/Visma. Wij wel.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="relative rounded-2xl bg-white ring-1 ring-ink-200/70 p-7 transition-all hover:shadow-cardHover hover:-translate-y-0.5"
            >
              <div
                className={
                  'absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-br transition-opacity ' +
                  f.glow
                }
              />
              <div
                className={
                  'inline-grid place-items-center w-11 h-11 rounded-xl bg-gradient-to-br ' +
                  f.glow +
                  ' ring-1 ring-ink-200/70 mb-5'
                }
              >
                <f.icon />
              </div>
              <h3 className="text-lg font-semibold text-ink-900 mb-2 leading-snug tracking-tight">
                {f.title}
              </h3>
              <p className="text-[14.5px] text-ink-600 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const iconBase = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function IconShield() {
  return (
    <svg {...iconBase} className="text-brand-700">
      <path d="M12 3l8 3v5c0 4.5-3 8.5-8 9.5-5-1-8-5-8-9.5V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg {...iconBase} className="text-emerald-700">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  );
}
function IconCloud() {
  return (
    <svg {...iconBase} className="text-blue-700">
      <path d="M17 18a4 4 0 000-8 5.5 5.5 0 00-10.5 1A4 4 0 007 18z" />
      <path d="M12 13v5m0 0l-2-2m2 2l2-2" />
    </svg>
  );
}
function IconReport() {
  return (
    <svg {...iconBase} className="text-fuchsia-700">
      <path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  );
}
function IconCode() {
  return (
    <svg {...iconBase} className="text-violet-700">
      <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" />
    </svg>
  );
}
function IconBolt() {
  return (
    <svg {...iconBase} className="text-amber-700">
      <path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" />
    </svg>
  );
}
