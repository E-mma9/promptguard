import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, createSession, setSessionCookie, generateApiKey } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null) as {
    organizationName?: string;
    email?: string;
    password?: string;
    name?: string;
    acceptedTerms?: boolean;
  } | null;

  const organizationName = body?.organizationName?.trim();
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? '';
  const name = body?.name?.trim() || null;

  if (!organizationName || organizationName.length < 2) {
    return NextResponse.json({ error: 'Organisatienaam is verplicht' }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Geldig e-mailadres is verplicht' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Wachtwoord moet minimaal 8 tekens zijn' }, { status: 400 });
  }
  if (!body?.acceptedTerms) {
    return NextResponse.json({ error: 'Verwerkersovereenkomst moet worden geaccepteerd' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Een account met dit e-mailadres bestaat al' }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const apiKey = generateApiKey();

  const result = await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: { name: organizationName, apiKey },
    });
    const user = await tx.user.create({
      data: {
        orgId: org.id,
        email,
        passwordHash,
        name,
        role: 'admin',
      },
    });
    return { org, user };
  });

  const token = await createSession(result.user.id);
  await setSessionCookie(token);

  return NextResponse.json({ ok: true, redirectTo: '/dashboard/welcome' });
}
