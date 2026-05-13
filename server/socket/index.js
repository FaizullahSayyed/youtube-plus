const authMiddleware = require('./middleware/auth');
const handleSubscribe = require('./handlers/subscribe');
const handleLike = require('./handlers/like');
const handleComment = require('./handlers/comment');

function initSocket(io) {
  // Apply authentication middleware
  io.use(authMiddleware);

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id} - User: ${socket.user.username}`);

    // Join/leave channel rooms
    socket.on('join_channel', (channelId) => {
      socket.join(`channel:${channelId}`);
      console.log(`👥 User ${socket.user.username} joined channel:${channelId}`);
    });

    socket.on('leave_channel', (channelId) => {
      socket.leave(`channel:${channelId}`);
      console.log(`👋 User ${socket.user.username} left channel:${channelId}`);
    });

    // Join/leave video rooms
    socket.on('join_video', (videoId) => {
      socket.join(`video:${videoId}`);
      console.log(`🎥 User ${socket.user.username} joined video:${videoId}`);
    });

    socket.on('leave_video', (videoId) => {
      socket.leave(`video:${videoId}`);
      console.log(`👋 User ${socket.user.username} left video:${videoId}`);
    });

    // Attach real-time event handlers
    handleSubscribe(io, socket);
    handleLike(io, socket);
    console.log(`Like handler attached for ${socket.user.username}`);
    handleComment(io, socket);

    // Handle socket errors
    socket.on('error', (err) => console.error('Socket error from client:', err));

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
}

module.exports = initSocket;