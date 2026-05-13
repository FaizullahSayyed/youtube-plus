const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');

const env = require('./config/env');
const { pool, testConnection } = require('./config/db');
const { redisClient, connectRedis } = require('./config/redis');

const authRoutes = require('./routes/auth');
const channelRoutes = require('./routes/channels');
const videoRoutes = require('./routes/videos');
const subscriptionRoutes = require('./routes/subscriptions');
const likeRoutes = require('./routes/likes');
const commentRoutes = require('./routes/comments');

const initSocket = require('./socket/index');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());
app.use(express.static('server/public'));
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

// Initialize Socket.IO with authentication and event handlers
initSocket(io);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Start the server: connect to databases and listen on PORT
 */
async function startServer() {
  try {
    // Test PostgreSQL connection
    await testConnection();

    // Connect to Redis
    await connectRedis();

    // Start HTTP server
    server.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
      console.log(`📡 Socket.IO ready`);
      console.log(`🌍 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the server
startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await redisClient.quit();
    await pool.end();
    process.exit(0);
  });
});

module.exports = { app, server, io };

