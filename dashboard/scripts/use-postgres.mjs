// Mutates prisma/schema.prisma to use postgresql at build time.
// Local dev keeps sqlite (the committed default). Vercel runs this before
// `prisma generate` so the same schema works in both worlds.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const path = resolve(here, '..', 'prisma', 'schema.prisma');
const content = readFileSync(path, 'utf8');
const updated = content.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');

if (updated === content) {
  console.log('[use-postgres] schema.prisma already uses postgresql or sqlite line not found');
  process.exit(0);
}

writeFileSync(path, updated);
console.log('[use-postgres] schema.prisma switched: sqlite -> postgresql');
