const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');

const env = require('./config/env');
const { pool, testConnection } = require('./config/db');
const { redisClient, connectRedis } = require('./config/redis');

const authRoutes = require('./routes/auth');


const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());
app.use('/api/auth', authRoutes);

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

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
