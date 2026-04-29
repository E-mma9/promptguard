'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

const COLORS = {
  high: '#dc2626',
  medium: '#f59e0b',
  low: '#2563eb',
};

export function StackedAreaSeries({
  data,
  height = 260,
}: {
  data: { day: string; high: number; medium: number; low: number; total: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="pg-grad-high" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.high} stopOpacity={0.4} />
            <stop offset="100%" stopColor={COLORS.high} stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="pg-grad-medium" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.medium} stopOpacity={0.4} />
            <stop offset="100%" stopColor={COLORS.medium} stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="pg-grad-low" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.low} stopOpacity={0.4} />
            <stop offset="100%" stopColor={COLORS.low} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#e5e7eb" strokeDasharray="2 4" vertical={false} />
        <XAxis
          dataKey="day"
          tickFormatter={(d) => {
            const dt = new Date(d);
            return dt.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
          }}
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip
          cursor={{ fill: 'rgba(124, 58, 237, 0.06)' }}
          contentStyle={{
            background: 'white',
            border: 'none',
            borderRadius: 10,
            boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
            fontSize: 12,
            padding: '10px 12px',
          }}
          labelFormatter={(d) =>
            new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
          }
          formatter={(value: number, name: string) => {
            const labels: Record<string, string> = {
              high: 'Kritiek',
              medium: 'Gevoelig',
              low: 'Laag',
            };
            return [value, labels[name] ?? name];
          }}
        />
        <Area type="monotone" dataKey="low" stackId="1" stroke={COLORS.low} fill="url(#pg-grad-low)" strokeWidth={1.5} />
        <Area type="monotone" dataKey="medium" stackId="1" stroke={COLORS.medium} fill="url(#pg-grad-medium)" strokeWidth={1.5} />
        <Area type="monotone" dataKey="high" stackId="1" stroke={COLORS.high} fill="url(#pg-grad-high)" strokeWidth={1.8} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BarBreakdown({
  data,
  height = 220,
  color = '#7c3aed',
}: {
  data: { name: string; value: number }[];
  height?: number;
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 6, right: 12, left: 0, bottom: 0 }} layout="vertical">
        <CartesianGrid stroke="#e5e7eb" strokeDasharray="2 4" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 12, fill: '#374151' }}
          axisLine={false}
          tickLine={false}
          width={120}
        />
        <Tooltip
          cursor={{ fill: 'rgba(124, 58, 237, 0.06)' }}
          contentStyle={{
            background: 'white',
            border: 'none',
            borderRadius: 10,
            boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
            fontSize: 12,
            padding: '10px 12px',
          }}
        />
        <Bar dataKey="value" fill={color} radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SeverityDonut({
  high,
  medium,
  low,
  height = 180,
}: {
  high: number;
  medium: number;
  low: number;
  height?: number;
}) {
  const data = [
    { name: 'Kritiek', value: high, color: COLORS.high },
    { name: 'Gevoelig', value: medium, color: COLORS.medium },
    { name: 'Laag', value: low, color: COLORS.low },
  ];
  const total = high + medium + low;
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={50}
            outerRadius={75}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'white',
              border: 'none',
              borderRadius: 10,
              boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
              fontSize: 12,
              padding: '10px 12px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-2xl font-bold pg-num">{total}</div>
        <div className="text-[11px] text-ink-500 uppercase tracking-wider mt-0.5">events</div>
      </div>
    </div>
  );
}
