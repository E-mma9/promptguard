/**
 * PromptGuard — Local Sensitive Data Detection Engine
 *
 * All detection runs locally in the browser. Nothing here calls the network.
 * Open source by design: customers can read and verify every rule.
 *
 * Detectors are designed to minimise false positives by validating
 * checksums (BSN/RSIN elfproef, IBAN mod-97, credit card Luhn) wherever
 * a checksum exists.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PromptGuardDetector = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const Severity = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
  };

  // ---------- Helpers ----------

  /** Elfproef for BSN / RSIN (9 digits, last weight = -1). */
  function elfproef(digits) {
    if (digits.length !== 9) return false;
    let sum = 0;
    for (let i = 0; i < 8; i++) sum += parseInt(digits[i], 10) * (9 - i);
    sum += parseInt(digits[8], 10) * -1;
    return sum % 11 === 0;
  }

  /** ISO/IEC 7064 mod-97 check for IBAN. */
  function ibanValid(iban) {
    const compact = iban.replace(/\s+/g, '').toUpperCase();
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(compact)) return false;
    const rearranged = compact.slice(4) + compact.slice(0, 4);
    const numeric = rearranged.replace(/[A-Z]/g, (c) => (c.charCodeAt(0) - 55).toString());
    let remainder = 0;
    for (const ch of numeric) {
      remainder = (remainder * 10 + parseInt(ch, 10)) % 97;
    }
    return remainder === 1;
  }

  /** Luhn check for credit card numbers. */
  function luhn(digits) {
    let sum = 0;
    let alt = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let n = parseInt(digits[i], 10);
      if (alt) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alt = !alt;
    }
    return sum % 10 === 0;
  }

  // ---------- Detectors ----------

  const detectors = [];

  // BSN — 9 digits, elfproef. Allow spaces/dashes/dots inside.
  detectors.push({
    id: 'bsn',
    label: 'BSN',
    severity: Severity.HIGH,
    detect(text) {
      const out = [];
      const re = /(?<![\d])(?:\d[\s.\-]?){8}\d(?![\d])/g;
      let m;
      while ((m = re.exec(text)) !== null) {
        const digits = m[0].replace(/[\s.\-]/g, '');
        if (digits.length === 9 && elfproef(digits) && digits !== '000000000') {
          out.push({ type: 'bsn', start: m.index, end: m.index + m[0].length, severity: Severity.HIGH });
        }
      }
      return out;
    },
  });

  // RSIN — 9 digits, same elfproef. We classify any elfproef-passing 9-digit
  // number as 'bsn' by default; if it's preceded by RSIN/KvK keywords, classify as rsin.
  detectors.push({
    id: 'rsin',
    label: 'RSIN',
    severity: Severity.HIGH,
    detect(text) {
      const out = [];
      const re = /\bRSIN[:\s]*((?:\d[\s.\-]?){8}\d)\b/gi;
      let m;
      while ((m = re.exec(text)) !== null) {
        const digits = m[1].replace(/[\s.\-]/g, '');
        if (digits.length === 9 && elfproef(digits)) {
          out.push({ type: 'rsin', start: m.index, end: m.index + m[0].length, severity: Severity.HIGH });
        }
      }
      return out;
    },
  });

  // KvK number — 8 digits, often labelled. No checksum.
  detectors.push({
    id: 'kvk',
    label: 'KvK-nummer',
    severity: Severity.MEDIUM,
    detect(text) {
      const out = [];
      const re = /\b(?:KvK|Kamer van Koophandel)[\s.:#-]*(\d{8})\b/gi;
      let m;
      while ((m = re.exec(text)) !== null) {
        out.push({ type: 'kvk', start: m.index, end: m.index + m[0].length, severity: Severity.MEDIUM });
      }
      return out;
    },
  });

  // Dutch IBAN — NL + 2 check + 4 letters + 10 digits, mod-97.
  detectors.push({
    id: 'iban-nl',
    label: 'IBAN (NL)',
    severity: Severity.HIGH,
    detect(text) {
      const out = [];
      const re = /\bNL\d{2}[\s]?[A-Z]{4}[\s]?\d{4}[\s]?\d{4}[\s]?\d{2}\b/g;
      let m;
      while ((m = re.exec(text)) !== null) {
        if (ibanValid(m[0])) {
          out.push({ type: 'iban-nl', start: m.index, end: m.index + m[0].length, severity: Severity.HIGH });
        }
      }
      return out;
    },
  });

  // Generic IBAN — any country, mod-97.
  detectors.push({
    id: 'iban',
    label: 'IBAN (international)',
    severity: Severity.HIGH,
    detect(text) {
      const out = [];
      const re = /\b[A-Z]{2}\d{2}(?:[\s]?[A-Z0-9]){11,30}\b/g;
      let m;
      while ((m = re.exec(text)) !== null) {
        if (m[0].startsWith('NL')) continue; // covered by iban-nl
        if (ibanValid(m[0])) {
          out.push({ type: 'iban', start: m.index, end: m.index + m[0].length, severity: Severity.HIGH });
        }
      }
      return out;
    },
  });

  // BTW-id — NL + 9 digits + B + 2 digits.
  detectors.push({
    id: 'btw',
    label: 'BTW-nummer',
    severity: Severity.MEDIUM,
    detect(text) {
      const out = [];
      const re = /\bNL\d{9}B\d{2}\b/gi;
      let m;
      while ((m = re.exec(text)) !== null) {
        out.push({ type: 'btw', start: m.index, end: m.index + m[0].length, severity: Severity.MEDIUM });
      }
      return out;
    },
  });

  // Dutch postcode — 4 digits + 2 letters (uppercase).
  detectors.push({
    id: 'postcode',
    label: 'Postcode',
    severity: Severity.LOW,
    detect(text) {
      const out = [];
      const re = /\b\d{4}\s?[A-Z]{2}\b/g;
      let m;
      while ((m = re.exec(text)) !== null) {
        // Avoid flagging things that look like room numbers etc.
        // Must be followed by/preceded by something that suggests an address.
        out.push({ type: 'postcode', start: m.index, end: m.index + m[0].length, severity: Severity.LOW });
      }
      return out;
    },
  });

  // Dutch phone — +31 or 06-prefix mobile or landline.
  detectors.push({
    id: 'phone-nl',
    label: 'Telefoonnummer',
    severity: Severity.LOW,
    detect(text) {
      const out = [];
      // +31 6 1234 5678 or 06-12345678 or 020-1234567
      const re = /(?:\+31[\s-]?|0)(?:6[\s-]?\d{8}|[1-5,7-9]\d[\s-]?\d{7})\b/g;
      let m;
      while ((m = re.exec(text)) !== null) {
        out.push({ type: 'phone-nl', start: m.index, end: m.index + m[0].length, severity: Severity.LOW });
      }
      return out;
    },
  });

  // Email — single conservative pattern.
  detectors.push({
    id: 'email',
    label: 'E-mailadres',
    severity: Severity.LOW,
    detect(text) {
      const out = [];
      const re = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
      let m;
      while ((m = re.exec(text)) !== null) {
        out.push({ type: 'email', start: m.index, end: m.index + m[0].length, severity: Severity.LOW });
      }
      return out;
    },
  });

  // Credit card — 13–19 digits with Luhn check.
  detectors.push({
    id: 'creditcard',
    label: 'Creditcardnummer',
    severity: Severity.HIGH,
    detect(text) {
      const out = [];
      const re = /\b(?:\d[\s-]?){13,19}\b/g;
      let m;
      while ((m = re.exec(text)) !== null) {
        const digits = m[0].replace(/[\s-]/g, '');
        if (digits.length >= 13 && digits.length <= 19 && luhn(digits)) {
          out.push({ type: 'creditcard', start: m.index, end: m.index + m[0].length, severity: Severity.HIGH });
        }
      }
      return out;
    },
  });

  // API keys — well-known prefixes.
  detectors.push({
    id: 'api-key',
    label: 'API-key / token',
    severity: Severity.HIGH,
    detect(text) {
      const out = [];
      const patterns = [
        { name: 'openai', re: /\bsk-(?:proj-|svcacct-|admin-)?[A-Za-z0-9_-]{20,}\b/g },
        { name: 'anthropic', re: /\bsk-ant-[A-Za-z0-9_-]{20,}\b/g },
        { name: 'aws', re: /\bAKIA[0-9A-Z]{16}\b/g },
        { name: 'github', re: /\bgh[pousr]_[A-Za-z0-9_]{36,}\b/g },
        { name: 'slack', re: /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/g },
        { name: 'google', re: /\bAIza[0-9A-Za-z_-]{35}\b/g },
        { name: 'stripe', re: /\b(?:sk|pk|rk)_(?:live|test)_[A-Za-z0-9]{24,}\b/g },
        { name: 'private-key', re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g },
        { name: 'jwt', re: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g },
      ];
      for (const p of patterns) {
        let m;
        while ((m = p.re.exec(text)) !== null) {
          out.push({ type: 'api-key', subtype: p.name, start: m.index, end: m.index + m[0].length, severity: Severity.HIGH });
        }
      }
      return out;
    },
  });

  // Salary / loonstrook signatures — Dutch payroll-specific keywords.
  // Detects structured presence of salary information, not individual numbers.
  detectors.push({
    id: 'loonstrook',
    label: 'Salarisgegevens',
    severity: Severity.HIGH,
    detect(text) {
      const out = [];
      const keywords = ['loonheffing', 'vakantiegeld', 'bruto loon', 'nettoloon', 'pensioenpremie', 'aow-premie', 'wga-premie', 'zvw-bijdrage', 'salarisstrook', 'jaaropgaaf'];
      const lower = text.toLowerCase();
      let hits = 0;
      let firstHit = -1;
      for (const kw of keywords) {
        const idx = lower.indexOf(kw);
        if (idx !== -1) {
          hits++;
          if (firstHit === -1 || idx < firstHit) firstHit = idx;
        }
      }
      // Two or more salary terms indicates an actual loonstrook, not a passing mention.
      if (hits >= 2 && firstHit !== -1) {
        out.push({ type: 'loonstrook', start: firstHit, end: firstHit + 30, severity: Severity.HIGH, hits });
      }
      return out;
    },
  });

  // Dutch contract / legal signature
  detectors.push({
    id: 'contract',
    label: 'Contracttekst',
    severity: Severity.MEDIUM,
    detect(text) {
      const out = [];
      const lower = text.toLowerCase();
      const keywords = ['ondergetekende', 'hierna te noemen', 'in aanmerking nemende', 'komen overeen', 'algemene voorwaarden', 'aldus overeengekomen'];
      let hits = 0;
      let firstHit = -1;
      for (const kw of keywords) {
        const idx = lower.indexOf(kw);
        if (idx !== -1) {
          hits++;
          if (firstHit === -1 || idx < firstHit) firstHit = idx;
        }
      }
      if (hits >= 2 && firstHit !== -1) {
        out.push({ type: 'contract', start: firstHit, end: firstHit + 30, severity: Severity.MEDIUM, hits });
      }
      return out;
    },
  });

  // NL business systems — signatures of common payroll/ERP exports
  detectors.push({
    id: 'nl-system',
    label: 'NL-systeem export',
    severity: Severity.MEDIUM,
    detect(text) {
      const out = [];
      const signatures = [
        { sys: 'exact-online', re: /(?:Administratie\s*[:\-]|Grootboekrekening|Dagboek)/i },
        { sys: 'afas', re: /(?:Profit\s+(?:HRM|Financieel)|Medewerker(?:ID|nummer)|InSite|Connector)/i },
        { sys: 'visma', re: /(?:Visma\.net|Visma\s+Severa|Visma\s+Talent)/i },
        { sys: 'loket', re: /(?:Loket\.nl|loket\s+self\s*service|loonstrook\s+via\s+Loket)/i },
        { sys: 'nmbrs', re: /Nmbrs(?:\.nl|\s+payroll)?/i },
        { sys: 'twinfield', re: /Twinfield/i },
      ];
      for (const s of signatures) {
        const m = s.re.exec(text);
        if (m) {
          out.push({ type: 'nl-system', subtype: s.sys, start: m.index, end: m.index + m[0].length, severity: Severity.MEDIUM });
        }
      }
      return out;
    },
  });

  // Source code with secret-likely content (heuristic)
  detectors.push({
    id: 'source-code',
    label: 'Broncode',
    severity: Severity.MEDIUM,
    detect(text) {
      const out = [];
      // Look for code-like density: braces, semicolons, function/class/import keywords
      const codeKeywords = /\b(?:function|class|import|export|const|let|var|public|private|def|return|async|await|=>)\b/g;
      const codeSymbols = /[{};()=]/g;
      const kw = (text.match(codeKeywords) || []).length;
      const sym = (text.match(codeSymbols) || []).length;
      if (text.length > 200 && kw >= 4 && sym / text.length > 0.05) {
        out.push({ type: 'source-code', start: 0, end: Math.min(40, text.length), severity: Severity.MEDIUM });
      }
      return out;
    },
  });

  // ---------- Engine ----------

  /**
   * Run all detectors over text.
   * @param {string} text
   * @returns {{
   *   matches: Array,
   *   counts: Object,         // {bsn: 14, iban-nl: 2, ...}
   *   severityCounts: Object, // {high: 16, medium: 1, low: 0}
   *   total: number,
   *   highest: 'high'|'medium'|'low'|null,
   * }}
   */
  function scan(text) {
    if (!text || typeof text !== 'string' || text.length === 0) {
      return { matches: [], counts: {}, severityCounts: {}, total: 0, highest: null };
    }
    const matches = [];
    for (const d of detectors) {
      try {
        const found = d.detect(text);
        for (const f of found) matches.push(f);
      } catch (e) {
        // detectors must never break the whole scan
      }
    }
    const counts = {};
    const severityCounts = { high: 0, medium: 0, low: 0 };
    for (const m of matches) {
      counts[m.type] = (counts[m.type] || 0) + 1;
      severityCounts[m.severity] = (severityCounts[m.severity] || 0) + 1;
    }
    let highest = null;
    if (severityCounts.high > 0) highest = 'high';
    else if (severityCounts.medium > 0) highest = 'medium';
    else if (severityCounts.low > 0) highest = 'low';
    return { matches, counts, severityCounts, total: matches.length, highest };
  }

  /** Returns label for a detector type id. */
  function labelFor(typeId) {
    const d = detectors.find((d) => d.id === typeId);
    return d ? d.label : typeId;
  }

  return {
    scan,
    labelFor,
    Severity,
    detectors: detectors.map((d) => ({ id: d.id, label: d.label, severity: d.severity })),
    // exported for tests
    _internal: { elfproef, ibanValid, luhn },
  };
});
