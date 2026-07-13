import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="container-x flex flex-col items-center justify-center py-28 text-center">
      <p className="text-6xl font-extrabold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-bold text-primary">Page not found</h1>
      <p className="mt-2 text-slate-600">The page you are looking for doesn’t exist or has moved.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to Home
      </Link>
    </section>
  );
}
