/**
 * SQLite database layer for the loansoffers.in Node backend.
 *
 * Uses better-sqlite3 (synchronous) and mirrors the original Django schema:
 *   loan_types           -> LoanType
 *   leads                -> Lead (with soft-delete via is_deleted)
 *   lead_status_history  -> LeadStatusHistory (append-only audit log)
 *   admin_notes          -> AdminNote
 *   blog_posts           -> BlogPost
 *   users                -> staff auth accounts
 *
 * The schema is created on first import if the tables do not already exist.
 */

import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'loansoffers.sqlite3'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS loan_types (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT NOT NULL UNIQUE,
  slug         TEXT NOT NULL UNIQUE,
  description  TEXT NOT NULL DEFAULT '',
  apr_percent  REAL,
  is_active    INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS leads (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  loan_type_id   INTEGER NOT NULL REFERENCES loan_types(id) ON DELETE CASCADE,
  full_name      TEXT NOT NULL,
  phone_number   TEXT NOT NULL,
  email          TEXT NOT NULL DEFAULT '',
  city           TEXT NOT NULL,
  loan_amount    REAL NOT NULL CHECK (loan_amount > 0),
  monthly_income REAL CHECK (monthly_income IS NULL OR monthly_income >= 0),
  status         TEXT NOT NULL DEFAULT 'New',
  source         TEXT NOT NULL DEFAULT '',
  ip_address     TEXT,
  is_deleted     INTEGER NOT NULL DEFAULT 0,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS lead_created_idx ON leads(created_at);
CREATE INDEX IF NOT EXISTS lead_status_created_idx ON leads(status, created_at);
CREATE INDEX IF NOT EXISTS lead_loan_status_idx ON leads(loan_type_id, status);

CREATE TABLE IF NOT EXISTS lead_status_history (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id     INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  old_status  TEXT NOT NULL,
  new_status  TEXT NOT NULL,
  changed_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  changed_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS lead_hist_lead_changed_idx ON lead_status_history(lead_id, changed_at);

CREATE TABLE IF NOT EXISTS admin_notes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id     INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  note        TEXT NOT NULL,
  added_by    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS admin_note_lead_created_idx ON admin_notes(lead_id, created_at);

CREATE TABLE IF NOT EXISTS blog_posts (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  title              TEXT NOT NULL,
  slug               TEXT NOT NULL UNIQUE,
  cover_image        TEXT,
  excerpt            TEXT NOT NULL DEFAULT '',
  body               TEXT NOT NULL DEFAULT '',
  category           TEXT NOT NULL DEFAULT '',
  tags               TEXT NOT NULL DEFAULT '',
  meta_description   TEXT NOT NULL DEFAULT '',
  is_published       INTEGER NOT NULL DEFAULT 0,
  is_deleted         INTEGER NOT NULL DEFAULT 0,
  published_at       TEXT,
  read_time_minutes  INTEGER NOT NULL DEFAULT 1,
  created_at         TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at         TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name     TEXT NOT NULL DEFAULT '',
  is_staff      INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

export default db;
