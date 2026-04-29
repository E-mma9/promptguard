import { requireUser } from '@/lib/auth';
import { PageHeader } from '@/components/PageHeader';
import { DeployTabs } from './DeployTabs';

export const dynamic = 'force-dynamic';

const CHROME_EXT_ID = 'promptguard-extension-id-replace-after-publish';
const FIREFOX_EXT_ID = 'promptguard@local.dev';

export default async function DeployPage() {
  const user = await requireUser();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const config = {
    apiBase: baseUrl,
    apiKey: user.org.apiKey,
    organizationName: user.org.name,
    chromeExtId: CHROME_EXT_ID,
    firefoxExtId: FIREFOX_EXT_ID,
  };

  return (
    <div>
      <PageHeader
        title="Uitrol via IT"
        description="Centrale installatie en configuratie via Microsoft Intune, Group Policy, Jamf, of Firefox enterprise policy. Alle templates bevatten al jouw API-key."
      />

      <div className="px-8 py-7 max-w-5xl space-y-6">
        <section className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 text-white p-6">
          <h2 className="font-semibold text-lg mb-1">Hoe het werkt</h2>
          <p className="text-brand-100 text-sm leading-relaxed max-w-3xl">
            IT pusht een config-policy naar alle werklaptops met de PromptGuard dashboard-URL en jullie API-key. De extension leest die uit <code className="bg-white/15 px-1.5 py-0.5 rounded text-xs">chrome.storage.managed</code> en kan ze niet meer wijzigen door de eindgebruiker. Combineer met <strong>force-install</strong> en de extension verschijnt automatisch op iedere laptop bij volgende login.
          </p>
        </section>

        <DeployTabs config={config} />

        <section className="pg-card p-6">
          <h3 className="font-semibold text-ink-900 mb-3">Wat je gebruikers zien</h3>
          <ul className="text-sm text-ink-700 space-y-2 list-disc pl-5">
            <li>De extension verschijnt automatisch in hun browser, geen actie nodig.</li>
            <li>Bij het openen van extension-instellingen tonen we duidelijk dat de configuratie centraal beheerd wordt — gebruikers kunnen API-key en dashboard-URL niet wijzigen.</li>
            <li>Op detectiemomenten zien ze de banner zoals normaal (alleen als modus = waarschuw of blokkeer).</li>
            <li>Geen prompttekst verlaat hun browser. De extension is open source en de code is in de installatie zelf inspecteerbaar.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
