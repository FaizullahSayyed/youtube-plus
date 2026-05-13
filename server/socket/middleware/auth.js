const jwt = require('jsonwebtoken');
const env = require('../../config/env');

function authMiddleware(socket, next) {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;

  if (!token) {
    return next(new Error('Authentication error: Token missing'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    socket.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
    };
    next();
  } catch (error) {
    return next(new Error('Authentication error: Invalid token'));
  }
}

module.exports = authMiddleware;