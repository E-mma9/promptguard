import clsx from 'clsx';
import { fmtCompact } from '@/lib/format';

export function KpiCard({
  label,
  value,
  sub,
  accent,
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: 'high' | 'medium' | 'low' | 'brand';
  trend?: { delta: number; direction: 'up' | 'down' };
}) {
  const accentClass = {
    high: 'before:bg-sev-high',
    medium: 'before:bg-sev-medium',
    low: 'before:bg-sev-low',
    brand: 'before:bg-brand-700',
  }[accent ?? 'brand'];

  const v = typeof value === 'number' ? fmtCompact(value) : value;

  return (
    <div
      className={clsx(
        'pg-card p-5 relative overflow-hidden',
        'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1',
        accentClass
      )}
    >
      <div className="pg-section-label">{label}</div>
      <div className="mt-2 flex items-baseline gap-3">
        <div className="pg-num text-3xl font-bold text-ink-900 tracking-tight">{v}</div>
        {trend && (
          <div
            className={clsx(
              'text-xs font-semibold px-1.5 py-0.5 rounded',
              trend.direction === 'up' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
            )}
          >
            {trend.direction === 'up' ? '+' : '−'}
            {Math.abs(trend.delta)}%
          </div>
        )}
      </div>
      {sub && <div className="text-xs text-ink-500 mt-1">{sub}</div>}
    </div>
  );
}
