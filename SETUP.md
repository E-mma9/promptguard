# PromptGuard — volledige setup van het prototype

Stap-voor-stap, van een lege server tot een werkende detectie. Volg dit van
boven naar beneden. Geen voorkennis nodig.

> **Wat ga je opzetten?**
> 1. Het **dashboard** (Next.js + PostgreSQL) in Docker op je Proxmox-server
> 2. De **browser-extensie** op je werk-laptop
> 3. De koppeling tussen die twee + een eerste testdetectie
>
> Architectuur: de extensie detecteert gevoelige data **lokaal in de browser**
> en stuurt alleen tellingen/metadata naar het dashboard — nooit prompttekst.

---

## Deel 1 — Dashboard op Proxmox (Docker Compose)

### 1.1 Vereisten

Je hebt een Linux-omgeving met **Docker** + **Docker Compose** nodig. Op
Proxmox zijn er twee opties:

| Optie | Hoe |
|---|---|
| **VM** (aanbevolen, simpelst) | Maak een Debian/Ubuntu-VM, installeer Docker |
| **LXC-container** | Zet nesting aan: container → Options → Features → `nesting=1`, daarna Docker installeren |

Docker installeren (Debian/Ubuntu):

```sh
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER     # daarna opnieuw inloggen
docker --version && docker compose version
```

Noteer het **LAN-IP** van deze VM/container (`ip a` — bv. `192.168.1.50`).
Daar bereik je straks het dashboard op.

### 1.2 Code ophalen

```sh
git clone https://github.com/E-mma9/promptguard.git
cd promptguard
```

### 1.3 Configureren

```sh
cp .env.example .env
```

Genereer een sterke session-secret:

```sh
openssl rand -base64 48
```

Open `.env` (`nano .env`) en vul in:

| Variabele | Waarde |
|---|---|
| `POSTGRES_PASSWORD` | Een sterk willekeurig wachtwoord (verzin/genereer er één) |
| `SESSION_SECRET` | Plak de output van `openssl rand -base64 48` |
| `NEXT_PUBLIC_APP_URL` | `http://<lan-ip>` — bv. `http://192.168.1.50` |
| `SITE_ADDRESS` | Laat op `:80` staan (plain HTTP op het LAN) |
| `SESSION_COOKIE_SECURE` | Laat op `false` staan |

> ⚠️ `SESSION_COOKIE_SECURE=false` is **verplicht** zolang je over `http://`
> werkt. Een `Secure`-cookie wordt door browsers geweigerd over HTTP, waardoor
> inloggen anders nooit blijft hangen.
>
> ⚠️ `NEXT_PUBLIC_APP_URL` wordt **in de build gebakken**. Wijzig je 'm later,
> dan moet je opnieuw builden (`docker compose up -d --build`).

### 1.4 Starten

```sh
docker compose up -d --build
```

De eerste keer duurt dit een paar minuten (image bouwen). De app-container
wacht tot PostgreSQL gezond is, draait automatisch de databasemigraties (maakt
alle tabellen aan — een verse DB heeft géén extra stap nodig) en start de
server.

Volg de opstart:

```sh
docker compose logs -f app
```

Wacht tot je dit ziet:

```
[entrypoint] migrations applied — starting server
```

Druk `Ctrl+C` om het loggen te stoppen (de container blijft draaien).

### 1.5 Eerste organisatie aanmaken

Open in een browser op een laptop in hetzelfde netwerk:

```
http://<lan-ip>/
```

Je wordt naar `/login` geleid. Klik door naar **registreren** (`/signup`) en
maak het eerste admin-account:

- Organisatienaam
- E-mailadres + naam
- Wachtwoord: **minimaal 12 tekens**, met hoofdletter, kleine letter, cijfer
  én speciaal teken
- Verwerkersovereenkomst aanvinken

Na registratie kom je op het dashboard. Ga naar **Instellingen**
(`/dashboard/settings`) en kopieer de **API-key** (begint met `pg_live_`) —
die heb je zo nodig voor de extensie.

---

## Deel 2 — Browser-extensie installeren

Doe dit op de **laptop van de medewerker** (de machine waar in ChatGPT/Claude
geplakt wordt), niet op de server.

### 2.1 Code naar de laptop

Kopieer alleen de map `extension/` naar de laptop, of clone de hele repo daar
ook (`git clone https://github.com/E-mma9/promptguard.git`).

### 2.2 Laden in de browser

