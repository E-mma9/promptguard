'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function SignupPage() {
  const router = useRouter();
  const [organizationName, setOrgName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationName, email, password, name, acceptedTerms }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Er ging iets mis. Probeer opnieuw.');
        return;
      }
      router.push(data.redirectTo || '/dashboard/welcome');
      router.refresh();
    });
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 lg:px-16 py-12">
        <Link href="/login" className="inline-flex">
          <Logo size={32} withText />
        </Link>
        <div className="max-w-md mt-12">
          <h1 className="text-3xl font-bold tracking-tight text-ink-900">Maak een account</h1>
          <p className="mt-2 text-ink-600">
            14 dagen kosteloos. Geen creditcard nodig. Cancel wanneer je wilt.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="pg-section-label mb-1.5 block">Organisatienaam</span>
              <input
                type="text"
                required
                className="pg-input"
                value={organizationName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Bijv. Acme BV"
                autoFocus
              />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="pg-section-label mb-1.5 block">Naam</span>
                <input
                  type="text"
                  className="pg-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jan de Vries"
                />
              </label>
              <label className="block">
                <span className="pg-section-label mb-1.5 block">Werk-e-mail</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className="pg-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="naam@bedrijf.nl"
                />
              </label>
            </div>
            <label className="block">
              <span className="pg-section-label mb-1.5 block">Wachtwoord</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="pg-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimaal 8 tekens"
              />
            </label>

            <label className="flex items-start gap-2.5 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-ink-300 text-brand-700 focus:ring-brand-500"
              />
              <span className="text-sm text-ink-700 leading-relaxed">
                Ik ga akkoord met de voorwaarden van deze interne PromptGuard-omgeving.
              </span>
            </label>

            {error && (
              <div className="text-sm text-red-700 bg-red-50 ring-1 ring-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button type="submit" disabled={pending} className="pg-button-primary w-full !py-3 !text-base">
              {pending ? 'Account aanmaken…' : 'Account aanmaken'}
            </button>

            <p className="text-sm text-ink-500 text-center">
              Heb je al een account?{' '}
              <Link href="/login" className="text-brand-700 font-semibold hover:underline">
                Inloggen
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex bg-ink-950 text-white p-16 flex-col justify-between relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 70% 70%, #2563eb 0%, transparent 50%)',
          }}
        />
        <div className="relative">
          <Logo size={32} />
        </div>
        <div className="relative space-y-8">
          <h2 className="text-2xl font-semibold tracking-tight leading-tight">
            In 10 minuten weet je wat je medewerkers werkelijk in ChatGPT plakken.
          </h2>
          <ul className="space-y-3 text-ink-300">
            <Bullet>Detectie 100% lokaal in de browser — geen prompttekst verlaat de organisatie</Bullet>
            <Bullet>Automatische uitrol via Microsoft Intune, Group Policy, of Jamf</Bullet>
            <Bullet>BSN, IBAN, KvK, salarisstroken, broncode — herkent NL-systemen out-of-the-box</Bullet>
            <Bullet>AI Act-rapportage per kwartaal — direct exporteerbaar voor compliance</Bullet>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 items-start">
      <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0 mt-0.5" aria-hidden="true">
        <circle cx="10" cy="10" r="9" fill="#16a34a" />
        <path d="M6 10.5l2.5 2.5L14 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <span className="text-[15px] leading-relaxed">{children}</span>
    </li>
  );
}
