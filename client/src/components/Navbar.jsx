import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LOANS } from '../data/loans.js';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition hover:text-accent ${isActive ? 'text-accent' : 'text-slate-600'}`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loansOpen, setLoansOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <nav className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent font-bold text-white">L</span>
          <span className="text-lg font-bold text-primary">
            loansoffers<span className="text-accent">.in</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-7 lg:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <div
            className="relative"
            onMouseEnter={() => setLoansOpen(true)}
            onMouseLeave={() => setLoansOpen(false)}
          >
            <button className="text-sm font-medium text-slate-600 transition hover:text-accent">
              Loans ▾
            </button>
            {loansOpen && (
              <div className="absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3">
                <div className="grid gap-1 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-slate-100">
                  {LOANS.map((l) => (
                    <Link
                      key={l.slug}
                      to={`/loans/${l.slug}`}
                      className="rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-lightbg hover:text-accent"
                    >
                      {l.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <NavLink to="/emi-calculator" className={navLinkClass}>
            EMI Calculator
          </NavLink>
          <NavLink to="/blog" className={navLinkClass}>
            Blog
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
          <Link to="/apply" className="btn-primary !px-5 !py-2.5">
            Apply Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="grid h-10 w-10 place-items-center rounded-lg lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="text-2xl">{open ? '✕' : '☰'}</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <div className="container-x flex flex-col gap-1 py-3">
            {[
              ['/', 'Home'],
              ['/emi-calculator', 'EMI Calculator'],
              ['/blog', 'Blog'],
              ['/about', 'About'],
              ['/contact', 'Contact'],
            ].map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-lightbg"
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <div className="mt-1 border-t border-slate-100 pt-2">
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Loans</p>
              {LOANS.map((l) => (
                <Link
                  key={l.slug}
                  to={`/loans/${l.slug}`}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-lightbg"
                  onClick={() => setOpen(false)}
                >
                  {l.name}
                </Link>
              ))}
            </div>
            <Link to="/apply" className="btn-primary mt-2" onClick={() => setOpen(false)}>
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
