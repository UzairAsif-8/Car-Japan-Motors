import { cn } from '../../lib/format';

/**
 * Lightweight, responsive table. `columns` define headers + cell renderers;
 * on small screens rows collapse into stacked cards via the `card` renderer.
 */
export default function AdminTable({ columns, data, keyField = '_id', empty = 'No records found.' }) {
  if (!data?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center text-ink-400">
        {empty}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
      {/* Desktop table */}
      <table className="hidden w-full text-left md:table">
        <thead>
          <tr className="border-b border-ink-100 bg-mist-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-5 py-4 text-xs font-bold uppercase tracking-wider text-ink-400',
                  col.align === 'right' && 'text-right'
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {data.map((row) => (
            <tr key={row[keyField]} className="transition-colors hover:bg-mist-100/60">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn('px-5 py-4 align-middle text-sm text-ink-700', col.align === 'right' && 'text-right')}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="divide-y divide-ink-100 md:hidden">
        {data.map((row) => (
          <div key={row[keyField]} className="space-y-3 p-5">
            {columns.map((col) => (
              <div key={col.key} className="flex items-start justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                  {col.header}
                </span>
                <span className="text-right text-sm text-ink-700">
                  {col.render ? col.render(row) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
