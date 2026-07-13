import { useSearchParams } from 'react-router-dom';
import LeadForm from '../components/LeadForm.jsx';

export default function Apply() {
  const [params] = useSearchParams();
  const preselect = params.get('loan_type') || '';

  return (
    <>
      <section className="bg-primary text-white">
        <div className="container-x py-14 text-center">
          <h1 className="text-4xl font-extrabold">Apply for a Loan</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Share a few details and our team will match you with the right lender.
          </p>
        </div>
      </section>

      <section className="container-x py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-bold text-primary">Why apply with us?</h2>
            <ul className="mt-5 space-y-4">
              {[
                ['⚡', 'Instant eligibility', 'Know where you stand within minutes.'],
                ['🔒', 'Secure & private', 'Your information is handled responsibly.'],
                ['💸', 'Transparent rates', 'No hidden charges or surprises.'],
                ['🤝', 'Trusted lenders', 'Offers from established banks and NBFCs.'],
              ].map(([icon, title, text]) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lightbg text-xl">
                    {icon}
                  </span>
                  <div>
                    <p className="font-semibold text-primary">{title}</p>
                    <p className="text-sm text-slate-600">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-primary">Loan Application</h2>
            <p className="mb-5 mt-1 text-sm text-slate-500">All fields marked * are required.</p>
            <LeadForm defaultLoanType={preselect} source="apply-page" />
          </div>
        </div>
      </section>
    </>
  );
}
