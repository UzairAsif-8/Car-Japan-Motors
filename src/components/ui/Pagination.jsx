import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/format';

/** Builds a compact page range with ellipses, e.g. 1 … 4 5 6 … 12 */
function buildRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push('…');
    out.push(p);
    prev = p;
  }
  return out;
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const range = buildRange(page, totalPages);

  const btn =
    'grid h-11 min-w-[2.75rem] place-items-center rounded-full px-3 text-sm font-semibold transition-all duration-300 focus-ring';

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={cn(btn, 'text-ink-500 hover:bg-ink-50 disabled:opacity-40 disabled:hover:bg-transparent')}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      {range.map((p, i) =>
        p === '…' ? (
          <span key={`e-${i}`} className="px-2 text-ink-300">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              btn,
              p === page
                ? 'bg-ink text-white shadow-card'
                : 'text-ink-600 hover:bg-ink-50'
            )}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className={cn(btn, 'text-ink-500 hover:bg-ink-50 disabled:opacity-40 disabled:hover:bg-transparent')}
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
}
