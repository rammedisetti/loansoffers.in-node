/** Staff routes for lead management: dashboard, detail, notes, status, APR. */

import express from 'express';
import db from '../db.js';
import { requireStaff } from '../middleware.js';
import { STATUS_CHOICES } from '../helpers.js';

const router = express.Router();
router.use(requireStaff);

const leadSelect = `
  SELECT l.*, lt.name AS loan_type_name, lt.slug AS loan_type_slug
  FROM leads l JOIN loan_types lt ON lt.id = l.loan_type_id
`;

/** Dashboard: filterable lead list + KPI stats. */
router.get('/leads', (req, res) => {
  const { status = '', loan_type = '' } = req.query;
  const clauses = [];
  const params = [];
  if (status) {
    clauses.push('l.status = ?');
    params.push(status);
  }
  if (loan_type) {
    clauses.push('lt.slug = ?');
    params.push(loan_type);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const leads = db
    .prepare(`${leadSelect} ${where} ORDER BY l.created_at DESC`)
    .all(...params);

  const stats = {
    total: db.prepare('SELECT COUNT(*) c FROM leads').get().c,
    new: db.prepare("SELECT COUNT(*) c FROM leads WHERE status = 'New'").get().c,
    in_progress: db.prepare("SELECT COUNT(*) c FROM leads WHERE status = 'In Progress'").get().c,
    approved: db.prepare("SELECT COUNT(*) c FROM leads WHERE status = 'Approved'").get().c,
    rejected: db.prepare("SELECT COUNT(*) c FROM leads WHERE status = 'Rejected'").get().c,
  };

  const loanTypes = db
    .prepare('SELECT slug, name FROM loan_types WHERE is_active = 1 ORDER BY name')
    .all();

  res.json({ leads, stats, loan_types: loanTypes, status_choices: STATUS_CHOICES });
});

/** Single lead with notes and status history. */
router.get('/leads/:id', (req, res) => {
  const lead = db.prepare(`${leadSelect} WHERE l.id = ?`).get(req.params.id);
  if (!lead) return res.status(404).json({ detail: 'Lead not found.' });

  const notes = db
    .prepare(
      `SELECT n.*, u.username AS added_by_name
       FROM admin_notes n LEFT JOIN users u ON u.id = n.added_by
       WHERE n.lead_id = ? ORDER BY n.created_at DESC`
    )
    .all(lead.id);

  const history = db
    .prepare(
      `SELECT h.*, u.username AS changed_by_name
       FROM lead_status_history h LEFT JOIN users u ON u.id = h.changed_by
       WHERE h.lead_id = ? ORDER BY h.changed_at DESC`
    )
    .all(lead.id);

  res.json({ lead, notes, status_history: history, status_choices: STATUS_CHOICES });
});

/** Add a free-text note. */
router.post('/leads/:id/notes', (req, res) => {
  const lead = db.prepare('SELECT id FROM leads WHERE id = ?').get(req.params.id);
  if (!lead) return res.status(404).json({ detail: 'Lead not found.' });
  const note = String(req.body.note || '').trim();
  if (!note) return res.status(400).json({ detail: 'Note cannot be empty.' });
  db.prepare('INSERT INTO admin_notes (lead_id, note, added_by) VALUES (?, ?, ?)').run(
    lead.id,
    note,
    req.session.user.id
  );
  res.status(201).json({ message: 'Note added successfully.' });
});

/** Change status; records a LeadStatusHistory row when it actually changes. */
router.post('/leads/:id/status', (req, res) => {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!lead) return res.status(404).json({ detail: 'Lead not found.' });
  const newStatus = String(req.body.status || '').trim();
  if (!STATUS_CHOICES.includes(newStatus)) {
    return res.status(400).json({ detail: 'Invalid status value.' });
  }
  if (newStatus !== lead.status) {
    const tx = db.transaction(() => {
      db.prepare("UPDATE leads SET status = ?, updated_at = datetime('now') WHERE id = ?").run(
        newStatus,
        lead.id
      );
      db.prepare(
        'INSERT INTO lead_status_history (lead_id, old_status, new_status, changed_by) VALUES (?, ?, ?, ?)'
      ).run(lead.id, lead.status, newStatus, req.session.user.id);
    });
    tx();
  }
  res.json({ message: `Status updated to ${newStatus}.` });
});

/** APR settings: read all active loan types in business priority order. */
const APR_ORDER = ['personal-loan', 'business-loan', 'plot-loan', 'home-loan', 'education-loan', 'gold-loan', 'car-loan'];

router.get('/apr', (req, res) => {
  const rows = db.prepare('SELECT id, name, slug, apr_percent FROM loan_types WHERE is_active = 1').all();
  rows.sort((a, b) => {
    const ai = APR_ORDER.indexOf(a.slug);
    const bi = APR_ORDER.indexOf(b.slug);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi) || a.name.localeCompare(b.name);
  });
  res.json(rows.map((r) => ({ ...r, apr_percent: r.apr_percent == null ? '' : r.apr_percent })));
});

/** APR settings: bulk update. Body: { values: { <id>: <apr|''> } } */
router.post('/apr', (req, res) => {
  const values = req.body.values || {};
  const update = db.prepare("UPDATE loan_types SET apr_percent = ?, updated_at = datetime('now') WHERE id = ?");
  const tx = db.transaction(() => {
    for (const [id, raw] of Object.entries(values)) {
      const apr = raw === '' || raw === null ? null : Number(raw);
      if (apr !== null && (!Number.isFinite(apr) || apr < 0 || apr > 99.99)) continue;
      update.run(apr, Number(id));
    }
  });
  tx();
  res.json({ message: 'APR values updated successfully.' });
});

export default router;
