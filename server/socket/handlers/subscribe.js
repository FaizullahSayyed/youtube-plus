const { subscribe, unsubscribe } = require('../../models/subscription');
const { getChannelById } = require('../../models/channel');

function handleSubscribe(io, socket) {
  socket.on('channel:subscribe', async ({ channelId }) => {
    try {
      await subscribe(socket.user.id, channelId);
      const channel = await getChannelById(channelId);
      io.to(`channel:${channelId}`).emit('channel:subscriber_count', {
        channelId,
        count: channel.subscriber_count,
      });
    } catch (error) {
      if (error.code === '23505') {
        // Already subscribed, fetch current count and broadcast
        console.log(`User ${socket.user.id} already subscribed to channel ${channelId}`);
        const channel = await getChannelById(channelId);
        io.to(`channel:${channelId}`).emit('channel:subscriber_count', {
          channelId,
          count: channel.subscriber_count,
        });
      } else {
        console.error('Socket handler error:', error);
        socket.emit('error', { event: 'channel:subscribe', message: error.message });
      }
    }
  });

  socket.on('channel:unsubscribe', async ({ channelId }) => {
    try {
      await unsubscribe(socket.user.id, channelId);
      const channel = await getChannelById(channelId);
      io.to(`channel:${channelId}`).emit('channel:subscriber_count', {
        channelId,
        count: channel.subscriber_count,
      });
    } catch (error) {
      console.error('Socket handler error:', error);
      socket.emit('error', { event: 'channel:unsubscribe', message: error.message });
    }
  });
}

module.exports = handleSubscribe;