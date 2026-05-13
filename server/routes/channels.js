const express = require('express');
const { getAllChannels, getChannelById, createChannel } = require('../models/channel');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const channels = await getAllChannels();
    return res.status(200).json({ status: 'success', data: channels });
  } catch (error) {
    console.error('Get channels error:', error);
    return res.status(500).json({ status: 'error', message: 'Unable to fetch channels' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const channel = await getChannelById(req.params.id);
    if (!channel) {
      return res.status(404).json({ status: 'fail', message: 'Channel not found' });
    }

    return res.status(200).json({ status: 'success', data: channel });
  } catch (error) {
    console.error('Get channel error:', error);
    return res.status(500).json({ status: 'error', message: 'Unable to fetch channel' });
  }
});

router.post('/', protect, async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ status: 'fail', message: 'Name and description are required' });
  }

  try {
    const channel = await createChannel({
      user_id: req.user.id,
      name,
      description,
    });

    return res.status(201).json({ status: 'success', data: channel });
  } catch (error) {
    console.error('Create channel error:', error);
    return res.status(500).json({ status: 'error', message: 'Unable to create channel' });
  }
});

module.exports = router;
