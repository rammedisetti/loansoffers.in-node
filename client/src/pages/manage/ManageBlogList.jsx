import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api.js';
import ManageShell from '../../components/ManageShell.jsx';
import { formatDate } from '../../utils/format.js';

export default function ManageBlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get('/blog/manage')
      .then((d) => setPosts(d.posts))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (id) => {
    await api.post(`/blog/manage/${id}/toggle`);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this post? It will be hidden from the site.')) return;
    await api.del(`/blog/manage/${id}`);
    load();
  };

  return (
    <ManageShell
      title="Blog Posts"
      actions={
        <Link to="/manage/blog/new" className="btn-primary !px-4 !py-2 text-sm">
          + New Post
        </Link>
      }
    >
      <div className="overflow-x-auto rounded-2xl bg-white shadow-soft">
        <table className="min-w-full text-sm">
          <thead className="bg-lightbg text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {['Title', 'Category', 'Status', 'Published', 'Read Time', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  No posts yet.
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id} className="hover:bg-lightbg/60">
                  <td className="px-4 py-3 font-semibold text-primary">{p.title}</td>
                  <td className="px-4 py-3 text-slate-600">{p.category || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${p.is_published ? 'bg-success/15 text-success' : 'bg-amber-100 text-amber-600'}`}>
                      {p.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{p.published_at ? formatDate(p.published_at) : '—'}</td>
                  <td className="px-4 py-3 text-slate-500">{p.read_time_minutes} min</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3 text-sm font-semibold">
                      <Link to={`/manage/blog/${p.id}/edit`} className="text-accent hover:underline">
                        Edit
                      </Link>
                      <button onClick={() => toggle(p.id)} className="text-slate-500 hover:underline">
                        {p.is_published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={() => remove(p.id)} className="text-red-500 hover:underline">
                        Delete
                      </button>
                    </div>
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
