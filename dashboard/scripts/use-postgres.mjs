// Mutates prisma/schema.prisma to use postgresql at build time.
// Local dev keeps sqlite (the committed default). Vercel runs this before
// `prisma generate` so the same schema works in both worlds.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const path = resolve(here, '..', 'prisma', 'schema.prisma');
const content = readFileSync(path, 'utf8');

// Only touch the provider INSIDE the `datasource db { ... }` block. The file
// also mentions `provider = "sqlite"` in an explanatory comment, so a naive
// first-match replace would rewrite the comment and leave the real datasource
// on sqlite — silently breaking the Vercel/Postgres build.
const updated = content.replace(
  /(datasource\s+db\s*\{[^}]*?provider\s*=\s*)"sqlite"/,
  '$1"postgresql"'
);

if (updated === content) {
  if (/datasource\s+db\s*\{[^}]*?provider\s*=\s*"postgresql"/.test(content)) {
    console.log('[use-postgres] schema.prisma already uses postgresql');
    process.exit(0);
  }
  console.error('[use-postgres] ERROR: could not find provider = "sqlite" in the datasource db block');
  process.exit(1);
}

writeFileSync(path, updated);
console.log('[use-postgres] schema.prisma switched: sqlite -> postgresql');
