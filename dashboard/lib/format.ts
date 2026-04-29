const nf = new Intl.NumberFormat('nl-NL');

export function fmtNum(n: number | null | undefined): string {
  if (n == null) return '0';
  return nf.format(n);
}

export function fmtCompact(n: number | null | undefined): string {
  if (n == null) return '0';
  if (Math.abs(n) >= 1000) return new Intl.NumberFormat('nl-NL', { notation: 'compact' }).format(n);
  return nf.format(n);
}

export function fmtDate(d: Date | string): string {
  const dd = typeof d === 'string' ? new Date(d) : d;
  return dd.toLocaleDateString('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function fmtDateTime(d: Date | string): string {
  const dd = typeof d === 'string' ? new Date(d) : d;
  return dd.toLocaleString('nl-NL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function fmtRelative(d: Date | string): string {
  const dd = typeof d === 'string' ? new Date(d) : d;
  const diff = Date.now() - dd.getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'zojuist';
  if (m < 60) return `${m} min geleden`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} uur geleden`;
  const d2 = Math.floor(h / 24);
  if (d2 < 7) return `${d2} dagen geleden`;
  return fmtDate(dd);
}

export function quarterOf(d: Date): { year: number; quarter: number; label: string } {
  const m = d.getMonth();
  const q = Math.floor(m / 3) + 1;
  return { year: d.getFullYear(), quarter: q, label: `Q${q} ${d.getFullYear()}` };
}

export function quarterRange(year: number, quarter: number): { start: Date; end: Date } {
  const startMonth = (quarter - 1) * 3;
  const start = new Date(year, startMonth, 1, 0, 0, 0, 0);
  const end = new Date(year, startMonth + 3, 1, 0, 0, 0, 0);
  return { start, end };
}
