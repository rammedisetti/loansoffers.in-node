/** Express entry point: wires middleware, session store, routes, and startup seed. */

import express from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

import { seedAll } from './seed.js';
import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import leadRoutes from './routes/leads.js';
import blogRoutes from './routes/blog.js';
import analyticsRoutes from './routes/analytics.js';

console.log("===== APP STARTING =====");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const CLIENT_DIST_DIR = path.join(__dirname, '..', 'client', 'dist');
const CLIENT_INDEX_FILE = path.join(CLIENT_DIST_DIR, 'index.html');
const HAS_CLIENT_BUILD = fs.existsSync(CLIENT_INDEX_FILE);

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Seed loan types + default admin before serving traffic.
seedAll();

const app = express();
app.set('trust proxy', 1);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || CLIENT_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SQLiteStore = connectSqlite3(session);
app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite', dir: DATA_DIR }),
    secret: process.env.SESSION_SECRET || 'change-me-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// Serve uploaded blog cover images.
app.use('/uploads', express.static(UPLOAD_DIR));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/manage', leadRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/manage/analytics', analyticsRoutes);

// Fallback 404 for unknown API routes.
app.use('/api', (req, res) => res.status(404).json({ detail: 'Not found.' }));

if (HAS_CLIENT_BUILD) {
  app.use(express.static(CLIENT_DIST_DIR));
  app.get('*', (req, res, next) => {
    if (req.method !== 'GET') {
      next();
      return;
    }
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      next();
      return;
    }
    if (path.extname(req.path)) {
      next();
      return;
    }
    res.sendFile(CLIENT_INDEX_FILE);
  });
}

console.log("===== ABOUT TO LISTEN =====");
app.listen(PORT, () => {
  console.log(`loansoffers.in app running on http://localhost:${PORT}`);
  if (!HAS_CLIENT_BUILD) {
    console.log('No client build found. Run npm run build before starting in production.');
  }
});
