const express = require('express');
const { getAllVideos, getVideoById, getVideosByChannel, createVideo } = require('../models/video');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const videos = await getAllVideos();
    return res.status(200).json({ status: 'success', data: videos });
  } catch (error) {
    console.error('Get videos error:', error);
    return res.status(500).json({ status: 'error', message: 'Unable to fetch videos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const video = await getVideoById(req.params.id);
    if (!video) {
      return res.status(404).json({ status: 'fail', message: 'Video not found' });
    }

    return res.status(200).json({ status: 'success', data: video });
  } catch (error) {
    console.error('Get video error:', error);
    return res.status(500).json({ status: 'error', message: 'Unable to fetch video' });
  }
});

router.get('/channel/:channelId', async (req, res) => {
  try {
    const videos = await getVideosByChannel(req.params.channelId);
    return res.status(200).json({ status: 'success', data: videos });
  } catch (error) {
    console.error('Get videos by channel error:', error);
    return res.status(500).json({ status: 'error', message: 'Unable to fetch channel videos' });
  }
});

router.post('/', protect, async (req, res) => {
  const { channel_id, title, description, video_url, thumbnail_url, duration } = req.body;

  if (!channel_id || !title || !description || !video_url || !thumbnail_url || !duration) {
    return res.status(400).json({ status: 'fail', message: 'All video fields are required' });
  }

  try {
    const video = await createVideo({
      channel_id,
      title,
      description,
      video_url,
      thumbnail_url,
      duration,
    });

    return res.status(201).json({ status: 'success', data: video });
  } catch (error) {
    console.error('Create video error:', error);
    return res.status(500).json({ status: 'error', message: 'Unable to create video' });
  }
});

module.exports = router;
