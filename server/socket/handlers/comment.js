const { createComment } = require('../../models/comment');
const { getVideoById } = require('../../models/video');

function handleComment(io, socket) {
  socket.on('video:comment', async ({ videoId, text, parentId }) => {
    try {
      const comment = await createComment({
        userId: socket.user.id,
        videoId,
        text,
        parentId: parentId || null,
      });
      const video = await getVideoById(videoId);
      io.to(`video:${videoId}`).emit('video:comment_count', {
        videoId,
        count: video.comment_count,
      });
      io.to(`video:${videoId}`).emit('video:new_comment', comment);
    } catch (error) {
      console.error('Socket handler error:', error);
      socket.emit('error', { event: 'video:comment', message: error.message });
    }
  });
}

module.exports = handleComment;