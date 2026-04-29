/**
 * PromptGuard — Background service worker
 *
 * Responsibilities:
 *  - Receive detection events from content scripts
 *  - Store them locally (chrome.storage.local) for the popup
 *  - Batch and POST to the configured dashboard API every 60s
 *
 * Never sees raw prompt content; only metadata.
 */

const QUEUE_KEY = 'pg_queue';
const RECENT_KEY = 'pg_recent';     // last 50 events for popup
const STATS_KEY = 'pg_stats';       // aggregate counters for popup
const INSTALL_ID_KEY = 'pg_install_id';
const FLUSH_ALARM = 'pg_flush';

const SETTING_KEYS = ['apiBase', 'apiKey', 'team', 'mode', 'enabled', 'minSeverity'];

const DEFAULT_SETTINGS = {
  apiBase: 'http://localhost:3000', // dashboard URL
  apiKey: '',                        // org API key (set in options)
  team: '',                          // optional team tag
  mode: 'warn',                      // monitor | warn | block
  enabled: true,
  minSeverity: 'medium',
};

/**
 * Read effective settings = managed (forced by IT) overrides local (user-set).
 * Returns { settings, managed: { apiBase: true, ... } } so callers know which
 * keys are locked.
 */
async function getEffectiveSettings() {
  let managedRaw = {};
  try {
    if (chrome.storage.managed) {
      managedRaw = await chrome.storage.managed.get(SETTING_KEYS);
    }
  } catch (e) {
    // managed not available on this browser/platform — fine
  }
  const localRaw = await chrome.storage.local.get(SETTING_KEYS);
  const settings = { ...DEFAULT_SETTINGS };
  const managed = {};
  for (const key of SETTING_KEYS) {
    if (managedRaw[key] !== undefined && managedRaw[key] !== '') {
      settings[key] = managedRaw[key];
      managed[key] = true;
    } else if (localRaw[key] !== undefined) {
      settings[key] = localRaw[key];
    }
  }
  return { settings, managed };
}

// ---------- Install: set defaults, generate install id ----------
chrome.runtime.onInstalled.addListener(async () => {
  const cur = await chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS));
  const toSet = {};
  for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) {
    if (cur[k] === undefined) toSet[k] = v;
  }
  if (Object.keys(toSet).length) await chrome.storage.local.set(toSet);

  const installId = (await chrome.storage.local.get(INSTALL_ID_KEY))[INSTALL_ID_KEY];
  if (!installId) {
    const id = await sha256(crypto.randomUUID());
    await chrome.storage.local.set({ [INSTALL_ID_KEY]: id });
  }

  await chrome.alarms.create(FLUSH_ALARM, { periodInMinutes: 1 });
});

chrome.runtime.onStartup.addListener(async () => {
  await chrome.alarms.create(FLUSH_ALARM, { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === FLUSH_ALARM) flushQueue().catch(() => {});
});

// ---------- Receive events from content scripts ----------
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || !msg.kind) return;
  if (msg.kind === 'detection') {
    handleDetection(msg.payload).then(() => sendResponse({ ok: true }));
    return true; // async
  }
  if (msg.kind === 'flush') {
    flushQueue().then((r) => sendResponse(r));
    return true;
  }
  if (msg.kind === 'getRecent') {
    chrome.storage.local.get([RECENT_KEY, STATS_KEY]).then((d) => {
      sendResponse({ recent: d[RECENT_KEY] || [], stats: d[STATS_KEY] || emptyStats() });
    });
    return true;
  }
  if (msg.kind === 'getSettings') {
    getEffectiveSettings().then((data) => sendResponse(data));
    return true;
  }
});

async function handleDetection(payload) {
  const installId = (await chrome.storage.local.get(INSTALL_ID_KEY))[INSTALL_ID_KEY];
  const { settings } = await getEffectiveSettings();
  const event = {
    ...payload,
    installId,
    team: settings.team || '',
    detectedAt: new Date().toISOString(),
  };

  // Append to queue, recent, and stats
  const cur = await chrome.storage.local.get([QUEUE_KEY, RECENT_KEY, STATS_KEY]);
  const queue = cur[QUEUE_KEY] || [];
  const recent = cur[RECENT_KEY] || [];
  const stats = cur[STATS_KEY] || emptyStats();

  queue.push(event);
  if (queue.length > 1000) queue.splice(0, queue.length - 1000);

  recent.unshift({
    tool: event.tool,
    counts: event.counts,
    total: event.total,
    highest: event.highest,
    action: event.action,
    detectedAt: event.detectedAt,
  });
  if (recent.length > 50) recent.length = 50;

  stats.totalEvents += 1;
  stats.totalItems += event.total || 0;
  stats.byTool[event.tool] = (stats.byTool[event.tool] || 0) + 1;
  for (const [k, v] of Object.entries(event.counts || {})) {
    stats.byType[k] = (stats.byType[k] || 0) + v;
  }
  stats.bySeverity[event.highest] = (stats.bySeverity[event.highest] || 0) + 1;
  stats.lastEventAt = event.detectedAt;

  await chrome.storage.local.set({ [QUEUE_KEY]: queue, [RECENT_KEY]: recent, [STATS_KEY]: stats });

  // Live badge on the toolbar
  chrome.action.setBadgeBackgroundColor({ color: '#dc2626' }).catch(() => {});
  chrome.action.setBadgeText({ text: String(Math.min(stats.totalEvents, 999)) }).catch(() => {});

  // Trigger a debounced flush so the dashboard updates within ~3s
  // (the 60s alarm is the safety net).
  scheduleFlush();
}

let flushTimer = null;
function scheduleFlush() {
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushQueue().catch(() => {});
  }, 3000);
}

// ---------- Flush queue to backend ----------
async function flushQueue() {
  const queueData = await chrome.storage.local.get([QUEUE_KEY]);
  const queue = queueData[QUEUE_KEY] || [];
  if (queue.length === 0) return { ok: true, sent: 0 };

  const { settings } = await getEffectiveSettings();
  if (!settings.apiKey || !settings.apiBase) {
    return { ok: false, reason: 'no-api-config', queued: queue.length };
  }

  const url = settings.apiBase.replace(/\/$/, '') + '/api/ingest';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + settings.apiKey,
      },
      body: JSON.stringify({ events: queue }),
    });
    if (!res.ok) {
      return { ok: false, reason: 'http-' + res.status, queued: queue.length };
    }
    await chrome.storage.local.set({ [QUEUE_KEY]: [] });
    return { ok: true, sent: queue.length };
  } catch (e) {
    return { ok: false, reason: 'network', queued: queue.length };
  }
}

// ---------- Helpers ----------
function emptyStats() {
  return {
    totalEvents: 0,
    totalItems: 0,
    byTool: {},
    byType: {},
    bySeverity: { high: 0, medium: 0, low: 0 },
    lastEventAt: null,
  };
}

async function sha256(s) {
  const buf = new TextEncoder().encode(s);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
