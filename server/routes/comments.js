const express = require('express');
const router = express.Router();
const { createComment, getCommentsByVideo } = require('../models/comment');
const { protect } = require('../middleware/auth');

// Create a comment (Protected)
router.post('/:videoId', protect, async (req, res) => {
    try {
        const { text, parentId } = req.body;
        if (!text) {
            return res.status(400).json({ status: 'fail', message: 'Comment text is required' });
        }
        const comment = await createComment({
            userId: req.user.id,
            videoId: req.params.videoId,
            text,
            parentId: parentId || null
        });
        res.status(201).json({ status: 'success', data: comment });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
});

// Get comments for a video (Public)
router.get('/:videoId', async (req, res) => {
    try {
        const comments = await getCommentsByVideo(req.params.videoId);
        res.status(200).json({ status: 'success', data: comments });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
});

module.exports = router;