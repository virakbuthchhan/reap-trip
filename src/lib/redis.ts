import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) {
        return null; // Stop retrying if Redis is not running
      }
      return Math.min(times * 100, 2000);
    },
  });

redis.on('error', (err) => {
  console.warn('⚠️ Redis Connection Warning:', err.message);
});

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;
