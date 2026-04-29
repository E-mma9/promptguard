'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError('Ongeldige gegevens. Probeer opnieuw.');
        return;
      }
      router.push(next);
      router.refresh();
    });
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 lg:px-16 py-12">
        <Link href="/" className="inline-flex">
          <Logo size={32} withText />
        </Link>
        <div className="max-w-sm mt-12 lg:mt-20">
          <h1 className="text-3xl font-bold tracking-tight text-ink-900">Inloggen</h1>
          <p className="mt-2 text-ink-600">Toegang voor admins en compliance officers.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="pg-section-label mb-1.5 block">E-mail</span>
              <input
                type="email"
                required
                autoComplete="email"
                className="pg-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@uwbedrijf.nl"
              />
            </label>
            <label className="block">
              <span className="pg-section-label mb-1.5 block">Wachtwoord</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                className="pg-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error && (
              <div className="text-sm text-red-700 bg-red-50 ring-1 ring-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            <button type="submit" disabled={pending} className="pg-button-primary w-full !py-3">
              {pending ? 'Bezig met inloggen…' : 'Inloggen'}
            </button>
          </form>

          <p className="text-sm text-ink-500 text-center mt-6">
            Nog geen account?{' '}
            <Link href="/signup" className="text-brand-700 font-semibold hover:underline">
              Maak er gratis een aan
            </Link>
          </p>

          <div className="mt-8 rounded-xl bg-brand-50 ring-1 ring-brand-200 p-4 text-sm">
            <strong className="text-brand-900">Demo-account</strong>
            <p className="text-brand-800 mt-1 leading-relaxed">
              <span className="font-mono text-[13px] bg-white/60 px-1.5 py-0.5 rounded">admin@demo.nl</span>
              {' / '}
              <span className="font-mono text-[13px] bg-white/60 px-1.5 py-0.5 rounded">demo1234</span>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex bg-ink-950 text-white p-16 flex-col justify-between relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 80% 80%, #2563eb 0%, transparent 50%)',
          }}
        />
        <div className="relative">
          <Logo size={32} />
        </div>
        <div className="relative">
          <blockquote className="text-2xl leading-relaxed font-medium tracking-tight">
            &ldquo;In tien minuten wisten we wat het hele bedrijf in een jaar in ChatGPT had geplakt. Het rapport was confronterend.&rdquo;
          </blockquote>
          <div className="mt-6 text-ink-300 text-sm">
            <strong className="text-white">FG, &lsquo;Een NL accountantskantoor</strong> &middot; PromptGuard pilot
          </div>
        </div>
      </div>
    </div>
  );
}
