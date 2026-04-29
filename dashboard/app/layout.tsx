import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PromptGuard — Shadow AI Monitor',
  description:
    'Zie wat uw medewerkers in ChatGPT, Claude, Gemini en Copilot plakken. Lokaal gedetecteerd, AVG- en AI Act-proof.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
