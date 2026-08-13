import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const destinationId = searchParams.get('destinationId');
  const cacheKey = `cache:guides:${destinationId || 'all'}`;

  try {
    const cachedData = await redis.get(cacheKey).catch(() => null);
    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData), {
        headers: { 'X-Cache': 'HIT' },
      });
    }

    const guides = await prisma.localGuide.findMany({
      orderBy: { rating: 'desc' },
    });

    const filteredGuides = destinationId
      ? guides.filter((g) => {
          const destIds = (g.destinationIds as string[]) || [];
          return destIds.includes(destinationId);
        })
      : guides;

    await redis.setex(cacheKey, 300, JSON.stringify(filteredGuides)).catch(() => {});

    return NextResponse.json(filteredGuides, {
      headers: { 'X-Cache': 'MISS' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch guides' }, { status: 500 });
  }
}
