import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = createClient({ 
  url: redisUrl,
  socket: {
    connectTimeout: 2000, // 2 second timeout
    reconnectStrategy: false, // Don't retry on failure
  }
});

redis.on('error', (err) => {
  // Silently ignore errors if Redis is not available
  if (err.code !== 'ECONNREFUSED') {
    console.error('Redis Client Error', err);
  }
});

export async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
}
