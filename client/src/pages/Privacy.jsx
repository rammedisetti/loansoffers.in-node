const SECTIONS = [
  {
    title: 'Data We Collect',
    body: 'Name, phone number, email, city, loan requirement, income details, IP address, and enquiry metadata.',
  },
  {
    title: 'Why We Collect Data',
    body: 'To process enquiries, connect you with lenders, provide updates, and improve our services and risk controls.',
  },
  {
    title: 'Data Sharing',
    body: 'We share information with partner banks/NBFCs and authorized service providers for loan processing.',
  },
  {
    title: 'Data Security',
    body: 'We apply reasonable technical and organizational safeguards and work continuously to reduce risk.',
  },
  {
    title: 'Data Retention',
    body: 'Information is retained only as long as needed for legitimate business, compliance, and dispute-resolution purposes.',
  },
  {
    title: 'Your Choices',
    body: 'You can request correction or deletion of your data by contacting support@loansoffers.in.',
  },
];

export default function Privacy() {
  return (
    <>
      <section className="bg-primary text-white">
        <div className="container-x py-14">
          <h1 className="text-4xl font-extrabold">Privacy Policy</h1>
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
