import { Link } from 'react-router-dom';

export default function CtaBanner() {
  return (
    <section className="container-x py-16">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center text-white sm:px-16">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
          <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-success/30 blur-3xl" />
        </div>
        <div className="relative">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to Find Your Best Loan Offer?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Apply in minutes and let our team match you with the right lender — no obligations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/apply" className="btn-primary">
              Apply Now
            </Link>
            <Link
              to="/emi-calculator"
              className="btn-ghost !border-white/20 !bg-white/10 !text-white hover:!text-white"
            >
              Calculate EMI
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
