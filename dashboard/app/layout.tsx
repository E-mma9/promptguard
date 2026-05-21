import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PromptGuard — Shadow AI Monitor',
  description:
    'Zie welke gevoelige datacategorieën uw medewerkers in ChatGPT, Claude, Gemini en Copilot invoeren. Lokale detectie, EU-data-residency, ontworpen volgens AVG-data-minimalisatie.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
