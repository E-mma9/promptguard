// Translation tables for type ids and tool ids → Dutch labels.

export const TYPE_LABELS: Record<string, string> = {
  'bsn': 'BSN',
  'rsin': 'RSIN',
  'kvk': 'KvK-nummer',
  'iban-nl': 'IBAN (NL)',
  'iban': 'IBAN (overig)',
  'btw': 'BTW-nummer',
  'postcode': 'Postcode',
  'phone-nl': 'Telefoonnummer',
  'email': 'E-mailadres',
  'creditcard': 'Creditcardnummer',
  'api-key': 'API-key / token',
  'loonstrook': 'Salarisgegevens',
  'contract': 'Contracttekst',
  'nl-system': 'NL-systeem export',
  'source-code': 'Broncode',
};

export const TYPE_SEVERITY: Record<string, 'high' | 'medium' | 'low'> = {
  'bsn': 'high',
  'rsin': 'high',
  'kvk': 'medium',
  'iban-nl': 'high',
  'iban': 'high',
  'btw': 'medium',
  'postcode': 'low',
  'phone-nl': 'low',
  'email': 'low',
  'creditcard': 'high',
  'api-key': 'high',
  'loonstrook': 'high',
  'contract': 'medium',
  'nl-system': 'medium',
  'source-code': 'medium',
};

export const TOOL_LABELS: Record<string, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  copilot: 'Copilot',
  mistral: 'Mistral',
  perplexity: 'Perplexity',
  you: 'You.com',
  unknown: 'Onbekend',
};

export const TOOL_VENDORS: Record<string, string> = {
  chatgpt: 'OpenAI',
  claude: 'Anthropic',
  gemini: 'Google',
  copilot: 'Microsoft',
  mistral: 'Mistral AI',
  perplexity: 'Perplexity',
  you: 'You.com',
};

export const SEVERITY_LABELS: Record<string, string> = {
  high: 'Kritiek',
  medium: 'Gevoelig',
  low: 'Laag',
};

export const ACTION_LABELS: Record<string, string> = {
  monitored: 'Geregistreerd',
  warned: 'Waarschuwing getoond',
  blocked: 'Geblokkeerd',
};

export function typeLabel(id: string) {
  return TYPE_LABELS[id] ?? id;
}
export function toolLabel(id: string) {
  return TOOL_LABELS[id] ?? id;
}
export function severityLabel(id: string) {
  return SEVERITY_LABELS[id] ?? id;
}
