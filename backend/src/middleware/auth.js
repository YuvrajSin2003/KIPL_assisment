const { Session, Employee } = require('../models');
const { Op } = require('sequelize');

const SESSION_TIMEOUT_MS = 15 * 60 * 1000;

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({ error: 'No token provided. Please log in.' });
    }

    const session = await Session.findOne({
      where: { token, is_valid: true },
      include: [{ model: Employee, as: 'employee' }],
    });

    if (!session) {
      return res.status(401).json({ error: 'Invalid session. Please log in again.' });
    }

    const now = new Date();

    const inactiveMs = now - new Date(session.last_activity);
    if (inactiveMs > SESSION_TIMEOUT_MS) {
      await session.update({ is_valid: false });
      return res.status(401).json({
        error: 'Session expired due to inactivity. Please log in again.',
        code: 'SESSION_EXPIRED',
      });
    }

    if (now > new Date(session.expires_at)) {
      await session.update({ is_valid: false });
      return res.status(401).json({
        error: 'Session expired. Please log in again.',
        code: 'SESSION_EXPIRED',
      });
    }

    const newExpiresAt = new Date(now.getTime() + SESSION_TIMEOUT_MS);
    await session.update({ last_activity: now, expires_at: newExpiresAt });

    req.employee = session.employee;
    req.session = session;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ error: 'Authentication error.' });
  }
};

module.exports = { authenticate, SESSION_TIMEOUT_MS };
