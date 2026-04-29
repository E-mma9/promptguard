const STEPS = [
  {
    n: '01',
    tag: 'Discover',
    title: 'Uitrol op iedere werklaptop',
    body:
      'IT pusht de extension via Microsoft Intune, Group Policy of Jamf — kant-en-klare templates met uw API-key. Eindgebruikers merken niets behalve het pictogram in hun toolbar.',
    accent: 'from-brand-400 to-brand-600',
  },
  {
    n: '02',
    tag: 'Detect',
    title: 'Lokale detectie in de browser',
    body:
      'Bij elke paste of typ-actie scant PromptGuard de prompt op BSN, IBAN, KvK, salarisgegevens, API-keys en NL-systeem-exporten. Detectie gebeurt 100% in de browsergeheugen — niets verlaat het apparaat.',
    accent: 'from-violet-400 to-violet-600',
  },
  {
    n: '03',
    tag: 'Decide',
    title: 'Waarschuw, blokkeer of registreer',
    body:
      'Drie modi per organisatie of per team. Bij hoge ernst krijgt de medewerker een banner — kan annuleren of doorgaan. Geen prompttekst gaat naar het dashboard, alleen tellingen.',
    accent: 'from-fuchsia-400 to-fuchsia-600',
  },
  {
    n: '04',
    tag: 'Comply',
    title: 'Rapporteer voor AVG en AI Act',
    body:
      'Per kwartaal exporteer je een CSV/JSON-rapport — per afdeling, per AI-tool, per datatype. Direct bruikbaar voor uw AVG-artikel-30 register, AI-systeemregister en jaarlijkse cyberverzekeringsvragenlijst.',
    accent: 'from-cyan-400 to-cyan-600',
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-24 lg:py-28">
      <div className="px-6 lg:px-10 max-w-[1280px] mx-auto">
        <div className="max-w-3xl">
          <span className="pg-pill pg-pill-neutral mb-4">Hoe werkt het</span>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-ink-900 leading-[1.05]">
            Van uitrol tot AI Act-rapport in <span className="text-brand-700">vier stappen</span>.
          </h2>
          <p className="mt-5 text-lg text-ink-600 leading-relaxed">
            Geen pen-test, geen 6-weken POC. PromptGuard is opgezet voor MKB-IT'ers die hun directie binnen één maand een rapport moeten kunnen voorleggen.
          </p>
        </div>

        <div className="mt-16 grid lg:grid-cols-2 gap-x-12 gap-y-12 relative">
          {STEPS.map((s) => (
            <div key={s.n} className="flex gap-5">
              <div className="shrink-0 flex flex-col items-center">
                <div
                  className={
                    'w-14 h-14 rounded-2xl grid place-items-center text-white text-lg font-bold shadow-lg shadow-brand-500/20 bg-gradient-to-br ' +
                    s.accent
                  }
                >
                  {s.n}
                </div>
                <div className="flex-1 mt-2 w-px bg-gradient-to-b from-ink-200 to-transparent" />
              </div>
              <div className="flex-1 min-w-0 pb-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-700 mb-1">
                  {s.tag}
                </div>
                <h3 className="text-xl font-bold text-ink-900 mb-2 leading-snug">{s.title}</h3>
                <p className="text-ink-600 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
