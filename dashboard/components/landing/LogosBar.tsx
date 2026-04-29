// Industry placeholders — replace with real customer logos once available.
const INDUSTRIES = [
  'Accountancy',
  'Financiële dienstverlening',
  'Zorg & Welzijn',
  'Juridisch',
  'Consultancy',
  'Onderwijs',
  'Notariaat',
  'Verzekeringen',
];

export function LogosBar() {
  // Render twice for seamless marquee loop
  const items = [...INDUSTRIES, ...INDUSTRIES];

  return (
    <section className="bg-white border-y border-ink-100 py-10 overflow-hidden">
      <div className="px-6 lg:px-10 max-w-[1280px] mx-auto">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          In gebruik bij Nederlandse MKB-organisaties in
        </p>
        <div className="mt-6 pg-marquee-mask">
          <div className="flex animate-marquee gap-12 whitespace-nowrap will-change-transform">
            {items.map((s, i) => (
              <div key={i} className="flex items-center gap-3 text-ink-600 shrink-0">
                <Mark />
                <span className="font-semibold text-[15px]">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Mark() {
  // Simple placeholder mark — a small filled circle with a "PG" letterform.
  return (
    <span className="w-7 h-7 rounded-md bg-gradient-to-br from-brand-500/20 to-brand-700/30 ring-1 ring-brand-200 grid place-items-center">
      <span className="text-[10px] font-bold text-brand-800 tracking-tight">PG</span>
    </span>
  );
}
