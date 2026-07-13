import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api.js';
import ManageShell from '../../components/ManageShell.jsx';
import { formatINR, formatDateTime } from '../../utils/format.js';

export default function LeadDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [note, setNote] = useState('');
  const [statusValue, setStatusValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState('');

  const load = useCallback(() => {
    api
      .get(`/manage/leads/${id}`)
      .then((d) => {
        setData(d);
        setStatusValue(d.lead.status);
      })
      .catch(() => setData(null));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const showFlash = (msg) => {
    setFlash(msg);
    setTimeout(() => setFlash(''), 2500);
  };

  const saveStatus = async () => {
    setBusy(true);
    try {
      await api.post(`/manage/leads/${id}/status`, { status: statusValue });
      showFlash('Status updated.');
      load();
    } finally {
      setBusy(false);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setBusy(true);
    try {
      await api.post(`/manage/leads/${id}/notes`, { note });
      setNote('');
      showFlash('Note added.');
      load();
    } finally {
      setBusy(false);
    }
  };

  if (!data) {
    return (
      <ManageShell title="Lead Detail">
        <p className="text-slate-500">Loading…</p>
      </ManageShell>
    );
  }

  const { lead, notes, status_history, status_choices } = data;

  return (
    <ManageShell
      title={lead.full_name}
      actions={
        <Link to="/manage" className="btn-ghost !px-4 !py-2 text-sm">
          ← Back to Dashboard
        </Link>
      }
    >
      {flash && (
        <div className="mb-4 rounded-lg bg-success/10 px-4 py-2 text-sm font-medium text-success">{flash}</div>
      )}

      <p className="mb-6 text-sm text-slate-500">
        Lead #{lead.id} · Submitted {formatDateTime(lead.created_at)}
        {lead.is_deleted ? <span className="ml-2 badge bg-red-100 text-red-600">Deleted</span> : null}
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Left: details + status */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <div className="card">
            <h2 className="text-lg font-bold text-primary">Lead Details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ['Phone', lead.phone_number],
                ['Email', lead.email || '—'],
                ['City', lead.city],
                ['Loan Type', lead.loan_type_name],
                ['Loan Amount', formatINR(lead.loan_amount)],
                ['Monthly Income', lead.monthly_income != null ? formatINR(lead.monthly_income) : '—'],
                ['Source', lead.source || '—'],
                ['IP Address', lead.ip_address || '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-slate-50 pb-2">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="text-right font-medium text-primary">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold text-primary">Change Status</h2>
            <div className="mt-3 flex gap-2">
              <select
                className="field-input"
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
              >
                {status_choices.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button className="btn-primary !px-5 !py-2" onClick={saveStatus} disabled={busy}>
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Right: notes + history */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-bold text-primary">Add Note</h2>
            <form onSubmit={addNote} className="mt-3">
              <textarea
                rows={3}
                className="field-input"
                placeholder="Add a note about this lead…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button className="btn-primary mt-3 !px-5 !py-2" disabled={busy}>
                Save Note
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {notes.length === 0 ? (
                <p className="text-sm text-slate-400">No notes yet.</p>
              ) : (
                notes.map((n) => (
                  <div key={n.id} className="rounded-xl bg-lightbg p-4">
                    <p className="text-sm text-slate-700">{n.note}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {n.added_by_name || 'Staff'} · {formatDateTime(n.created_at)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold text-primary">Status History</h2>
            <div className="mt-4 space-y-4">
              {status_history.length === 0 ? (
                <p className="text-sm text-slate-400">No status changes yet.</p>
              ) : (
                status_history.map((h) => (
                  <div key={h.id} className="flex gap-3">
                    <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
                    <div>
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">{h.old_status || 'New'}</span> →{' '}
                        <span className="font-semibold text-primary">{h.new_status}</span>
                      </p>
                      <p className="text-xs text-slate-400">
                        {h.changed_by_name || 'System'} · {formatDateTime(h.changed_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </ManageShell>
  );
}
