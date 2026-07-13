/** Analytics route: KPIs, time series, and breakdowns for the staff dashboard. */

import express from 'express';
import db from '../db.js';
import { requireStaff } from '../middleware.js';

const router = express.Router();
router.use(requireStaff);

/** Resolve a preset or explicit start/end into ISO date bounds. */
function resolveRange(query) {
  const now = new Date();
  const preset = query.preset || 'last_30';
  let start;
  let end = new Date(now);
  if (query.start && query.end) {
    start = new Date(query.start);
    end = new Date(query.end);
  } else {
    switch (preset) {
      case 'last_7':
        start = new Date(now); start.setDate(now.getDate() - 6); break;
      case 'last_90':
        start = new Date(now); start.setDate(now.getDate() - 89); break;
      case 'this_year':
        start = new Date(now.getFullYear(), 0, 1); break;
      case 'last_30':
      default:
        start = new Date(now); start.setDate(now.getDate() - 29); break;
    }
  }
  const fmt = (d) => d.toISOString().slice(0, 10);
  return { start: fmt(start), end: fmt(end), preset: query.start && query.end ? 'custom' : preset };
}

const AMOUNT_BUCKETS = [
  { label: '0–5L', min: 0, max: 500000 },
  { label: '5–10L', min: 500000, max: 1000000 },
  { label: '10–25L', min: 1000000, max: 2500000 },
  { label: '25–50L', min: 2500000, max: 5000000 },
  { label: '50L–1Cr', min: 5000000, max: 10000000 },
  { label: '1–2Cr', min: 10000000, max: 20000000 },
  { label: '2–5Cr', min: 20000000, max: 50000000 },
  { label: '5Cr+', min: 50000000, max: Infinity },
];

const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

router.get('/', (req, res) => {
  const { start, end, preset } = resolveRange(req.query);
  // Inclusive of the end day.
  const rangeClause = "l.created_at >= ? AND l.created_at < date(?, '+1 day')";
  const rp = [start, end];

  const rows = db
    .prepare(
      `SELECT l.*, lt.name AS loan_type_name, lt.slug AS loan_type_slug
       FROM leads l JOIN loan_types lt ON lt.id = l.loan_type_id
       WHERE ${rangeClause}`
    )
    .all(...rp);

  const count = rows.length;
  const totalAmount = rows.reduce((s, r) => s + (r.loan_amount || 0), 0);
  const approved = rows.filter((r) => r.status === 'Approved').length;

  // KPIs
  const kpi = {
    total_leads: count,
    total_amount: totalAmount,
    avg_amount: count ? Math.round(totalAmount / count) : 0,
    approved,
    conversion_rate: count ? Number(((approved / count) * 100).toFixed(1)) : 0,
  };

  // Leads over time (by day)
  const byDayMap = new Map();
  for (const r of rows) {
    const d = String(r.created_at).slice(0, 10);
    byDayMap.set(d, (byDayMap.get(d) || 0) + 1);
  }
  const leads_over_time = [...byDayMap.entries()].sort().map(([date, c]) => ({ date, count: c }));

  const groupCount = (keyFn) => {
    const m = new Map();
    for (const r of rows) {
      const k = keyFn(r);
      m.set(k, (m.get(k) || 0) + 1);
    }
    return m;
  };

  const by_status = [...groupCount((r) => r.status).entries()].map(([label, value]) => ({ label, value }));
  const by_loan_type = [...groupCount((r) => r.loan_type_name).entries()].map(([label, value]) => ({ label, value }));
  const by_source = [...groupCount((r) => r.source || 'Direct').entries()].map(([label, value]) => ({ label, value }));

  const by_city = [...groupCount((r) => r.city || 'Unknown').entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const amount_distribution = AMOUNT_BUCKETS.map((b) => ({
    label: b.label,
    value: rows.filter((r) => (r.loan_amount || 0) >= b.min && (r.loan_amount || 0) < b.max).length,
  }));

  const FUNNEL = ['New', 'Contacted', 'In Progress', 'Approved'];
  const conversion_funnel = FUNNEL.map((s) => ({ label: s, value: rows.filter((r) => r.status === s).length }));

  const dowCounts = new Array(7).fill(0);
  for (const r of rows) dowCounts[new Date(r.created_at).getDay()] += 1;
  const by_day_of_week = DOW.map((label, i) => ({ label, value: dowCounts[i] }));

  // Monthly trend (last 12 months, independent of range)
  const monthlyRows = db
    .prepare(
      `SELECT strftime('%Y-%m', created_at) ym, COUNT(*) c, COALESCE(SUM(loan_amount),0) amt
       FROM leads WHERE created_at >= date('now', '-12 months') GROUP BY ym ORDER BY ym`
    )
    .all();
  const monthly_trend = monthlyRows.map((r) => ({ month: r.ym, count: r.c, amount: r.amt }));

  const top_sources = [...by_source].sort((a, b) => b.value - a.value).slice(0, 5);

  const avgByType = new Map();
  for (const r of rows) {
    const k = r.loan_type_name;
    const cur = avgByType.get(k) || { sum: 0, n: 0 };
    cur.sum += r.loan_amount || 0;
    cur.n += 1;
    avgByType.set(k, cur);
  }
  const avg_amount_by_type = [...avgByType.entries()].map(([label, v]) => ({
    label,
    value: v.n ? Math.round(v.sum / v.n) : 0,
  }));

  const recent_activity = db
    .prepare(
      `SELECT l.id, l.full_name, l.status, l.loan_amount, l.created_at, lt.name AS loan_type_name
       FROM leads l JOIN loan_types lt ON lt.id = l.loan_type_id
       ORDER BY l.created_at DESC LIMIT 10`
    )
    .all();

  res.json({
    range: { start, end, preset },
    kpi,
    leads_over_time,
    by_status,
    by_loan_type,
    by_source,
    by_city,
    amount_distribution,
    conversion_funnel,
    by_day_of_week,
    monthly_trend,
    top_sources,
    avg_amount_by_type,
    recent_activity,
  });
});

export default router;
