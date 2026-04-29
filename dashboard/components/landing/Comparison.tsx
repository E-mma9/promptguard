type Cell = boolean | 'partial' | string;

const COLS = ['PromptGuard', 'Nightfall', 'Microsoft Purview', 'Netskope DLP'] as const;

const ROWS: Array<{ label: string; values: Cell[] }> = [
  { label: 'NL-detectie (BSN, IBAN, KvK, BTW)', values: [true, false, 'partial', false] },
  { label: 'NL-systeem signatures (AFAS, Exact, Loket)', values: [true, false, false, false] },
  { label: 'Lokale browser-detectie (geen prompttekst naar cloud)', values: [true, false, false, false] },
  { label: 'Werkt op ChatGPT, Claude, Gemini, Copilot', values: [true, true, 'Alleen Copilot', true] },
  { label: 'Force-install via Intune / GPO / Jamf', values: [true, true, true, true] },
  { label: 'AI Act-rapport per kwartaal export', values: [true, false, 'partial', false] },
  { label: 'Self-service signup, geen sales-cyclus', values: [true, false, false, false] },
  { label: 'Open source extension', values: [true, false, false, false] },
  { label: 'EU-hosted, geen CLOUD Act-blootstelling', values: [true, false, 'partial', false] },
  { label: 'Lijstprijs MKB (50 seats, jaar)', values: ['€5.400', '~$15.000', '€34.800 (E5)', '€10.000+'] },
];

export function Comparison() {
  return (
    <section className="bg-white py-24 lg:py-28">
      <div className="px-6 lg:px-10 max-w-[1280px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="pg-pill pg-pill-neutral mb-4">Vergelijking</span>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-ink-900 leading-[1.05]">
            Waarom MKB-organisaties ons kiezen, niet de US-incumbents.
          </h2>
        </div>

        <div className="rounded-2xl ring-1 ring-ink-200 overflow-hidden bg-white shadow-card">
          <div className="overflow-x-auto pg-scroll">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="border-b border-ink-200 bg-ink-50/40">
                  <th className="text-left p-5 font-semibold text-ink-700 w-[36%]">Capability</th>
                  {COLS.map((c, i) => (
                    <th
                      key={c}
                      className={
                        'text-center p-5 font-semibold ' +
                        (i === 0 ? 'bg-brand-700 text-white' : 'text-ink-600')
                      }
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {ROWS.map((row) => (
                  <tr key={row.label}>
                    <td className="p-4 text-ink-700 align-top text-[14px]">{row.label}</td>
                    {row.values.map((v, i) => (
                      <td
                        key={i}
                        className={
                          'p-4 text-center align-middle ' +
                          (i === 0 ? 'bg-brand-50/30 font-semibold' : '')
                        }
                      >
                        <Mark v={v} highlight={i === 0} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 text-xs text-ink-500 text-center max-w-2xl mx-auto leading-relaxed">
          Prijsranges op basis van publiek beschikbare bronnen (Nightfall pricing pagina, Microsoft 365 E5, Netskope channel-quotes Q1 2026). Werkelijke deal-prijzen worden vaak onderhandeld.
        </p>
      </div>
    </section>
  );
}

function Mark({ v, highlight }: { v: Cell; highlight: boolean }) {
  if (v === true) {
    return (
      <span className={'inline-flex items-center justify-center w-6 h-6 rounded-full ' + (highlight ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200')}>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M16.7 5.3a1 1 0 00-1.4 0L8 12.6l-3.3-3.3a1 1 0 00-1.4 1.4l4 4a1 1 0 001.4 0l8-8a1 1 0 000-1.4z" /></svg>
      </span>
    );
  }
  if (v === false) {
    return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-ink-400 text-xl leading-none">−</span>;
  }
  if (v === 'partial') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 ring-1 ring-amber-200 text-[11px] font-semibold">
        Beperkt
      </span>
    );
  }
  return <span className={'text-[13px] font-semibold ' + (highlight ? 'text-ink-900' : 'text-ink-700')}>{v}</span>;
}
