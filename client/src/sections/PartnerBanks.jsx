const PARTNERS = [
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'SBI',
  'Kotak',
  'Bajaj Finserv',
  'IDFC First',
  'Yes Bank',
];

export default function PartnerBanks() {
  return (
    <section className="container-x py-16">
      <p className="text-center text-sm font-semibold uppercase tracking-wide text-slate-400">
        Offers sourced from trusted banks &amp; NBFCs
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {PARTNERS.map((p) => (
          <div
            key={p}
            className="grid h-16 place-items-center rounded-xl border border-slate-100 bg-white font-semibold text-slate-500 shadow-soft"
          >
            {p}
          </div>
        ))}
      </div>
    </section>
  );
}
