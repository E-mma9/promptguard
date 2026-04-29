(async function () {
  'use strict';

  function el(id) { return document.getElementById(id); }

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

  // Lock managed fields and show a banner
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
        if (span && !span.textContent.includes('🔒')) {
          span.innerHTML = span.innerHTML + ' <span style="color:#7c3aed;font-weight:700">🔒 IT-vergrendeld</span>';
        }
      }
    }
    if (lockedKeys.includes('apiBase') && lockedKeys.includes('apiKey')) {
      el('pg-save').disabled = true;
      el('pg-save').style.opacity = '0.5';
      el('pg-save').style.cursor = 'not-allowed';
    }
  }

  el('pg-save').addEventListener('click', async () => {
    if (el('pg-save').disabled) return;
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

  el('pg-test').addEventListener('click', async () => {
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
        showResult(`Verbindingsfout: HTTP ${res.status}.`, 'err');
        return;
      }
      const data = await res.json().catch(() => ({}));
      const orgName = data.organization || 'organisatie';
      showResult(`Verbonden met ${orgName}.`, 'ok');
    } catch (e) {
      showResult('Kon dashboard niet bereiken. Controleer URL en netwerk.', 'err');
    }
  });

  el('pg-clear').addEventListener('click', async () => {
    await chrome.storage.local.remove(['pg_queue', 'pg_recent', 'pg_stats', 'pg_install_id']);
    showResult('Lokale data is gewist.', 'ok');
  });

  function showResult(msg, kind) {
    const r = el('pg-test-result');
    r.textContent = msg;
    r.classList.remove('pg-ok', 'pg-err');
    if (kind === 'ok') r.classList.add('pg-ok');
    if (kind === 'err') r.classList.add('pg-err');
  }

  function showManagedBanner(keys) {
    const banner = document.createElement('div');
    banner.style.cssText = 'background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; padding: 14px 16px; border-radius: 12px; margin-bottom: 20px; font-size: 13.5px; line-height: 1.5;';
    banner.innerHTML = '<strong>🔒 Beheerd door IT</strong><br>Een aantal instellingen wordt centraal beheerd door je IT-afdeling en kan hier niet worden gewijzigd: <em>' + keys.join(', ') + '</em>.';
    const main = document.querySelector('.pg-opt');
    if (main) main.insertBefore(banner, main.children[1] || null);
  }
})();
