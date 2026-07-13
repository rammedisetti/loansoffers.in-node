import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api.js';
import { useConfig } from '../context/ConfigContext.jsx';
import { formatDate } from '../utils/format.js';

export default function BlogList() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const tag = params.get('tag') || '';
  const page = parseInt(params.get('page') || '1', 10);

  const [data, setData] = useState({ posts: [], categories: [], num_pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [tagInput, setTagInput] = useState(tag);
  const { config } = useConfig();

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (category) qs.set('category', category);
    if (tag) qs.set('tag', tag);
    qs.set('page', String(page));
    api
      .get(`/blog?${qs.toString()}`)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, tag, page]);

  const update = (next) => {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    p.delete('page');
    setParams(p);
  };

  return (
    <>
      <section className="bg-gradient-to-r from-primary to-blue-900 text-white">
        <div className="container-x py-16 text-center">
          <h1 className="text-4xl font-extrabold">Loan Tips &amp; Financial Guides</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            Practical advice on borrowing smart, comparing offers, and managing repayments.
          </p>
        </div>
      </section>

      <section className="container-x py-12">
        {/* Filter bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => update({ category: '' })}
              className={`badge ${!category ? 'bg-accent text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}
            >
              All
            </button>
            {data.categories.map((c) => (
              <button
                key={c}
                onClick={() => update({ category: c })}
                className={`badge ${category === c ? 'bg-accent text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}
              >
                {c}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update({ tag: tagInput.trim() });
            }}
            className="flex gap-2"
          >
            <input
              className="field-input !py-2"
              placeholder="Search by tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
            <button className="btn-primary !px-4 !py-2">Search</button>
          </form>
        </div>

        {loading ? (
          <p className="py-16 text-center text-slate-500">Loading articles…</p>
        ) : data.posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-5xl">📝</p>
            <p className="mt-3 text-lg font-semibold text-primary">No articles yet</p>
            <p className="text-slate-500">Please check back soon for new guides.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft transition hover:-translate-y-1"
              >
                {post.cover_image ? (
                  <img src={post.cover_image} alt={post.title} className="h-44 w-full object-cover" />
                ) : (
                  <div className="h-44 w-full bg-gradient-to-br from-primary to-accent" />
                )}
                <div className="p-6">
                  {post.category && <span className="badge bg-lightbg text-slate-500">{post.category}</span>}
                  <h3 className="mt-3 text-lg font-bold text-primary group-hover:text-accent">{post.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">{post.excerpt}</p>
                  <p className="mt-4 text-xs text-slate-400">
                    {config.blogAuthorName} · {formatDate(post.published_at)} · {post.read_time_minutes} min read
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {data.num_pages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => {
                const p = new URLSearchParams(params);
                p.set('page', String(page - 1));
                setParams(p);
              }}
              className="btn-ghost !px-4 !py-2 disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: data.num_pages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => {
                  const p = new URLSearchParams(params);
                  p.set('page', String(n));
                  setParams(p);
                }}
                className={`h-10 w-10 rounded-lg font-semibold ${n === page ? 'bg-accent text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}
              >
                {n}
              </button>
            ))}
            <button
              disabled={page >= data.num_pages}
              onClick={() => {
                const p = new URLSearchParams(params);
                p.set('page', String(page + 1));
                setParams(p);
              }}
              className="btn-ghost !px-4 !py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </>
  );
}
