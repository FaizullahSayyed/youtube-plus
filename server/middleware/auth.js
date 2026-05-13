const jwt = require('jsonwebtoken');
const env = require('../config/env');

async function protect(req, res, next) {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'fail', message: 'Authorization token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
    };
    next();
  } catch (error) {
    return res.status(401).json({ status: 'fail', message: 'Invalid or expired token' });
  }
}

module.exports = {
  protect,
};
