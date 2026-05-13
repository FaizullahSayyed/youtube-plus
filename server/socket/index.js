const authMiddleware = require('./middleware/auth');

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

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
}

module.exports = initSocket;