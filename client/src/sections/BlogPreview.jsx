import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { formatDate } from '../utils/format.js';

export default function BlogPreview() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api
      .get('/blog?page=1')
      .then((data) => setPosts((data.posts || []).slice(0, 3)))
      .catch(() => {});
  }, []);

  if (!posts.length) return null;

  return (
    <section className="bg-white py-20">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="badge bg-accent/10 text-accent">From the Blog</span>
            <h2 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">Loan Tips &amp; Financial Guides</h2>
          </div>
          <Link to="/blog" className="btn-ghost !px-5 !py-2.5">
            View all articles
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
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
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{post.excerpt}</p>
                <p className="mt-4 text-xs text-slate-400">
                  {formatDate(post.published_at)} · {post.read_time_minutes} min read
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
