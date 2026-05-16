# Chrome Web Store — Listing Content

## Basic Info

| Field | Value |
|---|---|
| **Title** | PromptGuard — AI Data Shield |
| **Category** | Productivity |
| **Language** | English (store listing) — Dutch UI |
| **Website** | https://promptguard.nl |
| **Support URL** | https://promptguard.nl/support |
| **Privacy Policy URL** | https://promptguard.nl/privacy |

---

## Short Description (max 132 chars)

```
Detect sensitive data before it reaches AI tools. Local, privacy-first monitoring for your organisation.
```
*(104 chars)*

---

## Detailed Description (max 16,000 chars)

```
PromptGuard — AI Data Shield

Protect your organisation's sensitive information before it leaves your browser.

As employees increasingly use public AI tools — ChatGPT, Claude, Gemini, Microsoft Copilot and others — they sometimes paste confidential data without realising it: customer records, BSN numbers (Dutch citizen IDs), IBAN bank accounts, API keys, medical information or internal documents.

PromptGuard runs silently in your browser and detects these patterns locally, before anything is sent to an AI provider. Your IT team gets aggregated statistics on what types of sensitive data are being used in AI tools — without ever seeing the actual content.


HOW IT WORKS

1. Install the extension and configure your dashboard URL and API key (set by your IT administrator).
2. Browse and work normally. When you submit a message to a supported AI tool, PromptGuard inspects it locally.
3. If sensitive data patterns are detected, PromptGuard can warn you, log the event, or block the submission — depending on the policy set by your organisation.
4. Aggregated metadata (data category, severity, tool used) is sent to your private PromptGuard dashboard. No prompt content is ever transmitted.


WHAT IS DETECTED

PromptGuard recognises common categories of sensitive information, including:
• Dutch BSN (citizen service numbers)
• IBAN bank account numbers
• Credit card numbers
• Email addresses
• Phone numbers
• IP addresses
• API keys and secrets
• Dutch postal codes combined with other identifiers
• Generic personal data patterns


SUPPORTED AI TOOLS

• ChatGPT (chatgpt.com / chat.openai.com)
• Claude (claude.ai)
• Google Gemini (gemini.google.com)
• Microsoft Copilot (copilot.microsoft.com / bing.com/chat)
• Mistral Chat (chat.mistral.ai)
• Perplexity AI (perplexity.ai)
• You.com


THREE OPERATING MODES (set by IT policy)

Monitor — silently log events to the dashboard. No interruptions for users.
Warn    — show an in-page banner when sensitive data is detected. User can still proceed.
Block   — prevent form submission until sensitive data is removed.


PRIVACY BY DESIGN

• All detection happens locally in your browser — no prompt text ever leaves your device.
• Only metadata is transmitted: which category of sensitive data was found, how many items, severity level, which AI tool, and a timestamp.
• No cookies, no cross-site tracking, no third-party analytics.
• The extension never reads, stores or transmits prompt content, passwords, documents or any other personal input.
• Data is never sold to third parties.
• Fully AVG / GDPR compliant.


FOR IT ADMINISTRATORS

PromptGuard supports Chrome managed policies (chrome.storage.managed), so you can push configuration to all employees without them needing to set anything up:

• apiBase    — URL of your private PromptGuard dashboard
• apiKey     — organisation API key
• team       — optional team label for segmentation in the dashboard
• mode       — monitor | warn | block
• enabled    — true/false kill switch
• minSeverity — low | medium | high

Managed policy values override any local user settings.


THE UI IS IN DUTCH

PromptGuard is built for the Dutch SME market (Nederlands MKB). The popup, options page and dashboard are in Dutch. The detection engine works on any text regardless of language.


OPEN SOURCE

The detection logic is open and auditable. Visit https://promptguard.nl for the source repository link.


REQUIREMENTS

• Chrome 116 or newer (Manifest V3 / service worker support)
• A PromptGuard dashboard (self-hosted or cloud) configured by your IT administrator

Questions? Contact us at info@promptguard.nl
```

