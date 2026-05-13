const { createClient } = require('redis');
const env = require('./env');

const redisClient = createClient({
  url: env.REDIS_URL,
});

// Handle Redis errors
redisClient.on('error', (err) => {
  console.error('❌ Redis client error:', err.message);
});

redisClient.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...');
});

/**
 * Connect to Redis and verify connection
 */
async function connectRedis() {
  try {
    await redisClient.connect();
    const pong = await redisClient.ping();
    console.log('✅ Redis connected:', pong);
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    throw error;
  }
}

module.exports = {
  redisClient,
  connectRedis,
};
