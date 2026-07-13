const STEPS = [
  { n: '01', title: 'Share Your Requirement', text: 'Tell us the loan type, amount, and a few basic details.' },
  { n: '02', title: 'Get Matched', text: 'We compare offers from trusted banks and NBFCs for your profile.' },
  { n: '03', title: 'Compare Offers', text: 'Review transparent rates, tenure, and eligibility side by side.' },
  { n: '04', title: 'Submit Documents', text: 'Upload KYC and income proofs with guided assistance.' },
  { n: '05', title: 'Get Disbursed', text: 'Complete verification and receive funds in your account.' },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge bg-accent/10 text-accent">How It Works</span>
          <h2 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">A Simple, Guided Journey</h2>
          <p className="mt-3 text-slate-600">From enquiry to disbursal in five clear steps.</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-slate-100 bg-lightbg p-6">
              <span className="text-3xl font-extrabold text-accent/30">{s.n}</span>
              <h3 className="mt-2 text-base font-bold text-primary">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
