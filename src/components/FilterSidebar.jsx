import { Search, X } from 'lucide-react';
import { MAKES, BODY_TYPES, TRANSMISSIONS, FUEL_TYPES, YEARS, PRICE_BOUNDS } from '../constants';
import { formatPrice, cn } from '../lib/format';

/**
 * Controlled filter panel shared by the desktop sidebar and the mobile drawer.
 * Emits partial updates via `onChange`; parent owns the state and the URL sync.
 */
export default function FilterSidebar({ filters, onChange, onReset, resultCount }) {
  const set = (patch) => onChange({ ...filters, ...patch });
  const toggle = (key, value) =>
    set({ [key]: filters[key] === value ? '' : value });

  return (
    <div className="space-y-7">
      <div>
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-300" />
          <input
            value={filters.search || ''}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Search inventory…"
            className="h-12 w-full rounded-2xl border border-ink-100 bg-white pl-12 pr-4 text-[15px] outline-none transition-colors focus:border-ink-900"
          />
        </label>
      </div>

      <FilterBlock title="Make">
        <ChipGroup
          value={filters.make}
          options={MAKES}
          onToggle={(v) => toggle('make', v)}
        />
      </FilterBlock>

      <FilterBlock title="Body Type">
        <ChipGroup
          value={filters.bodyType}
          options={BODY_TYPES}
          onToggle={(v) => toggle('bodyType', v)}
        />
      </FilterBlock>

      <FilterBlock title={`Max Price · ${formatPrice(filters.maxPrice || PRICE_BOUNDS.max)}`}>
        <input
          type="range"
          min={PRICE_BOUNDS.min}
          max={PRICE_BOUNDS.max}
          step={PRICE_BOUNDS.step}
          value={filters.maxPrice || PRICE_BOUNDS.max}
          onChange={(e) => set({ maxPrice: Number(e.target.value) })}
          className="range-brand w-full"
        />
        <div className="mt-2 flex justify-between text-xs font-medium text-ink-400">
          <span>{formatPrice(PRICE_BOUNDS.min)}</span>
          <span>{formatPrice(PRICE_BOUNDS.max)}</span>
        </div>
      </FilterBlock>

      <FilterBlock title="Transmission">
        <ChipGroup
          value={filters.transmission}
          options={TRANSMISSIONS}
          onToggle={(v) => toggle('transmission', v)}
        />
      </FilterBlock>

      <FilterBlock title="Fuel Type">
        <ChipGroup
          value={filters.fuel}
          options={FUEL_TYPES}
          onToggle={(v) => toggle('fuel', v)}
        />
      </FilterBlock>

      <FilterBlock title="Year">
        <div className="relative">
          <select
            value={filters.year || ''}
            onChange={(e) => set({ year: e.target.value })}
            className="h-11 w-full appearance-none rounded-xl border border-ink-100 bg-white px-4 text-sm font-medium outline-none focus:border-ink-900"
          >
            <option value="">Any Year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </FilterBlock>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition-colors hover:text-brand"
      >
        <X className="h-4 w-4" /> Clear all filters
      </button>

      {typeof resultCount === 'number' && (
        <p className="border-t border-ink-100 pt-4 text-sm text-ink-400">
          <span className="font-semibold text-ink">{resultCount}</span> vehicles found
        </p>
      )}
    </div>
  );
}

function FilterBlock({ title, children }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-bold tracking-tight text-ink">{title}</h4>
      {children}
    </div>
  );
}

function ChipGroup({ value, options, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onToggle(opt)}
          className={cn(
            'rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-200',
            value === opt
              ? 'border-ink-900 bg-ink text-white'
              : 'border-ink-100 bg-white text-ink-600 hover:border-ink-300'
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
