import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function GET() {
  let dbStatus = 'healthy';
  let redisStatus = 'healthy';

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err: any) {
    dbStatus = `unhealthy: ${err.message}`;
  }

  try {
    await redis.ping();
  } catch (err: any) {
    redisStatus = `unhealthy: ${err.message}`;
  }

  const isHealthy = !dbStatus.startsWith('unhealthy') && !redisStatus.startsWith('unhealthy');

  return NextResponse.json(
    {
      status: isHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        cache: redisStatus,
      },
    },
    { status: isHealthy ? 200 : 503 }
  );
}
