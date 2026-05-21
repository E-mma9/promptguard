import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://promptguard.nl'),
  title: {
    default: 'PromptGuard — Evidence-laag voor AI-gebruik op de werkvloer',
    template: '%s · PromptGuard',
  },
  description:
    'Wettelijk verplicht inzicht in het gebruik van ChatGPT, Claude, Gemini en Copilot door uw medewerkers. AI Act, AVG, NIS2 en NEN 7510 — bewijsbaar, niet beloofd. EU-only hosting.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <a href="#hoofdinhoud" className="skip-link">
          Direct naar inhoud
        </a>
        {children}
      </body>
    </html>
  );
}
