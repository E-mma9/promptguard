/**
 * PromptGuard — Content Script
 *
 * Hooks into AI chat tool pages (ChatGPT, Claude, Gemini, Copilot, ...)
 * and runs the local detector against text that the user pastes or types
 * into the prompt box. Never reads, stores or transmits the actual content.
 *
 * Modes:
 *   - monitor: log detection metadata silently
 *   - warn:    show a banner; user can proceed or cancel
 *   - block:   prevent the prompt from being submitted
 */
(function () {
  'use strict';

  if (window.__promptguardLoaded__) return;
  window.__promptguardLoaded__ = true;

  const Detector = window.PromptGuardDetector || self.PromptGuardDetector;
  if (!Detector) {
    console.warn('[PromptGuard] detector not loaded');
    return;
  }

  // ---------- Identify the AI tool from the URL ----------
  function detectTool() {
    const h = location.hostname;
    if (h.includes('chatgpt.com') || h.includes('chat.openai.com')) return 'chatgpt';
    if (h.includes('claude.ai')) return 'claude';
    if (h.includes('gemini.google.com')) return 'gemini';
    if (h.includes('copilot.microsoft.com') || h.includes('bing.com')) return 'copilot';
    if (h.includes('mistral.ai')) return 'mistral';
    if (h.includes('perplexity.ai')) return 'perplexity';
    if (h.includes('you.com')) return 'you';
    return 'unknown';
  }
  const tool = detectTool();

  // ---------- Settings (read once, refreshed on storage change) ----------
  const settings = {
    mode: 'warn',     // monitor | warn | block
    enabled: true,
    minSeverity: 'medium', // only act on >= this severity
  };

  function isPromptInput(el) {
    if (!el) return false;
    if (el.tagName === 'TEXTAREA') return true;
    if (el.tagName === 'INPUT' && el.type === 'text') return true;
    if (el.getAttribute && el.getAttribute('contenteditable') === 'true') return true;
    return false;
  }

  function getInputText(el) {
    if (!el) return '';
    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') return el.value || '';
    return el.innerText || el.textContent || '';
  }

  function severityRank(s) {
    return s === 'high' ? 3 : s === 'medium' ? 2 : s === 'low' ? 1 : 0;
  }

  function shouldAct(result) {
    if (!result || !result.highest) return false;
    return severityRank(result.highest) >= severityRank(settings.minSeverity);
  }

  // ---------- Send event to background for ingestion ----------
  // Map UI mode → canonical action verb (server only accepts these three).
  const ACTION_BY_MODE = { monitor: 'monitored', warn: 'warned', block: 'blocked' };

  function reportDetection(result, source, characterCount) {
    try {
      chrome.runtime.sendMessage({
        kind: 'detection',
        payload: {
          tool,
          source,
          counts: result.counts,
          severityCounts: result.severityCounts,
          total: result.total,
          highest: result.highest,
          characterCount,
          action: shouldAct(result)
            ? (ACTION_BY_MODE[settings.mode] || 'monitored')
            : 'monitored',
          url: location.origin + location.pathname,
        },
      });
    } catch (e) {
      // background may not be ready yet — non-fatal
    }
  }

  // ---------- UI banner (warn mode) ----------
  let bannerEl = null;
  function showBanner(result, onProceed, onCancel) {
    hideBanner();
    bannerEl = document.createElement('div');
    bannerEl.className = 'pg-banner';
    bannerEl.setAttribute('role', 'dialog');
    bannerEl.setAttribute('aria-label', 'PromptGuard waarschuwing');

    const labelByType = {
      'bsn': 'BSN',
      'rsin': 'RSIN',
      'kvk': 'KvK-nummer',
      'iban-nl': 'NL IBAN',
      'iban': 'IBAN',
      'btw': 'BTW-nummer',
      'postcode': 'postcode',
      'phone-nl': 'telefoonnummer',
      'email': 'e-mailadres',
      'creditcard': 'creditcardnummer',
      'api-key': 'API-key',
      'loonstrook': 'salarisgegevens',
      'contract': 'contracttekst',
      'nl-system': 'NL-systeem export',
      'source-code': 'broncode',
    };

    const items = Object.entries(result.counts)
      .map(([k, v]) => `${v}× ${labelByType[k] || k}`)
      .join(', ');

    const sevLabel = result.highest === 'high' ? 'kritiek' : result.highest === 'medium' ? 'gevoelig' : 'lage prioriteit';

    bannerEl.innerHTML = `
      <div class="pg-banner-inner pg-sev-${result.highest}">
        <div class="pg-banner-icon" aria-hidden="true">!</div>
        <div class="pg-banner-body">
          <div class="pg-banner-title">PromptGuard heeft <strong>${result.total}</strong> ${sevLabel}e item(s) gedetecteerd</div>
          <div class="pg-banner-detail">${escapeHtml(items)}</div>
          <div class="pg-banner-help">Deze data zou bij <strong>${escapeHtml(toolLabel(tool))}</strong> terechtkomen.</div>
        </div>
        <div class="pg-banner-actions">
          <button class="pg-btn pg-btn-cancel" type="button">Annuleren</button>
          <button class="pg-btn pg-btn-proceed" type="button">Toch versturen</button>
        </div>
      </div>
    `;

    document.documentElement.appendChild(bannerEl);
    bannerEl.querySelector('.pg-btn-cancel').addEventListener('click', () => { hideBanner(); onCancel && onCancel(); });
    bannerEl.querySelector('.pg-btn-proceed').addEventListener('click', () => { hideBanner(); onProceed && onProceed(); });
  }

  function hideBanner() {
    if (bannerEl && bannerEl.parentNode) bannerEl.parentNode.removeChild(bannerEl);
    bannerEl = null;
  }

  function toolLabel(t) {
    return ({ chatgpt: 'ChatGPT', claude: 'Claude', gemini: 'Gemini', copilot: 'Copilot', mistral: 'Mistral', perplexity: 'Perplexity', you: 'You.com' })[t] || t;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---------- Paste hook ----------
  document.addEventListener('paste', (e) => {
    if (!settings.enabled) return;
    const target = e.target;
    if (!isPromptInput(target)) return;

    const data = (e.clipboardData || window.clipboardData);
    if (!data) return;
    const pasted = data.getData('text/plain') || data.getData('text') || '';
    if (!pasted) return;

    const result = Detector.scan(pasted);
    if (result.total === 0) return;

    reportDetection(result, 'paste', pasted.length);

    if (!shouldAct(result)) return;

    if (settings.mode === 'block') {
      e.preventDefault();
      e.stopPropagation();
      showBanner(result, null, null); // no proceed in block mode
      // mutate banner to remove proceed button
      if (bannerEl) {
        const proc = bannerEl.querySelector('.pg-btn-proceed');
        if (proc) proc.remove();
        const cancel = bannerEl.querySelector('.pg-btn-cancel');
        if (cancel) cancel.textContent = 'Sluiten';
      }
      return;
    }

    if (settings.mode === 'warn') {
      // We can't synchronously block then resume a paste event in the way
      // browsers expect. So we cancel, show banner, and on Proceed we
      // programmatically insert the text.
      e.preventDefault();
      e.stopPropagation();
      showBanner(
        result,
        () => insertTextInto(target, pasted),
        () => {
          // log override = false (user cancelled); already reported above
        }
      );
      return;
    }
    // monitor mode — already reported, do nothing else.
  }, true);

  // ---------- Input hook (typed text) ----------
  // Tracks the last reported scan-signature per element to avoid duplicates
  // when the same prompt sits in the textarea while user keeps typing.
  const lastSignature = new WeakMap();
  let inputDebounce = null;

  function scanSignature(result) {
    const counts = result.counts || {};
    return Object.keys(counts).sort().map((k) => k + ':' + counts[k]).join('|');
  }

  function handleInput(target) {
    if (!settings.enabled) return;
    if (!isPromptInput(target)) return;
    const text = getInputText(target);
    if (!text || text.length < 4) return;

    const result = Detector.scan(text);
    if (result.total === 0) return;

    const sig = scanSignature(result);
    if (lastSignature.get(target) === sig) return; // unchanged since last scan
    lastSignature.set(target, sig);

    reportDetection(result, 'submit', text.length);

    if (!shouldAct(result)) return;
    if (bannerEl) return; // already showing

    if (settings.mode === 'block' || settings.mode === 'warn') {
      // We can't undo what was already typed, but we CAN warn the user
      // before they submit.
      showBanner(
        result,
        () => { /* user proceeds — leave text intact */ },
        () => {
          // user cancelled — clear the input so nothing is sent
          if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
            target.value = '';
            target.dispatchEvent(new Event('input', { bubbles: true }));
          } else if (target.getAttribute && target.getAttribute('contenteditable') === 'true') {
            target.textContent = '';
            target.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      );
    }
  }

  document.addEventListener('input', (e) => {
    const target = e.target;
    if (!isPromptInput(target)) return;
    if (inputDebounce) clearTimeout(inputDebounce);
    inputDebounce = setTimeout(() => handleInput(target), 600);
  }, true);

  // Final safety net: when user presses Enter (often = submit), scan immediately
  // and block the submission if the result triggers a warning/block.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.shiftKey) return;
    const target = e.target;
    if (!isPromptInput(target)) return;
    if (inputDebounce) { clearTimeout(inputDebounce); inputDebounce = null; }

    const text = getInputText(target);
    if (!text || text.length < 4) return;
    const result = Detector.scan(text);
    if (result.total === 0) return;

    if (shouldAct(result) && (settings.mode === 'warn' || settings.mode === 'block')) {
      // Stop ChatGPT/Claude/etc. from submitting before the user has decided.
      e.preventDefault();
      e.stopImmediatePropagation();
    }

    handleInput(target);
  }, true);

  function insertTextInto(el, text) {
    if (!el) return;
    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
      const start = el.selectionStart || 0;
      const end = el.selectionEnd || 0;
      const before = (el.value || '').slice(0, start);
      const after = (el.value || '').slice(end);
      el.value = before + text + after;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.focus();
    } else if (el.getAttribute && el.getAttribute('contenteditable') === 'true') {
      el.focus();
      // use execCommand for compatibility; modern alternative is Selection API
      document.execCommand('insertText', false, text);
    }
  }

  // ---------- Settings sync ----------
  // Always go through background which merges managed (IT-pushed) over local.
  function loadSettings() {
    try {
      chrome.runtime.sendMessage({ kind: 'getSettings' }, (resp) => {
        if (!resp || !resp.settings) return;
        const s = resp.settings;
        if (s.mode) settings.mode = s.mode;
        if (typeof s.enabled === 'boolean') settings.enabled = s.enabled;
        if (s.minSeverity) settings.minSeverity = s.minSeverity;
      });
    } catch (e) {}
  }
  loadSettings();
  chrome.storage.onChanged.addListener(loadSettings);

  // ---------- Console marker for verifiability ----------
  console.log('%c[PromptGuard] active on ' + tool + ' — mode=' + settings.mode, 'color:#7c3aed;font-weight:bold');
})();
