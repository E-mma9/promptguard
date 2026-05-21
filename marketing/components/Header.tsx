import Link from 'next/link';
import { Logo } from './Logo';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function Header({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const isDark = variant === 'dark';
  return (
    <header
      className={
        'relative z-30 ' +
        (isDark
          ? 'text-white'
          : 'border-b border-ink-100 bg-white/80 backdrop-blur-md text-ink-900')
      }
    >
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <Link
          href="/"
          aria-label="PromptGuard — naar de homepagina"
          className={isDark ? 'focus-ring-dark' : 'focus-ring'}
        >
          <Logo light={isDark} />
        </Link>

        <nav aria-label="Hoofdnavigatie" className="hidden md:flex items-center gap-7 text-sm">
          <NavLink href="/oplossingen/zorg" dark={isDark}>Zorg</NavLink>
          <NavLink href="/oplossingen/financieel" dark={isDark}>Financieel</NavLink>
          <NavLink href="/oplossingen/mkb" dark={isDark}>MKB</NavLink>
          <NavLink href="/wettelijk-kader" dark={isDark}>Wettelijk kader</NavLink>
          <NavLink href="/prijzen" dark={isDark}>Prijzen</NavLink>
          <NavLink href="/contact" dark={isDark}>Contact</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`${APP_URL}/login`}
            className={
              'text-sm font-medium px-1 py-0.5 ' +
              (isDark
                ? 'text-white hover:text-white/80 focus-ring-dark'
                : 'text-ink-700 hover:text-ink-900 focus-ring')
            }
          >
            Inloggen
          </a>
          <Link
            href="/contact"
            className={isDark ? 'btn-primary' : 'btn-primary-dark'}
          >
            Demo aanvragen
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  dark,
}: {
  href: string;
  children: React.ReactNode;
  dark: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        'font-medium transition-colors px-1 py-0.5 ' +
        (dark
          ? 'text-white hover:text-white/80 focus-ring-dark'
          : 'text-ink-700 hover:text-ink-900 focus-ring')
      }
    >
      {children}
    </Link>
  );
}
