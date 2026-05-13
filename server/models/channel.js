const { pool } = require('../config/db');

async function getAllChannels() {
  const query = `
    SELECT c.id,
           c.user_id,
           c.name,
           c.description,
           c.created_at,
           u.username AS owner_name
    FROM channels c
    JOIN users u ON c.user_id = u.id
    ORDER BY c.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
}

async function getChannelById(id) {
  const query = `
    SELECT c.id,
           c.user_id,
           c.name,
           c.description,
           c.created_at,
           u.username AS owner_name
    FROM channels c
    JOIN users u ON c.user_id = u.id
    WHERE c.id = $1
  `;
  const values = [id];

  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function createChannel({ user_id, name, description }) {
  const query = `
    INSERT INTO channels (user_id, name, description)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, name, description, created_at
  `;
  const values = [user_id, name, description];

  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = {
  getAllChannels,
  getChannelById,
  createChannel,
};
