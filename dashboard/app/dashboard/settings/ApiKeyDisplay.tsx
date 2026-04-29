'use client';

import { useState } from 'react';

export function ApiKeyDisplay({ apiKey }: { apiKey: string }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const masked = apiKey.replace(/^(.{12})(.*)(.{4})$/, (_m, a: string, b: string, c: string) =>
    a + b.replace(/./g, '•') + c
  );

  return (
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
          {copied ? 'Gekopieerd' : 'Kopieer'}
        </button>
      </div>
    </div>
  );
}
