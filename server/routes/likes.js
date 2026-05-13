const express = require('express');
const router = express.Router();
const { likeVideo, unlikeVideo, isLiked } = require('../models/like');
const { protect } = require('../middleware/auth');

// Like a video
router.post('/:videoId/like', protect, async (req, res) => {
    try {
        const like = await likeVideo(req.user.id, req.params.videoId);
        res.status(200).json({ status: 'success', data: like });
    } catch (error) {
        if (error.code === '23505') { // Already liked
            return res.status(409).json({ status: 'fail', message: 'Already liked' });
        }
        res.status(400).json({ status: 'fail', message: error.message });
    }
});

// Unlike a video
router.post('/:videoId/unlike', protect, async (req, res) => {
    try {
        await unlikeVideo(req.user.id, req.params.videoId);
        res.status(200).json({ status: 'success', message: 'Unliked successfully' });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
});

// Check if liked
router.get('/check/:videoId', protect, async (req, res) => {
    try {
        const result = await isLiked(req.user.id, req.params.videoId);
        res.status(200).json({ status: 'success', isLiked: result });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
});

module.exports = router;