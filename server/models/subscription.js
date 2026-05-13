const { pool } = require('../config/db');

async function subscribe(userId, channelId) {
    // 1. Insert the subscription
    const insertQuery = `
        INSERT INTO subscriptions (user_id, channel_id)
        VALUES ($1, $2)
        RETURNING *;
    `;
    const result = await pool.query(insertQuery, [userId, channelId]);

    // 2. Increment the denormalized subscriber_count on the channel
    const updateQuery = `
        UPDATE channels
        SET subscriber_count = subscriber_count + 1
        WHERE id = $1;
    `;
    await pool.query(updateQuery, [channelId]);

    return result.rows[0];
}

async function unsubscribe(userId, channelId) {
    // 1. Delete the subscription
    const deleteQuery = `
        DELETE FROM subscriptions
        WHERE user_id = $1 AND channel_id = $2
        RETURNING *;
    `;
    const result = await pool.query(deleteQuery, [userId, channelId]);

    // Only decrement if a row was actually deleted
    if (result.rowCount > 0) {
        // 2. Decrement the denormalized subscriber_count
        const updateQuery = `
            UPDATE channels
            SET subscriber_count = subscriber_count - 1
            WHERE id = $1;
        `;
        await pool.query(updateQuery, [channelId]);
    }

    return result.rows[0];
}

async function isSubscribed(userId, channelId) {
    const query = `
        SELECT EXISTS(
            SELECT 1 FROM subscriptions
            WHERE user_id = $1 AND channel_id = $2
        );
    `;
    const result = await pool.query(query, [userId, channelId]);
    return result.rows[0].exists;
}

module.exports = { subscribe, unsubscribe, isSubscribed };