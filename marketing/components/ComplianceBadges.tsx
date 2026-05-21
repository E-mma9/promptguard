type BadgeProps = {
  light?: boolean;
};

const items = [
  { label: 'AI Act', sub: 'art. 4 evidence' },
  { label: 'AVG', sub: 'by design' },
  { label: 'NIS2', sub: 'art. 21 maatregelen' },
  { label: 'DORA', sub: 'ICT-register' },
  { label: 'NEN 7510', sub: 'controls-mapping' },
  { label: 'ISO 27001', sub: 'ontworpen volgens' },
];

export function ComplianceBadges({ light }: BadgeProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
      {items.map((it) => (
        <div
          key={it.label}
          className={
            'flex items-center gap-2 px-3 py-1.5 rounded-md ring-1 ' +
            (light
              ? 'ring-white/20 bg-white/5 text-white'
              : 'ring-ink-200 bg-white text-ink-800')
          }
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={light ? 'text-emerald-400' : 'text-emerald-600'}
            aria-hidden="true"
          >
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" />
          </svg>
          <span className="text-sm font-semibold">{it.label}</span>
          <span className={light ? 'text-xs text-ink-400' : 'text-xs text-ink-500'}>
            {it.sub}
          </span>
        </div>
      ))}
    </div>
  );
}
