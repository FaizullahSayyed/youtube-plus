const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Handle connection errors
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
});

/**
 * Test the PostgreSQL database connection
 */
async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected:', result.rows[0]);
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    throw error;
  }
}

module.exports = {
  pool,
  testConnection,
};
