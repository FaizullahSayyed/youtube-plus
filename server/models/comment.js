const { pool } = require('../config/db');

async function createComment({ userId, videoId, text, parentId }) {
    // 1. Insert the comment
    const insertQuery = `
        INSERT INTO comments (user_id, video_id, text, parent_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const result = await pool.query(insertQuery, [userId, videoId, text, parentId]);
    const newComment = result.rows[0];

    // 2. Increment the denormalized comment_count on the video
    const updateQuery = `
        UPDATE videos
        SET comment_count = comment_count + 1
        WHERE id = $1;
    `;
    await pool.query(updateQuery, [videoId]);

    // 3. Fetch the comment with user data to return to the frontend
    const fetchQuery = `
        SELECT c.*, u.username, u.avatar_url
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.id = $1;
    `;
    const finalResult = await pool.query(fetchQuery, [newComment.id]);

    return finalResult.rows[0];
}

async function getCommentsByVideo(videoId) {
    const query = `
        SELECT c.*, u.username, u.avatar_url
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.video_id = $1 AND c.is_deleted = false
        ORDER BY c.created_at DESC;
    `;
    const result = await pool.query(query, [videoId]);
    return result.rows;
}

module.exports = { createComment, getCommentsByVideo };