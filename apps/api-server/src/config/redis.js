// ─── Redis Client Configuration ─────────────────────────────
const Redis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

/**
 * Primary Redis client for caching, pub/sub, and general operations.
 */
const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,   // Required for BullMQ compatibility
  enableReadyCheck: true,
  retryStrategy(times) {
    const delay = Math.min(times * 200, 5000);
    console.log(`🔄  Redis reconnecting in ${delay}ms (attempt ${times})`);
    return delay;
  },
});

redis.on('connect', () => {
  console.log('✅  Redis connected successfully');
});

redis.on('error', (err) => {
  console.error('❌  Redis connection error:', err.message);
});

/**
 * Create a duplicate Redis connection (for BullMQ workers, subscribers, etc.)
 * BullMQ requires separate connections for queue and worker.
 * @returns {Redis} A new Redis instance
 */
function createRedisConnection() {
  return new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    retryStrategy(times) {
      const delay = Math.min(times * 200, 5000);
      return delay;
    },
  });
}

module.exports = { redis, createRedisConnection };
