import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, generateApiKey } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { clientIp } from '@/lib/request';
import { auditLog } from '@/lib/audit';

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const userAgent = req.headers.get('user-agent') ?? undefined;

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (user.role !== 'admin') {
    auditLog({
      type: 'access.denied',
      userId: user.id,
      orgId: user.orgId,
      ipAddress: ip,
      userAgent,
      details: { endpoint: 'regenerate-api-key', reason: 'not_admin' },
    });
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const newKey = generateApiKey();
  await prisma.organization.update({
    where: { id: user.orgId },
    data: { apiKey: newKey },
  });

  auditLog({
    type: 'api.apikey.regenerated',
    userId: user.id,
    orgId: user.orgId,
    ipAddress: ip,
    userAgent,
  });

  return NextResponse.json({ apiKey: newKey });
}
