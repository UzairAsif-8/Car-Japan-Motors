import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import Button from './ui/Button';
import { MAKES, TRANSMISSIONS, YEARS, PRICE_BOUNDS } from '../constants';
import { formatPrice, cn } from '../lib/format';

const priceOptions = [
  { value: '', label: 'Any Price' },
  { value: '0-4000000', label: `Under ${formatPrice(4000000)}` },
  { value: '4000000-7000000', label: `${formatPrice(4000000)} – ${formatPrice(7000000)}` },
  { value: '7000000-12000000', label: `${formatPrice(7000000)} – ${formatPrice(12000000)}` },
  { value: `12000000-${PRICE_BOUNDS.max}`, label: `Above ${formatPrice(12000000)}` },
];

/**
 * Elegant, glass inventory search used on the hero. Builds a query string and
 * routes to /inventory — the inventory page reads it back from the URL.
 */
export default function SearchBar({ className }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ search: '', make: '', year: '', price: '', transmission: '' });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.search) params.set('search', form.search);
    if (form.make) params.set('make', form.make);
    if (form.year) params.set('year', form.year);
    if (form.transmission) params.set('transmission', form.transmission);
    if (form.price) {
      const [min, max] = form.price.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }
    navigate(`/inventory?${params.toString()}`);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl border border-white/60 bg-white/95 p-1.5 shadow-elevated backdrop-blur-xl sm:rounded-[28px] sm:p-3',
        className
      )}
    >
      <div className="flex items-center gap-1 rounded-xl px-2 py-0.5 sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-2">
        <Search className="h-3.5 w-3.5 shrink-0 text-ink-400 sm:h-5 sm:w-5" />
        <input
          value={form.search}
          onChange={update('search')}
          placeholder="Search by make, model or keyword…"
          className="h-8 w-full bg-transparent text-xs text-ink placeholder:text-ink-400 outline-none sm:h-11 sm:text-[15px]"
        />
      </div>

      <div className="grid grid-cols-3 gap-1 border-t border-ink-100 pt-1 sm:gap-2 sm:pt-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <PillSelect value={form.make} onChange={update('make')} placeholder="Any Make" options={MAKES} />
        <PillSelect
          value={form.year}
          onChange={update('year')}
          placeholder="Any Year"
          options={YEARS.map((y) => ({ value: y, label: y }))}
        />
        <PillSelect
          value={form.price}
          onChange={update('price')}
          placeholder="Any Price"
          options={priceOptions}
          className="lg:hidden"
        />
        <PillSelect
          value={form.transmission}
          onChange={update('transmission')}
          placeholder="Any Transmission"
          options={TRANSMISSIONS}
          className="hidden lg:block"
        />
        <Button
          type="submit"
          size="lg"
          icon={Search}
          className="col-span-3 mt-0.5 h-7 text-[11px] lg:col-span-1 lg:mt-0 lg:h-14 lg:text-base"
        >
          Search
        </Button>
      </div>
    </motion.form>
  );
}

function PillSelect({ value, onChange, placeholder, options = [], className }) {
  const normalized = options.map((o) => (typeof o === 'object' ? o : { value: o, label: o }));
  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={onChange}
        className="h-8 w-full min-w-0 appearance-none truncate rounded-lg bg-mist-200 pl-1.5 pr-6 text-[10px] font-semibold text-ink-700 outline-none transition-colors hover:bg-mist-300 focus:ring-2 focus:ring-ink-900/10 sm:h-12 sm:rounded-2xl sm:pl-4 sm:pr-9 sm:text-sm"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {normalized.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-ink-400 sm:right-3 sm:h-4 sm:w-4" />
    </div>
  );
}
