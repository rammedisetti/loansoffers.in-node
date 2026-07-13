import { useParams, Link, Navigate } from 'react-router-dom';
import { LOAN_BY_SLUG } from '../data/loans.js';
import { useConfig } from '../context/ConfigContext.jsx';
import LeadForm from '../components/LeadForm.jsx';

export default function LoanPage() {
  const { slug } = useParams();
  const loan = LOAN_BY_SLUG[slug];
  const { aprBySlug } = useConfig();

  if (!loan) return <Navigate to="/" replace />;

  const apr = aprBySlug[slug];

  return (
    <>
      {/* Hero */}
      <section className="bg-primary text-white">
        <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-2">
          <div className="animate-fade-up">
            <span className="badge bg-white/10 text-white">{loan.badge}</span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">{loan.h1}</h1>
            <p className="mt-4 max-w-xl text-lg text-slate-300">{loan.intro}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link to="/apply" className="btn-primary">
                Apply Now
              </Link>
              {apr && (
                <span className="badge bg-success/20 text-success">Rates from {apr}% APR*</span>
              )}
            </div>
          </div>

          <div className="animate-fade-up rounded-2xl bg-white p-6 text-darktext shadow-soft">
            <h3 className="text-lg font-bold text-primary">Check your eligibility</h3>
            <p className="mb-4 mt-1 text-sm text-slate-500">Free, quick, and with no obligation.</p>
            <LeadForm defaultLoanType={slug} source={`loan:${slug}`} compact />
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="container-x py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-primary">{loan.whyHeading}</h2>
            <p className="mt-3 text-slate-600">{loan.whyParagraph}</p>
            <ul className="mt-6 space-y-3">
              {loan.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success/15 text-xs text-success">
                    ✓
                  </span>
                  <span className="text-slate-700">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="card">
              <h3 className="text-lg font-bold text-primary">{loan.bestForHeading}</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {loan.bestFor.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="text-lg font-bold text-primary">{loan.requirementsHeading}</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {loan.requirements.map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x pb-20">
        <div className="rounded-3xl bg-lightbg px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-primary">Ready to explore {loan.name.toLowerCase()} offers?</h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-600">
            Compare transparent options from trusted lenders and apply in minutes.
          </p>
          <Link to="/apply" className="btn-primary mt-6">
            Apply Now
          </Link>
        </div>
      </section>
    </>
  );
}
