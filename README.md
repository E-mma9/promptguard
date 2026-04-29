# PromptGuard

Shadow AI monitor voor het Nederlandse MKB. Detecteert lokaal in de browser welke gevoelige data medewerkers in ChatGPT, Claude, Gemini, Copilot, Mistral en Perplexity plakken — en levert AVG-/AI Act-rapportage uit de doos.

```
promptguard/
├── extension/    Browser extension (Manifest V3) — local detection engine
├── dashboard/    Next.js 15 SaaS — multi-tenant signup, ingest API, reports
└── .github/      Auto-deploy workflows for GitHub Pages (marketing site)
```

## Wat is af

- **NL-detectie engine** — BSN (elfproef), NL-IBAN (mod-97), KvK, RSIN, BTW, postcode, salarisstroken, contracten, API-keys (OpenAI/Anthropic/AWS/GitHub/Stripe/JWT), signatures van Exact, AFAS, Visma, Loket, Nmbrs, Twinfield. **29/29 tests slagen.**
- **Browser extension** (MV3) — werkt op Chrome, Edge, Brave, Firefox 128+. Drie modi (monitor/waarschuw/blokkeer), Enter-interceptie, banner-flow, managed storage voor IT-uitrol.
- **Multi-tenant SaaS dashboard** — self-service signup, login, KPI overview, detecties, per-team / per-tool / per-datatype views, kwartaal CSV/JSON export voor AI Act.
- **IT-uitrol-templates** — Microsoft Intune JSON, Group Policy `.reg`, Firefox `policies.json`, macOS Jamf plist. Allemaal met de organisatie-API-key voorgeconfigureerd, downloadbaar uit het dashboard.
- **Marketing site** — Lasso-stijl dark hero, pricing, features, security, juridische pagina's (privacy, DPA, sub-processors, terms).
- **Privacy-by-design** — detectie 100% lokaal in de browser. Naar het dashboard gaan alleen geanonimiseerde tellingen — nooit prompttekst.

---

## Lokale snelstart (5 minuten)

