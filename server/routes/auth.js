const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findByEmail, createUser } = require('../models/user');
const env = require('../config/env');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ status: 'fail', message: 'Username, email, and password are required' });
  }

  try {
    const existingUser = await findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ status: 'fail', message: 'User already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await createUser({ username, email, password_hash });

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return res.status(201).json({ status: 'success', token, data: user });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ status: 'error', message: 'Unable to register user' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: 'fail', message: 'Email and password are required' });
  }

  try {
    const user = await findByEmail(email);
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
    }

    const { password_hash, ...userWithoutPassword } = user;
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return res.status(200).json({ status: 'success', token, data: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ status: 'error', message: 'Unable to login' });
  }
});

module.exports = router;
