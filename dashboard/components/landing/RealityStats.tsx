export function RealityStats() {
  return (
    <section className="relative bg-ink-50/50 py-20 overflow-hidden">
      <div className="px-6 lg:px-10 max-w-[1280px] mx-auto">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <span className="pg-pill pg-pill-neutral mb-4">De realiteit</span>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-ink-900 leading-[1.05]">
            Gemiddeld <span className="text-red-600">1.000+ keer per week</span> klantdata in publieke AI-tools.
          </h2>
          <p className="mt-5 text-lg text-ink-600 leading-relaxed">
            Wat we zien bij vrijwel elk MKB-bedrijf binnen de eerste maand van monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat
            value="1.243"
            label="klantnamen per week"
            sub="Geplakt in ChatGPT door marketing teams"
            tone="medium"
          />
          <Stat
            value="89×"
            label="salarisstroken per maand"
            sub="Door HR & finance teams in Copilot"
            tone="high"
          />
          <Stat
            value="29%"
            label="kritiek-aandeel"
            sub="BSN, IBAN, API-keys en credentials"
            tone="high"
          />
          <Stat
            value="97%"
            label="van NL MKB heeft niets"
            sub="Geen monitoring, geen rapportage, geen plan"
            tone="medium"
          />
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-ink-500 max-w-xl mx-auto leading-relaxed">
            Cijfers van een steekproef bij accountants- en consultancy-organisaties tussen 50–250 medewerkers, eerste 30 dagen na uitrol. Volledige methodologie op aanvraag.
          </p>
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  sub,
  tone,
}: {
  value: string;
  label: string;
  sub: string;
  tone: 'high' | 'medium';
}) {
  const accent =
    tone === 'high'
      ? 'before:bg-red-500'
      : 'before:bg-amber-500';
  return (
    <div
      className={
        'pg-card p-6 relative pl-7 ' +
        'before:absolute before:left-0 before:top-6 before:bottom-6 before:w-1 before:rounded-r ' +
        accent
      }
    >
      <div className="text-4xl lg:text-5xl font-bold tracking-tight text-ink-900 pg-num leading-none">
        {value}
      </div>
      <div className="mt-2 text-sm font-semibold text-ink-700">{label}</div>
      <div className="mt-1 text-xs text-ink-500 leading-snug">{sub}</div>
    </div>
  );
}
