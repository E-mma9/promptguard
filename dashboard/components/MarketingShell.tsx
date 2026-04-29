'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Logo } from './Logo';

type HeaderProps = {
  /** When true, header is transparent over a dark hero until the user scrolls */
  darkHero?: boolean;
};

export function MarketingHeader({ darkHero = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!darkHero) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [darkHero]);

  const overDark = darkHero && !scrolled;

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-30 transition-all duration-300',
        overDark
          ? 'bg-transparent border-b border-transparent'
          : 'bg-white/85 backdrop-blur-md border-b border-ink-200/70'
      )}
    >
      <div className="px-6 lg:px-10 py-4 max-w-[1280px] mx-auto flex items-center justify-between">
        <Link href="/" className="inline-flex">
          <Logo size={30} withText />
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <NavLink href="/features" overDark={overDark}>Features</NavLink>
          <NavLink href="/pricing" overDark={overDark}>Prijzen</NavLink>
          <NavLink href="/security" overDark={overDark}>Beveiliging</NavLink>
          <NavLink href="/legal/privacy" overDark={overDark}>Privacy</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={clsx(
              'text-sm font-semibold px-3 py-2 transition-colors',
              overDark ? 'text-white/80 hover:text-white' : 'text-ink-700 hover:text-ink-900'
            )}
          >
            Inloggen
          </Link>
          <Link
            href="/signup"
            className={clsx(
              'rounded-lg px-4 py-2 text-sm font-semibold transition-all',
              overDark
                ? 'bg-white text-ink-900 hover:bg-ink-100'
                : 'bg-ink-900 text-white hover:bg-ink-950'
            )}
          >
            Gratis proberen
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, overDark, children }: { href: string; overDark: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={clsx(
        'transition-colors',
        overDark ? 'text-white/70 hover:text-white' : 'text-ink-600 hover:text-ink-900'
      )}
    >
      {children}
    </Link>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-ink-200 bg-ink-50/30">
      <div className="px-6 lg:px-10 py-12 max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 text-sm">
        <div className="col-span-2">
          <Logo size={26} withText />
          <p className="text-ink-500 mt-3 text-[13px] leading-relaxed max-w-xs">
            Shadow AI monitor voor het Nederlandse MKB. AVG-proof, AI Act-klaar, lokaal gedetecteerd.
          </p>
          <div className="mt-5 flex items-center gap-4 text-xs text-ink-500">
            <Badge>SOC2 in progress</Badge>
            <Badge>EU-hosted</Badge>
          </div>
        </div>
        <FooterCol title="Product" links={[
          ['Features', '/features'],
          ['Prijzen', '/pricing'],
          ['Beveiliging', '/security'],
          ['Aanmelden', '/signup'],
          ['Inloggen', '/login'],
        ]} />
        <FooterCol title="Compliance" links={[
          ['Privacybeleid', '/legal/privacy'],
          ['Verwerkersovereenkomst', '/legal/dpa'],
          ['Sub-processors', '/legal/sub-processors'],
          ['Algemene voorwaarden', '/legal/terms'],
        ]} />
        <FooterCol title="Contact" links={[
          ['hello@promptguard.nl', 'mailto:hello@promptguard.nl'],
          ['security@promptguard.nl', 'mailto:security@promptguard.nl'],
          ['Plan een gesprek', 'mailto:sales@promptguard.nl'],
        ]} />
      </div>
      <div className="px-6 lg:px-10 py-5 max-w-[1280px] mx-auto border-t border-ink-100 text-xs text-ink-500 flex justify-between flex-wrap gap-2">
        <div>© {new Date().getFullYear()} PromptGuard. Gebouwd voor het Nederlandse MKB.</div>
        <div>KvK xxx · BTW NL xxx · Amsterdam</div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="pg-section-label mb-3">{title}</div>
      <ul className="space-y-2 text-ink-600">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="hover:text-ink-900">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white ring-1 ring-ink-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      <span className="text-[11px] font-semibold text-ink-700">{children}</span>
    </span>
  );
}
