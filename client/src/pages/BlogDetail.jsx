import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api.js';
import { useConfig } from '../context/ConfigContext.jsx';
import { formatDate } from '../utils/format.js';

export default function BlogDetail() {
  const { slug } = useParams();
  const [state, setState] = useState({ loading: true, post: null, related: [], error: false });
  const { config } = useConfig();

  useEffect(() => {
    setState({ loading: true, post: null, related: [], error: false });
    api
      .get(`/blog/post/${slug}`)
      .then((data) => setState({ loading: false, post: data.post, related: data.related, error: false }))
      .catch(() => setState({ loading: false, post: null, related: [], error: true }));
  }, [slug]);

  if (state.loading) return <p className="container-x py-24 text-center text-slate-500">Loading…</p>;
  if (state.error || !state.post)
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-2xl font-bold text-primary">Article not found</h1>
        <Link to="/blog" className="btn-primary mt-6">
          Back to Blog
        </Link>
      </div>
    );

  const { post, related } = state;
  const tags = (post.tags || '').split(',').map((t) => t.trim()).filter(Boolean);

  return (
    <article>
      {/* Breadcrumb */}
      <div className="container-x pt-6 text-sm text-slate-500">
        <Link to="/" className="hover:text-accent">
          Home
        </Link>{' '}
        /{' '}
        <Link to="/blog" className="hover:text-accent">
          Blog
        </Link>{' '}
        / <span className="text-primary">{post.title}</span>
      </div>

      {/* Cover / header */}
      <section className="container-x py-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary text-white">
          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
          )}
          <div className="relative px-8 py-16">
            {post.category && <span className="badge bg-white/10 text-white">{post.category}</span>}
            <h1 className="mt-4 max-w-3xl text-3xl font-extrabold sm:text-4xl">{post.title}</h1>
          </div>
        </div>

        {/* Meta bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/10 font-bold text-accent">
            {config.blogAuthorName.charAt(0)}
          </span>
          <span className="font-semibold text-primary">{config.blogAuthorName}</span>
          <span>·</span>
          <span>{formatDate(post.published_at)}</span>
          <span>·</span>
          <span>{post.read_time_minutes} min read</span>
        </div>

        {/* Body */}
        <div
          className="prose-content mt-8 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {tags.map((t) => (
              <Link key={t} to={`/blog?tag=${encodeURIComponent(t)}`} className="badge bg-lightbg text-slate-600">
                #{t}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-white py-14">
          <div className="container-x">
            <h2 className="text-2xl font-bold text-primary">Related Articles</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/blog/${r.slug}`}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft transition hover:-translate-y-1"
                >
                  {r.cover_image ? (
                    <img src={r.cover_image} alt={r.title} className="h-40 w-full object-cover" />
                  ) : (
                    <div className="h-40 w-full bg-gradient-to-br from-primary to-accent" />
                  )}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-primary group-hover:text-accent">{r.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">{r.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