**Chrome / Edge / Brave:**
1. Ga naar `chrome://extensions`
2. Zet rechtsboven **Developer mode** aan
3. Klik **Load unpacked** → selecteer de map `extension/`

**Firefox 128+:**
1. Ga naar `about:debugging#/runtime/this-firefox`
2. **Load Temporary Add-on…** → selecteer `extension/manifest.json`

### 2.3 Koppelen aan het dashboard

1. Klik op het PromptGuard-icoon in de toolbar → **Instellingen**
2. Vul in:
   - **Dashboard URL**: `http://<lan-ip>` (zelfde als `NEXT_PUBLIC_APP_URL`)
   - **API-key**: de `pg_live_…` key van `/dashboard/settings`
   - **Modus**: `warn` (standaard) — toont een banner met keuze
3. Klik **Verbinding testen** → moet groen worden
4. Klik **Opslaan**

---

## Deel 3 — Testen

Ga op de laptop naar **https://chatgpt.com** of **https://claude.ai** en plak
dit in het promptvak:

```
Hoi, kun je deze klantenlijst verwerken?

Naam: Jan de Vries
BSN: 111222333
IBAN: NL91ABNA0417164300
Bedrijf: Acme BV, KvK 12345678
Postcode: 1015 CJ Amsterdam
```

**Verwacht:**
- Direct een rood/oranje PromptGuard-banner bovenin (warn-modus) met
  **Annuleren** / **Toch versturen**
- Binnen ~3 seconden een nieuw event op `http://<lan-ip>/dashboard/detections`

Zie je dat? Dan werkt het prototype end-to-end. 🎉

---

## Beheer & onderhoud

| Actie | Commando (op de server, in de `promptguard`-map) |
|---|---|
| Logs bekijken | `docker compose logs -f app` |
| Herstarten | `docker compose restart app` |
| Updaten na nieuwe code | `git pull && docker compose up -d --build` |
| Database-backup | `docker compose exec db pg_dump -U promptguard promptguard > backup.sql` |
| Stoppen (data blijft) | `docker compose down` |
| Alles wissen incl. data | `docker compose down -v` ⚠️ |

---

## Troubleshooting

| Probleem | Oplossing |
|---|---|
| `docker compose up` faalt op build | Controleer internettoegang van de VM; herhaal `docker compose up -d --build` |
| App-container herstart steeds | `docker compose logs app` — meestal DB nog niet klaar; wacht, of check `POSTGRES_PASSWORD`/`DATABASE_URL` in `.env` |
| Kan dashboard niet bereiken | Juiste LAN-IP? Firewall poort 80 open? `docker compose ps` — draait `caddy`? |
| Inloggen lukt, maar je wordt direct uitgelogd | `SESSION_COOKIE_SECURE` staat niet op `false` terwijl je via `http://` werkt → aanpassen, `docker compose up -d` |
| Extensie meldt "Geen verbinding" | Dashboard-URL exact gelijk aan hoe je 't bereikt? API-key correct gekopieerd? |
| Geen banner bij plakken | Zit je op een ondersteunde AI-tool (chatgpt.com / claude.ai / etc.)? Check de browserconsole op extensie-errors |
| Event verschijnt niet | Wacht 3-5 sec; `docker compose logs -f app` voor ingest-fouten |

---

## Later: productie op Hetzner (domein + HTTPS)

Zelfde stack, alleen `.env` aanpassen op de Hetzner-server:

```
SITE_ADDRESS=promptguard.jouwdomein.nl
SESSION_COOKIE_SECURE=true
NEXT_PUBLIC_APP_URL=https://promptguard.jouwdomein.nl
```

Zorg dat DNS van dat domein naar het Hetzner-IP wijst en poorten 80 + 443
open staan, dan: `docker compose up -d --build`. Caddy regelt automatisch een
Let's Encrypt-certificaat.

Data meeverhuizen van Proxmox → Hetzner: maak een `pg_dump` op Proxmox (zie
Beheer), kopieer het bestand, en herstel met
`docker compose exec -T db psql -U promptguard promptguard < backup.sql` op
Hetzner.

---

## Alternatief: lokaal draaien zonder Docker (ontwikkelaars)

Voor snel sleutelen aan de code op een dev-machine met Node.js 20+ — gebruikt
SQLite, geen database-installatie nodig. Zie de sectie **"Lokale snelstart"**
in [`README.md`](README.md).
