'use client';

import { useState } from 'react';

export function ApiKeyDisplay({ apiKey: initialApiKey }: { apiKey: string }) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [regenError, setRegenError] = useState<string | null>(null);

  const masked = apiKey.replace(/^(.{12})(.*)(.{4})$/, (_m, a: string, b: string, c: string) =>
    a + b.replace(/./g, '•') + c
  );

  async function handleRegenerate() {
    if (
      !confirm(
        'Weet je zeker dat je de API-key wilt regenereren? Alle actieve extensies verliezen direct toegang totdat je de nieuwe key configureert.'
      )
    ) {
      return;
    }
    setRegenerating(true);
    setRegenError(null);
    try {
      const res = await fetch('/api/settings/regenerate-api-key', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setRegenError(data.error ?? 'Er ging iets mis. Probeer opnieuw.');
        return;
      }
      const data = await res.json() as { apiKey: string };
      setApiKey(data.apiKey);
      setRevealed(true);
      setCopied(false);
    } catch {
      setRegenError('Netwerkfout. Probeer opnieuw.');
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl ring-1 ring-ink-200 bg-ink-50 p-4 flex items-center gap-3">
        <code className="flex-1 font-mono text-sm text-ink-900 break-all select-all">
          {revealed ? apiKey : masked}
        </code>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            className="text-xs font-semibold px-3 py-1.5 rounded-md bg-white ring-1 ring-ink-200 hover:bg-ink-100"
          >
            {revealed ? 'Verbergen' : 'Tonen'}
          </button>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(apiKey);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-md bg-ink-900 text-white hover:bg-ink-950"
          >
            {copied ? 'Gekopieerd ✓' : 'Kopieer'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={regenerating}
          className="text-xs font-semibold px-3 py-1.5 rounded-md ring-1 ring-red-200 text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {regenerating ? 'Bezig…' : 'Regenereer API-key'}
        </button>
        <span className="text-xs text-ink-500">
          Let op: alle actieve extensies verliezen direct toegang na regeneratie.
        </span>
      </div>

      {regenError && (
        <div className="text-sm text-red-700 bg-red-50 ring-1 ring-red-200 rounded-lg px-3 py-2">
          {regenError}
        </div>
      )}
    </div>
  );
}
