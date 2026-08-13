import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');
  const province = searchParams.get('province');
  const search = searchParams.get('search');

  const cacheKey = `cache:destinations:${category || 'all'}:${difficulty || 'all'}:${province || 'all'}:${search || 'none'}`;

  try {
    // Check Redis cache first
    const cachedData = await redis.get(cacheKey).catch(() => null);
    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData), {
        headers: { 'X-Cache': 'HIT' },
      });
    }

    const where: any = {};
    if (category && category !== 'all') {
      where.category = category;
    }
    if (difficulty && difficulty !== 'all') {
      where.difficulty = difficulty;
    }
    if (province && province !== 'all') {
      where.OR = [
        { provinceEn: { contains: province, mode: 'insensitive' } },
        { provinceKm: { contains: province, mode: 'insensitive' } },
      ];
    }
    if (search) {
      where.OR = [
        { nameEn: { contains: search, mode: 'insensitive' } },
        { nameKm: { contains: search, mode: 'insensitive' } },
        { descriptionEn: { contains: search, mode: 'insensitive' } },
        { descriptionKm: { contains: search, mode: 'insensitive' } },
      ];
    }

    const rawDestinations = await prisma.destination.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const destinations = rawDestinations.map((dest) => ({
      ...dest,
      coordinates: { lat: dest.lat, lng: dest.lng },
    }));

    // Cache result in Redis for 5 minutes (300 seconds)
    await redis.setex(cacheKey, 300, JSON.stringify(destinations)).catch(() => {});

    return NextResponse.json(destinations, {
      headers: { 'X-Cache': 'MISS' },
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}
