# PromptGuard

Shadow AI monitor voor het Nederlandse MKB. Detecteert lokaal in de browser welke gevoelige data medewerkers in ChatGPT, Claude, Gemini, Copilot, Mistral en Perplexity plakken — en levert AVG-/AI Act-rapportage uit de doos.

```
promptguard/
├── extension/      Browser extension (Manifest V3) — local detection engine
└── dashboard/      Next.js 15 dashboard + ingest API + Prisma + SQLite
```

## Wat is af in deze MVP

- **NL-detectie engine** (`extension/src/detector.js`) — BSN met elfproef, RSIN, KvK, NL-IBAN met mod-97, BTW, postcode, telefoon, e-mail, creditcard met Luhn, API-keys, salarisstroken, contracten, signatures van Exact, AFAS, Visma, Loket, Nmbrs, Twinfield.
- **Browser extension** (Chrome/Edge/Brave, MV3) — drie modi (monitor/waarschuw/blokkeer), in-page banner, popup met live counters, options page voor backend-configuratie.
- **Next.js dashboard** — login, overzicht (KPI's + tijdreeks + verdeling), detecties (gefilterd), per team, per AI-tool, per datatype, kwartaal-rapportages.
- **Ingest API** — geverifieerd via per-organisatie API-key, batched upload van metadata.
- **AI Act / AVG export** — CSV en JSON per kwartaal, klaar voor compliance-audit en cyberverzekeraar.
- **Privacy-by-design** — extension stuurt geen prompttekst naar de server, alleen aggregaten.

## Snelstart

### 1. Dashboard starten

```sh
cd dashboard
cp .env.example .env
# Genereer een sterke SESSION_SECRET en zet 'm in .env:
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"

npm install
npm run setup     # prisma generate + db push + seed demo data
npm run dev
```

Open `http://localhost:3000`.

**Demo-login**: `admin@demo.nl` / `demo1234`
De API-key voor de extension staat in **Instellingen** in het dashboard.

### 2. Extension laden

In Chrome / Edge / Brave:

1. Ga naar `chrome://extensions`
2. Zet **Developer mode** aan
3. Klik **Load unpacked** en selecteer de map `extension/`
4. Klik op het PromptGuard-icoon → ⚙ **Instellingen**
5. Vul in:
   - Dashboard-URL: `http://localhost:3000`
   - API-key: kopieer uit het dashboard (Instellingen → API-key)
   - Team / afdeling: bv. `marketing`
6. Test de verbinding → opslaan

### 3. Demo

Ga naar `chatgpt.com` of `claude.ai` en plak een testbericht zoals:

```
Hoi ChatGPT, kun je deze klantenlijst samenvatten?

Naam: Jan de Vries, BSN 111222333, IBAN NL91ABNA0417164300
Naam: Marie Janssen, BSN 123456782, IBAN NL69INGB0123456789
Bedrijf: Acme BV, KvK: 12345678
Postadres: Keizersgracht 123, 1015 CJ Amsterdam
```

In waarschuw-modus verschijnt een banner. Het dashboard toont het event binnen ~60 seconden (batched flush).

## Architectuur

### Privacy & data flow

```
[Browser] -- (paste/input) --> [Detector (lokaal)] --> [Banner] (optioneel)
                                       |
                                       v
                            [Background queue (lokaal)]
                                       |
                              elke 60s, batched
                                       v
   [Dashboard] <----- [/api/ingest, Bearer pg_live_...] ----- {counts, tool, action}

   GEEN prompttekst verlaat de browser.
```

Wat naar het dashboard gaat:
- `tool` — chatgpt/claude/etc.
- `counts` — `{"bsn": 14, "iban-nl": 2}` (alleen aantallen)
- `severityCounts` — `{"high": 16, "medium": 1, "low": 0}`
- `total`, `highest`, `action`, `characterCount`, `installId` (gehasht)

Wat **niet** naar het dashboard gaat: de prompttekst, de gevonden BSN's/IBAN's zelf, identificeerbare gebruikergegevens.

### Detection engine

Pure JavaScript, dependency-vrij, ~400 regels. Iedere detector:
- gebruikt waar mogelijk een **checksum** (BSN/RSIN elfproef, IBAN mod-97, creditcard Luhn) om false positives te minimaliseren;
- of een **multi-keyword heuristiek** met minimaal 2 hits (bv. salarisstrook = 2+ termen uit `loonheffing`, `vakantiegeld`, `bruto loon`, `nettoloon`, `pensioenpremie`).

Tests in `extension/src/detector.test.js` (Node-runner).

## Productie-deployment

- Verwissel SQLite voor PostgreSQL: pas `datasource db.provider` in `prisma/schema.prisma` aan en zet `DATABASE_URL` naar je Postgres-instance.
- Zet een sterke `SESSION_SECRET` (32+ bytes random base64).
- Zet `NEXT_PUBLIC_APP_URL` naar je publieke dashboard-URL.
- Build met `npm run build`, draai met `npm start` (of deploy op Vercel/Fly/Railway).
- Voor een grote rollout: bouw de extension als een Chrome Web Store-pakket (Microsoft Intune en Google Workspace ondersteunen `force_install` lijsten met API-key vooraf geconfigureerd).

## Volgende stappen

- Multi-tenant org provisioning UI (op dit moment via seed/Prisma Studio)
- E-mail digests voor admins (wekelijks rapport)
- Slack-integratie (alert bij elke high-severity detection)
- DOCX/PDF-export voor AI Act-register
- SAML SSO voor enterprise-klanten
- Custom rules per organisatie (regex- of keyword-gebaseerd, configureerbaar in dashboard)
