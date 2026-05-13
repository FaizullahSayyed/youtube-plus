require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

// Validate critical environment variables
const requiredVars = ['DATABASE_URL', 'REDIS_URL', 'JWT_SECRET'];
const missingVars = requiredVars.filter(varName => !env[varName]);

if (missingVars.length > 0) {
  console.error(
    `❌ FATAL ERROR: Missing required environment variables: ${missingVars.join(', ')}`
  );
  console.error('Please set these in your .env file before starting the server.');
  process.exit(1);
}

module.exports = env;
