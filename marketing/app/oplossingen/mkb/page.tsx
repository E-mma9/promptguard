import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Voor het Nederlandse MKB',
  description:
    'PromptGuard voor accountants, juristen, IT-bureaus, marketingbureaus en consultancies. AVG- en AI Act-naleving zonder DPO in huis.',
};

export default function MkbPage() {
  return (
    <>
      <div className="bg-ink-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg" aria-hidden="true" />
        <Header variant="dark" />
        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full ring-1 ring-white/20 bg-white/5 text-xs font-medium">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Voor MKB-organisaties tot 250 medewerkers
            </div>
            <h1 className="mt-7 text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              AVG en AI Act —{' '}
              <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
                ook zonder DPO in huis.
              </span>
            </h1>
            <p className="mt-7 text-lg text-ink-300 max-w-2xl leading-relaxed">
              U bent accountant, jurist, IT-bureau, marketingbureau of consultancy. U werkt
              dagelijks met klantdata. Uw medewerkers gebruiken ChatGPT om die data te bewerken.
              U weet dat dat een AVG-risico is, maar u heeft geen DPO en geen security-team. Dit
              is uw oplossing.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link href="/contact" className="btn-primary">Vraag een demo aan</Link>
              <Link href="/prijzen" className="btn-secondary">Bekijk de prijzen</Link>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <span className="section-label">Voor wie</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-ink-900 leading-tight">
              MKB-sectoren waar dit speelt.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Branche
              naam="Accountancy"
              kader="NBA-richtlijn 7 geheimhouding"
              gevoelig="Klant-jaarrekeningen, controle-bevindingen, fiscale aangiftes"
            />
            <Branche
              naam="Advocatuur"
              kader="Art. 11a Advocatenwet, NOvA-regels"
              gevoelig="Cliëntdossiers, processtukken, vertrouwelijke briefwisseling"
            />
            <Branche
              naam="IT-dienstverleners"
              kader="AVG art. 28, geheimhouding"
              gevoelig="Klant-broncode, API-keys, SaaS-credentials, klantdata in productie"
            />
            <Branche
              naam="Marketing &amp; communicatie"
              kader="AVG, e-Privacy-richtlijn"
              gevoelig="Klant-CRM-data, persoonsprofielen, contactlijsten"
            />
            <Branche
              naam="Consultancy"
              kader="Klant-NDA's, AVG art. 28"
              gevoelig="Klantstrategie, financiële projecties, vertrouwelijke memo's"
            />
            <Branche
              naam="Onderwijs / training"
              kader="AVG, Onderwijsinspectie"
              gevoelig="Cursistgegevens, beoordelingen, persoonlijke ontwikkelplannen"
            />
          </div>
        </div>
      </section>

      <section className="bg-ink-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <span className="section-label">Waarom MKB ons kiest</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-ink-900 leading-tight">
              Direct werkbaar. Geen project nodig.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Why title="In 10 minuten live">
              U maakt een account aan, downloadt de extensie, geeft uw IT-bureau de
              uitrolinstructies. Vanaf dan loopt detectie automatisch op de achtergrond.
            </Why>
            <Why title="Geen DPO nodig">
              We leveren standaard de juridische bouwstenen mee: privacyverklaring, DPA en
              voorgevulde AVG-paragraaf voor uw eigen verwerkingsregister.
            </Why>
            <Why title="Voorspelbare prijs">
              € 175 (tot 25 wp), € 595 (tot 100 wp) of € 1.999 (tot 500 wp) per maand voor de hele
              organisatie. Vanaf € 5,95 per medewerker per maand, dalend naar € 4,00 bij volume.
              Geen jaarverplichtingen, op elk moment opzegbaar.
            </Why>
            <Why title="Nederlandse data, Nederlandse taal">
              Detectoren voor BSN, IBAN, KvK, BTW, salarisstroken en NL-boekhoudsoftware. Dashboard
              en rapporten volledig in het Nederlands.
            </Why>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Begin een 14-dagen proef.
          </h2>
          <p className="mt-5 text-lg text-brand-100 max-w-2xl mx-auto">
            Geen creditcard. Geen verkoper aan de telefoon. Gewoon proberen.
          </p>
          <div className="mt-9">
            <Link href="/contact" className="btn-primary">Start de proefperiode</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Branche({ naam, kader, gevoelig }: { naam: string; kader: string; gevoelig: string }) {
  return (
    <div className="rounded-2xl ring-1 ring-ink-200 bg-white p-6">
      <h3 className="font-semibold text-ink-900">{naam}</h3>
      <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">Wettelijk kader</div>
      <p className="text-sm text-ink-700">{kader}</p>
      <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">Gevoelige data</div>
      <p className="text-sm text-ink-700">{gevoelig}</p>
    </div>
  );
}

function Why({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-7 ring-1 ring-ink-200">
      <h3 className="font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-ink-600 leading-relaxed">{children}</p>
    </div>
  );
}
