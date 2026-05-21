import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Main } from '@/components/Main';

export const metadata = {
  title: 'Over ons — wie zit er achter PromptGuard',
  description:
    'PromptGuard is opgezet vanuit Nederland, met EU-only hosting en open-source detectielogica. Onze missie, onze keuzes, ons team.',
};

export default function OverOnsPage() {
  return (
    <>
      <div className="bg-ink-950 text-white">
        <Header variant="dark" />
      </div>

      <Main>
      <section className="bg-ink-950 text-white">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-12">
          <span className="section-label-light">Over ons</span>
          <h1 className="mt-3 text-5xl md:text-6xl font-bold tracking-tight max-w-4xl">
            Eerlijk. Nederlands. Bewijsbaar.
          </h1>
          <p className="mt-7 text-lg text-ink-300 max-w-2xl leading-relaxed">
            PromptGuard is opgezet in 2026 vanuit één observatie: vrijwel iedere Nederlandse
            organisatie gebruikt al generatieve AI, maar niemand kan dat aantoonbaar in goede banen
            leiden. De wet eist het. De techniek is er. Wat ontbrak was een leverancier die het
            niet ingewikkelder maakte dan nodig.
          </p>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6 space-y-12">

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-ink-900">Onze missie</h2>
            <p className="mt-4 text-ink-700 leading-relaxed text-lg">
              PromptGuard maakt het mogelijk dat Nederlandse organisaties — van eenpitter tot
              zorginstelling met 5.000 medewerkers — kunnen aantonen dat ze hun AI-gebruik kennen,
              monitoren en bestuurbaar maken. Zonder Amerikaanse subverwerkers. Zonder
              prompttekst-onderschepping. Zonder schaduwboekhouding.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-ink-900">Wat we anders doen</h2>
            <ul className="mt-4 space-y-4 text-ink-700">
              <li className="flex gap-3">
                <Dot />
                <div>
                  <strong className="text-ink-900">Detectie is open-source.</strong> De
                  detectie-engine (BSN-elfproef, IBAN mod-97, Luhn, NL-specifieke regex) is publiek
                  auditbaar. Een DPO mag het lezen. Een concurrent ook.
                </div>
              </li>
              <li className="flex gap-3">
                <Dot />
                <div>
                  <strong className="text-ink-900">EU-only is een feature, geen marketing.</strong>{' '}
                  Onze code-base bevat geen Amerikaanse subverwerkers voor klantgegevens.
                  Schrems II is voor ons niet relevant — we hebben er bewust voor gekozen niet
                  doorheen te hoeven navigeren.
                </div>
              </li>
              <li className="flex gap-3">
                <Dot />
                <div>
                  <strong className="text-ink-900">Eerlijk over wat we niet zijn.</strong> We zijn
                  geen NEN 7510-gecertificeerd bedrijf. We zijn geen vervanging van uw FG of
                  CISO. We dekken geen werkgevers­aansprakelijkheid. Het staat allemaal expliciet
                  op onze pagina{' '}
                  <Link href="/wettelijk-kader" className="text-brand-700 underline focus-ring">
                    wettelijk kader
                  </Link>.
                </div>
              </li>
              <li className="flex gap-3">
                <Dot />
                <div>
                  <strong className="text-ink-900">Werknemer is ook een persoon.</strong> Onze
                  privacyverklaring bevat een sectie speciaal voor medewerkers waar hun werkgever
                  PromptGuard inzet. Wij wijzen klanten actief op hun verplichtingen onder de
                  Wet op de ondernemingsraden (WOR art. 27).
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-ink-900">Het team</h2>
            <p className="mt-4 text-ink-700 leading-relaxed">
              PromptGuard is in 2026 gestart als eenmanszaak. Op het moment van uw eerste
              contractgesprek zijn wij in oprichtingsproces naar B.V. (PromptGuard B.V. in
              oprichting). Een transparant detail dat ander leveranciers verbergen, en dat wij
              expliciet vermelden: u contracteert met een jong bedrijf. Daar staan
              broncode-escrow, EU-data-portabiliteit en een no-lock-in-architectuur tegenover.
            </p>
            <p className="mt-4 text-ink-700 leading-relaxed">
              We zijn klein. We willen klein blijven tot we serieus serieuze klanten serieus
              kunnen bedienen. Dat moment komt — en dan groeien we passend, niet eerder.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-ink-900">Wat dit voor u betekent</h2>
            <ul className="mt-4 space-y-3 text-ink-700">
              <li className="flex gap-3"><Check /> U kunt onze code lezen vóórdat u tekent</li>
              <li className="flex gap-3"><Check /> U behoudt te allen tijde uw eigen data — exporteerbaar in CSV en JSON</li>
              <li className="flex gap-3"><Check /> U krijgt persoonlijk contact — geen sales-funnel zonder mens erin</li>
              <li className="flex gap-3"><Check /> U onderhandelt met ons over de DPA, niet andersom</li>
              <li className="flex gap-3"><Check /> U weet wat onze subverwerkers zijn — drie partijen, allemaal EU</li>
            </ul>
          </div>

          <div className="pt-8 border-t border-ink-100 text-center">
            <p className="text-ink-700 text-lg">
              Een vraag, of liever direct kennismaken?
            </p>
            <div className="mt-6">
              <Link href="/contact" className="btn-primary-dark">Plan een gesprek</Link>
            </div>
          </div>
        </div>
      </section>
      </Main>

      <Footer />
    </>
  );
}

function Dot() {
  return (
    <span
      className="mt-2 inline-block w-2 h-2 rounded-full bg-brand-500 shrink-0"
      aria-hidden="true"
    />
  );
}

function Check() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 shrink-0 text-emerald-600"
    >
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15" />
      <path
        d="M6 10.5l2.5 2.5L14 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
