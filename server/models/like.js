const { pool } = require('../config/db');

async function likeVideo(userId, videoId) {
    // 1. Insert the like
    const insertQuery = `
        INSERT INTO likes (user_id, video_id)
        VALUES ($1, $2)
        RETURNING *;
    `;
    const result = await pool.query(insertQuery, [userId, videoId]);

    // 2. Increment the denormalized like_count on the video
    const updateQuery = `
        UPDATE videos
        SET like_count = like_count + 1
        WHERE id = $1;
    `;
    await pool.query(updateQuery, [videoId]);

    return result.rows[0];
}

async function unlikeVideo(userId, videoId) {
    // 1. Delete the like
    const deleteQuery = `
        DELETE FROM likes
        WHERE user_id = $1 AND video_id = $2
        RETURNING *;
    `;
    const result = await pool.query(deleteQuery, [userId, videoId]);

    // Only decrement if a row was actually deleted
    if (result.rowCount > 0) {
        // 2. Decrement the denormalized like_count
        const updateQuery = `
            UPDATE videos
            SET like_count = like_count - 1
            WHERE id = $1;
        `;
        await pool.query(updateQuery, [videoId]);
    }

    return result.rows[0];
}

async function isLiked(userId, videoId) {
    const query = `
        SELECT EXISTS(
            SELECT 1 FROM likes
            WHERE user_id = $1 AND video_id = $2
        );
    `;
    const result = await pool.query(query, [userId, videoId]);
    return result.rows[0].exists;
}

module.exports = { likeVideo, unlikeVideo, isLiked };