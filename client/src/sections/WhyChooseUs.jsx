const POINTS = [
  { icon: '⚡', title: 'Instant Eligibility', text: 'Check your eligibility in seconds with minimal details.' },
  { icon: '🔒', title: 'Secure & Private', text: 'Your data is protected with reasonable technical safeguards.' },
  { icon: '💸', title: 'Transparent Rates', text: 'No hidden charges — compare clear, upfront pricing.' },
  { icon: '🤝', title: 'Trusted Lenders', text: 'Offers sourced from established banks and NBFCs.' },
  { icon: '📱', title: '100% Digital', text: 'Apply, upload, and track your application online.' },
  { icon: '🎯', title: 'Personalized Matches', text: 'Options tailored to your profile and requirement.' },
];

export default function WhyChooseUs() {
  return (
    <section className="container-x py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="badge bg-accent/10 text-accent">Why Choose Us</span>
        <h2 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">
          Loan Discovery Made Simple and Fair
        </h2>
        <p className="mt-3 text-slate-600">
          Borrowers deserve clear comparisons, not confusing terms and hidden charges.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {POINTS.map((p) => (
          <div key={p.title} className="card">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-lightbg text-2xl">{p.icon}</span>
            <h3 className="mt-4 text-lg font-bold text-primary">{p.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
