/** Formatting + small utility helpers used across the app. */

/** Format a PKR amount into a readable "Rs 78.5 Lac" / "Rs 1.85 Cr" style. */
export function formatPrice(value) {
  if (value == null) return '—';
  const n = Number(value);
  if (n >= 10000000) {
    const cr = n / 10000000;
    return `Rs ${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
  }
  if (n >= 100000) {
    const lac = n / 100000;
    return `Rs ${lac % 1 === 0 ? lac : lac.toFixed(1)} Lac`;
  }
  return `Rs ${n.toLocaleString('en-PK')}`;
}

/** Full grouped number, e.g. 7,250,000. */
export function formatNumber(value) {
  if (value == null) return '—';
  return Number(value).toLocaleString('en-US');
}

/** "18,500 km" */
export function formatMileage(km) {
  return `${formatNumber(km)} km`;
}

export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Tailwind className combiner (filters falsy values). */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
