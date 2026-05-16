import { NextResponse } from 'next/server';
import { getCurrentUser, generateApiKey } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const newKey = generateApiKey();
  await prisma.organization.update({
    where: { id: user.orgId },
    data: { apiKey: newKey },
  });

  console.log(
    JSON.stringify({
      audit: {
        type: 'settings.apikey.regenerated',
        userId: user.id,
        orgId: user.orgId,
        timestamp: new Date().toISOString(),
      },
    })
  );

  return NextResponse.json({ apiKey: newKey });
}
