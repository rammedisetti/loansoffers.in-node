const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    city: 'Bengaluru',
    text: 'The comparison made it so easy to pick the right personal loan. Approval was quick and completely transparent.',
  },
  {
    name: 'Rahul Verma',
    city: 'Pune',
    text: 'Got competitive home loan offers without endless phone calls. The team guided me through every document.',
  },
  {
    name: 'Anjali Nair',
    city: 'Kochi',
    text: 'Applied for a business loan and had matched offers the same day. Highly recommend for entrepreneurs.',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge bg-accent/10 text-accent">Testimonials</span>
          <h2 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">What Borrowers Say</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-slate-100 bg-lightbg p-6">
              <div className="text-accent">★★★★★</div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">“{t.text}”</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-accent/10 font-bold text-accent">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
