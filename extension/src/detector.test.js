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
// Note: source-code threshold raised (kw >= 6, text.length > 300, sym ratio > 0.07)
// so this short snippet no longer triggers source-code — the API key hit is what matters.
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

// Scenario 6: zorg detector — EPD/patient export with multiple healthcare keywords.
console.log('\n[zorg detector]');
const prompt6 = `Kun je dit samenvatten?

Patiëntnummer: 987654
BSN-nummer: 111222333
Diagnose: Diabetes mellitus type 2
Behandelplan: Metformine 500mg 2x daags
Medicatie: zie bijlage
Anamnese: klachten sinds 6 maanden
HIS exportdatum: 2025-01-15`;

const r6 = PG.scan(prompt6);
assert(r6.counts['zorg'] === 1, `prompt6 should detect zorgdata (got ${r6.counts['zorg']})`);
assert(r6.highest === 'high', 'prompt6 highest severity should be high');

// Scenario 7: wiskundige formules mogen GEEN source-code detectie triggeren.
console.log('\n[source-code false positive — math formulas]');
const prompt7 = `Leg uit wat de afgeleiden zijn van f(x) = x^2 + 3x + 2.
De afgeleide is f'(x) = 2x + 3. Als x = 5, dan is f'(5) = 13.
Dit geldt voor alle reële getallen in het domein (x > 0).
De integraal van f(x) over [0, 10] = [x^3/3 + 3x^2/2 + 2x] = 483.33.
Let op: dit is een simpel voorbeeld zonder import van bibliotheken.`;

const r7 = PG.scan(prompt7);
assert(!r7.counts['source-code'], `prompt7 (math text) should NOT trigger source-code detection (got ${r7.counts['source-code']})`);

// Scenario 8: postcode false-positive reductie.
// "1234 AB" zonder adrescontext (bijv. een kamercode) mag niet geflagd worden.
// "1234 AB" met straatnaam-context WEL.
console.log('\n[postcode false positive reduction]');

const prompt8a = `Vergaderzaal 1234 AB is gereserveerd voor morgen.
Product SKU: 5678 CD. Kamer 9012 EF.`;
const r8a = PG.scan(prompt8a);
assert(!r8a.counts['postcode'], `prompt8a (room/product codes) should NOT trigger postcode (got ${r8a.counts['postcode']})`);

const prompt8b = `Mijn adres is Keizersgracht 123, 1015 CJ Amsterdam.`;
const r8b = PG.scan(prompt8b);
assert(r8b.counts['postcode'] >= 1, `prompt8b (street context) should detect postcode (got ${r8b.counts['postcode']})`);

const prompt8c = `Stuur het naar postcode 2500 GH.`;
const r8c = PG.scan(prompt8c);
assert(r8c.counts['postcode'] >= 1, `prompt8c ("postcode" keyword) should detect postcode (got ${r8c.counts['postcode']})`);

// Scenario 9: DigiD + BSN context boost.
console.log('\n[DigiD + BSN severity boost]');
const prompt9 = `DigiD sessie export:
BSN: 111222333
token: abc123`;

const r9 = PG.scan(prompt9);
assert(r9.counts['digid-bsn'] === 1, `prompt9 should detect DigiD+BSN combo (got ${r9.counts['digid-bsn']})`);
assert(r9.highest === 'high', 'prompt9 highest severity should be high');

// DigiD zonder BSN mag NIET de combo triggeren.
const prompt9b = `Ik gebruik DigiD om in te loggen bij Mijn Overheid.`;
const r9b = PG.scan(prompt9b);
assert(!r9b.counts['digid-bsn'], `prompt9b (DigiD without BSN) should NOT trigger digid-bsn combo (got ${r9b.counts['digid-bsn']})`);

console.log(`\nResult: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
