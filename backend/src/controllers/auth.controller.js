const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Log = require('../models/log.model');
const { accessSecret, refreshSecret, accessExpiresIn, refreshExpiresIn } = require('../config/jwt');
const { sendResetPasswordEmail } = require('../utils/email');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (user.is_blocked) {
      return res.status(403).json({ message: 'Account blocked' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      await Log.create({ user_id: user.id, action: 'LOGIN_FAILED', details: { email }, ip: req.ip });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ id: user.id, role: user.role }, accessSecret, { expiresIn: accessExpiresIn });
    const refreshToken = jwt.sign({ id: user.id }, refreshSecret, { expiresIn: refreshExpiresIn });

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await User.updateLastLogin(user.id);
    await Log.create({ user_id: user.id, action: 'LOGIN_SUCCESS', details: {}, ip: req.ip });

    res.json({ accessToken, user: { id: user.id, email: user.email, role: user.role, firstName: user.first_name, lastName: user.last_name, avatar: user.avatar_url } });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token' });
    }
    let payload;
    try {
      payload = jwt.verify(refreshToken, refreshSecret);
    } catch (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    const user = await User.findById(payload.id);
    if (!user || user.is_blocked) {
      return res.status(403).json({ message: 'User not found or blocked' });
    }
    const accessToken = jwt.sign({ id: user.id, role: user.role }, accessSecret, { expiresIn: accessExpiresIn });
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists
      return res.json({ message: 'If email exists, reset link sent' });
    }
    const token = jwt.sign({ id: user.id }, accessSecret, { expiresIn: '1h' });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendResetPasswordEmail(email, resetLink);
    res.json({ message: 'Reset link sent' });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    let payload;
    try {
      payload = jwt.verify(token, accessSecret);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.update(payload.id, { password_hash: hashed });
    res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, refresh, logout, forgotPassword, resetPassword };
