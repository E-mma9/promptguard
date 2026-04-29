import { MarketingHeader, MarketingFooter } from '@/components/MarketingShell';
import Link from 'next/link';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <MarketingHeader />
      <main className="px-6 lg:px-10 py-12 max-w-3xl mx-auto">
        <nav className="flex gap-1 text-xs mb-8 overflow-x-auto">
          <LegalNav href="/legal/privacy" label="Privacybeleid" />
          <LegalNav href="/legal/dpa" label="Verwerkersovereenkomst" />
          <LegalNav href="/legal/sub-processors" label="Sub-processors" />
          <LegalNav href="/legal/terms" label="Algemene voorwaarden" />
        </nav>
        <article className="prose prose-ink max-w-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:leading-relaxed [&_p]:mb-3 [&_p]:text-[15px] [&_p]:text-ink-700 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:mb-3 [&_li]:text-[15px] [&_li]:leading-relaxed [&_li]:text-ink-700 [&_table]:w-full [&_table]:text-sm [&_table]:my-4 [&_th]:text-left [&_th]:font-semibold [&_th]:py-2 [&_th]:border-b [&_td]:py-2 [&_td]:border-b [&_td]:border-ink-100 [&_strong]:text-ink-900">
          {children}
        </article>
      </main>
      <MarketingFooter />
    </div>
  );
}

function LegalNav({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-md font-semibold text-ink-600 hover:text-ink-900 hover:bg-ink-100 whitespace-nowrap"
    >
      {label}
    </Link>
  );
}
