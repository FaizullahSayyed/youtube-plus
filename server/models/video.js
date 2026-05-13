const { pool } = require('../config/db');

async function getAllVideos() {
  const query = `
    SELECT v.id,
           v.channel_id,
           c.name AS channel_name,
           v.title,
           v.description,
           v.video_url,
           v.thumbnail_url,
           v.duration,
           v.created_at
    FROM videos v
    JOIN channels c ON v.channel_id = c.id
    ORDER BY v.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
}

async function getVideoById(id) {
  const query = `
    SELECT v.id,
           v.channel_id,
           c.name AS channel_name,
           v.title,
           v.description,
           v.video_url,
           v.thumbnail_url,
           v.duration,
           v.created_at
    FROM videos v
    JOIN channels c ON v.channel_id = c.id
    WHERE v.id = $1
  `;
  const values = [id];

  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function getVideosByChannel(channelId) {
  const query = `
    SELECT v.id,
           v.channel_id,
           c.name AS channel_name,
           v.title,
           v.description,
           v.video_url,
           v.thumbnail_url,
           v.duration,
           v.created_at
    FROM videos v
    JOIN channels c ON v.channel_id = c.id
    WHERE v.channel_id = $1
    ORDER BY v.created_at DESC
  `;
  const values = [channelId];

  const result = await pool.query(query, values);
  return result.rows;
}

async function createVideo({ channel_id, title, description, video_url, thumbnail_url, duration }) {
  const query = `
    INSERT INTO videos (channel_id, title, description, video_url, thumbnail_url, duration)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, channel_id, title, description, video_url, thumbnail_url, duration, created_at
  `;
  const values = [channel_id, title, description, video_url, thumbnail_url, duration];

  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = {
  getAllVideos,
  getVideoById,
  getVideosByChannel,
  createVideo,
};
