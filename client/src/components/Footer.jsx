import { Link } from 'react-router-dom';
import { LOANS } from '../data/loans.js';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-primary text-slate-300">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent font-bold text-white">L</span>
            <span className="text-lg font-bold text-white">
              loansoffers<span className="text-accent">.in</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Compare transparent loan offers from trusted banks and NBFCs, quickly and securely.
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://instagram.com/loansoffers.in"
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 transition hover:bg-accent"
              aria-label="Instagram"
            >
              IG
            </a>
            <a
              href="https://facebook.com/loansoffers.in"
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 transition hover:bg-accent"
              aria-label="Facebook"
            >
              FB
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Loan Products</h4>
          <ul className="space-y-2 text-sm">
            {LOANS.map((l) => (
              <li key={l.slug}>
                <Link to={`/loans/${l.slug}`} className="transition hover:text-accent">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="transition hover:text-accent">About Us</Link></li>
            <li><Link to="/contact" className="transition hover:text-accent">Contact</Link></li>
            <li><Link to="/emi-calculator" className="transition hover:text-accent">EMI Calculator</Link></li>
            <li><Link to="/blog" className="transition hover:text-accent">Blog</Link></li>
            <li><Link to="/privacy-policy" className="transition hover:text-accent">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions" className="transition hover:text-accent">Terms &amp; Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Get in Touch</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>Email: <a href="mailto:support@loansoffers.in" className="transition hover:text-accent">support@loansoffers.in</a></li>
            <li>Phone: <a href="tel:+919876543210" className="transition hover:text-accent">+91 98765 43210</a></li>
            <li>Hours: Mon–Sat, 9:00 AM – 7:00 PM</li>
          </ul>
          <Link to="/apply" className="btn-primary mt-5 !px-5 !py-2.5">
            Apply Now
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-400 sm:flex-row">
          <p>© {year} loansoffers.in. All rights reserved.</p>
          <p>Loans are offered by partner banks/NBFCs and subject to their terms.</p>
        </div>
      </div>
    </footer>
  );
}
