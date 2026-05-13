const express = require('express');
const router = express.Router();
const { subscribe, unsubscribe, isSubscribed } = require('../models/subscription');
const { protect } = require('../middleware/auth');

// Subscribe to a channel
router.post('/:channelId/subscribe', protect, async (req, res) => {
    try {
        const subscription = await subscribe(req.user.id, req.params.channelId);
        res.status(200).json({ status: 'success', data: subscription });
    } catch (error) {
        if (error.code === '23505') { // PostgreSQL unique violation (already subscribed)
            return res.status(409).json({ status: 'fail', message: 'Already subscribed' });
        }
        res.status(400).json({ status: 'fail', message: error.message });
    }
});

// Unsubscribe from a channel
router.post('/:channelId/unsubscribe', protect, async (req, res) => {
    try {
        await unsubscribe(req.user.id, req.params.channelId);
        res.status(200).json({ status: 'success', message: 'Unsubscribed successfully' });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
});

// Check if subscribed
router.get('/check/:channelId', protect, async (req, res) => {
    try {
        const result = await isSubscribed(req.user.id, req.params.channelId);
        res.status(200).json({ status: 'success', isSubscribed: result });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
});

module.exports = router;