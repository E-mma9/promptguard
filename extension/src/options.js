(async function () {
  'use strict';

  function el(id) { return document.getElementById(id); }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---------- Extension version ----------

  try {
    const manifest = chrome.runtime.getManifest();
    el('pg-version').textContent = escapeHtml(manifest.version);
  } catch (_) {
    el('pg-version').textContent = '—';
  }

  // ---------- Load settings ----------

  const { settings: cur, managed } = await new Promise((resolve) => {
    chrome.runtime.sendMessage({ kind: 'getSettings' }, (resp) => resolve(resp || { settings: {}, managed: {} }));
  });

  el('pg-api-base').value = cur.apiBase || '';
  el('pg-api-key').value = cur.apiKey || '';
  el('pg-team').value = cur.team || '';
  if (cur.mode) el('pg-mode').value = cur.mode;
  if (cur.minSeverity) el('pg-min-severity').value = cur.minSeverity;
  if (cur.apiKey && cur.apiBase) {
    el('pg-status').textContent = 'Geconfigureerd';
    el('pg-status').classList.add('pg-ok');
  }

  // ---------- API key show/hide toggle ----------

  const apiKeyInput = el('pg-api-key');
  const apiKeyToggleBtn = el('pg-api-key-toggle');
  const eyeShow = el('pg-eye-show');
  const eyeHide = el('pg-eye-hide');

  apiKeyToggleBtn.addEventListener('click', () => {
    const isPassword = apiKeyInput.type === 'password';
    apiKeyInput.type = isPassword ? 'text' : 'password';
    eyeShow.hidden = isPassword;
    eyeHide.hidden = !isPassword;
    apiKeyToggleBtn.setAttribute('aria-label', isPassword ? 'API-key verbergen' : 'API-key tonen');
  });

  // ---------- Lock managed fields and show a banner ----------

  const lockedKeys = Object.keys(managed).filter((k) => managed[k]);
  if (lockedKeys.length > 0) {
    showManagedBanner(lockedKeys);
    const fieldMap = {
      apiBase: 'pg-api-base',
      apiKey: 'pg-api-key',
      team: 'pg-team',
      mode: 'pg-mode',
      minSeverity: 'pg-min-severity',
    };
    for (const k of lockedKeys) {
      const fieldId = fieldMap[k];
      if (!fieldId) continue;
      const field = el(fieldId);
      if (!field) continue;
      field.disabled = true;
      field.style.background = '#f3f4f6';
      field.style.cursor = 'not-allowed';
      const label = field.closest('label');
      if (label) {
        const span = label.querySelector('span');
        if (span && !span.textContent.includes('IT-vergrendeld')) {
          const lock = document.createElement('span');
          lock.style.cssText = 'color:#7c3aed;font-weight:700';
          lock.textContent = ' 🔒 IT-vergrendeld';
          span.appendChild(lock);
        }
      }
    }
    if (lockedKeys.includes('apiBase') && lockedKeys.includes('apiKey')) {
      el('pg-save').disabled = true;
      el('pg-save').style.opacity = '0.5';
      el('pg-save').style.cursor = 'not-allowed';
    }
  }

  // ---------- Validation helpers ----------

  function clearFieldError(errId) {
    const errEl = el(errId);
    if (errEl) errEl.textContent = '';
  }

  function setFieldError(errId, msg) {
    const errEl = el(errId);
    if (errEl) errEl.textContent = msg;
  }

  function validateFields() {
    let valid = true;
    clearFieldError('pg-api-base-err');
    clearFieldError('pg-api-key-err');

    const apiBase = el('pg-api-base').value.trim();
    const apiKey = el('pg-api-key').value.trim();

    if (apiBase && !apiBase.startsWith('http://') && !apiBase.startsWith('https://')) {
      setFieldError('pg-api-base-err', 'URL moet beginnen met http:// of https://');
      valid = false;
    }

    if (apiKey && !apiKey.startsWith('pg_live_')) {
      setFieldError('pg-api-key-err', 'API-key moet beginnen met pg_live_');
      valid = false;
    }

    return valid;
  }

  // ---------- Save ----------

  el('pg-save').addEventListener('click', async () => {
    if (el('pg-save').disabled) return;
    if (!validateFields()) return;

    const toSet = {};
    if (!managed.apiBase) toSet.apiBase = el('pg-api-base').value.trim();
    if (!managed.apiKey) toSet.apiKey = el('pg-api-key').value.trim();
    if (!managed.team) toSet.team = el('pg-team').value.trim();
    if (!managed.mode) toSet.mode = el('pg-mode').value;
    if (!managed.minSeverity) toSet.minSeverity = el('pg-min-severity').value;
    await chrome.storage.local.set(toSet);
    showResult('Opgeslagen.', 'ok');
    if (el('pg-api-key').value && el('pg-api-base').value) {
      el('pg-status').textContent = 'Geconfigureerd';
      el('pg-status').classList.add('pg-ok');
    }
  });

  // ---------- Test connection ----------

  el('pg-test').addEventListener('click', async () => {
    if (!validateFields()) return;
    const apiBase = el('pg-api-base').value.trim().replace(/\/$/, '');
    const apiKey = el('pg-api-key').value.trim();
    if (!apiBase || !apiKey) {
      showResult('Vul eerst dashboard-URL en API-key in.', 'err');
      return;
    }
    showResult('Bezig met testen…', '');
    try {
      const res = await fetch(apiBase + '/api/ingest/health', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + apiKey },
      });
      if (!res.ok) {
        showResult('Verbindingsfout: HTTP ' + res.status + '.', 'err');
        return;
      }
      const data = await res.json().catch(() => ({}));
      const orgName = escapeHtml(data.organization || 'organisatie');
      showResult('Verbonden met ' + orgName + '.', 'ok');
    } catch (e) {
      showResult('Kon dashboard niet bereiken. Controleer URL en netwerk.', 'err');
    }
  });

  // ---------- Export data ----------

  el('pg-export').addEventListener('click', () => {
    chrome.storage.local.get(['pg_stats', 'pg_recent'], (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'promptguard-export.json';
      a.click();
      URL.revokeObjectURL(url);
    });
  });

  // ---------- Clear local data ----------

  el('pg-clear').addEventListener('click', async () => {
    await chrome.storage.local.remove(['pg_queue', 'pg_recent', 'pg_stats', 'pg_install_id']);
    showResult('Lokale data is gewist.', 'ok');
  });

  // ---------- Helpers ----------

  function showResult(msg, kind) {
    const r = el('pg-test-result');
    r.textContent = msg;
    r.classList.remove('pg-ok', 'pg-err');
    if (kind === 'ok') r.classList.add('pg-ok');
    if (kind === 'err') r.classList.add('pg-err');
  }

  function showManagedBanner(keys) {
    const banner = document.createElement('div');
    banner.className = 'pg-managed-banner';

    const strong = document.createElement('strong');
    strong.textContent = '🔒 Beheerd door IT';

    const text = document.createTextNode(
      ' Een aantal instellingen wordt centraal beheerd door je IT-afdeling en kan hier niet worden gewijzigd: '
    );
    const em = document.createElement('em');
    em.textContent = keys.join(', ');

    banner.appendChild(strong);
    banner.appendChild(text);
    banner.appendChild(em);
    banner.appendChild(document.createTextNode('.'));

    const main = document.querySelector('.pg-opt');
    if (main) main.insertBefore(banner, main.children[1] || null);
  }
})();
