const { likeVideo, unlikeVideo } = require('../../models/like');
const { getVideoById } = require('../../models/video');

function handleLike(io, socket) {
  socket.on('video:like', async ({ videoId }) => {
    console.log(`👍 Like event received from ${socket.user.username} for video ${videoId}`);
    try {
      await likeVideo(socket.user.id, videoId);
      const video = await getVideoById(videoId);
      io.to(`video:${videoId}`).emit('video:like_count', {
        videoId,
        count: video.like_count,
      });
    } catch (error) {
      if (error.code === '23505') {
        // Already liked, fetch current count and broadcast
        console.log(`User ${socket.user.id} already liked video ${videoId}`);
        const video = await getVideoById(videoId);
        io.to(`video:${videoId}`).emit('video:like_count', {
          videoId,
          count: video.like_count,
        });
      } else {
        console.error('Error in like handler:', error);
        socket.emit('error', { event: 'video:like', message: error.message });
      }
    }
  });

  socket.on('video:unlike', async ({ videoId }) => {
    try {
      await unlikeVideo(socket.user.id, videoId);
      const video = await getVideoById(videoId);
      io.to(`video:${videoId}`).emit('video:like_count', {
        videoId,
        count: video.like_count,
      });
    } catch (error) {
      console.error('Socket handler error:', error);
      socket.emit('error', { event: 'video:unlike', message: error.message });
    }
  });
}

module.exports = handleLike;