export function Testimonial() {
  return (
    <section className="bg-ink-50/60 py-24 lg:py-28">
      <div className="px-6 lg:px-10 max-w-[1100px] mx-auto">
        <figure className="text-center">
          <svg
            width="44"
            height="32"
            viewBox="0 0 44 32"
            className="mx-auto text-brand-300 mb-6"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M0 32V18.4C0 8.32 5.92 2.24 17.76 0v6.72c-5.6 1.6-8.32 4.8-8.32 9.6h7.84V32H0zm22.4 0V18.4c0-10.08 5.92-16.16 17.76-18.4v6.72c-5.6 1.6-8.32 4.8-8.32 9.6h7.84V32H22.4z" />
          </svg>
          <blockquote className="text-2xl lg:text-3xl font-semibold tracking-tight text-ink-900 leading-snug max-w-3xl mx-auto">
            "In tien minuten wisten we wat ons hele team in een jaar in ChatGPT had geplakt. Het rapport was confronterend — en precies wat we nodig hadden om de directie wakker te schudden."
          </blockquote>
          <figcaption className="mt-8 flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center text-white font-bold">
              FG
            </div>
            <div className="text-left">
              <div className="font-semibold text-ink-900">Functionaris Gegevensbescherming</div>
              <div className="text-sm text-ink-500">NL accountantskantoor · 140 medewerkers · pilot</div>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
