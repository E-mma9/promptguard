import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950 text-white">
      {/* mesh gradient + grid + noise */}
      <div className="absolute inset-0 -z-10 bg-mesh-hero" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.6] bg-grid-dark"
        style={{ backgroundSize: '48px 48px' }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 opacity-[0.7] bg-noise mix-blend-soft-light" aria-hidden="true" />
      {/* Bottom fade into white */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-white" aria-hidden="true" />

      <div className="px-6 lg:px-10 max-w-[1280px] mx-auto pt-32 lg:pt-40 pb-20 lg:pb-28">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="pg-eyebrow">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              Shadow AI Monitor · Live in 10 minuten
            </span>

            <h1 className="mt-6 text-[44px] sm:text-[56px] lg:text-[72px] font-bold tracking-[-0.025em] leading-[0.98]">
              Zie wat uw medewerkers
              <br />
              in <span className="pg-shimmer-text font-bold">ChatGPT plakken</span>.
            </h1>

            <p className="mt-7 text-lg lg:text-xl text-white/70 leading-relaxed max-w-2xl">
              PromptGuard detecteert <strong className="text-white font-semibold">lokaal in de browser</strong> welke gevoelige data — BSN's, IBAN's, salarisstroken, contracten, broncode — uw team plakt in ChatGPT, Claude, Gemini en Copilot. Geen prompttekst verlaat uw organisatie.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-lg bg-white text-ink-900 hover:bg-ink-100 px-6 py-3.5 text-base font-semibold transition-all shadow-xl shadow-brand-500/20"
              >
                Start gratis proef →
              </Link>
              <Link
                href="mailto:sales@promptguard.nl?subject=Demo aanvragen"
                className="rounded-lg ring-1 ring-white/20 hover:ring-white/40 hover:bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition-all backdrop-blur-sm"
              >
                Plan een demo
              </Link>
            </div>

            <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60">
              <Pillar>14 dagen kosteloos</Pillar>
              <Pillar>Geen creditcard</Pillar>
              <Pillar>10 min installatie</Pillar>
              <Pillar>NL-detectie out-of-the-box</Pillar>
            </ul>
          </div>

          <div className="lg:col-span-5">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillar({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="9" fill="rgba(34, 197, 94, 0.15)" stroke="rgba(74, 222, 128, 0.6)" strokeWidth="1" />
        <path d="M6 10.5l2.5 2.5L14 7.5" stroke="rgb(74, 222, 128)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <span>{children}</span>
    </li>
  );
}

function HeroMockup() {
  return (
    <div className="relative">
      {/* Glow under */}
      <div
        className="absolute -inset-8 -z-10 rounded-3xl opacity-60 animate-pulse-glow"
        style={{
          background: 'radial-gradient(closest-side, rgba(168, 85, 247, 0.4), transparent 70%)',
          filter: 'blur(40px)',
        }}
        aria-hidden="true"
      />

      {/* Browser chrome */}
      <div className="relative rounded-2xl bg-gradient-to-b from-white to-ink-50 shadow-2xl ring-1 ring-white/10 overflow-hidden animate-float">
        <div className="px-4 py-3 border-b border-ink-100 flex items-center gap-2 bg-ink-50/80 backdrop-blur">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="ml-3 flex-1 text-xs text-ink-500 font-mono bg-white rounded px-3 py-1 ring-1 ring-ink-200/60">
            chatgpt.com/c/...
          </div>
        </div>
        <div className="p-5 space-y-4">
          {/* Banner */}
          <div className="border-l-[3px] border-red-500 bg-red-50 rounded-r-lg p-4 ring-1 ring-red-100">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-7 h-7 rounded-full bg-red-100 text-red-700 grid place-items-center text-sm font-bold">!</span>
              <strong className="text-[13.5px] text-ink-900">PromptGuard heeft <span className="text-red-700">17 kritieke items</span> gedetecteerd</strong>
            </div>
            <p className="text-[12px] text-ink-600 ml-9">14× BSN, 2× NL IBAN, 1× KvK-nummer</p>
            <p className="text-[11px] text-ink-500 ml-9 mt-0.5">Deze data zou bij <strong>ChatGPT</strong> terechtkomen.</p>
          </div>
          {/* Pasted text */}
          <div className="rounded-lg bg-ink-50 p-3.5 font-mono text-[11.5px] leading-relaxed text-ink-700 ring-1 ring-ink-100">
            <div className="text-ink-400 mb-1">{'>'} Kun je deze klantenlijst samenvatten?</div>
            Naam: Jan de Vries
            <br />
            BSN: <span className="bg-red-100 text-red-800 px-1 rounded">111222333</span>
            <br />
            IBAN: <span className="bg-red-100 text-red-800 px-1 rounded">NL91ABNA0417...</span>
            <br />
            <span className="text-ink-400">[+ 14 vergelijkbare records]</span>
          </div>
          <div className="flex justify-end gap-2">
            <button className="text-xs font-semibold px-3.5 py-2 rounded-lg ring-1 ring-ink-200 text-ink-700">
              Annuleren
            </button>
            <button className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-ink-900 text-white">
              Toch versturen
            </button>
          </div>
        </div>
      </div>

      {/* Floating mini-card: detection indicator */}
      <div className="absolute -bottom-6 -left-6 hidden md:block animate-float" style={{ animationDelay: '0.5s' }}>
        <div className="rounded-xl bg-ink-900 ring-1 ring-white/10 p-3.5 shadow-2xl flex items-center gap-3 min-w-[200px]">
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 grid place-items-center ring-1 ring-emerald-400/30">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="rgb(74, 222, 128)" aria-hidden="true">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-[10.5px] font-semibold uppercase tracking-wider text-white/50">Lokaal gedetecteerd</div>
            <div className="text-sm font-semibold text-white">Geen data gelekt</div>
          </div>
        </div>
      </div>
    </div>
  );
}
