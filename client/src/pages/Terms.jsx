const SECTIONS = [
  {
    title: 'Service Scope',
    body: 'Our platform helps you submit enquiries and compare offers. We do not guarantee approval, rate, or timeline.',
  },
  {
    title: 'User Information',
    body: 'You must provide accurate and complete information. False data may result in rejection of your enquiry.',
  },
  {
    title: 'Consent to Contact',
    body: 'By submitting any form, you authorize us and our partners to contact you via call, SMS, email, or WhatsApp.',
  },
  {
    title: 'Third-Party Lenders',
    body: 'Loan products are offered by banks/NBFCs; their terms are outside our control.',
  },
  {
    title: 'Limitation of Liability',
    body: 'We are not liable for lender decisions, delays, losses, or damages arising from your use of the platform.',
  },
  {
    title: 'Policy Updates',
    body: 'These terms may be updated at any time; continued use of the platform means acceptance of the changes.',
  },
];

export default function Terms() {
  return (
    <>
      <section className="bg-primary text-white">
        <div className="container-x py-14">
          <h1 className="text-4xl font-extrabold">Terms and Conditions</h1>
          <p className="mt-2 text-sm text-slate-400">Last updated: March 1, 2026</p>
        </div>
      </section>
      <section className="container-x py-14">
        <div className="mx-auto max-w-3xl space-y-6">
          {SECTIONS.map((s, i) => (
            <div key={s.title} className="card">
              <h2 className="text-xl font-bold text-primary">
                {i + 1}. {s.title}
              </h2>
              <p className="mt-2 text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
