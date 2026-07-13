import { useState } from 'react';
import api from '../api.js';
import { useConfig } from '../context/ConfigContext.jsx';
import { formatIndianNumber } from '../utils/format.js';
import ConsentCheckbox from './ConsentCheckbox.jsx';

const EMPTY = {
  full_name: '',
  phone_number: '',
  email: '',
  city: '',
  loan_type: '',
  loan_amount: '',
  monthly_income: '',
};

/**
 * Lead capture form. `defaultLoanType` preselects a product (used on loan pages).
 * `source` tags the origin of the lead for analytics.
 */
export default function LeadForm({ defaultLoanType = '', source = 'website', compact = false }) {
  const { loanTypes } = useConfig();
  const [form, setForm] = useState({ ...EMPTY, loan_type: defaultLoanType });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleAmount = (key) => (e) => {
    const digits = e.target.value.replace(/[^\d]/g, '');
    setField(key, digits ? formatIndianNumber(digits) : '');
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    setStatus({ state: 'loading', message: '' });
    try {
      const payload = {
        ...form,
        loan_amount: form.loan_amount.replace(/,/g, ''),
        monthly_income: form.monthly_income.replace(/,/g, ''),
        consent,
        source,
      };
      const data = await api.post('/leads', payload);
      setStatus({ state: 'success', message: data.message });
      setForm({ ...EMPTY, loan_type: defaultLoanType });
      setConsent(false);
    } catch (err) {
      if (err.data?.errors) setErrors(err.data.errors);
      setStatus({
        state: 'error',
        message: err.data?.errors ? 'Please correct the highlighted fields.' : err.message,
      });
    }
  };

  if (status.state === 'success') {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/10 p-6 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-success text-white">✓</div>
        <h3 className="text-lg font-semibold text-primary">Application received</h3>
        <p className="mt-1 text-sm text-slate-600">{status.message}</p>
        <button
          className="btn-ghost mt-4 !px-5 !py-2.5"
          onClick={() => setStatus({ state: 'idle', message: '' })}
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className={compact ? 'grid gap-4' : 'grid gap-4 sm:grid-cols-2'}>
        <div>
          <label className="field-label">Full Name *</label>
          <input
            className="field-input"
            value={form.full_name}
            onChange={(e) => setField('full_name', e.target.value)}
            placeholder="Your full name"
          />
          {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>}
        </div>
        <div>
          <label className="field-label">Phone Number *</label>
          <input
            className="field-input"
            value={form.phone_number}
            onChange={(e) => setField('phone_number', e.target.value)}
            placeholder="10-digit mobile number"
          />
          {errors.phone_number && <p className="mt-1 text-xs text-red-500">{errors.phone_number}</p>}
        </div>
        <div>
          <label className="field-label">Email Address</label>
          <input
            type="email"
            className="field-input"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
        <div>
          <label className="field-label">City *</label>
          <input
            className="field-input"
            value={form.city}
            onChange={(e) => setField('city', e.target.value)}
            placeholder="Your city"
          />
          {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
        </div>
        <div>
          <label className="field-label">Loan Type *</label>
          <select
            className="field-input"
            value={form.loan_type}
            onChange={(e) => setField('loan_type', e.target.value)}
          >
            <option value="">Select a loan type</option>
            {loanTypes.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
          {errors.loan_type && <p className="mt-1 text-xs text-red-500">{errors.loan_type}</p>}
        </div>
        <div>
          <label className="field-label">Loan Amount (₹) *</label>
          <input
            inputMode="numeric"
            className="field-input"
            value={form.loan_amount}
            onChange={handleAmount('loan_amount')}
            placeholder="e.g. 5,00,000"
          />
          {errors.loan_amount && <p className="mt-1 text-xs text-red-500">{errors.loan_amount}</p>}
        </div>
        <div className={compact ? '' : 'sm:col-span-2'}>
          <label className="field-label">Monthly Income (₹)</label>
          <input
            inputMode="numeric"
            className="field-input"
            value={form.monthly_income}
            onChange={handleAmount('monthly_income')}
            placeholder="e.g. 60,000"
          />
          {errors.monthly_income && <p className="mt-1 text-xs text-red-500">{errors.monthly_income}</p>}
        </div>
      </div>

      <ConsentCheckbox checked={consent} onChange={setConsent} error={errors.consent} />

      {status.state === 'error' && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{status.message}</p>
      )}

      <button type="submit" className="btn-primary w-full" disabled={status.state === 'loading'}>
        {status.state === 'loading' ? 'Submitting…' : 'Submit Application'}
      </button>
    </form>
  );
}
