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

  function el(id) { return document.getElementById(id); }

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
      li.innerHTML = `
        <span class="pg-evt-dot pg-sev-${sev}"></span>
        <div class="pg-evt-body">
          <div class="pg-evt-title">${e.total} item(s) — ${escapeHtml(TOOL_LABELS[e.tool] || e.tool)}</div>
          <div class="pg-evt-meta">${escapeHtml(topItems(e.counts))}</div>
        </div>
        <span class="pg-evt-time">${timeAgo(e.detectedAt)}</span>
      `;
      list.appendChild(li);
    }
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---------- Wire up ----------

  const settings = await chrome.storage.local.get(['mode', 'enabled', 'apiBase']);
  const mode = settings.mode || 'warn';
  const enabled = settings.enabled !== false;

  // Mode segment
  document.querySelectorAll('.pg-seg').forEach((btn) => {
    if (btn.dataset.mode === mode) btn.classList.add('pg-seg-active');
    else btn.classList.remove('pg-seg-active');
    btn.addEventListener('click', async () => {
      document.querySelectorAll('.pg-seg').forEach((b) => b.classList.remove('pg-seg-active'));
      btn.classList.add('pg-seg-active');
      await chrome.storage.local.set({ mode: btn.dataset.mode });
    });
  });

  // Enable toggle
  const toggle = el('pg-toggle');
  toggle.setAttribute('aria-pressed', String(enabled));
  toggle.addEventListener('click', async () => {
    const next = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(next));
    await chrome.storage.local.set({ enabled: next });
  });

  // Footer links
  el('pg-options-link').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
  const apiBase = settings.apiBase || 'http://localhost:3000';
  el('pg-dashboard-link').href = apiBase.replace(/\/$/, '') + '/dashboard';

  // Recent events
  chrome.runtime.sendMessage({ kind: 'getRecent' }, (resp) => {
    if (resp) render(resp);
  });
})();
