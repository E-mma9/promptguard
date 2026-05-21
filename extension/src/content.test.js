/**
 * PromptGuard — content.js integration test (jsdom sandbox).
 *
 * Loads detector.js + content.js into a simulated AI-tool page and verifies
 * detection fires for the cases that matter in production:
 *  - paste into a ProseMirror contenteditable, where the paste event fires on
 *    an inner <p> (not the contenteditable root) — the ChatGPT/Claude case
 *    that previously slipped through undetected;
 *  - paste into a plain <textarea>;
 *  - clean text does NOT trigger;
 *  - paste outside any prompt input is ignored.
 *
 * Run: npm install (once) then `node src/content.test.js`.
 */
'use strict';

const fs = require('fs');
const path = require('path');

let JSDOM;
try {
  ({ JSDOM } = require('jsdom'));
} catch (e) {
  console.error('jsdom not installed — run `npm install` in extension/ first.');
  process.exit(1);
}

let passed = 0;
let failed = 0;
function assert(cond, msg) {
  if (cond) {
    passed++;
    console.log('  PASS  ' + msg);
  } else {
    failed++;
    console.log('  FAIL  ' + msg);
  }
}

const DETECTOR_SRC = fs.readFileSync(path.join(__dirname, 'detector.js'), 'utf8');
const CONTENT_SRC = fs.readFileSync(path.join(__dirname, 'content.js'), 'utf8');

/** Build a fresh simulated AI-tool page with detector.js + content.js loaded. */
function makeEnv(hostname) {
  const dom = new JSDOM(
    '<!DOCTYPE html><html><body>' +
      '<div class="ProseMirror" contenteditable="true"><p id="pm-inner">typ hier</p></div>' +
      '<textarea id="ta"></textarea>' +
      '<div id="plain">geen invoerveld</div>' +
      '</body></html>',
    { url: 'https://' + hostname + '/', runScripts: 'outside-only' }
  );
  const { window } = dom;
  const sent = [];
  window.chrome = {
    runtime: {
      sendMessage: (msg, cb) => {
        sent.push(msg);
        if (typeof cb === 'function') {
          cb({ settings: { mode: 'warn', enabled: true, minSeverity: 'medium' } });
        }
      },
    },
    storage: { onChanged: { addListener: () => {} } },
  };
  window.eval(DETECTOR_SRC);
  window.eval(CONTENT_SRC);
  return { window, sent };
}

/** Dispatch a paste event carrying `text`, targeting `el`. */
function paste(window, el, text) {
  const evt = new window.Event('paste', { bubbles: true, cancelable: true });
  evt.clipboardData = { getData: () => text };
  el.dispatchEvent(evt);
}

const SENSITIVE = 'Klant: Jan de Vries, BSN 111222333, IBAN NL91ABNA0417164300';

console.log('[ProseMirror — paste on inner <p> (ChatGPT/Claude case)]');
{
  const { window, sent } = makeEnv('chatgpt.com');
  assert(!!window.PromptGuardDetector, 'detector.js loaded into the page');
  const inner = window.document.getElementById('pm-inner');
  paste(window, inner, SENSITIVE);
  const det = sent.find((m) => m && m.kind === 'detection');
  assert(!!det, 'detection event sent after paste on inner <p>');
  assert(!!det && det.payload && det.payload.total >= 2, 'payload.total >= 2 (BSN + IBAN)');
  assert(!!det && det.payload.counts && det.payload.counts['bsn'] === 1, 'BSN counted in payload');
  assert(!!window.document.querySelector('.pg-banner'), 'warn banner rendered in the DOM');
}

console.log('[textarea — paste still detected]');
{
  const { window, sent } = makeEnv('claude.ai');
  paste(window, window.document.getElementById('ta'), SENSITIVE);
  assert(
    sent.some((m) => m && m.kind === 'detection'),
    'detection event sent from textarea paste'
  );
}

console.log('[clean text — no false positive]');
{
  const { window, sent } = makeEnv('chatgpt.com');
  paste(window, window.document.getElementById('pm-inner'), 'een gewone vraag over het weer morgen');
  assert(
    !sent.some((m) => m && m.kind === 'detection'),
    'no detection event for clean, non-sensitive text'
  );
}

console.log('[non-input target — paste ignored]');
{
  const { window, sent } = makeEnv('chatgpt.com');
  paste(window, window.document.getElementById('plain'), SENSITIVE);
  assert(
    !sent.some((m) => m && m.kind === 'detection'),
    'no detection when paste target is not a prompt input'
  );
}

console.log('\nResult: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
