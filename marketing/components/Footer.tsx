import Link from 'next/link';
import { Logo } from './Logo';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-2">
            <Logo light />
            <p className="mt-4 text-sm leading-relaxed text-ink-300 max-w-sm">
              De evidence-laag voor AI-gebruik op de werkvloer. Compliance onder AI Act,
              AVG, NIS2 en NEN 7510 — bewijsbaar, niet beloofd.
            </p>
            <p className="mt-6 text-xs text-ink-400 leading-relaxed">
              PromptGuard B.V. in oprichting<br />
              KvK: [na inschrijving]  ·  btw-id: [na inschrijving]<br />
              Hosting: EU — Frankfurt (fra1)  ·  Geen US-subverwerkers
            </p>
          </div>

          <FooterCol title="Product">
            <FooterLink href="/oplossingen/zorg">Voor de zorg</FooterLink>
            <FooterLink href="/oplossingen/financieel">Voor financieel</FooterLink>
            <FooterLink href="/oplossingen/mkb">Voor MKB</FooterLink>
            <FooterLink href="/prijzen">Prijzen</FooterLink>
            <FooterLink href="/over-ons">Over ons</FooterLink>
            <FooterLink href={`${APP_URL}/login`} external>Inloggen</FooterLink>
          </FooterCol>

          <FooterCol title="Compliance">
            <FooterLink href="/wettelijk-kader">Wettelijk kader</FooterLink>
            <FooterLink href={`${APP_URL}/security`} external>Beveiliging</FooterLink>
            <FooterLink href={`${APP_URL}/security/nen7510`} external>NEN 7510-mapping</FooterLink>
            <FooterLink href={`${APP_URL}/legal/dpa`} external>Verwerkersovereenkomst</FooterLink>
          </FooterCol>

          <FooterCol title="Juridisch">
            <FooterLink href={`${APP_URL}/privacy`} external>Privacyverklaring</FooterLink>
            <FooterLink href={`${APP_URL}/terms`} external>Algemene voorwaarden</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="mailto:security@promptguard.nl" external>Beveiligingsmelding</FooterLink>
          </FooterCol>
        </div>

        <div className="mt-14 pt-8 border-t border-ink-800 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-ink-400">
          <div>© {new Date().getFullYear()} PromptGuard. Alle rechten voorbehouden.</div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true"></span>
            <span>Dashboard online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">{title}</h2>
      <ul className="mt-4 space-y-2 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className =
    'inline-block text-ink-300 hover:text-white transition-colors focus-ring-dark';
  if (external) {
    return (
      <li>
        <a href={href} className={className}>
          {children}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={href} className={className}>
        {children}
      </Link>
    </li>
  );
}