---

## Screenshots Needed

Take screenshots at 1280×800 or 640×400 (Chrome Store accepts both). Minimum 1, maximum 5 recommended.

### Screenshot 1 — Extension popup (main view)
- Open ChatGPT or Claude in the browser
- Click the PromptGuard toolbar icon
- Show the popup with event count, recent detections list, and stats
- **Caption:** "Real-time overzicht van gedetecteerde risico's per AI-tool"

### Screenshot 2 — In-page warning banner (warn mode)
- Paste a text with an IBAN or BSN into ChatGPT's prompt box
- Trigger a detection in warn mode
- Show the orange/red warning banner that appears above the input
- **Caption:** "Directe waarschuwing wanneer gevoelige data wordt ingevoerd"

### Screenshot 3 — Dashboard overview
- Open the PromptGuard dashboard (/dashboard or home page)
- Show the aggregated statistics: events per tool, data types breakdown, severity chart
- **Caption:** "Aggregated inzicht voor IT-beheerders — geen prompt-inhoud"

### Screenshot 4 — Options / configuration page
- Open the extension options page (right-click icon > Options)
- Show the settings form: API URL, API key, mode selector, severity filter
- **Caption:** "Eenvoudig te configureren via de optiespagina of managed policy"

### Screenshot 5 — Block mode (optional)
- Show a blocked form submission with an explanation overlay
- **Caption:** "Blokkeerstand voorkomt dat gevoelige data de organisatie verlaat"

---

## Promotional Images (optional but recommended)

| Asset | Size | Notes |
|---|---|---|
| Small promo tile | 440×280 px | Used in search results |
| Large promo tile | 920×680 px | Used on extension detail page |
| Marquee promo | 1400×560 px | Used on home page features |

Use a dark background (#0f172a or similar), the PromptGuard logo, and a one-line tagline such as:
"Stop sensitive data before it reaches the AI."

---

## Privacy Practices Checklist (store submission form)

When filling in the "Privacy practices" section of the Chrome Web Store Developer Dashboard, answer as follows:

### Does your extension collect or use any user data?
**Yes** — select the following data types:

| Data type | Collected? | Notes |
|---|---|---|
| Personally identifiable information | No | Detection is metadata-only; no PII in payload |
| Health information | No | |
| Financial and payment information | No | |
| Authentication information | No | API key stored locally, never transmitted in body |
| Personal communications | No | Prompt content is never read or stored |
| Location | No | |
| Web history | No | |
| User activity | Yes | Detection events (category, severity, tool, timestamp) |
| Website content | No | Content is inspected locally, never stored or sent |

### How is data used?

Check:
- [x] The data is used for the app's core functionality
- [ ] The data is used for analytics (aggregated dashboard stats — check this if your dashboard performs analytics)

Do NOT check:
- [ ] The data is used for advertising or marketing

### Is data shared with third parties?
**No** — data is only sent to the organisation's own configured dashboard endpoint.

### Is data sold?
**No.**

### Is data used for personalisation?
**No.**

### Is data related to user activity kept after the user stops using the extension?
Local browser data is deleted when the extension is uninstalled. Dashboard data retention is controlled by the organisation.

---

## Justification for Permissions (required in submission)

Provide these justifications when the store asks why each permission is needed:

| Permission | Justification |
|---|---|
| `storage` | Store detection events in a local queue, extension settings, and aggregate statistics for the popup. |
| `alarms` | Schedule a periodic flush of the event queue to the dashboard API every 60 seconds without relying on timers that don't survive service worker suspension. |
| Host permissions (AI tool URLs) | Inject content scripts to detect sensitive data patterns in the user's input on supported AI platforms. Detection happens locally; no data from these pages is transmitted to PromptGuard servers. |

---

*Last updated: 2026-05-17*
