import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { Logo } from '@/components/Logo';
import { Sidebar } from '@/components/Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      <aside className="bg-white border-r border-ink-200/70 flex flex-col">
        <div className="p-5 border-b border-ink-100">
          <Link href="/dashboard" className="inline-flex">
            <Logo size={28} withText />
          </Link>
        </div>
        <Sidebar />
        <div className="p-4 border-t border-ink-100">
          <div className="rounded-xl bg-ink-50 p-3 text-xs text-ink-600 leading-snug">
            <div className="font-semibold text-ink-900 mb-0.5">{user.org.name}</div>
            <div className="truncate">{user.email}</div>
          </div>
          <form action="/api/auth/logout" method="POST" className="mt-2">
            <button type="submit" className="w-full text-left text-xs font-medium text-ink-500 hover:text-ink-900 px-3 py-1.5">
              Uitloggen
            </button>
          </form>
        </div>
      </aside>
      <main className="overflow-x-hidden">{children}</main>
    </div>
  );
}
