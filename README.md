# PromptGuard

Shadow AI monitor voor het Nederlandse MKB. Detecteert lokaal in de browser welke gevoelige data medewerkers in ChatGPT, Claude, Gemini, Copilot, Mistral en Perplexity plakken — en levert AVG-/AI Act-rapportage uit de doos.

```
promptguard/
├── extension/    Browser extension (Manifest V3) — lokale detection engine
└── dashboard/    Next.js 15 app — multi-tenant signup/login, ingest API, reports
```

Dit is een interne app — geen marketingsite, geen publieke landingspagina. `/` redirect direct naar `/login`.

> 📦 **Het prototype opzetten?** Volg de complete stap-voor-stap gids:
> **[SETUP.md](SETUP.md)** — van lege Proxmox-server tot werkende detectie.

---

## Lokale snelstart

### Vereisten
- Node.js 20+
- Geen database-installatie nodig — gebruikt SQLite lokaal

### Stap 1 — Dashboard draaien

```sh
cd dashboard
cp .env.example .env
```

Open `.env` en vul `SESSION_SECRET` in met een **cryptografisch willekeurige string van minimaal 32 tekens**. Genereer er één:

```sh
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

Plak de output als waarde van `SESSION_SECRET` in `.env`. Een te korte of lege secret laat de app crashen bij opstarten — dit is bewust.

```sh
npm install
npm run setup     # prisma generate + db push + seed (60 dagen demo data)
npm run dev
```

Open **http://localhost:3000** → redirect naar `/login`.

| | |
|---|---|
| **Demo-account (lokaal seed)** | `admin@demo.nl` / `demo1234` |
| **API-key voor extension** | Zichtbaar op `/dashboard/settings` |

> **Let op wachtwoordbeleid voor nieuwe accounts**: minimaal 12 tekens, één hoofdletter, één kleine letter, één cijfer, één speciaal teken. Het seeded demo-account (`demo1234`) werkt alleen voor inloggen, niet als voorbeeld-wachtwoord bij signup.

---

### Stap 2 — Extension laden

**Chrome / Edge / Brave**:
1. Ga naar `chrome://extensions`
2. Zet **Developer mode** aan (rechtsboven)
3. Klik **Load unpacked** → selecteer de map `extension/`

**Firefox 128+**:
1. Ga naar `about:debugging#/runtime/this-firefox`
2. Klik **Load Temporary Add-on...** → selecteer `extension/manifest.json`

---

### Stap 3 — Extension koppelen aan dashboard

1. Klik op het PromptGuard-icoon in de toolbar
2. Klik op **Instellingen**
3. Vul in:
   - **Dashboard URL**: `http://localhost:3000`
   - **API-key**: kopieer van `/dashboard/settings` (begint met `pg_live_`)
4. Klik **Verbinding testen** — moet groen worden
5. Klik **Opslaan**

---

### Stap 4 — Eerste detectie testen

