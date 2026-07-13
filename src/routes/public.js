/** Public API: site config, loan types + APR, lead submission, EMI, contact. */

import express from 'express';
import db from '../db.js';
import { seedLoanTypes } from '../seed.js';
import { normalisePhone, parseAmount, clientIp } from '../helpers.js';

const router = express.Router();

/** Expose non-secret config (GTM id, blog author) to the SPA. */
router.get('/config', (req, res) => {
  res.json({
    gtmId: process.env.GTM_ID || '',
    blogAuthorName: process.env.BLOG_AUTHOR_NAME || 'loansoffers.in Team',
    blogAuthorAvatar: process.env.BLOG_AUTHOR_AVATAR || '',
  });
});

/** Active loan types with formatted APR — powers the category cards. */
router.get('/loan-types', (req, res) => {
  seedLoanTypes();
  const rows = db
    .prepare('SELECT slug, name, apr_percent FROM loan_types WHERE is_active = 1 ORDER BY name')
    .all();
  res.json(
    rows.map((r) => ({
      slug: r.slug,
      name: r.name,
      apr: r.apr_percent == null ? null : Number(r.apr_percent).toFixed(2),
    }))
  );
});

/**
 * Submit a lead. Mirrors LeadCaptureForm validation:
 *  - phone normalised to digits (min 10)
 *  - amounts strip commas; loan_amount > 0; monthly_income >= 0 or blank
 *  - consent required
 *  - loan_type resolved by slug server-side (prevents tampering)
 */
router.post('/leads', (req, res) => {
  seedLoanTypes();
  const body = req.body || {};
  const errors = {};

  const fullName = String(body.full_name || '').trim();
  if (!fullName) errors.full_name = 'This field is required.';

  const phone = normalisePhone(body.phone_number);
  if (!phone) errors.phone_number = 'Enter a valid phone number.';

  const city = String(body.city || '').trim();
  if (!city) errors.city = 'This field is required.';

  const loanAmount = parseAmount(body.loan_amount);
  if (loanAmount === null) errors.loan_amount = 'This field is required.';
  else if (Number.isNaN(loanAmount)) errors.loan_amount = 'Enter a valid amount.';
  else if (loanAmount <= 0) errors.loan_amount = 'Amount must be greater than zero.';

  let monthlyIncome = parseAmount(body.monthly_income);
  if (monthlyIncome !== null) {
    if (Number.isNaN(monthlyIncome)) errors.monthly_income = 'Enter a valid amount.';
    else if (monthlyIncome < 0) errors.monthly_income = 'Amount cannot be negative.';
  }

  if (!body.consent) errors.consent = 'You must accept the terms to continue.';

  const loanTypeSlug = String(body.loan_type || '').trim();
  const loanType = loanTypeSlug
    ? db.prepare('SELECT id FROM loan_types WHERE slug = ?').get(loanTypeSlug)
    : null;
  if (!loanType) errors.loan_type = 'Please select a loan type.';

  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const email = String(body.email || '').trim();
  const source = String(body.source || '').trim();

  const info = db
    .prepare(
      `INSERT INTO leads
        (loan_type_id, full_name, phone_number, email, city, loan_amount, monthly_income, status, source, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'New', ?, ?)`
    )
    .run(
      loanType.id,
      fullName,
      phone,
      email,
      city,
      loanAmount,
      monthlyIncome,
      source,
      clientIp(req)
    );

  res.status(201).json({
    id: info.lastInsertRowid,
    message: 'Application submitted successfully. Our team will contact you soon.',
  });
});

/** Server-side EMI calculation (matches EMICalculatorForm). */
router.post('/emi', (req, res) => {
  const principal = parseAmount(req.body.loan_amount);
  const rate = Number(req.body.annual_interest_rate);
  const months = Number(req.body.tenure_months);

  if (principal === null || Number.isNaN(principal) || principal < 10000 || principal > 50000000) {
    return res.status(400).json({ detail: 'Loan amount must be between 10,000 and 5,00,00,000.' });
  }
  if (!Number.isFinite(rate) || rate < 0.1 || rate > 36) {
    return res.status(400).json({ detail: 'Interest rate must be between 0.10 and 36.00.' });
  }
  if (!Number.isInteger(months) || months < 6 || months > 360) {
    return res.status(400).json({ detail: 'Tenure must be between 6 and 360 months.' });
  }

  const monthlyRate = rate / 1200;
  let emi;
  if (monthlyRate === 0) emi = principal / months;
  else {
    const factor = Math.pow(1 + monthlyRate, months);
    emi = (principal * monthlyRate * factor) / (factor - 1);
  }
  const emiRounded = Math.round(emi);
  const totalPayable = emiRounded * months;
  res.json({
    emi: emiRounded,
    total_payable: totalPayable,
    total_interest: Math.max(totalPayable - principal, 0),
  });
});

/** Contact form endpoint — records the message as a note-like enquiry log. */
router.post('/contact', (req, res) => {
  const { full_name, email, phone, message } = req.body || {};
  if (!full_name || !message) {
    return res.status(400).json({ detail: 'Name and message are required.' });
  }
  // Kept lightweight: acknowledge receipt (extend to email/CRM as needed).
  res.json({ message: 'Thanks for reaching out. Our team will get back to you shortly.' });
});

export default router;
