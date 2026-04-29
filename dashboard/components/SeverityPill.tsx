import clsx from 'clsx';

export function SeverityPill({ severity }: { severity: string }) {
  const cls = clsx(
    'pg-pill',
    severity === 'high' ? 'pg-pill-high' : severity === 'medium' ? 'pg-pill-medium' : 'pg-pill-low'
  );
  const label = severity === 'high' ? 'Kritiek' : severity === 'medium' ? 'Gevoelig' : 'Laag';
  const dotCls = clsx('pg-dot', `pg-dot-${severity}`);
  return (
    <span className={cls}>
      <span className={dotCls} />
      {label}
    </span>
  );
}

export function ToolBadge({ tool }: { tool: string }) {
  const map: Record<string, { label: string; bg: string; fg: string }> = {
    chatgpt: { label: 'ChatGPT', bg: 'bg-emerald-50', fg: 'text-emerald-700 ring-emerald-200' },
    claude: { label: 'Claude', bg: 'bg-orange-50', fg: 'text-orange-700 ring-orange-200' },
    gemini: { label: 'Gemini', bg: 'bg-blue-50', fg: 'text-blue-700 ring-blue-200' },
    copilot: { label: 'Copilot', bg: 'bg-sky-50', fg: 'text-sky-700 ring-sky-200' },
    mistral: { label: 'Mistral', bg: 'bg-amber-50', fg: 'text-amber-700 ring-amber-200' },
    perplexity: { label: 'Perplexity', bg: 'bg-violet-50', fg: 'text-violet-700 ring-violet-200' },
    you: { label: 'You.com', bg: 'bg-rose-50', fg: 'text-rose-700 ring-rose-200' },
    unknown: { label: 'Onbekend', bg: 'bg-ink-50', fg: 'text-ink-700 ring-ink-200' },
  };
  const v = map[tool] ?? map.unknown;
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ring-1', v.bg, v.fg)}>
      {v.label}
    </span>
  );
}

export function ActionPill({ action }: { action: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    monitored: { label: 'Geregistreerd', cls: 'bg-ink-100 text-ink-700 ring-ink-200' },
    warned: { label: 'Waarschuwing', cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
    blocked: { label: 'Geblokkeerd', cls: 'bg-red-50 text-red-700 ring-red-200' },
  };
  const v = map[action] ?? map.monitored;
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ring-1', v.cls)}>
      {v.label}
    </span>
  );
}
