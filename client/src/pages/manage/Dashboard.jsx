import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api.js';
import ManageShell from '../../components/ManageShell.jsx';
import { formatINR, formatDate } from '../../utils/format.js';

const STATUS_STYLES = {
  New: 'bg-accent/10 text-accent',
  Contacted: 'bg-indigo-100 text-indigo-600',
  'In Progress': 'bg-amber-100 text-amber-600',
  Approved: 'bg-success/15 text-success',
  Rejected: 'bg-red-100 text-red-600',
  Closed: 'bg-slate-200 text-slate-600',
};

export default function Dashboard() {
  const [params, setParams] = useSearchParams();
  const status = params.get('status') || '';
  const loanType = params.get('loan_type') || '';
  const [data, setData] = useState({ leads: [], stats: {}, loan_types: [], status_choices: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (status) qs.set('status', status);
    if (loanType) qs.set('loan_type', loanType);
    api
      .get(`/manage/leads?${qs.toString()}`)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status, loanType]);

  const setFilter = (key, value) => {
    const p = new URLSearchParams(params);
    if (value) p.set(key, value);
    else p.delete(key);
    setParams(p);
  };

  const stats = data.stats || {};

  return (
    <ManageShell
      title="Lead Dashboard"
      actions={
        <>
          <Link to="/manage/apr-settings" className="btn-ghost !px-4 !py-2 text-sm">
            Update APR
          </Link>
          <Link to="/apply" target="_blank" className="btn-primary !px-4 !py-2 text-sm">
            + New Lead
          </Link>
        </>
      }
    >
      {/* Stat cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          ['Total', stats.total, 'text-primary'],
          ['New', stats.new, 'text-accent'],
          ['In Progress', stats.in_progress, 'text-amber-500'],
          ['Approved', stats.approved, 'text-success'],
          ['Rejected', stats.rejected, 'text-red-500'],
        ].map(([label, value, color]) => (
          <div key={label} className="card !p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className={`mt-1 text-3xl font-extrabold ${color}`}>{value ?? 0}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter('status', '')}
          className={`badge ${!status ? 'bg-accent text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}
        >
          All
        </button>
        {(data.status_choices || []).map((s) => (
          <button
            key={s}
            onClick={() => setFilter('status', s)}
            className={`badge ${status === s ? 'bg-accent text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}
          >
            {s}
          </button>
        ))}
        <select
          className="field-input ml-auto !w-auto !py-2"
          value={loanType}
          onChange={(e) => setFilter('loan_type', e.target.value)}
        >
          <option value="">All loan types</option>
          {(data.loan_types || []).map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow-soft">
        <table className="min-w-full text-sm">
          <thead className="bg-lightbg text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {['Applicant', 'Loan Type', 'Amount', 'Status', 'City', 'Source', 'Date', ''].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            ) : data.leads.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                  No leads found.
                </td>
              </tr>
            ) : (
              data.leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-lightbg/60">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-primary">{lead.full_name}</p>
                    <p className="text-xs text-slate-400">{lead.phone_number}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{lead.loan_type_name}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{formatINR(lead.loan_amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_STYLES[lead.status] || 'bg-slate-100 text-slate-600'}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{lead.city}</td>
                  <td className="px-4 py-3 text-slate-500">{lead.source || '—'}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(lead.created_at)}</td>
                  <td className="px-4 py-3">
                    <Link to={`/manage/lead/${lead.id}`} className="font-semibold text-accent hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </ManageShell>
  );
}
