/**
 * PromptGuard demo seed.
 *
 * Creates a demo organization, admin login, six teams, and 60 days of realistic
 * detection events across all AI tools. Useful for the 10-minute demo without
 * having to install the extension first.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

type TeamProfile = {
  slug: string;
  name: string;
  weight: number;          // events per day baseline
  toolMix: Record<string, number>;
  typeMix: Record<string, number>; // probability of each type appearing
  severitySkew: 'high' | 'medium' | 'low';
};

const TEAMS: TeamProfile[] = [
  {
    slug: 'marketing', name: 'Marketing', weight: 18,
    toolMix: { chatgpt: 0.55, claude: 0.18, gemini: 0.12, copilot: 0.06, perplexity: 0.09 },
    typeMix: { email: 0.7, postcode: 0.6, 'phone-nl': 0.4, bsn: 0.05, 'iban-nl': 0.08, contract: 0.12 },
    severitySkew: 'low',
  },
  {
    slug: 'sales', name: 'Sales', weight: 14,
    toolMix: { chatgpt: 0.48, claude: 0.22, gemini: 0.10, copilot: 0.16, perplexity: 0.04 },
    typeMix: { email: 0.7, 'phone-nl': 0.55, kvk: 0.35, btw: 0.20, contract: 0.18, 'iban-nl': 0.12 },
    severitySkew: 'medium',
  },
  {
    slug: 'finance', name: 'Finance', weight: 11,
    toolMix: { chatgpt: 0.42, claude: 0.18, copilot: 0.32, gemini: 0.06, perplexity: 0.02 },
    typeMix: { 'iban-nl': 0.6, btw: 0.45, kvk: 0.5, loonstrook: 0.25, 'nl-system': 0.4, bsn: 0.18, creditcard: 0.04 },
    severitySkew: 'high',
  },
  {
    slug: 'engineering', name: 'Engineering', weight: 21,
    toolMix: { chatgpt: 0.36, claude: 0.40, copilot: 0.20, gemini: 0.04 },
    typeMix: { 'source-code': 0.85, 'api-key': 0.18, email: 0.25, postcode: 0.05, 'iban-nl': 0.02 },
    severitySkew: 'medium',
  },
  {
    slug: 'hr', name: 'HR', weight: 8,
    toolMix: { chatgpt: 0.55, claude: 0.20, copilot: 0.18, gemini: 0.07 },
    typeMix: { bsn: 0.55, loonstrook: 0.65, 'nl-system': 0.35, contract: 0.30, 'iban-nl': 0.40, email: 0.6, 'phone-nl': 0.45 },
    severitySkew: 'high',
  },
  {
    slug: 'customer-success', name: 'Customer Success', weight: 12,
    toolMix: { chatgpt: 0.62, claude: 0.18, gemini: 0.12, copilot: 0.04, perplexity: 0.04 },
    typeMix: { email: 0.85, 'phone-nl': 0.65, postcode: 0.50, kvk: 0.18, contract: 0.10 },
    severitySkew: 'low',
  },
];

const TYPE_SEVERITY: Record<string, 'high' | 'medium' | 'low'> = {
  bsn: 'high', rsin: 'high', kvk: 'medium', 'iban-nl': 'high', iban: 'high',
  btw: 'medium', postcode: 'low', 'phone-nl': 'low', email: 'low',
  creditcard: 'high', 'api-key': 'high', loonstrook: 'high',
  contract: 'medium', 'nl-system': 'medium', 'source-code': 'medium',
};

function pickWeighted<T extends string>(weights: Record<T, number>): T {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (const [k, w] of Object.entries(weights)) {
    r -= w as number;
    if (r <= 0) return k as T;
  }
  return Object.keys(weights)[0] as T;
}

function poisson(lambda: number) {
  let L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

function genApiKey(): string {
  return 'pg_live_' + crypto.randomBytes(24).toString('base64url');
}

function genInstallId(): string {
  return crypto.randomBytes(32).toString('hex');
}

async function main() {
  console.log('Seeding PromptGuard demo data…');

  // Reset for idempotent seeds
  const existing = await prisma.organization.findFirst({ where: { name: 'Demo Bedrijf BV' } });
  if (existing) {
    await prisma.detection.deleteMany({ where: { orgId: existing.id } });
    await prisma.team.deleteMany({ where: { orgId: existing.id } });
    await prisma.user.deleteMany({ where: { orgId: existing.id } });
    await prisma.organization.delete({ where: { id: existing.id } });
    console.log('  cleared existing demo data');
  }

  const apiKey = genApiKey();
  const org = await prisma.organization.create({
    data: { name: 'Demo Bedrijf BV', apiKey },
  });
  console.log(`  created organization "${org.name}"`);

  const passwordHash = await bcrypt.hash('demo1234', 10);
  await prisma.user.create({
    data: {
      orgId: org.id,
      email: 'admin@demo.nl',
      passwordHash,
      name: 'Demo Admin',
      role: 'admin',
    },
  });
  console.log('  created user admin@demo.nl (password: demo1234)');

  const teamRecords = await Promise.all(
    TEAMS.map((t) => prisma.team.create({ data: { orgId: org.id, name: t.name, slug: t.slug } }))
  );
  const teamIdBySlug = new Map(teamRecords.map((t, i) => [TEAMS[i].slug, t.id]));
  console.log(`  created ${teamRecords.length} teams`);

  // Generate detections over 60 days
  const days = 60;
  const now = new Date();
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const installIdsByTeam = new Map(TEAMS.map((t) => [
    t.slug,
    Array.from({ length: 3 + Math.floor(Math.random() * 4) }, () => genInstallId()),
  ]));

  const events: Array<{
    orgId: string; teamId: string | null; installId: string; tool: string;
    source: string; action: string; counts: string; severityCounts: string;
    totalItems: number; highest: string; characterCount: number; detectedAt: Date;
  }> = [];

  for (let d = 0; d < days; d++) {
    const day = new Date(start.getTime() + d * 24 * 60 * 60 * 1000);
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    const dayMultiplier = isWeekend ? 0.3 : 1.0;

    for (const team of TEAMS) {
      const eventsToday = Math.max(0, poisson(team.weight * dayMultiplier));
      const installIds = installIdsByTeam.get(team.slug)!;

      for (let i = 0; i < eventsToday; i++) {
        const tool = pickWeighted(team.toolMix);
        const installId = installIds[Math.floor(Math.random() * installIds.length)];

        // Roll which types appear in this event
        const counts: Record<string, number> = {};
        for (const [type, prob] of Object.entries(team.typeMix)) {
          if (Math.random() < prob) {
            const max = type === 'source-code' ? 1
              : type === 'loonstrook' || type === 'contract' || type === 'nl-system' ? 1
              : type === 'bsn' ? Math.ceil(Math.random() * 25)
              : type === 'iban-nl' ? Math.ceil(Math.random() * 8)
              : type === 'email' || type === 'phone-nl' ? Math.ceil(Math.random() * 12)
              : Math.ceil(Math.random() * 5);
            counts[type] = max;
          }
        }
        if (Object.keys(counts).length === 0) {
          counts['email'] = 1; // ensure at least one detection
        }

        let highest: 'high' | 'medium' | 'low' = 'low';
        const severityCounts = { high: 0, medium: 0, low: 0 };
        let totalItems = 0;
        for (const [type, n] of Object.entries(counts)) {
          const sev = TYPE_SEVERITY[type] ?? 'low';
          severityCounts[sev] += n;
          totalItems += n;
          if (sev === 'high') highest = 'high';
          else if (sev === 'medium' && highest !== 'high') highest = 'medium';
        }

        let action: 'monitored' | 'warned' | 'blocked';
        const r = Math.random();
        if (highest === 'high') {
          action = r < 0.45 ? 'warned' : r < 0.55 ? 'blocked' : 'monitored';
        } else if (highest === 'medium') {
          action = r < 0.30 ? 'warned' : 'monitored';
        } else {
          action = 'monitored';
        }

        const hour = isWeekend
          ? 9 + Math.floor(Math.random() * 6)
          : 8 + Math.floor(Math.random() * 11);
        const minute = Math.floor(Math.random() * 60);
        const detectedAt = new Date(day);
        detectedAt.setHours(hour, minute, Math.floor(Math.random() * 60), 0);

        events.push({
          orgId: org.id,
          teamId: teamIdBySlug.get(team.slug) ?? null,
          installId,
          tool,
          source: Math.random() < 0.7 ? 'paste' : 'submit',
          action,
          counts: JSON.stringify(counts),
          severityCounts: JSON.stringify(severityCounts),
          totalItems,
          highest,
          characterCount: 50 + Math.floor(Math.random() * 8000),
          detectedAt,
        });
      }
    }
  }

  // Bulk insert
  const BATCH = 500;
  for (let i = 0; i < events.length; i += BATCH) {
    await prisma.detection.createMany({ data: events.slice(i, i + BATCH) });
  }
  console.log(`  created ${events.length} detection events over ${days} days`);

  console.log('\n  Demo login:    admin@demo.nl / demo1234');
  console.log('  API key:       ' + apiKey);
  console.log('  Dashboard URL: http://localhost:3000/dashboard\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
