import Link from 'next/link';
import { Logo } from './Logo';

export function MarketingHeader() {
  return (
    <header className="px-6 lg:px-10 py-5 flex items-center justify-between border-b border-ink-200/70 bg-white/80 backdrop-blur-md sticky top-0 z-20">
      <Link href="/" className="inline-flex">
        <Logo size={30} withText />
      </Link>
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-ink-600">
        <Link href="/features" className="hover:text-ink-900">Features</Link>
        <Link href="/pricing" className="hover:text-ink-900">Prijzen</Link>
        <Link href="/security" className="hover:text-ink-900">Beveiliging</Link>
        <Link href="/legal/privacy" className="hover:text-ink-900">Privacy</Link>
      </nav>
      <div className="flex items-center gap-2">
        <Link href="/login" className="text-sm font-semibold text-ink-700 hover:text-ink-900 px-3 py-2">
          Inloggen
        </Link>
        <Link href="/signup" className="pg-button-primary">Gratis proberen</Link>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-ink-200 mt-16">
      <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1">
          <Logo size={24} withText />
          <p className="text-ink-500 mt-3 text-[12.5px] leading-relaxed">
            Shadow AI monitor voor het Nederlandse MKB. AVG-proof, AI Act-klaar, lokaal.
          </p>
        </div>
        <div>
          <div className="pg-section-label mb-3">Product</div>
          <ul className="space-y-2 text-ink-600">
            <li><Link href="/features" className="hover:text-ink-900">Features</Link></li>
            <li><Link href="/pricing" className="hover:text-ink-900">Prijzen</Link></li>
            <li><Link href="/security" className="hover:text-ink-900">Beveiliging</Link></li>
            <li><Link href="/signup" className="hover:text-ink-900">Aanmelden</Link></li>
          </ul>
        </div>
        <div>
          <div className="pg-section-label mb-3">Compliance</div>
          <ul className="space-y-2 text-ink-600">
            <li><Link href="/legal/privacy" className="hover:text-ink-900">Privacybeleid</Link></li>
            <li><Link href="/legal/dpa" className="hover:text-ink-900">Verwerkersovereenkomst</Link></li>
            <li><Link href="/legal/sub-processors" className="hover:text-ink-900">Sub-processors</Link></li>
          </ul>
        </div>
        <div>
          <div className="pg-section-label mb-3">Contact</div>
          <ul className="space-y-2 text-ink-600">
            <li><a href="mailto:hello@promptguard.nl" className="hover:text-ink-900">hello@promptguard.nl</a></li>
            <li><a href="mailto:security@promptguard.nl" className="hover:text-ink-900">security@promptguard.nl</a></li>
          </ul>
        </div>
      </div>
      <div className="px-6 lg:px-10 py-5 max-w-6xl mx-auto border-t border-ink-100 text-xs text-ink-500 flex justify-between flex-wrap gap-2">
        <div>© {new Date().getFullYear()} PromptGuard. Gebouwd voor het Nederlandse MKB.</div>
        <div>KvK xxx · BTW NL xxx · Amsterdam</div>
      </div>
    </footer>
  );
}
