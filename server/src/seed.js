/**
 * Seed helpers: default loan types, APR backfill, and the initial staff user.
 *
 * Mirrors the Django behaviour where the seven loan types are auto-created on
 * first run and APR defaults are back-filled for rows that have a NULL APR.
 */

import bcrypt from 'bcryptjs';
import db from './db.js';

export const DEFAULT_LOAN_TYPES = [
  ['personal-loan', 'Personal Loan'],
  ['business-loan', 'Business Loan'],
  ['plot-loan', 'Plot Loan'],
  ['home-loan', 'Home Loan'],
  ['car-loan', 'Car Loan'],
  ['education-loan', 'Education Loan'],
  ['gold-loan', 'Gold Loan'],
];

export const DEFAULT_LOAN_APR = {
  'personal-loan': 5.99,
  'business-loan': 7.49,
  'plot-loan': 6.99,
  'home-loan': 6.25,
  'education-loan': 3.99,
  'car-loan': 4.49,
  'gold-loan': 8.49,
};

/** Ensure the loan_types table holds the seven defaults and APRs are populated. */
export function seedLoanTypes() {
  const existing = new Set(
    db.prepare('SELECT slug FROM loan_types').all().map((r) => r.slug)
  );
  const insert = db.prepare(
    'INSERT INTO loan_types (name, slug, is_active, apr_percent) VALUES (?, ?, 1, ?)'
  );
  const insertMany = db.transaction((rows) => {
    for (const [slug, name] of rows) {
      if (!existing.has(slug)) insert.run(name, slug, DEFAULT_LOAN_APR[slug] ?? null);
    }
  });
  insertMany(DEFAULT_LOAN_TYPES);

  const backfill = db.prepare(
    'UPDATE loan_types SET apr_percent = ? WHERE slug = ? AND apr_percent IS NULL'
  );
  for (const [slug, apr] of Object.entries(DEFAULT_LOAN_APR)) backfill.run(apr, slug);
}

/** Create the initial staff account from env vars if no users exist yet. */
export function seedAdminUser() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  if (count > 0) return;
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = bcrypt.hashSync(password, 10);
  db.prepare(
    'INSERT INTO users (username, password_hash, full_name, is_staff) VALUES (?, ?, ?, 1)'
  ).run(username, hash, 'Administrator');
  // eslint-disable-next-line no-console
  console.log(`[seed] Created staff user "${username}".`);
}

export function seedAll() {
  seedLoanTypes();
  seedAdminUser();
}

// Allow running `npm run seed` directly.
if (import.meta.url === `file://${process.argv[1]}`) {
  const dotenv = await import('dotenv');
  dotenv.config();
  seedAll();
  // eslint-disable-next-line no-console
  console.log('[seed] Done.');
}
