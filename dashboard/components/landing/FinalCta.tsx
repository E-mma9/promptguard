import Link from 'next/link';

export function FinalCta() {
  return (
    <section className="px-6 lg:px-10 py-20">
      <div className="relative max-w-[1100px] mx-auto rounded-3xl overflow-hidden">
        <div className="relative bg-ink-950 text-white px-8 lg:px-16 py-16 lg:py-24">
          {/* Mesh gradient background */}
          <div
            className="absolute inset-0 -z-10 opacity-90"
            style={{
              background:
                'radial-gradient(at 20% 20%, rgba(124, 58, 237, 0.5) 0px, transparent 50%),' +
                'radial-gradient(at 80% 30%, rgba(37, 99, 235, 0.4) 0px, transparent 50%),' +
                'radial-gradient(at 40% 90%, rgba(168, 85, 247, 0.35) 0px, transparent 50%)',
            }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 -z-10 opacity-50"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),' +
                'linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-3xl">
            <span className="pg-eyebrow mb-6">14 dagen kosteloos</span>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight leading-[1.05] mb-5">
              Wacht niet op het eerste datalek.
              <br />
              <span className="text-white/70">Weet vandaag wat er gebeurt.</span>
            </h2>
            <p className="text-lg text-white/70 mb-10 leading-relaxed max-w-2xl">
              Self-service signup, 10 minuten installatie, geen creditcard, geen verkoopgesprek vooraf. Aan het einde van de proef heeft u het rapport. Dan praten we verder.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-lg bg-white text-ink-900 hover:bg-ink-100 px-7 py-3.5 text-base font-semibold transition-all shadow-xl"
              >
                Maak gratis account →
              </Link>
              <Link
                href="/pricing"
                className="rounded-lg ring-1 ring-white/30 hover:ring-white/50 hover:bg-white/5 px-7 py-3.5 text-base font-semibold text-white transition-all backdrop-blur-sm"
              >
                Bekijk prijzen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
