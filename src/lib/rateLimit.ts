import { redis } from './redis';

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Redis-backed sliding window rate limiter
 * @param identifier e.g., IP address or User ID
 * @param limit Max allowed requests within window
 * @param windowSeconds Window duration in seconds
 */
export async function rateLimit(
  identifier: string,
  limit: number = 60,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const clearBefore = now - windowSeconds * 1000;

  try {
    if (redis.status !== 'ready' && redis.status !== 'connecting') {
      await redis.connect().catch(() => {});
    }

    const multi = redis.multi();
    multi.zremrangebyscore(key, 0, clearBefore);
    multi.zadd(key, now, `${now}-${Math.random()}`);
    multi.zcard(key);
    multi.expire(key, windowSeconds);

    const results = await multi.exec();
    const requestCount = (results?.[2]?.[1] as number) || 1;

    const remaining = Math.max(0, limit - requestCount);
    const success = requestCount <= limit;

    return {
      success,
      limit,
      remaining,
      reset: Math.ceil((now + windowSeconds * 1000) / 1000),
    };
  } catch (error) {
    // If Redis fails, gracefully fail open so app continues serving
    console.warn('Rate limiter fallback triggered:', error);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Math.ceil((now + windowSeconds * 1000) / 1000),
    };
  }
}
