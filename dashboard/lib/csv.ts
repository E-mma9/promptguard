// CSV helpers hardened against spreadsheet formula injection (CWE-1236).
//
// Quarterly/export reports are opened by auditors and DPOs in Excel/Sheets.
// A cell beginning with = + - @ (or tab/CR) is interpreted as a formula, so a
// value an attacker controls (e.g. an organisation name set at signup, or a
// team name derived from extension-supplied slugs) could exfiltrate data or
// trigger code execution on the reviewer's machine. We prefix such cells with
// a single quote, then double-quote and escape per RFC 4180.

export function csvCell(value: string | number | null | undefined): string {
  let s = String(value ?? '');
  // Neutralise leading formula triggers (also after a stripped CR/LF).
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  // Escape embedded quotes and wrap.
  return `"${s.replace(/"/g, '""')}"`;
}

export function csvRow(cells: Array<string | number | null | undefined>): string {
  return cells.map(csvCell).join(',');
}

// Safe ASCII filename for Content-Disposition (prevents header injection and
// keeps cross-OS-valid names). Falls back to a constant if nothing survives.
export function safeFilename(name: string, fallback = 'export'): string {
  const cleaned = name
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '_')
    .replace(/^[_.]+|[_.]+$/g, '')
    .slice(0, 80);
  return cleaned || fallback;
}
