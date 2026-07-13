import { Link } from 'react-router-dom';

/** Reusable consent checkbox required before submitting any lead form. */
export default function ConsentCheckbox({ checked, onChange, error }) {
  return (
    <div>
      <label className="flex items-start gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-accent focus:ring-accent"
        />
        <span>
          I authorize loansoffers.in and its partner banks/NBFCs to contact me via call, SMS, email,
          or WhatsApp. I agree to the{' '}
          <Link to="/terms-and-conditions" className="text-accent underline" target="_blank">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy-policy" className="text-accent underline" target="_blank">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
