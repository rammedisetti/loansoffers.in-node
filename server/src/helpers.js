/** Small shared helpers mirroring Django form/model logic. */

/** URL-safe slug from a string (Django slugify equivalent). */
export function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Ensure a slug is unique within blog_posts by appending -1, -2, ... */
export function uniqueBlogSlug(db, base, excludeId = null) {
  let slug = base || 'post';
  let candidate = slug;
  let counter = 1;
  const stmt = db.prepare(
    'SELECT id FROM blog_posts WHERE slug = ? AND id != ?'
  );
  while (stmt.get(candidate, excludeId ?? -1)) {
    candidate = `${slug}-${counter}`;
    counter += 1;
  }
  return candidate;
}

/** Normalise a phone number to digits with an optional leading +. */
export function normalisePhone(raw) {
  const normalized = String(raw || '')
    .split('')
    .filter((ch) => /\d/.test(ch) || ch === '+')
    .join('');
  const digits = normalized.replace(/\+/g, '');
  if (digits.length < 10) return null;
  return normalized;
}

/** Parse an amount string (strips commas). Returns number or null on failure. */
export function parseAmount(value) {
  const raw = String(value ?? '').trim().replace(/,/g, '');
  if (raw === '') return null;
  const num = Number(raw);
  return Number.isFinite(num) ? num : NaN;
}

/** Extract the real client IP, honouring X-Forwarded-For. */
export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return String(fwd).split(',')[0].trim();
  return req.socket?.remoteAddress || null;
}

export const STATUS_CHOICES = [
  'New',
  'Contacted',
  'In Progress',
  'Approved',
  'Rejected',
  'Closed',
];
