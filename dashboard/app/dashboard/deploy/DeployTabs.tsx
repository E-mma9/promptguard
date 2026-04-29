'use client';

import { useState } from 'react';
import clsx from 'clsx';

type Config = {
  apiBase: string;
  apiKey: string;
  organizationName: string;
  chromeExtId: string;
  firefoxExtId: string;
};

const TABS = [
  { id: 'intune', label: 'Microsoft Intune', sub: 'Chrome / Edge — meest gebruikt in MKB' },
  { id: 'gpo', label: 'Group Policy', sub: 'Klassieke Windows AD-omgeving' },
  { id: 'firefox', label: 'Firefox', sub: 'Enterprise policies.json' },
  { id: 'jamf', label: 'Jamf / macOS', sub: 'Apple-laptops' },
];

export function DeployTabs({ config }: { config: Config }) {
  const [tab, setTab] = useState('intune');
  return (
    <div className="pg-card overflow-hidden">
      <div className="flex border-b border-ink-200/70 bg-ink-50/40 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={clsx(
              'flex-1 min-w-[180px] text-left px-5 py-3 border-b-2 transition-colors',
              tab === t.id
                ? 'bg-white border-brand-700 text-ink-900'
                : 'border-transparent text-ink-600 hover:bg-ink-100/60'
            )}
          >
            <div className="font-semibold text-sm">{t.label}</div>
            <div className="text-[11px] text-ink-500 mt-0.5">{t.sub}</div>
          </button>
        ))}
      </div>
      <div className="p-6">
        {tab === 'intune' && <IntunePanel config={config} />}
        {tab === 'gpo' && <GpoPanel config={config} />}
        {tab === 'firefox' && <FirefoxPanel config={config} />}
        {tab === 'jamf' && <JamfPanel config={config} />}
      </div>
    </div>
  );
}

function IntunePanel({ config }: { config: Config }) {
  const json = intuneJson(config);
  return (
    <div className="space-y-5">
      <Step n={1} title="Maak een nieuw Configuration Profile in Intune">
        <p>
          Open <a href="https://intune.microsoft.com/" target="_blank" rel="noreferrer" className="text-brand-700 hover:underline font-semibold">Microsoft Intune Admin Center</a> → <strong>Apparaten</strong> → <strong>Configuratieprofielen</strong> → <strong>+ Profiel maken</strong>. Kies platform <em>Windows 10 en hoger</em>, profieltype <em>Templates</em> → <em>Custom</em>.
        </p>
      </Step>
      <Step n={2} title="Voeg deze OMA-URI's toe">
        <p className="mb-3">Voor Google Chrome (vergelijkbaar voor Edge — vervang <code>Google\\Chrome</code> door <code>Microsoft\\Edge</code>):</p>
        <CodeBlock filename="intune-config.json" code={json} />
      </Step>
      <Step n={3} title="Wijs het profiel toe aan een groep">
        <p>Wijs toe aan de gebruikers- of apparaatgroep waar je PromptGuard wil uitrollen. Wijzigingen pushen binnen 8 uur, of direct met <em>Sync</em> op het apparaat.</p>
      </Step>
      <Step n={4} title="Force-install van de extension">
        <p>
          Voeg in hetzelfde profiel of een nieuw profiel een <strong>ExtensionInstallForcelist</strong> toe met:
        </p>
        <CodeBlock filename="extension-id" code={config.chromeExtId + ';https://clients2.google.com/service/update2/crx'} />
        <p className="text-xs text-ink-500 mt-2">
          ⚠️ Deze extension-ID krijg je nadat we PromptGuard publiceren in de Chrome Web Store. Tijdens je proef kun je de extension handmatig laden via <code>chrome://extensions</code> → Developer mode.
        </p>
      </Step>
      <DownloadButton name="intune-config.json" payload={json} mime="application/json" />
    </div>
  );
}

