/** Auth routes: staff login, logout, and current-session lookup. */

import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ detail: 'Username and password are required.' });
  }
  const user = db
    .prepare('SELECT * FROM users WHERE username = ?')
    .get(String(username).trim());
  if (!user || !bcrypt.compareSync(String(password), user.password_hash)) {
    return res.status(401).json({ detail: 'Invalid username or password.' });
  }
  req.session.user = {
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    is_staff: !!user.is_staff,
  };
  return res.json({ user: req.session.user });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

router.get('/me', (req, res) => {
  if (req.session && req.session.user) return res.json({ user: req.session.user });
  return res.json({ user: null });
});

export default router;
