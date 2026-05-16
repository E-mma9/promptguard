(async function () {
  'use strict';

  const TYPE_LABELS = {
    'bsn': 'BSN', 'rsin': 'RSIN', 'kvk': 'KvK', 'iban-nl': 'NL IBAN',
    'iban': 'IBAN', 'btw': 'BTW', 'postcode': 'postcode', 'phone-nl': 'tel',
    'email': 'e-mail', 'creditcard': 'creditcard', 'api-key': 'API-key',
    'loonstrook': 'salaris', 'contract': 'contract', 'nl-system': 'NL-systeem',
    'source-code': 'broncode',
  };

  const TOOL_LABELS = {
    chatgpt: 'ChatGPT', claude: 'Claude', gemini: 'Gemini',
    copilot: 'Copilot', mistral: 'Mistral', perplexity: 'Perplexity',
    you: 'You.com', unknown: 'AI-tool',
  };

  const MODE_LABELS = {
    monitor: 'Monitor',
    warn: 'Waarschuw',
    block: 'Blokkeer',
  };

  function el(id) { return document.getElementById(id); }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function timeAgo(iso) {
    const t = new Date(iso).getTime();
    const diff = Math.max(0, Date.now() - t);
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'nu';
    if (m < 60) return m + 'm';
    const h = Math.floor(m / 60);
    if (h < 24) return h + 'u';
    return Math.floor(h / 24) + 'd';
  }

  function topItems(counts) {
    return Object.entries(counts || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => `${v}× ${TYPE_LABELS[k] || k}`)
      .join(', ');
  }

  function render(data) {
    const stats = data.stats || {};
    el('pg-stat-events').textContent = stats.totalEvents || 0;
    el('pg-stat-items').textContent = stats.totalItems || 0;
    el('pg-stat-high').textContent = (stats.bySeverity && stats.bySeverity.high) || 0;

    const list = el('pg-recent-list');
    list.innerHTML = '';
    const recent = data.recent || [];
    if (recent.length === 0) {
      const li = document.createElement('li');
      li.className = 'pg-empty';
      li.textContent = 'Nog geen detecties — start een sessie in ChatGPT, Claude, Gemini of Copilot.';
      list.appendChild(li);
      return;
    }
    for (const e of recent.slice(0, 8)) {
      const li = document.createElement('li');
      li.className = 'pg-evt';
      const sev = e.highest || 'low';

      const dot = document.createElement('span');
      dot.className = 'pg-evt-dot pg-sev-' + escapeHtml(sev);

      const body = document.createElement('div');
      body.className = 'pg-evt-body';

      const title = document.createElement('div');
      title.className = 'pg-evt-title';
      title.textContent = e.total + ' item(s) — ' + (TOOL_LABELS[e.tool] || escapeHtml(e.tool));

      const meta = document.createElement('div');
      meta.className = 'pg-evt-meta';
      meta.textContent = topItems(e.counts);

      body.appendChild(title);
      body.appendChild(meta);

      const time = document.createElement('span');
      time.className = 'pg-evt-time';
      time.textContent = timeAgo(e.detectedAt);

      li.appendChild(dot);
      li.appendChild(body);
      li.appendChild(time);
      list.appendChild(li);
    }
  }

  // ---------- Load settings via background (respects managed policy) ----------

  const { settings: cur } = await new Promise((resolve) => {
    chrome.runtime.sendMessage({ kind: 'getSettings' }, (resp) => {
      resolve(resp || { settings: {}, managed: {} });
    });
  });

  const mode = cur.mode || 'warn';
  const enabled = cur.enabled !== false;
  const apiKey = cur.apiKey || '';
  const apiBase = cur.apiBase || '';

  // ---------- Setup wizard banner ----------

  if (!apiKey) {
    el('pg-setup-banner').hidden = false;
  }
  el('pg-setup-btn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // ---------- Connection status badge ----------

  const badge = el('pg-conn-badge');
  if (!enabled) {
    badge.className = 'pg-conn-badge pg-conn-red';
    badge.title = 'PromptGuard uitgeschakeld';
  } else if (apiKey && apiBase) {
    badge.className = 'pg-conn-badge pg-conn-green';
    badge.title = 'Verbonden met dashboard';
  } else {
    badge.className = 'pg-conn-badge pg-conn-orange';
    badge.title = 'Lokaal actief, geen dashboard';
  }

  // ---------- Mode segment ----------

  const modeActiveLbl = el('pg-mode-label-active');
  modeActiveLbl.textContent = MODE_LABELS[mode] || mode;

  document.querySelectorAll('.pg-seg').forEach((btn) => {
    const isActive = btn.dataset.mode === mode;
    btn.classList.toggle('pg-seg-active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
    btn.addEventListener('click', async () => {
      document.querySelectorAll('.pg-seg').forEach((b) => {
        b.classList.remove('pg-seg-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('pg-seg-active');
      btn.setAttribute('aria-pressed', 'true');
      modeActiveLbl.textContent = MODE_LABELS[btn.dataset.mode] || btn.dataset.mode;
      await chrome.storage.local.set({ mode: btn.dataset.mode });
    });
  });

  // ---------- Enable toggle ----------

  const toggle = el('pg-toggle');
  toggle.setAttribute('aria-pressed', String(enabled));
  toggle.addEventListener('click', async () => {
    const next = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(next));
    await chrome.storage.local.set({ enabled: next });
    // Update badge to reflect disabled state
    if (!next) {
      badge.className = 'pg-conn-badge pg-conn-red';
      badge.title = 'PromptGuard uitgeschakeld';
    } else if (apiKey && apiBase) {
      badge.className = 'pg-conn-badge pg-conn-green';
      badge.title = 'Verbonden met dashboard';
    } else {
      badge.className = 'pg-conn-badge pg-conn-orange';
      badge.title = 'Lokaal actief, geen dashboard';
    }
  });

  // ---------- Footer links ----------

  el('pg-options-link').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  const dashBase = apiBase || 'http://localhost:3000';
  el('pg-dashboard-link').href = dashBase.replace(/\/$/, '') + '/dashboard';

  // ---------- Sync / Flush button ----------

  const syncBtn = el('pg-sync-btn');
  const syncFeedback = el('pg-sync-feedback');
  let syncTimer = null;

  function showSyncFeedback(msg, kind) {
    syncFeedback.textContent = msg;
    syncFeedback.className = 'pg-sync-feedback pg-sync-feedback-' + kind;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
      syncFeedback.textContent = '';
      syncFeedback.className = 'pg-sync-feedback';
    }, 3000);
  }

  syncBtn.addEventListener('click', () => {
    syncBtn.disabled = true;
    chrome.runtime.sendMessage({ kind: 'flush' }, (resp) => {
      syncBtn.disabled = false;
      if (chrome.runtime.lastError) {
        showSyncFeedback('Fout: ' + escapeHtml(chrome.runtime.lastError.message), 'err');
        return;
      }
      if (resp && resp.ok === false) {
        showSyncFeedback('Synchronisatie mislukt.', 'err');
      } else {
        showSyncFeedback('Gesynchroniseerd.', 'ok');
      }
    });
  });

  // ---------- Recent events ----------

  chrome.runtime.sendMessage({ kind: 'getRecent' }, (resp) => {
    if (resp) render(resp);
  });
})();
