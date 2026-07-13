import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api.js';
import ManageShell from '../../components/ManageShell.jsx';

export default function AprSettings() {
  const [rows, setRows] = useState([]);
  const [values, setValues] = useState({});
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState('');

  useEffect(() => {
    api.get('/manage/apr').then((data) => {
      setRows(data);
      setValues(Object.fromEntries(data.map((r) => [r.id, r.apr_percent ?? ''])));
    });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await api.post('/manage/apr', { values });
      setFlash(data.message);
      setTimeout(() => setFlash(''), 2500);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ManageShell
      title="APR Settings"
      actions={
        <Link to="/manage" className="btn-ghost !px-4 !py-2 text-sm">
          ← Back to Dashboard
        </Link>
      }
    >
      {flash && (
        <div className="mb-4 rounded-lg bg-success/10 px-4 py-2 text-sm font-medium text-success">{flash}</div>
      )}

      <form onSubmit={save} className="max-w-2xl">
        <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
          <table className="min-w-full text-sm">
            <thead className="bg-lightbg text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Loan Type</th>
                <th className="px-4 py-3 font-semibold">APR (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium text-primary">{r.name}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="99.99"
                      className="field-input !w-40 !py-2"
                      value={values[r.id] ?? ''}
                      onChange={(e) => setValues((v) => ({ ...v, [r.id]: e.target.value }))}
                      placeholder="e.g. 6.25"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn-primary mt-6" disabled={busy}>
          {busy ? 'Saving…' : 'Save APR Values'}
        </button>
      </form>
    </ManageShell>
  );
}
