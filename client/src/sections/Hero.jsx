import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LeadForm from '../components/LeadForm.jsx';

const SLIDES = [
  {
    title: 'Compare Loan Offers from Trusted Banks',
    subtitle: 'Transparent rates, instant eligibility, and zero hidden charges — all in one place.',
  },
  {
    title: 'Personal Loans with Instant Approval',
    subtitle: 'Quick credit at competitive rates for any life goal, with minimal documentation.',
  },
  {
    title: 'Own Your Dream Home with Confidence',
    subtitle: 'Optimize EMIs and choose the right home financing structure for your budget.',
  },
  {
    title: 'Capital to Grow Your Business',
    subtitle: 'Working capital and expansion funding with repayment aligned to your cash flow.',
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative overflow-hidden bg-primary text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-accent/40 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-success/30 blur-3xl" />
      </div>

      <div className="container-x relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <div key={index} className="animate-fade-up">
          <span className="badge bg-white/10 text-white">Trusted by borrowers across India</span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">{slide.title}</h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">{slide.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/apply" className="btn-primary">
              Apply Now
            </Link>
            <Link to="/emi-calculator" className="btn-ghost !bg-white/10 !text-white !border-white/20 hover:!text-white">
              Calculate EMI
            </Link>
          </div>

          <div className="mt-10 flex gap-8">
            {[
              ['7+', 'Loan Products'],
              ['100%', 'Digital Process'],
              ['Zero', 'Hidden Charges'],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="text-2xl font-bold text-white">{n}</p>
                <p className="text-sm text-slate-400">{l}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-8 bg-accent' : 'w-3 bg-white/30'}`}
              />
            ))}
          </div>
        </div>

        <div className="animate-fade-up rounded-2xl bg-white p-6 text-darktext shadow-soft">
          <h3 className="text-lg font-bold text-primary">Get a callback in minutes</h3>
          <p className="mb-4 mt-1 text-sm text-slate-500">Tell us what you need — our team does the rest.</p>
          <LeadForm source="hero" compact />
        </div>
      </div>
    </section>
  );
}
