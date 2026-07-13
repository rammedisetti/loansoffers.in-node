/** Blog routes: public list/detail + staff CMS (create/edit/delete/toggle). */

import express from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import db from '../db.js';
import { requireStaff } from '../middleware.js';
import { slugify, uniqueBlogSlug } from '../helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads', 'blog');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = express.Router();

const publicWhere = 'is_published = 1 AND is_deleted = 0';

/** Public: paginated list with category/tag filters (9 per page). */
router.get('/', (req, res) => {
  const { category = '', tag = '', page = '1' } = req.query;
  const perPage = 9;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);

  const clauses = [publicWhere];
  const params = [];
  if (category) {
    clauses.push('category = ?');
    params.push(category);
  }
  if (tag) {
    clauses.push('tags LIKE ?');
    params.push(`%${tag}%`);
  }
  const where = `WHERE ${clauses.join(' AND ')}`;
  const total = db.prepare(`SELECT COUNT(*) c FROM blog_posts ${where}`).get(...params).c;
  const posts = db
    .prepare(`SELECT * FROM blog_posts ${where} ORDER BY published_at DESC LIMIT ? OFFSET ?`)
    .all(...params, perPage, (pageNum - 1) * perPage);

  const categories = db
    .prepare(`SELECT DISTINCT category FROM blog_posts WHERE ${publicWhere} AND category != '' ORDER BY category`)
    .all()
    .map((r) => r.category);

  res.json({
    posts,
    categories,
    page: pageNum,
    num_pages: Math.max(1, Math.ceil(total / perPage)),
    total,
  });
});

/** Public: single post by slug + up to 3 related posts. */
router.get('/post/:slug', (req, res) => {
  const post = db
    .prepare(`SELECT * FROM blog_posts WHERE slug = ? AND ${publicWhere}`)
    .get(req.params.slug);
  if (!post) return res.status(404).json({ detail: 'Post not found.' });

  let related = db
    .prepare(
      `SELECT id, title, slug, excerpt, cover_image, category, published_at, read_time_minutes
       FROM blog_posts WHERE ${publicWhere} AND category = ? AND id != ? ORDER BY published_at DESC LIMIT 3`
    )
    .all(post.category, post.id);
  if (related.length < 3) {
    const fillerIds = related.map((r) => r.id).concat(post.id);
    const placeholders = fillerIds.map(() => '?').join(',');
    const fillers = db
      .prepare(
        `SELECT id, title, slug, excerpt, cover_image, category, published_at, read_time_minutes
         FROM blog_posts WHERE ${publicWhere} AND id NOT IN (${placeholders})
         ORDER BY published_at DESC LIMIT ?`
      )
      .all(...fillerIds, 3 - related.length);
    related = related.concat(fillers);
  }
  res.json({ post, related });
});

/* ---------------------- Staff CMS ---------------------- */

router.get('/manage', requireStaff, (req, res) => {
  const posts = db.prepare('SELECT * FROM blog_posts WHERE is_deleted = 0 ORDER BY created_at DESC').all();
  res.json({ posts });
});

router.get('/manage/:id', requireStaff, (req, res) => {
  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ? AND is_deleted = 0').get(req.params.id);
  if (!post) return res.status(404).json({ detail: 'Post not found.' });
  res.json({ post });
});

function readBody(req) {
  const b = req.body || {};
  return {
    title: String(b.title || '').trim(),
    excerpt: String(b.excerpt || '').trim(),
    body: String(b.body || ''),
    category: String(b.category || '').trim(),
    tags: String(b.tags || '').trim(),
    meta_description: String(b.meta_description || '').trim(),
    read_time_minutes: Math.max(1, parseInt(b.read_time_minutes, 10) || 1),
    is_published: b.is_published === 'true' || b.is_published === true || b.is_published === '1',
  };
}

router.post('/manage', requireStaff, upload.single('cover_image'), (req, res) => {
  const data = readBody(req);
  if (!data.title) return res.status(400).json({ detail: 'Title is required.' });
  const slug = uniqueBlogSlug(db, slugify(data.title));
  const cover = req.file ? `/uploads/blog/${req.file.filename}` : null;
  const publishedAt = data.is_published ? new Date().toISOString() : null;
  const info = db
    .prepare(
      `INSERT INTO blog_posts
        (title, slug, cover_image, excerpt, body, category, tags, meta_description, is_published, published_at, read_time_minutes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      data.title, slug, cover, data.excerpt, data.body, data.category, data.tags,
      data.meta_description, data.is_published ? 1 : 0, publishedAt, data.read_time_minutes
    );
  res.status(201).json({ id: info.lastInsertRowid, message: 'Post created.' });
});

router.put('/manage/:id', requireStaff, upload.single('cover_image'), (req, res) => {
  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ? AND is_deleted = 0').get(req.params.id);
  if (!post) return res.status(404).json({ detail: 'Post not found.' });
  const data = readBody(req);
  if (!data.title) return res.status(400).json({ detail: 'Title is required.' });
  const cover = req.file ? `/uploads/blog/${req.file.filename}` : post.cover_image;
  // Set published_at the first time it becomes published.
  let publishedAt = post.published_at;
  if (data.is_published && !post.published_at) publishedAt = new Date().toISOString();
  db.prepare(
    `UPDATE blog_posts SET title=?, cover_image=?, excerpt=?, body=?, category=?, tags=?,
      meta_description=?, is_published=?, published_at=?, read_time_minutes=?, updated_at=datetime('now')
     WHERE id=?`
  ).run(
    data.title, cover, data.excerpt, data.body, data.category, data.tags,
    data.meta_description, data.is_published ? 1 : 0, publishedAt, data.read_time_minutes, post.id
  );
  res.json({ message: 'Post updated.' });
});

router.post('/manage/:id/toggle', requireStaff, (req, res) => {
  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ? AND is_deleted = 0').get(req.params.id);
  if (!post) return res.status(404).json({ detail: 'Post not found.' });
  const next = post.is_published ? 0 : 1;
  let publishedAt = post.published_at;
  if (next && !post.published_at) publishedAt = new Date().toISOString();
  db.prepare("UPDATE blog_posts SET is_published=?, published_at=?, updated_at=datetime('now') WHERE id=?").run(
    next, publishedAt, post.id
  );
  res.json({ message: next ? 'Post published.' : 'Post unpublished.' });
});

router.delete('/manage/:id', requireStaff, (req, res) => {
  const post = db.prepare('SELECT id FROM blog_posts WHERE id = ? AND is_deleted = 0').get(req.params.id);
  if (!post) return res.status(404).json({ detail: 'Post not found.' });
  db.prepare("UPDATE blog_posts SET is_deleted=1, is_published=0, updated_at=datetime('now') WHERE id=?").run(post.id);
  res.json({ message: 'Post deleted.' });
});

export default router;
