'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const NAV = [
  { href: '/dashboard', label: 'Overzicht', icon: IconDashboard, exact: true },
  { href: '/dashboard/detections', label: 'Detecties', icon: IconList },
  { href: '/dashboard/teams', label: 'Teams', icon: IconUsers },
  { href: '/dashboard/tools', label: 'AI-tools', icon: IconBolt },
  { href: '/dashboard/types', label: 'Datatypes', icon: IconShield },
  { href: '/dashboard/reports', label: 'Rapportages', icon: IconReport },
  { href: '/dashboard/deploy', label: 'Uitrol via IT', icon: IconDownload },
  { href: '/dashboard/settings', label: 'Instellingen', icon: IconCog },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <nav className="flex-1 p-3 overflow-y-auto pg-scroll">
      <div className="pg-section-label px-3 py-2 mt-1">Navigatie</div>
      <ul className="space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  'flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  active
                    ? 'bg-ink-900 text-white shadow-card'
                    : 'text-ink-600 hover:text-ink-900 hover:bg-ink-50'
                )}
              >
                <Icon className="w-4 h-4" active={active} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function baseProps(active?: boolean) {
  return {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
}

function IconDashboard({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps(active)}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}
function IconList({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps(active)}>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx="3.5" cy="6" r="1.4" />
      <circle cx="3.5" cy="12" r="1.4" />
      <circle cx="3.5" cy="18" r="1.4" />
    </svg>
  );
}
function IconUsers({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps(active)}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M14 14.5c1-.3 2-.5 3-.5 2.5 0 4.5 1.7 4.5 4.5" />
    </svg>
  );
}
function IconBolt({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps(active)}>
      <path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" />
    </svg>
  );
}
function IconShield({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps(active)}>
      <path d="M12 3l8 3v5c0 4.5-3 8.5-8 9.5-5-1-8-5-8-9.5V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function IconReport({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps(active)}>
      <path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  );
}
function IconDownload({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps(active)}>
      <path d="M12 3v12m0 0l-4-4m4 4l4-4" />
      <path d="M5 17v2a2 2 0 002 2h10a2 2 0 002-2v-2" />
    </svg>
  );
}
function IconCog({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps(active)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 003.91 15a1.65 1.65 0 00-1.51-1H2.4a2 2 0 010-4h.09A1.65 1.65 0 003.91 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 008.23 4.7 1.65 1.65 0 009 3.18V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.07 9c.04.5.27.97.66 1.31.4.34.92.54 1.46.54.55 0 1.07-.2 1.46-.54.4-.34.62-.81.66-1.31" />
    </svg>
  );
}