function GpoPanel({ config }: { config: Config }) {
  const reg = gpoReg(config);
  return (
    <div className="space-y-5">
      <Step n={1} title="Download het ADMX-templatepakket van Google">
        <p>
          Download <a href="https://chromeenterprise.google/browser/download/" target="_blank" rel="noreferrer" className="text-brand-700 hover:underline font-semibold">Chrome ADMX bundle</a> en plaats <code>chrome.admx</code> + <code>chrome.adml</code> in <code>%SystemRoot%\PolicyDefinitions</code>.
        </p>
      </Step>
      <Step n={2} title="Open de Group Policy Editor">
        <p>Run <code>gpedit.msc</code> → Computer Configuration → Administrative Templates → Google → Google Chrome → <strong>Configure the list of force-installed apps and extensions</strong>.</p>
      </Step>
      <Step n={3} title="Voeg PromptGuard toe als force-install">
        <CodeBlock filename="extension entry" code={config.chromeExtId + ';https://clients2.google.com/service/update2/crx'} />
      </Step>
      <Step n={4} title="Push managed storage via registry">
        <p>Importeer onderstaand <code>.reg</code>-bestand (of zet 'm in je domain GPO):</p>
        <CodeBlock filename="promptguard.reg" code={reg} />
      </Step>
      <DownloadButton name="promptguard.reg" payload={reg} mime="application/octet-stream" />
    </div>
  );
}

function FirefoxPanel({ config }: { config: Config }) {
  const json = firefoxPolicies(config);
  return (
    <div className="space-y-5">
      <Step n={1} title="Plaats policies.json naast firefox.exe">
        <p>
          Plaats het bestand in <code>distribution/policies.json</code> in de Firefox-installatiemap. Op Windows: <code>C:\Program Files\Mozilla Firefox\distribution\policies.json</code>. Op macOS: <code>/Applications/Firefox.app/Contents/Resources/distribution/policies.json</code>.
        </p>
      </Step>
      <Step n={2} title="Inhoud">
        <CodeBlock filename="policies.json" code={json} />
      </Step>
      <Step n={3} title="Verifieer">
        <p>Open in Firefox <code>about:policies</code> — je moet PromptGuard daar zien onder <em>Active Policies</em>.</p>
      </Step>
      <DownloadButton name="policies.json" payload={json} mime="application/json" />
    </div>
  );
}

function JamfPanel({ config }: { config: Config }) {
  const plist = macPlist(config);
  return (
    <div className="space-y-5">
      <Step n={1} title="Maak een Configuration Profile in Jamf Pro">
        <p>Categorie <em>Application &amp; Custom Settings</em> → <strong>Custom Settings</strong> (Plist) voor preference domain <code>com.google.Chrome</code> (of <code>com.microsoft.Edge.plist</code>).</p>
      </Step>
      <Step n={2} title="Plak deze plist">
        <CodeBlock filename="com.google.Chrome.plist" code={plist} />
      </Step>
      <Step n={3} title="Wijs toe aan een Smart Group">
        <p>Bijvoorbeeld <em>All Managed Macs</em>. Profile rolt uit binnen 15 minuten na MDM-check-in.</p>
      </Step>
      <DownloadButton name="com.google.Chrome.plist" payload={plist} mime="application/xml" />
    </div>
  );
}

// ---------- Helpers ----------

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-7 h-7 rounded-full bg-ink-900 text-white text-sm font-bold grid place-items-center">{n}</div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-ink-900 text-sm mb-1.5">{title}</h4>
        <div className="text-sm text-ink-700 leading-relaxed prose-sm">{children}</div>
      </div>
    </div>
  );
}

function CodeBlock({ filename, code }: { filename: string; code: string }) {
  return (
    <div className="rounded-lg overflow-hidden ring-1 ring-ink-800 mt-2">
      <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider bg-ink-900 text-ink-400 flex justify-between items-center">
        <span>{filename}</span>
        <CopyButton text={code} />
      </div>
      <pre className="bg-ink-950 text-ink-100 text-[12px] leading-relaxed p-4 overflow-x-auto pg-scroll font-mono">{code}</pre>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="text-ink-300 hover:text-white text-[11px] font-semibold"
    >
      {copied ? '✓ Gekopieerd' : 'Kopieer'}
    </button>
  );
}

function DownloadButton({ name, payload, mime }: { name: string; payload: string; mime: string }) {
  const onClick = () => {
    const blob = new Blob([payload], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button type="button" onClick={onClick} className="pg-button-secondary mt-2">
      Download {name}
    </button>
  );
}

// ---------- Templates ----------

function intuneJson(c: Config): string {
  return JSON.stringify(
    {
      _comment: `PromptGuard managed configuration for ${c.organizationName}. Push via Microsoft Intune as a Chrome (or Edge) ManagedConfiguration profile.`,
      apiBase: { Value: c.apiBase },
      apiKey: { Value: c.apiKey },
      mode: { Value: 'warn' },
      minSeverity: { Value: 'medium' },
    },
    null,
    2
  );
}

function gpoReg(c: Config): string {
  const escape = (s: string) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return [
    'Windows Registry Editor Version 5.00',
    '',
    `; PromptGuard managed config for ${c.organizationName}`,
    `[HKEY_LOCAL_MACHINE\\SOFTWARE\\Policies\\Google\\Chrome\\3rdparty\\extensions\\${c.chromeExtId}\\policy]`,
    `"apiBase"="${escape(c.apiBase)}"`,
    `"apiKey"="${escape(c.apiKey)}"`,
    `"mode"="warn"`,
    `"minSeverity"="medium"`,
    '',
  ].join('\r\n');
}

function firefoxPolicies(c: Config): string {
  return JSON.stringify(
    {
      policies: {
        ExtensionSettings: {
          [c.firefoxExtId]: {
            installation_mode: 'force_installed',
            install_url: `${c.apiBase}/extension/promptguard.xpi`,
            default_area: 'navbar',
          },
        },
        '3rdparty': {
          Extensions: {
            [c.firefoxExtId]: {
              apiBase: c.apiBase,
              apiKey: c.apiKey,
              mode: 'warn',
              minSeverity: 'medium',
            },
          },
        },
      },
    },
    null,
    2
  );
}

function macPlist(c: Config): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
    '<plist version="1.0">',
    '<dict>',
    '  <key>ExtensionInstallForcelist</key>',
    '  <array>',
    `    <string>${c.chromeExtId};https://clients2.google.com/service/update2/crx</string>`,
    '  </array>',
    '  <key>3rdparty</key>',
    '  <dict>',
    '    <key>extensions</key>',
    '    <dict>',
    `      <key>${c.chromeExtId}</key>`,
    '      <dict>',
    '        <key>apiBase</key>',
    `        <string>${c.apiBase}</string>`,
    '        <key>apiKey</key>',
    `        <string>${c.apiKey}</string>`,
    '        <key>mode</key>',
    '        <string>warn</string>',
    '        <key>minSeverity</key>',
    '        <string>medium</string>',
    '      </dict>',
    '    </dict>',
    '  </dict>',
    '</dict>',
    '</plist>',
  ].join('\n');
}