### Vereisten
- Node.js 20+ (via nvm, brew, of [nodejs.org](https://nodejs.org))
- Geen database-installatie nodig — gebruikt SQLite lokaal

### Dashboard draaien

```sh
cd dashboard
cp .env.example .env

# Genereer een sterke SESSION_SECRET en plak in .env:
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"

npm install
npm run setup     # prisma generate + db push + seed (60 dagen demo data)
npm run dev
```

Open http://localhost:3000.

**Demo-account uit seed**: `admin@demo.nl` / `demo1234`
**API-key voor extension**: te zien op `/dashboard/settings`

### Extension laden

**Chrome / Edge / Brave**:
1. `chrome://extensions` → Developer mode aan
2. **Load unpacked** → kies `extension/`

**Firefox 128+**:
1. `about:debugging#/runtime/this-firefox`
2. **Load Temporary Add-on...** → kies `extension/manifest.json`

Klik op het PromptGuard-icoon → **Instellingen** → vul Dashboard-URL en API-key in → **Testen** → **Opslaan**.

### Demo

Plak in ChatGPT (na bestreden de extension is permission gegeven op `chatgpt.com`):

```
Hoi ChatGPT, kun je deze klantenlijst samenvatten?

Naam: Jan de Vries, BSN 111222333, IBAN NL91ABNA0417164300
Bedrijf: Acme BV, KvK 12345678, postcode 1015 CJ
```

Banner verschijnt direct. Event verschijnt binnen 3 seconden in `/dashboard/detections`.

---

## Productie deploy via Vercel (5 minuten)

Vercel host de full app — signup, login, ingest API, dashboard. Gratis tier voor zolang je wilt.

### 1. Postgres database (Neon, gratis)

Optie A — via Vercel Marketplace (aanbevolen):
- Bij stap 3 hieronder klik je in je Vercel-project op **Storage** → **Create Database** → **Postgres** (Neon).
- Vercel set `DATABASE_URL` automatisch in.

Optie B — direct bij Neon:
- Maak gratis account op [neon.tech](https://neon.tech)
- Maak project `promptguard`
- Kopieer connection string (begint met `postgresql://...`)
- Plak straks als `DATABASE_URL` in Vercel env vars

### 2. Vercel project aanmaken

1. Ga naar https://vercel.com/new
2. Login met GitHub
3. **Import Git Repository** → kies `E-mma9/promptguard`
4. **Framework Preset** wordt auto-detected als Next.js
5. **Root Directory**: klik **Edit** → kies `dashboard`
6. **Build & Output Settings** worden uit `dashboard/vercel.json` gelezen

### 3. Environment Variables

Voeg toe in **Environment Variables** vóór deploy:

| Naam | Waarde | Hoe |
|---|---|---|
| `DATABASE_URL` | postgres-URL | Optie A: auto-set door Marketplace. Optie B: plak van Neon |
| `SESSION_SECRET` | 48 random bytes | `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"` |
| `NEXT_PUBLIC_APP_URL` | Vercel URL (zonder slash aan eind) | Vul na eerste deploy in (= https://your-deployment.vercel.app), redeploy |

### 4. Deploy

Klik **Deploy**. Eerste build duurt ~2 minuten:
- `npm install` (incl. Prisma client generation)
- `npm run build:vercel`:
  - Mutates `prisma/schema.prisma` → postgresql
  - `prisma db push` (creëert tabellen in Postgres)
  - `next build`

Site is dan live op `https://your-deployment.vercel.app`.

### 5. Eerste org aanmaken

- Open `/signup`
- Maak admin-account voor je eigen organisatie
- API-key te zien op `/dashboard/settings`
- Gebruik die in extension-instellingen voor productie-monitoring

### 6. Auto-deploy

Elke `git push origin main` deployt automatisch een preview én productie. Pull-requests krijgen een eigen preview-URL.

---

## Marketing site via GitHub Pages

De landing-pagina's (zonder backend) deployen automatisch naar GH Pages via `.github/workflows/deploy-pages.yml`.

**Activeren**:
1. Open https://github.com/E-mma9/promptguard/settings/pages
2. **Source** → **GitHub Actions**
3. Save

Site komt live op **https://e-mma9.github.io/promptguard/**.

⚠ Op GH Pages werken alleen marketing-pagina's. Signup/login/dashboard hebben backend nodig — gebruik daar de Vercel-URL voor.

---

## Architectuur

```
[Chrome/Firefox] -- (paste/typ) --> [Detector (lokaal)] --> [Banner overlay]
                                          |
                                  3s gedebounced flush
                                          |
                                          v
   [Vercel] <--- POST /api/ingest, Bearer pg_live_... --- {tellingen, geen tekst}
       |
       v
   [Postgres (Neon)] --> [Dashboard] --> [Kwartaalrapport CSV/JSON]
```

### Wat we WEL zien (op het dashboard)
- Aantal events per dag
- Tellingen per type: `{"bsn": 14, "iban-nl": 2}`
- Welke AI-tool werd gebruikt
- Tijdstempel + URL-domein
- Anoniem installatie-ID (SHA-256 hash)
- Optioneel team-tag (door IT geconfigureerd)

### Wat we NIET zien
- Prompttekst
- Daadwerkelijke BSN/IBAN-waarden
- AI-antwoorden
- Wachtwoorden, e-mails, namen
- Browser-historie buiten AI-tools

---

## Detection engine

Pure JavaScript, dependency-vrij, ~400 regels. Iedere detector:
- Gebruikt waar mogelijk een **checksum** (BSN/RSIN elfproef, IBAN mod-97, creditcard Luhn) om false positives te minimaliseren.
- Of een **multi-keyword heuristiek** met minimaal 2 hits (bv. salarisstrook = 2+ termen uit `loonheffing`, `vakantiegeld`, `bruto loon`, `nettoloon`, `pensioenpremie`).

Tests: `cd extension/src && node detector.test.js` (29 assertions).

---

## Volgende stappen voor productie

- **SOC2 Type 1** audit (~€15-25k via Drata of Vanta) — verkoopvoorwaarde voor 250+ medewerker organisaties
- **SAML SSO** voor enterprise (Microsoft Entra, Okta)
- **Stripe billing** met `/checkout` flow per plan
- **E-mailverificatie + password reset** via Postmark of Resend
- **Audit log** voor alle dashboard-acties (compliance-vereiste)
- **Officiële extension-publicatie** in Chrome Web Store + Mozilla AMO + Edge Add-ons (vereist voor force-install via Intune)
- **Pen-test** door externe partij voor in `/security` te kunnen claimen
- **AVG-jurist** voor finale review van DPA en privacy-pagina's

---

## Stack

- **Extension**: Manifest V3, vanilla JS, geen build step
- **Dashboard**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Database**: SQLite (lokaal), PostgreSQL/Neon (Vercel)
- **ORM**: Prisma 6
- **Auth**: bcryptjs + jose (JWT in HttpOnly cookie)
- **Charts**: Recharts
- **Hosting**: Vercel (full app), GitHub Pages (marketing only)
