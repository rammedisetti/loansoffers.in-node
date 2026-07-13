import { useState } from 'react';
import api from '../api.js';

export default function Contact() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'loading', message: '' });
    try {
      const data = await api.post('/contact', form);
      setStatus({ state: 'success', message: data.message });
      setForm({ full_name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus({ state: 'error', message: err.message });
    }
  };

  return (
    <>
      <section className="bg-primary text-white">
        <div className="container-x py-14 text-center">
          <h1 className="text-4xl font-extrabold">Contact Us</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Have a question about eligibility, documents, or offers? Our team can help.
          </p>
        </div>
      </section>

      <section className="container-x py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-5">
            {[
              ['📧', 'Email', 'support@loansoffers.in', 'mailto:support@loansoffers.in'],
              ['📞', 'Phone', '+91 98765 43210', 'tel:+919876543210'],
              ['🕒', 'Hours', 'Mon–Sat, 9:00 AM – 7:00 PM', null],
            ].map(([icon, label, value, href]) => (
              <div key={label} className="card flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-lightbg text-2xl">{icon}</span>
                <div>
                  <p className="text-sm text-slate-500">{label}</p>
                  {href ? (
                    <a href={href} className="font-semibold text-primary hover:text-accent">
                      {value}
                    </a>
                  ) : (
                    <p className="font-semibold text-primary">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            {status.state === 'success' ? (
              <div className="rounded-xl border border-success/30 bg-success/10 p-6 text-center">
                <p className="font-semibold text-primary">Thank you!</p>
                <p className="mt-1 text-sm text-slate-600">{status.message}</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="field-label">Full Name *</label>
                  <input
                    className="field-input"
                    value={form.full_name}
                    onChange={(e) => setField('full_name', e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="field-label">Email Address</label>
                    <input
                      type="email"
                      className="field-input"
                      value={form.email}
                      onChange={(e) => setField('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">Phone Number</label>
                    <input
                      className="field-input"
                      value={form.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="field-label">Message *</label>
                  <textarea
                    rows={5}
                    className="field-input"
                    value={form.message}
                    onChange={(e) => setField('message', e.target.value)}
                    required
                  />
                </div>
                {status.state === 'error' && (
                  <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{status.message}</p>
                )}
                <button className="btn-primary w-full" disabled={status.state === 'loading'}>
                  {status.state === 'loading' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
