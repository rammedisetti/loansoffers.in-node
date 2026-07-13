import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../api.js';
import ManageShell from '../../components/ManageShell.jsx';

const EMPTY = {
  title: '',
  excerpt: '',
  body: '',
  category: '',
  tags: '',
  meta_description: '',
  read_time_minutes: 1,
  is_published: false,
};

export default function BlogForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [cover, setCover] = useState(null);
  const [existingCover, setExistingCover] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/blog/manage/${id}`).then((d) => {
      const p = d.post;
      setForm({
        title: p.title,
        excerpt: p.excerpt || '',
        body: p.body || '',
        category: p.category || '',
        tags: p.tags || '',
        meta_description: p.meta_description || '',
        read_time_minutes: p.read_time_minutes || 1,
        is_published: !!p.is_published,
      });
      setExistingCover(p.cover_image);
    });
  }, [id, isEdit]);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) return setError('Title is required.');
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (cover) fd.append('cover_image', cover);
      if (isEdit) await api.putForm(`/blog/manage/${id}`, fd);
      else await api.postForm('/blog/manage', fd);
      navigate('/manage/blog');
    } catch (err) {
      setError(err.message || 'Failed to save.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ManageShell
      title={isEdit ? 'Edit Post' : 'New Post'}
      actions={
        <Link to="/manage/blog" className="btn-ghost !px-4 !py-2 text-sm">
          ← Back
        </Link>
      }
    >
      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>}

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Main */}
        <div className="card space-y-4">
          <div>
            <label className="field-label">Title *</label>
            <input className="field-input" value={form.title} onChange={(e) => setField('title', e.target.value)} />
          </div>
          <div>
            <label className="field-label">Excerpt</label>
            <textarea rows={3} className="field-input" value={form.excerpt} onChange={(e) => setField('excerpt', e.target.value)} />
          </div>
          <div>
            <label className="field-label">Body (HTML)</label>
            <textarea rows={18} className="field-input font-mono text-xs" value={form.body} onChange={(e) => setField('body', e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Category</label>
              <input className="field-input" value={form.category} onChange={(e) => setField('category', e.target.value)} />
            </div>
            <div>
              <label className="field-label">Tags (comma-separated)</label>
              <input className="field-input" value={form.tags} onChange={(e) => setField('tags', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="card space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div>
            <label className="field-label">Cover Image</label>
            {existingCover && !cover && (
              <img src={existingCover} alt="cover" className="mb-2 h-32 w-full rounded-lg object-cover" />
            )}
            <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] || null)} className="text-sm" />
          </div>
          <div>
            <label className="field-label">Meta Description</label>
            <textarea rows={3} className="field-input" value={form.meta_description} onChange={(e) => setField('meta_description', e.target.value)} />
          </div>
          <div>
            <label className="field-label">Read Time (minutes)</label>
            <input
              type="number"
              min={1}
              className="field-input"
              value={form.read_time_minutes}
              onChange={(e) => setField('read_time_minutes', e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setField('is_published', e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-accent focus:ring-accent"
            />
            Publish immediately
          </label>
          <button className="btn-primary w-full" disabled={busy}>
            {busy ? 'Saving…' : 'Save Post'}
          </button>
        </div>
      </form>
    </ManageShell>
  );
}