Ga naar een van de ondersteunde AI-tools (bijv. **https://claude.ai** of **https://chatgpt.com**) en plak dit testbericht in het promptvak:

```
Hoi, kun je deze klantenlijst verwerken?

Naam: Jan de Vries
BSN: 111222333
IBAN: NL91ABNA0417164300
Bedrijf: Acme BV, KvK 12345678
Postcode: 1015 CJ Amsterdam
Salaris bruto: € 4.200,- | nettoloon: € 2.950,-
```

**Wat je ziet:**
- Rood/oranje banner verschijnt direct bovenin de browser (warn-modus)
- Knoppen: **Annuleren** (paste geannuleerd) of **Toch versturen** (paste gaat door)
- Binnen ~3 seconden verschijnt een event in `/dashboard/detections`

**Modi wisselen** (via extension-instellingen):
| Modus | Gedrag |
|---|---|
| `monitor` | Stilletjes loggen, geen banner |
| `warn` | Banner met keuze — **standaard** |
| `block` | Paste volledig geblokkeerd, geen doorgaan-knop |

---

### Stap 5 — Detector unit tests

```sh
cd extension/src
node detector.test.js   # 29 assertions — alle datatypes getest
```

Verwachte output: `✓ 29 assertions passed`

---

### Troubleshooting

| Probleem | Oplossing |
|---|---|
| Dashboard start niet op | Controleer dat `SESSION_SECRET` in `.env` minimaal 32 tekens heeft |
| Extension meldt "Geen verbinding" | Zorg dat `npm run dev` draait op poort 3000 en API-key correct is |
| Geen banner bij plakken | Controleer dat je op een ondersteunde AI-tool-pagina zit (zie `manifest.json` host_permissions) |
| Event verschijnt niet in dashboard | Wacht 3-5 seconden; check browser console op extension-errors |
| `npm run setup` faalt | Verwijder `dashboard/prisma/dev.db` en probeer opnieuw |

---

## Productie deploy via Vercel

Vercel host de full app — signup, login, ingest API, dashboard.

### 1. Postgres (Neon, gratis)

- **Optie A** — bij stap 2 in Vercel project: **Storage** → **Create Database** → **Postgres** (Neon). `DATABASE_URL` wordt automatisch ingevuld.
- **Optie B** — direct bij [neon.tech](https://neon.tech): maak project, kopieer connection string, plak straks als `DATABASE_URL`.

### 2. Vercel project

1. https://vercel.com/new → Import Git Repository → `E-mma9/promptguard`
2. **Root Directory**: `dashboard`
3. Build settings worden uit `dashboard/vercel.json` gelezen

### 3. Environment Variables

| Naam | Waarde |
|---|---|
| `DATABASE_URL` | postgres-URL (auto bij Optie A, plak bij Optie B) |
| `SESSION_SECRET` | 48 random bytes via `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"` |
| `NEXT_PUBLIC_APP_URL` | `https://your-deployment.vercel.app` (na eerste deploy invullen + redeploy) |

### 4. Deploy

`build:vercel` script doet:
1. `scripts/use-postgres.mjs` muteert `prisma/schema.prisma` provider naar `postgresql`
2. `prisma generate`
3. `prisma migrate deploy` → past gecommitte migraties in `prisma/migrations/` toe (geen `db push --accept-data-loss` meer — schema-wijzigingen lopen via versie-gecontroleerde migraties, geen stille data-loss)
4. `next build`

Auto-deploy op elke `git push origin main`.

> **Eenmalige baseline bij een BESTAANDE database** (een Neon-DB die eerder met `db push` is aangemaakt heeft nog geen migratie-historie). Draai één keer, met de productie-`DATABASE_URL` gezet:
> ```sh
> cd dashboard && npx prisma migrate resolve --applied 20240101000000_init
> ```
> Dit markeert de init-migratie als reeds toegepast zonder de SQL opnieuw te draaien. Een **nieuwe** lege Neon-DB heeft dit niet nodig — `migrate deploy` maakt de tabellen dan zelf aan. Lokaal blijft `npm run setup` SQLite via `db push` gebruiken; de migraties draaien alleen op Vercel/Postgres.

### 5. Eerste org

`/signup` → maak admin-account → API-key staat op `/dashboard/settings` → in extension-instellingen plakken.

---

## Self-hosted deploy via Docker Compose (Proxmox / Hetzner)

De aanbevolen weg zonder Vercel. Dezelfde stack draait lokaal op Proxmox (HTTP op het LAN) en later in productie op Hetzner (domein + automatische HTTPS). Eén `docker-compose.yml` in de repo-root: **app** (Next.js standalone) + **db** (PostgreSQL 16) + **caddy** (reverse proxy).

### Vereisten
- Docker + Docker Compose op de host. Op Proxmox: een **VM** met Docker, óf een **LXC** met nesting aan (`features: nesting=1`).

### 1. Configureren

```sh
cp .env.example .env
```

Vul in `.env` minimaal in:
- `POSTGRES_PASSWORD` — sterk willekeurig wachtwoord
- `SESSION_SECRET` — `openssl rand -base64 48`
- `NEXT_PUBLIC_APP_URL` — hoe gebruikers de app bereiken, bv. `http://192.168.1.50` (LAN-IP van de Proxmox-server). **Wordt in de build gebakken** — na wijzigen opnieuw builden.

Voor de **Proxmox/LAN-fase** (plain HTTP) laat je staan:
```
SITE_ADDRESS=:80
SESSION_COOKIE_SECURE=false
```
> `SESSION_COOKIE_SECURE=false` is hier verplicht: een `Secure`-cookie wordt door browsers geweigerd over `http://`, waardoor inloggen anders nooit blijft hangen.

### 2. Starten

```sh
docker compose up -d --build
```

De app-container wacht tot Postgres gezond is, draait `prisma migrate deploy` (maakt alle tabellen incl. `RateLimit` aan — een verse DB heeft géén baseline-stap nodig), en start de server. Bereik de app op `http://<server-ip>/` → `/login`.

Eerste org aanmaken: `/signup`. Een demo-seed is niet nodig in productie; wil je toch demodata, draai eenmalig in de app-container `npx tsx prisma/seed.ts` (let op: dit reset de demo-org).

### 3. Later: overstap naar Hetzner (productie + HTTPS)

Zelfde compose, alleen `.env` aanpassen op de Hetzner-server:
- DNS: laat `promptguard.example.com` naar het Hetzner-IP wijzen, poorten 80+443 open.
- In `.env`:
  ```
  SITE_ADDRESS=promptguard.example.com
  SESSION_COOKIE_SECURE=true
  NEXT_PUBLIC_APP_URL=https://promptguard.example.com
  ```
- `docker compose up -d --build`. Caddy regelt automatisch een Let's Encrypt-certificaat.

Data verhuizen van Proxmox → Hetzner: `pg_dump` op het `db`-volume en `pg_restore` op de nieuwe host (de `pgdata` Docker-volume bevat de database).

### Beheer

| Actie | Commando |
|---|---|
| Logs | `docker compose logs -f app` |
| Herstarten | `docker compose restart app` |
| Updaten na `git pull` | `docker compose up -d --build` |
| DB-backup | `docker compose exec db pg_dump -U promptguard promptguard > backup.sql` |
| Stoppen | `docker compose down` (data blijft in volumes) |

> `vercel.json` en `npm run build:vercel` blijven in de repo voor wie Vercel wil; de Docker-stack gebruikt ze niet.

---

## Architectuur

```
[Chrome/Firefox] -- (paste/typ) --> [Detector (lokaal)] --> [Banner overlay]
                                          │
                                  3s gedebounced flush
                                          │
                                          ▼
   [Vercel] <--- POST /api/ingest, Bearer pg_live_... --- {tellingen, geen tekst}
       │
       ▼
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

# Code-architectuur — hoe alles in elkaar zit

Twee strikt gescheiden codebases met één HTTP-grens ertussen: de extension stuurt geanonimiseerde events naar `/api/ingest`. Geen andere koppeling.

## Extension (`extension/`) — pure JS, geen build step

| Bestand | Wat het doet |
|---|---|
| `manifest.json` | Manifest V3. Definieert host_permissions (whitelist van AI-tool-domeinen), content scripts (injecteren `detector.js` + `content.js` op die domeinen), service worker (`background.js`), popup en options page, en `managed_schema.json` voor IT-uitrol. |
| `src/detector.js` | **Pure-JS detection engine, ~400 regels, geen dependencies.** UMD-export zodat dezelfde code in browser én Node-tests werkt. Per datatype een aparte detector-functie (BSN, IBAN, KvK, RSIN, BTW, postcode, salarisstrook, contract, OpenAI/Anthropic/AWS/GitHub/Stripe API-keys, JWT, signatures van Exact/AFAS/Visma/Loket/Nmbrs/Twinfield). Elke detector retourneert hits met `severity` (`high`/`medium`/`low`), niet de gevonden waarde. |
| `src/detector.test.js` | 29 assertions die elke detector valideren — zowel positives (echte BSN/IBAN/KvK strings) als negatives (random strings die niet door de checksum komen). Draait met `node detector.test.js`. |
| `src/content.js` | Wordt op elke whitelisted AI-tool-pagina geladen. (1) Identificeert de tool uit `location.hostname`. (2) Hookt op `paste`-events en de Enter-toets in de prompt-textarea. (3) Roept `Detector.scan(text)` aan. (4) Bij hits: render banner-overlay (`content.css`). (5) Drie modi — `monitor` (silent log), `warn` (banner met "Doorgaan/Annuleren"), `block` (prevent submit). (6) Stuurt detection-metadata naar `background.js` via `chrome.runtime.sendMessage`. |
| `src/content.css` | Styling voor de banner-overlay. Bewust simpel, geen externe lettertypen. |
| `src/background.js` | Service worker. Verzamelt detection-events van content scripts in een 3-seconden debounce-buffer, dan POST naar `${dashboardUrl}/api/ingest` met `Authorization: Bearer ${apiKey}`. Body bevat alleen tellingen, severity, tool, timestamp, installId — **geen tekst**. |
| `src/options.html` + `options.js` | Instellingenpagina. Velden: dashboard-URL, API-key, modus, optioneel team-tag. Test-knop pingt `/api/ingest/health`. Slaat op in `chrome.storage.sync` (gebruiker) of `chrome.storage.managed` (IT-policy). |
| `src/popup.html` + `popup.js` | Klein popup-paneel via toolbar-icoon. Toont status (verbonden/niet-verbonden) + snelkoppeling naar instellingen. |
| `managed_schema.json` | JSON-Schema dat IT-policy-installers beschrijft hoe ze via Intune/GPO/Jamf de extension force-installen mét voorgevulde dashboard-URL, API-key en team-tag. |
| `icons/` | Toolbar/store icons in 16/32/48/128. |

### Hoe de extension werkt — flow

1. **Manifest V3 laadt content scripts** op chatgpt.com / claude.ai / etc. Eerst `detector.js` (definieert `window.PromptGuardDetector`), dan `content.js`.
2. **Gebruiker plakt tekst.** `content.js` vangt het paste-event af, leest `event.clipboardData.getData('text')`.
3. **`Detector.scan(text)`** loopt alle regels langs (regex + checksum), retourneert `{ hits: [{ type, severity }], counts, severityCounts, totalItems, highest }`.
4. **Banner verschijnt** als modus ≠ `monitor`. Bij `block` wordt het Enter-event geblokkeerd.
5. **`background.js` bufferd 3 seconden** (debounce — als gebruiker razendsnel paste-paste-paste doet stuur je niet 3 requests).
6. **POST naar dashboard.** Faalt het (geen netwerk, ongeldig key) → event komt in een retry-queue in `chrome.storage.local`.

### Detection-strategieën in `detector.js`

- **Met checksum** (lage false-positive rate):
  - **BSN / RSIN** — elfproef: 9 cijfers, gewicht 9..2 + (-1) voor laatste, sum mod 11 = 0.
  - **IBAN** — ISO/IEC 7064 mod-97. Eerst de 4 prefixchars naar achteren rotaten, letters → cijfers (A=10, B=11, …), dan modulo 97 == 1.
  - **Creditcard** — Luhn (van rechts, alterneer × 2, som mod 10 = 0).
- **Met regex + format-check**:
  - **KvK** — 8 cijfers, niet beginnend met 0 (anti-postcode-collision).
  - **BTW** — `NL` + 9 cijfers + `B` + 2 cijfers.
  - **Postcode** — `NNNN [optionele spatie] LL`.
  - **API-keys** — provider-specifieke prefix-patterns (`sk-`, `sk-ant-`, `AKIA…`, `ghp_`, `xoxb-`, etc.) met length-check.
  - **JWT** — drie base64url-segmenten gescheiden door `.`, eerste segment decodeert naar geldig JSON met `alg`-veld.
- **Multi-keyword heuristiek** (≥ 2 termen-match in venster):
  - **Salarisstrook** — `loonheffing`, `vakantiegeld`, `bruto loon`, `nettoloon`, `pensioenpremie`.
  - **Contract** — `partijen`, `overweegt`, `komen overeen`, `ondertekening`.
  - **Boekhoud-software-export** — bestandsnamen/headers van Exact, AFAS, Visma, Loket, Nmbrs, Twinfield.

## Dashboard (`dashboard/`) — Next.js 15 App Router

### Top-level

| Pad | Wat het doet |
|---|---|
| `app/page.tsx` | `redirect('/login')`. Geen publieke landing. |
| `app/layout.tsx` | Root HTML, font, globale CSS. |
| `app/globals.css` | Tailwind + design tokens (kleuren `ink-*`, `brand-*`, `pg-input`, `pg-button-primary` utility classes). |
| `middleware.ts` | Bewaakt `/dashboard/*`. Leest JWT uit cookie via `lib/auth.ts`, redirect naar `/login?next=...` als ongeldig. |
| `next.config.ts` | Server actions enabled (2 MB body). Geen extra config. |
| `vercel.json` | Pin `framework: nextjs`, `buildCommand: build:vercel`, region `fra1` (EU). |

### Auth flow (`app/api/auth/`, `lib/auth.ts`)

1. **Signup** — `POST /api/auth/signup` met `{organizationName, email, password, name, acceptedTerms}`:
   - Validatie + `bcryptjs.hash(password, 12)`.
   - Maakt `Organization` (genereert `apiKey` als `pg_live_${randomBytes(24).hex}`) + eerste `User` met `role='admin'`.
   - `lib/auth.ts` zet JWT (jose, HS256, 30 dagen) in HttpOnly + Secure + SameSite=Lax cookie `pg_session`.
   - Response: `{redirectTo: '/dashboard/welcome'}`.
2. **Login** — `POST /api/auth/login`. Vergelijkt `bcrypt.compare`, zelfde JWT-cookie.
3. **Logout** — `POST /api/auth/logout`. Wist cookie via `Set-Cookie: pg_session=; Max-Age=0`.
4. **Middleware** verifieert elk request naar `/dashboard/*`. Bij ongeldig: redirect naar `/login?next=${pathname}`.

### Ingest API (`app/api/ingest/route.ts`)

```
POST /api/ingest
Authorization: Bearer pg_live_abc...
Body: {
  installId: "sha256-hash...",
  tool: "chatgpt",
  source: "paste" | "submit",
  action: "monitored" | "warned" | "blocked",
  counts: {"bsn": 14, "iban-nl": 2},
  severityCounts: {"high": 16, "medium": 1, "low": 0},
  totalItems: 17,
  highest: "high",
  characterCount: 4321,
  team?: "marketing"   // optioneel uit managed storage
}
```

Flow: IP-throttle op de onauth-pad → bearer-key → `prisma.organization.findUnique({where: {apiKey}})` → als team meegegeven, `upsert` Team → batch-validatie → `prisma.detection.createMany()`. `counts`/`severityCounts` worden als JSON-**string** in een `String`/`text`-kolom opgeslagen — identiek op SQLite én Postgres (bewust, voor provider-pariteit; geen `Json`/JSONB-type). Mislukte key-auth en rate-limits worden ge-audit-logd.

`/api/ingest/health` is een simpele 200-OK voor de "Testen"-knop in extension-options.

### Dashboard UI (`app/dashboard/`)

| Route | Doel |
|---|---|
| `dashboard/page.tsx` | KPI overview — totaal events, % met high-severity, top 5 datatypes, weekgrafiek. |
| `dashboard/detections/` | Event-lijst met filters (datum, tool, team, severity). Pagineert. |
| `dashboard/tools/` | Per-tool uitsplitsing (welk percentage gaat naar ChatGPT vs Claude vs Gemini, met datatype-distributie per tool). |
| `dashboard/teams/` | Per-team uitsplitsing (alleen zichtbaar als IT teams heeft uitgerold via managed storage). |
| `dashboard/types/` | Per-datatype uitsplitsing (welke teams/tools zijn de zwaarste BSN-pasters?). |
| `dashboard/reports/` | Kwartaalrapport-generator — geeft AI Act-vereiste samenvatting + downloads naar `/api/reports/quarterly`. |
| `dashboard/settings/` | Toont organisatie-API-key (regenerate-knop), beheer team-tags. |
| `dashboard/deploy/` | **Genereert IT-uitroltemplates** — Microsoft Intune JSON, Group Policy `.reg`, Firefox `policies.json`, Jamf macOS plist. Allemaal vooraf ingevuld met de juiste dashboard-URL en API-key. Pure client-side template-substitutie. |
| `dashboard/welcome/` | Onboarding na signup: 3-stappen-checklist (extension installeren, API-key plakken, eerste detectie genereren). |
| `dashboard/layout.tsx` | Sidebar (`components/Sidebar.tsx`) + page header. |

### `lib/`

| Bestand | Wat erin zit |
|---|---|
| `db.ts` | Singleton `PrismaClient` (HMR-veilig in dev — checkt `globalThis`). |
| `auth.ts` | JWT-helpers (`signSession`, `verifySession`, `getCurrentUser`), cookie-naam, expires. Wrapper rond `jose`. |
| `queries.ts` | Alle complexe Prisma-queries voor de UI. Aggregaties per dag/tool/team/datatype. `counts` is een JSON-string in een `text`-kolom; tellingen gebeuren door te parsen in JS — voor MKB-volumes (~10k events/maand) volstaat client-side aggregeren (O(n) op event-volume; bekende plafond ~50-100k events/window). |
| `format.ts` | Datum/getal-formatters — Nederlandse locale, dd-mm-jjjj, duizendpunten. |
| `labels.ts` | Mensvriendelijke labels per `tool`/`type`/`severity` (`bsn` → "BSN-nummer", `chatgpt` → "ChatGPT", `high` → "Hoog risico"). Eén plek voor i18n later. |

### `components/`

| Component | Doel |
|---|---|
| `Sidebar.tsx` | Linker navigatie binnen `/dashboard/*`. Highlight actieve route, toont user-email + logout. |
| `PageHeader.tsx` | Titel + subtitel + optionele rechter-actieknoppen, hergebruikt op alle dashboard-routes. |
| `Kpi.tsx` | KPI-tegel (label + getal + trend-pijl). |
| `Charts.tsx` | Recharts-wrappers (line voor weektrend, bar voor per-tool, pie voor severity-mix). |
| `SeverityPill.tsx` | Gekleurde badge `high`/`medium`/`low`. |
| `Logo.tsx` | SVG-logo, optioneel met tekst. |

### `prisma/`

```
Organization (apiKey UNIQUE — hoe extension authenticeert)
  ├── User[]       (admin | viewer, bcrypt password)
  ├── Team[]       (org+slug UNIQUE — voor managed-storage tags)
  └── Detection[]  ← waar alle events landen

RateLimit (key PK — bv. "login:<ip>" / "ingest:<orgId>")
  persistente fixed-window tellers, niet org-gebonden, fail-open
  (login fail-closed), opportunistisch opgeschoond
```

`Detection` is bewust schraal: `tool`, `source`, `action`, `counts` (JSON-string), `severityCounts`, `totalItems`, `highest`, `installId`, `characterCount`. Indexen op `(orgId, detectedAt)` plus de drie filter-dimensies (`tool`, `teamId`, `highest`). Alle relaties cascade-delete vanaf Organization — één DSAR-verzoek wist alles.

`prisma/seed.ts` genereert 60 dagen demo-data met realistische verdelingen per datatype/tool/team voor de demo-org.

`scripts/use-postgres.mjs` is de Vercel-build helper: muteert `provider = "sqlite"` → `"postgresql"` voor productie. Lokaal blijft alles SQLite.

## End-to-end data-flow

```
Medewerker plakt tekst in ChatGPT
        │
        ▼
content.js  ──── detector.js (lokaal!) ───▶ banner als hits
        │
        │ chrome.runtime.sendMessage (intern)
        ▼
background.js  ── 3s debounce ──┐
                                 │ POST /api/ingest  Bearer pg_live_…
                                 │ {tool, counts, severityCounts, installId, …}
                                 ▼
                       app/api/ingest/route.ts
                                 │ IP-throttle → apiKey → orgId
                                 │ team upsert (optioneel)
                                 ▼
                       prisma.detection.createMany()
                                 ▼
                       SQLite (lokaal) of Postgres/Neon (Vercel)
                                 ▲
                                 │ Prisma queries (lib/queries.ts)
                       /dashboard/* server components
                                 │
                                 ▼
                           Recharts grafieken
```

## De privacy-grens

Eén regel houdt het hele ontwerp overeind: **prompttekst verlaat de browser nooit.** Detectie is lokaal. Naar `/api/ingest` gaan alleen tellingen + metadata. Dat is wat het AVG-by-design-verkoopverhaal mogelijk maakt — een DPO kan in 5 minuten verifiëren (via DevTools Network-tab) dat er geen persoonsgegevens richting de servers stromen, alleen statistiek.

---

## Stack

- **Extension**: Manifest V3, vanilla JS, geen build step
- **Dashboard**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3
- **Database**: SQLite (lokaal), PostgreSQL/Neon (Vercel)
- **ORM**: Prisma 6
- **Auth**: bcryptjs + jose (JWT in HttpOnly cookie)
- **Charts**: Recharts 2
- **Hosting**: Vercel (full app)
