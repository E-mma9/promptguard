/**
 * Smoke tests for the detection engine.
 * Run with: node detector.test.js
 */

const PG = require('./detector.js');

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

console.log('\n[checksum primitives]');

// Test BSN elfproef with publicly published test BSNs.
const validTestBSNs = ['111222333', '123456782', '999995571'];
const invalidBSNs = ['987654321', '123456789', '000000000'];
for (const b of validTestBSNs) {
  assert(PG._internal.elfproef(b), `BSN ${b} should pass elfproef`);
}
for (const b of invalidBSNs) {
  assert(!PG._internal.elfproef(b) || b === '000000000', `BSN ${b} should fail elfproef or be filtered`);
}

// Test NL IBAN mod-97 (these are the canonical test IBANs).
const validIBANs = ['NL91ABNA0417164300', 'NL69INGB0123456789', 'GB82WEST12345698765432', 'DE89370400440532013000'];
const invalidIBANs = ['NL00ABNA0000000000', 'NL91ABNA0417164301'];
for (const i of validIBANs) {
  assert(PG._internal.ibanValid(i), `IBAN ${i} should pass mod-97`);
}
for (const i of invalidIBANs) {
  assert(!PG._internal.ibanValid(i), `IBAN ${i} should fail mod-97`);
}

// Test Luhn for credit cards.
assert(PG._internal.luhn('4242424242424242'), 'CC 4242... should pass Luhn');
assert(PG._internal.luhn('5555555555554444'), 'CC 5555... should pass Luhn');
assert(!PG._internal.luhn('1234567890123456'), 'CC 1234... should fail Luhn');

console.log('\n[full scan: realistic prompts]');

// Scenario 1: a marketing employee pasting a customer list with BSNs.
const prompt1 = `Hoi ChatGPT, kun je deze klantenlijst samenvatten?

Naam: Jan de Vries, BSN 111222333, IBAN NL91ABNA0417164300
Naam: Marie Janssen, BSN 123456782, IBAN NL69INGB0123456789
Bedrijf: Acme BV, KvK: 12345678
Postadres: Keizersgracht 123, 1015 CJ Amsterdam`;

const r1 = PG.scan(prompt1);
assert(r1.counts['bsn'] >= 2, `prompt1 should detect 2 BSNs (got ${r1.counts['bsn']})`);
assert(r1.counts['iban-nl'] >= 2, `prompt1 should detect 2 NL IBANs (got ${r1.counts['iban-nl']})`);
assert(r1.counts['kvk'] === 1, `prompt1 should detect 1 KvK (got ${r1.counts['kvk']})`);
assert(r1.counts['postcode'] >= 1, `prompt1 should detect 1 postcode (got ${r1.counts['postcode']})`);
assert(r1.highest === 'high', 'prompt1 highest severity should be high');

// Scenario 2: a developer pasting code with an API key.
const prompt2 = `Why does this not work?

const client = new OpenAI({
  apiKey: "sk-proj-AbCdEf1234567890AbCdEf1234567890ZYXW",
});
async function ask() {
  return await client.chat.completions.create({ model: "gpt-4" });
}`;

const r2 = PG.scan(prompt2);
assert(r2.counts['api-key'] === 1, `prompt2 should detect 1 API key (got ${r2.counts['api-key']})`);
assert(r2.counts['source-code'] === 1, `prompt2 should detect source code (got ${r2.counts['source-code']})`);
assert(r2.highest === 'high', 'prompt2 highest severity should be high');

// Scenario 3: a finance employee pasting a salary slip.
const prompt3 = `Kun je deze loonstrook controleren?

Werknemer: P. Bakker
Bruto loon: 4.250,00
Loonheffing: 1.234,00
Pensioenpremie: 245,00
Vakantiegeld reservering: 340,00
Nettoloon: 2.671,00
IBAN: NL91ABNA0417164300
Bron: AFAS Profit HRM`;

const r3 = PG.scan(prompt3);
assert(r3.counts['loonstrook'] === 1, `prompt3 should detect loonstrook (got ${r3.counts['loonstrook']})`);
assert(r3.counts['iban-nl'] === 1, `prompt3 should detect 1 NL IBAN (got ${r3.counts['iban-nl']})`);
assert(r3.counts['nl-system'] >= 1, `prompt3 should detect AFAS (got ${r3.counts['nl-system']})`);
assert(r3.highest === 'high', 'prompt3 highest severity should be high');

// Scenario 4: a benign chat — should produce no high-severity hits.
const prompt4 = `What's the difference between TypeScript generics and Java generics?`;
const r4 = PG.scan(prompt4);
assert(r4.severityCounts.high === 0, `prompt4 should have no high-severity hits (got ${r4.severityCounts.high})`);

// Scenario 5: a contract.
const prompt5 = `Kun je dit contract korter maken?

De ondergetekende, Acme BV, hierna te noemen "Opdrachtgever", in aanmerking nemende dat partijen een samenwerking willen aangaan, komen overeen het volgende.`;
const r5 = PG.scan(prompt5);
assert(r5.counts['contract'] === 1, `prompt5 should detect contract (got ${r5.counts['contract']})`);

console.log(`\nResult: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
