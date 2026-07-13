/** Indian-locale formatting helpers (ported from the Django site.js logic). */

export function formatINR(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '₹0';
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

/** Group digits in the Indian system without the currency symbol. */
export function formatIndianNumber(value) {
  const n = Number(String(value).replace(/,/g, ''));
  if (!Number.isFinite(n)) return '';
  return n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

/** Strip commas/spaces and return a numeric value or null. */
export function parseAmount(value) {
  if (value == null || value === '') return null;
  const cleaned = String(value).replace(/[,\s]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

/** Compact "lakh/crore" label for large rupee amounts. */
export function shortINR(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '₹0';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return formatINR(n);
}

export function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
