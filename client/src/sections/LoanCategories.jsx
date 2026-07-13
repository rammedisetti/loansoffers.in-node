import { Link } from 'react-router-dom';
import { LOANS } from '../data/loans.js';
import { useConfig } from '../context/ConfigContext.jsx';

const ICONS = {
  'personal-loan': '👤',
  'home-loan': '🏠',
  'business-loan': '💼',
  'car-loan': '🚗',
  'education-loan': '🎓',
  'gold-loan': '🪙',
  'plot-loan': '📐',
};

export default function LoanCategories() {
  const { aprBySlug } = useConfig();

  return (
    <section className="container-x py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="badge bg-accent/10 text-accent">Our Loan Products</span>
        <h2 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">
          Find the Right Loan for Every Goal
        </h2>
        <p className="mt-3 text-slate-600">
          Compare competitive rates across trusted lenders and apply in minutes.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {LOANS.map((loan) => (
          <Link
            key={loan.slug}
            to={`/loans/${loan.slug}`}
            className="card group transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-lightbg text-2xl">
                {ICONS[loan.slug] || '💳'}
              </span>
              {aprBySlug[loan.slug] && (
                <span className="badge bg-success/10 text-success">from {aprBySlug[loan.slug]}% APR*</span>
              )}
            </div>
            <h3 className="mt-4 text-lg font-bold text-primary">{loan.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{loan.intro}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
              Learn more <span className="transition group-hover:translate-x-1">→</span>
            </span>
          </Link>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-slate-400">
        *Indicative starting APRs. Actual rates depend on lender eligibility and profile.
      </p>
    </section>
  );
}
