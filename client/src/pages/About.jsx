import { Link } from 'react-router-dom';

export default function About() {
  return (
    <>
      <section className="bg-primary text-white">
        <div className="container-x py-14 text-center">
          <h1 className="text-4xl font-extrabold">About loansoffers.in</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            We help borrowers compare transparent loan offers from trusted banks and NBFCs, quickly
            and securely.
          </p>
        </div>
      </section>

      <section className="container-x py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-2xl">🎯</span>
            <h2 className="mt-4 text-2xl font-bold text-primary">Our Mission</h2>
            <p className="mt-2 text-slate-600">
              Make loan discovery simple, fair, and digital-first for every borrower in India.
            </p>
          </div>
          <div className="card">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-success/10 text-2xl">💡</span>
            <h2 className="mt-4 text-2xl font-bold text-primary">Why We Exist</h2>
            <p className="mt-2 text-slate-600">
              Borrowers deserve clear comparisons, not confusing terms and hidden charges.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-lightbg px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-primary">Have questions before you apply?</h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-600">
            Our team can help you understand eligibility, documents, and the best-fit options.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-primary">
              Contact Us
            </Link>
            <Link to="/apply" className="btn-ghost">
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
