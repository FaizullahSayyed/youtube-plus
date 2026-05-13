const { pool } = require('../config/db');

async function findByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];

  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function findById(id) {
  const query = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
  const values = [id];

  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function createUser({ username, email, password_hash }) {
  const query = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, created_at
  `;
  const values = [username, email, password_hash];

  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = {
  findByEmail,
  findById,
  createUser,
};
